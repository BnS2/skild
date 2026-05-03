import { createFileRoute, Link } from "@tanstack/react-router";
import { Terminal } from "lucide-react";
import SkillCard from "#/components/SkillCard";

const skills: SkillRecord[] = [
	{
		id: "1",
		title: "Code Review Assistant",
		slug: "code-review-assistant",
		description:
			"An AI agent that automatically reviews pull requests and provides constructive feedback on code quality.",
		category: "Development",
		tags: ["AI", "Code Review", "GitHub"],
		installCommand: "npm install @skill/code-review-assistant",
		createdAt: "2024-01-15T10:00:00Z",
		authorClerkId: "user_123",
		authorEmail: "dev@example.com",
	},
	{
		id: "2",
		title: "Database Migration Tool",
		slug: "database-migration-tool",
		description:
			"Automates database schema migrations with zero downtime and automatic rollback capabilities.",
		category: "DevOps",
		tags: ["Database", "Migration", "PostgreSQL"],
		installCommand: "npm install @skill/db-migration",
		createdAt: "2024-02-20T14:30:00Z",
		authorClerkId: "user_456",
		authorEmail: "ops@example.com",
	},
	{
		id: "3",
		title: "API Documentation Generator",
		slug: "api-docs-generator",
		description:
			"Generates beautiful, interactive API documentation from OpenAPI specs and code comments.",
		category: "Documentation",
		tags: ["API", "OpenAPI", "Docs"],
		installCommand: "npm install @skill/api-docs",
		createdAt: "2024-03-10T09:15:00Z",
		authorClerkId: "user_789",
		authorEmail: "docs@example.com",
	},
	{
		id: "4",
		title: "Test Case Generator",
		slug: "test-case-generator",
		description:
			"AI-powered test case generation that creates comprehensive unit and integration tests.",
		category: "Testing",
		tags: ["Testing", "AI", "Jest"],
		installCommand: "npm install @skill/test-generator",
		createdAt: "2024-04-05T16:45:00Z",
		authorClerkId: "user_321",
		authorEmail: "qa@example.com",
	},
	{
		id: "5",
		title: "Security Vulnerability Scanner",
		slug: "security-scanner",
		description:
			"Scans codebase for common security vulnerabilities and provides remediation suggestions.",
		category: "Security",
		tags: ["Security", "Vulnerability", "SAST"],
		installCommand: "npm install @skill/security-scanner",
		createdAt: "2024-05-01T11:20:00Z",
		authorClerkId: "user_654",
		authorEmail: "sec@example.com",
	},
];

export const Route = createFileRoute("/")({
	loader: async () => {
		return { skills };
	},
	component: Home,
});

function Home() {
	const { skills } = Route.useLoaderData();
	return (
		<div id="home">
			<section className="hero">
				<div className="copy">
					<h1>
						The Registry for <br />
						<span className="text-gradient">Agentic Intelligence</span>
					</h1>
					<p>
						A high-performance registry for procedural agent skills. Discover,
						publish, and operate reusable agent capabilities from a route-driven
						workspace.
					</p>
				</div>

				<div className="actions">
					<Link to="/skills" className="btn-primary">
						<Terminal size={18} />
						<span>Browse Registry</span>
					</Link>
					<Link to="/skills/new" className="btn-secondary">
						<span>Publish Skill</span>
					</Link>
				</div>
			</section>

			<section className="latest">
				<div className="space-y-2">
					<h2>
						Recently Created <span className="text-gradient">Skills</span>
					</h2>
				</div>
				<p>
					{" "}
					Latest skills loaded from Firestore in descending creation order.
				</p>

				<div>
					{skills.length > 0 ? (
						<div className="skills-grid">
							{skills?.map((skill) => (
								<SkillCard key={skill.id} {...skill} />
							))}
						</div>
					) : (
						<p>No skills have been created yet.</p>
					)}
				</div>
			</section>
		</div>
	);
}
