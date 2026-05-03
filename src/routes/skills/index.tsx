import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Plus, Search, X } from "lucide-react";
import SkillCard from "#/components/SkillCard";
import type { GetSkillsData } from "#/dataconnect-generated";
import { getSkills } from "#/dataconnect-generated";
import { dataConnect } from "#/lib/firebase";
import logger from "#/lib/logger";

export const Route = createFileRoute("/skills/")({
	validateSearch: (search: Record<string, unknown>) => {
		return {
			q: (search.q as string) || "",
		};
	},
	head: () => ({
		meta: [
			{
				title: "Skills Registry | Skild",
			},
			{
				name: "description",
				content:
					"Explore and discover agentic skills in the Skild registry. Find the capabilities you need to power your agents.",
			},
		],
	}),
	loaderDeps: ({ search: { q } }) => ({ q }),
	loader: async ({ deps: { q } }) => {
		try {
			const { data } = await getSkills(dataConnect, {
				searchTerm: q || "",
				limit: 50,
			});
			return data.skills;
		} catch (err) {
			logger.error(err);
			return [] as GetSkillsData["skills"];
		}
	},
	component: SkillsPage,
});

function SkillsPage() {
	const { q } = Route.useSearch();
	const skills = Route.useLoaderData();
	const navigate = useNavigate({ from: Route.fullPath });

	const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const query = formData.get("q") as string;
		navigate({ search: (prev) => ({ ...prev, q: query || "" }) });
	};

	const clearSearch = () => {
		navigate({ search: (prev) => ({ ...prev, q: "" }) });
	};

	return (
		<div id="skills-page">
			<section className="intro">
				<header>
					<h1>
						Registry <span className="text-gradient">Explorer</span>
					</h1>
					<p>
						Discover and deploy the next generation of agentic capabilities.
					</p>
				</header>

				<Link to="/skills/new" className="btn-primary" search={{ q }}>
					<Plus size={18} />
					<span>Publish Skill</span>
				</Link>

				<form onSubmit={handleSearch} className="search-bar">
					<div className="row">
						<div className="field">
							<Search className="icon" size={18} />
							<input
								type="text"
								name="q"
								defaultValue={q}
								placeholder="Search by title, tag, or author..."
								className="input-field search-input"
								autoComplete="off"
							/>
							{q && (
								<button
									type="button"
									onClick={clearSearch}
									className="search-clear"
									aria-label="Clear search"
								>
									<X size={16} />
								</button>
							)}
						</div>
						<button type="submit" className="btn-secondary search-filters">
							<span>Search</span>
						</button>
					</div>
					<div className="status">
						{skills.length} {skills.length === 1 ? "skill" : "skills"} found
					</div>
				</form>
			</section>

			<section className="results">
				{skills.length > 0 ? (
					<div className="skills-grid">
						{skills.map((skill) => (
							<SkillCard key={skill.id} {...skill} />
						))}
					</div>
				) : (
					<div className="py-20 text-center">
						<p className="mb-4 text-text-muted text-lg">
							No skills found matching your search.
						</p>
						<button
							type="button"
							onClick={clearSearch}
							className="text-accent-primary font-medium hover:underline cursor-pointer"
						>
							Clear all filters
						</button>
					</div>
				)}
			</section>
		</div>
	);
}
