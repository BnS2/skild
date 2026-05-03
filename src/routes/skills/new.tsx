import { useAuth } from "@clerk/tanstack-react-start";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { createSkill } from "#/dataconnect-generated";
import { dataConnect } from "#/lib/firebase";
import { logger } from "#/lib/logger";

export const Route = createFileRoute("/skills/new")({
	validateSearch: (search: Record<string, unknown>) => {
		return {
			q: (search.q as string) || "",
		};
	},
	component: NewSkillPage,
});

function NewSkillPage() {
	const navigate = useNavigate({ from: Route.fullPath });
	const { isLoaded, userId } = useAuth();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		tags: "",
		installCommand: "",
		promptConfig: "",
		usageExample: "",
	});

	const [isPublishingAvailable, setIsPublishingAvailable] = useState(false);

	useEffect(() => {
		if (isLoaded && userId) {
			// LEARNING NOTE: In a real app with auth bridge implemented,
			// we would verify the Firebase token bridge here.
			// For now, we allow the form to be submitted (it will fail at mutation)
			setIsPublishingAvailable(true);
		} else {
			setIsPublishingAvailable(false);
		}
	}, [isLoaded, userId]);

	// LEARNING NOTE: This mutation will fail - auth bridge not implemented yet.
	// This is intentional for the current learning stage.
	// See auth-integration.md for future implementation steps.
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!isPublishingAvailable) {
			setError("Please sign in to publish a skill.");
			return;
		}

		setIsSubmitting(true);
		setError(null);

		try {
			const tagsArray = formData.tags
				.split(",")
				.map((t) => t.trim())
				.filter(Boolean);

			await createSkill(dataConnect, {
				...formData,
				tags: tagsArray,
			});

			navigate({ to: "/skills", search: { q: "" } });
		} catch (err) {
			logger.error("Failed to publish skill", err);
			setError(
				err instanceof Error ? err.message : "An unexpected error occurred",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div id="new-skill">
			<Link to="/skills" search={{ q: "" }} className="back">
				<ArrowLeft size={18} />
				<span>Back to Skills</span>
			</Link>

			<header className="intro">
				<h1>
					Publish a <span className="text-gradient">New Skill</span>
				</h1>
				<p>Share your agentic skill with the Skild community.</p>
			</header>

			<form onSubmit={handleSubmit} className="content">
				<div className="card flex flex-col gap-12">
					<div className="flex flex-col gap-8">
						<div className="form-item">
							<label className="form-label" htmlFor="skill-title">
								Title
							</label>
							<input
								id="skill-title"
								type="text"
								name="title"
								value={formData.title}
								onChange={(e) =>
									setFormData({ ...formData, title: e.target.value })
								}
								placeholder="e.g., Web Scraper Pro"
								className="input-field"
								required
							/>
						</div>

						<div className="form-item">
							<label className="form-label" htmlFor="skill-description">
								Description
							</label>
							<p className="form-description">
								Describe what your skill does and how it helps agents.
							</p>
							<textarea
								id="skill-description"
								name="description"
								value={formData.description}
								onChange={(e) =>
									setFormData({ ...formData, description: e.target.value })
								}
								placeholder="This skill allows agents to..."
								className="input-field input-field-textarea input-field-description"
								required
							/>
						</div>

						<div className="form-item">
							<label className="form-label" htmlFor="skill-tags">
								Tags
							</label>
							<p className="form-description">
								Comma-separated keywords (e.g., automation, scraping).
							</p>
							<input
								id="skill-tags"
								type="text"
								name="tags"
								value={formData.tags}
								onChange={(e) =>
									setFormData({ ...formData, tags: e.target.value })
								}
								placeholder="web, scraping, automation"
								className="input-field"
							/>
						</div>

						<div className="divider" />

						<div className="form-item">
							<label className="form-label" htmlFor="skill-install">
								Install Command
							</label>
							<p className="form-description">
								The command users will run to install your skill.
							</p>
							<input
								id="skill-install"
								type="text"
								name="installCommand"
								value={formData.installCommand}
								onChange={(e) =>
									setFormData({ ...formData, installCommand: e.target.value })
								}
								placeholder="npx skild add web-scraper-pro"
								className="input-field input-field-mono"
								required
							/>
						</div>

						<div className="form-item">
							<label className="form-label" htmlFor="skill-prompt">
								Prompt Configuration
							</label>
							<p className="form-description">
								Define the system prompt or configuration for this skill.
							</p>
							<textarea
								id="skill-prompt"
								name="promptConfig"
								value={formData.promptConfig}
								onChange={(e) =>
									setFormData({ ...formData, promptConfig: e.target.value })
								}
								placeholder="You are a web scraping specialist..."
								className="input-field input-field-textarea input-field-prompt"
								required
							/>
						</div>

						<div className="form-item">
							<label className="form-label" htmlFor="skill-usage">
								Usage Example
							</label>
							<p className="form-description">
								Provide a short example of how to use this skill.
							</p>
							<textarea
								id="skill-usage"
								name="usageExample"
								value={formData.usageExample}
								onChange={(e) =>
									setFormData({ ...formData, usageExample: e.target.value })
								}
								placeholder="agent.use('web-scraper', { url: 'https://example.com' })"
								className="input-field input-field-textarea input-field-usage"
								required
							/>
						</div>
					</div>

					{error && (
						<div className="alert error">
							<p>{error}</p>
						</div>
					)}

					{!isPublishingAvailable && (
						<div className="alert warn">
							<p>
								<strong>Note:</strong> Publishing is currently disabled while we
								finalize our authentication bridge.
							</p>
						</div>
					)}

					<div className="actions">
						<button
							type="submit"
							className="btn-primary"
							disabled={isSubmitting || !isPublishingAvailable}
						>
							{isSubmitting ? (
								<Loader2 size={18} className="animate-spin" />
							) : (
								<Plus size={18} />
							)}
							<span>{isSubmitting ? "Publishing..." : "Publish Skill"}</span>
						</button>
						<Link to="/skills" search={{ q: "" }} className="btn-secondary">
							<span>Cancel</span>
						</Link>
					</div>
				</div>
			</form>
		</div>
	);
}
