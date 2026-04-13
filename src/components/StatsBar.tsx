import { entries, departments, entryTypes, skills } from "@/data"

export function StatsBar() {
  const totalEntries = entries.length
  const officialCount = entries.filter((e) => e.maturity === "official").length
  const deptCount = departments.filter((d) => d.id !== "all").length
  const typeCount = entryTypes.length

  const stats = [
    { label: "リソース", value: totalEntries },
    { label: "公式", value: officialCount },
    { label: "部門", value: deptCount },
    { label: "タイプ", value: typeCount },
    { label: "スキル", value: skills.length },
  ]

  return (
    <div className="grid grid-cols-5 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900"
        >
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stat.value}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  )
}
