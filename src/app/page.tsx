import { departments, entryTypes, entries, skills, hooks, plugins, mcpServers, subagents, rules } from "@/data"
import { FilterableCatalog } from "@/components/FilterableCatalog"

export default function Home() {
  const featuredEntries = entries.filter(
    (e) =>
      e.id === "anthropic-knowledge-work-plugins" ||
      e.id === "marketingskills" ||
      e.id === "ai-sales-team-claude" ||
      e.id === "pm-skills-deanpeters" ||
      e.id === "claude-legal-skill" ||
      e.id === "claude-chief-of-staff"
  )

  return (
    <FilterableCatalog
      entries={entries}
      departments={departments}
      entryTypes={entryTypes}
      featuredEntries={featuredEntries}
      skills={skills}
      hooks={hooks}
      plugins={plugins}
      mcpServers={mcpServers}
      subagents={subagents}
      rules={rules}
    />
  )
}
