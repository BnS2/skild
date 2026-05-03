import { Link } from "@tanstack/react-router";
import {
	ArrowBigUp,
	ArrowUpRight,
	Bookmark,
	Check,
	Copy,
	MessageSquare,
} from "lucide-react";
import { useState } from "react";

import { logger } from "#/lib/logger";

const SkillCard = ({
	authorEmail,
	category,
	createdAt,
	description,
	installCommand,
	tags,
	title,
}: SkillRecord) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		navigator.clipboard
			.writeText(installCommand)
			.then(() => {
				setCopied(true);
				setTimeout(() => setCopied(false), 2000);
			})
			.catch((error) => {
				logger.error("Failed to copy install command", error);
			});
	};

	return (
		<article className="skill-card">
			<Link
				to="/skills"
				tabIndex={-1}
				aria-label={`Open ${title}`}
				className="overlay"
			/>

			<div className="chrome">
				<div className="chrome-bar">
					<div className="lights">
						<div className="light red" />
						<div className="light amber" />
						<div className="light green" />
					</div>
					<div className="host">registry.sh</div>
				</div>
			</div>

			<div className="body">
				<div className="meta">
					<div className="author">
						<img src="/logo512.png" alt="author avatar" className="avatar" />
						<div className="author-copy">
							<p>BnS</p>
							<p>
								{createdAt
									? new Date(createdAt).toLocaleDateString()
									: "Unknown"}
							</p>
						</div>
					</div>

					<div className="category">{category}</div>
				</div>

				<div className="summary">
					<Link to="/skills" className="title-link">
						<h3>{title}</h3>
					</Link>

					<p>{description}</p>
				</div>

				<div className="command">
					<div className="command-copy">
						<span>{">_"}</span>
						<p>{installCommand}</p>
					</div>
					<button
						className="copy-action"
						onClick={handleCopy}
						type="button"
						aria-label={copied ? "Copied!" : "Copy install command"}
					>
						{copied ? (
							<Check size={16} className="text-accent-primary" />
						) : (
							<Copy size={16} />
						)}
					</button>
				</div>

				<div className="footer">
					<div className="stats">
						<button type="button" className="upvote" disabled>
							<ArrowBigUp size={16} fill="currentColor" />
							<span>{tags.length}</span>
						</button>

						<div className="comments">
							<MessageSquare size={14} />
							<span>{authorEmail ? 1 : 0}</span>
						</div>
					</div>

					<div className="footer-actions">
						<Link to="/skills" className="open" title={`Open ${title}`}>
							<span>Open</span>
							<ArrowUpRight size={14} />
						</Link>

						<button
							type="button"
							className="save"
							aria-label="Saved state"
							disabled
						>
							<Bookmark size={16} />
						</button>
					</div>
				</div>
			</div>
		</article>
	);
};

export default SkillCard;
