import { ENV } from "varlock/env";

export enum LogLevel {
	DEBUG = 0,
	INFO = 1,
	WARN = 2,
	ERROR = 3,
	SILENT = 4,
}

const IS_DEV = ENV.NODE_ENV === "development";

type LogMethod = "debug" | "info" | "warn" | "error";

interface LogEntry {
	level: string;
	message: string;
	timestamp: string;
	context?: string;
	data?: unknown;
	error?: unknown;
}

class Logger {
	private minLevel: LogLevel;

	constructor(
		private context?: string,
		options: { level?: LogLevel } = {},
	) {
		this.minLevel = options.level ?? (IS_DEV ? LogLevel.DEBUG : LogLevel.INFO);
	}

	private log(level: LogLevel, message: unknown, data?: unknown) {
		if (level < this.minLevel || level === LogLevel.SILENT) return;

		const timestamp = new Date().toISOString();
		const levelName = LogLevel[level] as keyof typeof LogLevel;
		const method = levelName.toLowerCase() as LogMethod;

		// Production: Structured JSON logging
		if (!IS_DEV) {
			const entry: LogEntry = {
				level: levelName,
				message: message instanceof Error ? message.message : String(message),
				timestamp,
				context: this.context,
				data,
				error:
					message instanceof Error
						? message
						: data instanceof Error
							? data
							: undefined,
			};

			const seen = new WeakSet();
			const replacer = (_key: string, value: unknown) => {
				if (typeof value === "object" && value !== null) {
					if (seen.has(value)) return "[Circular]";
					seen.add(value);
				}
				if (value instanceof Error) {
					return {
						...value,
						name: value.name,
						message: value.message,
						stack: value.stack,
						cause: (value as Error).cause,
					};
				}
				return value;
			};

			let output: string;
			try {
				output = JSON.stringify(entry, replacer);
			} catch (err) {
				// Fallback for extreme cases
				output = JSON.stringify({
					level: levelName,
					message: `[Serialization Error] ${entry.message}`,
					timestamp,
					error: String(err),
				});
			}

			console[method](output);
			return;
		}

		// Development: Human-readable logging
		const contextPrefix = this.context ? `[${this.context}] ` : "";
		const levelLabel = levelName.padEnd(5);

		// Browser: Use console styling
		if (typeof window !== "undefined") {
			const styles: Record<string, string> = {
				DEBUG: "color: #7f8c8d",
				INFO: "color: #3498db; font-weight: bold",
				WARN: "color: #f39c12; font-weight: bold",
				ERROR: "color: #e74c3c; font-weight: bold",
			};

			console[method](
				`%c${timestamp} %c${levelLabel} %c${contextPrefix}${message}`,
				"color: #888",
				styles[levelName] ?? "",
				"color: inherit",
				data ?? "",
			);
			return;
		}

		// Node/Terminal: Use ANSI colors
		const colors: Record<string, string> = {
			DEBUG: "\x1b[90m", // Gray
			INFO: "\x1b[34m", // Blue
			WARN: "\x1b[33m", // Yellow
			ERROR: "\x1b[31m", // Red
			RESET: "\x1b[0m",
		};

		const color = colors[levelName] ?? "";
		const reset = colors.RESET;

		console[method](
			`${colors.DEBUG}${timestamp}${reset} ${color}${levelLabel}${reset} ${contextPrefix}${message}`,
			data ?? "",
		);
	}

	debug(message: unknown, data?: unknown) {
		this.log(LogLevel.DEBUG, message, data);
	}

	info(message: unknown, data?: unknown) {
		this.log(LogLevel.INFO, message, data);
	}

	warn(message: unknown, data?: unknown) {
		this.log(LogLevel.WARN, message, data);
	}

	error(message: unknown, data?: unknown) {
		this.log(LogLevel.ERROR, message, data);
	}

	/**
	 * Creates a child logger with an inherited context and level.
	 */
	child(context: string, options?: { level?: LogLevel }) {
		return new Logger(this.context ? `${this.context}:${context}` : context, {
			level: options?.level ?? this.minLevel,
		});
	}
}

/**
 * Global logger instance.
 * - In development, it provides rich console output with colors and timestamps.
 * - In production, it outputs structured JSON for log aggregation.
 */
export const logger = new Logger();

export default logger;
