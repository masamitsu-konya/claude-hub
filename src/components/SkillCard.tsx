import { SkillItem } from "@/data/types"
import { departments as allDepartments } from "@/data/departments"
import { entries } from "@/data/entries"

function getSkillUrl(skill: SkillItem): string | undefined {
  if (skill.sourceUrl) return skill.sourceUrl
  const entry = entries.find((e) => e.id === skill.entryId)
  if (!entry?.repoUrl) return entry?.sourceUrl
  // Guess the skill directory URL from repo + skill name
  const repo = entry.repoUrl.replace(/\/$/, "")
  return `${repo}/tree/main/skills/${skill.name}`
}

export function SkillCard({ skill }: { skill: SkillItem }) {
  const entry = entries.find((e) => e.id === skill.entryId)
  const url = getSkillUrl(skill)

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-base leading-tight">
          {url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              {skill.name}
            </a>
          ) : (
            skill.name
          )}
        </h3>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
        {skill.description}
      </p>

      <div className="flex flex-wrap gap-1 mb-2">
        {entry && (
          <a
            href={entry.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-1.5 py-0.5 rounded text-sm bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 hover:underline"
          >
            📦 {entry.name}
          </a>
        )}
        {skill.departments.slice(0, 2).map((deptId) => {
          const dept = allDepartments.find((d) => d.id === deptId)
          return (
            <span
              key={deptId}
              className="px-1.5 py-0.5 rounded text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              {dept?.icon} {dept?.nameJa}
            </span>
          )
        })}
      </div>
    </div>
  )
}
