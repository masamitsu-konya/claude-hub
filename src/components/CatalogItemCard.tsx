import { departments as allDepartments } from "@/data/departments"

interface CatalogItem {
  id: string
  name: string
  description: string
  departments: string[]
  sourceUrl?: string
  entryId?: string
}

export function CatalogItemCard({
  item,
  icon,
  badge,
  badgeColor = "blue",
}: {
  item: CatalogItem
  icon: string
  badge?: string
  badgeColor?: "blue" | "green" | "orange" | "purple" | "red"
}) {
  const colorMap = {
    blue: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
    green: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
    orange:
      "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200",
    purple:
      "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200",
    red: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
  }

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-base leading-tight">
          {item.sourceUrl ? (
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              {icon} {item.name}
            </a>
          ) : (
            <>
              {icon} {item.name}
            </>
          )}
        </h3>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
        {item.description}
      </p>

      <div className="flex flex-wrap gap-1">
        {badge && (
          <span
            className={`px-1.5 py-0.5 rounded text-xs font-medium ${colorMap[badgeColor]}`}
          >
            {badge}
          </span>
        )}
        {item.departments.slice(0, 2).map((deptId) => {
          const dept = allDepartments.find((d) => d.id === deptId)
          return dept ? (
            <span
              key={deptId}
              className="px-1.5 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              {dept.icon} {dept.nameJa}
            </span>
          ) : null
        })}
      </div>
    </div>
  )
}
