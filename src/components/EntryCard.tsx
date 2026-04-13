import { Entry } from "@/data/types"
import { departments } from "@/data/departments"
import { entryTypes } from "@/data/entry-types"

const maturityColors: Record<string, string> = {
  official: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  high: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  community: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
}

const maturityLabels: Record<string, string> = {
  official: "公式",
  high: "高品質",
  medium: "中",
  community: "コミュニティ",
}

export function EntryCard({ entry }: { entry: Entry }) {
  const typeInfo = entryTypes.find((t) => t.id === entry.type)

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-base leading-tight">
          <a
            href={entry.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 dark:hover:text-blue-400"
          >
            {entry.name}
          </a>
        </h3>
        <span
          className={`shrink-0 px-2 py-0.5 rounded-full text-sm font-medium ${maturityColors[entry.maturity]}`}
        >
          {maturityLabels[entry.maturity]}
        </span>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
        {entry.description}
      </p>

      <div className="flex flex-wrap gap-1 mb-2">
        <span className="px-1.5 py-0.5 rounded text-sm bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
          {typeInfo?.icon} {typeInfo?.nameJa}
        </span>
        {entry.departments.slice(0, 3).map((deptId) => {
          const dept = departments.find((d) => d.id === deptId)
          return (
            <span
              key={deptId}
              className="px-1.5 py-0.5 rounded text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              {dept?.icon} {dept?.nameJa}
            </span>
          )
        })}
        {entry.departments.length > 3 && (
          <span className="px-1.5 py-0.5 rounded text-sm bg-gray-100 dark:bg-gray-800 text-gray-500">
            +{entry.departments.length - 3}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
        {entry.author && <span>{entry.author}</span>}
        {entry.skills && <span>{entry.skills} skills</span>}
        {entry.mcpTools && <span>{entry.mcpTools} tools</span>}
        {entry.stars && <span>⭐ {entry.stars.toLocaleString()}</span>}
      </div>

      {entry.highlights && entry.highlights.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {entry.highlights.slice(0, 2).map((h, i) => (
            <span
              key={i}
              className="text-sm text-blue-600 dark:text-blue-400"
            >
              • {h}
            </span>
          ))}
        </div>
      )}

      {entry.installCommand && (
        <div className="mt-2">
          <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded font-mono">
            {entry.installCommand}
          </code>
        </div>
      )}
    </div>
  )
}
