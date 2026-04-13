import { notFound } from "next/navigation"
import Link from "next/link"
import { departments, entries, entryTypes } from "@/data"
import { EntryCard } from "@/components/EntryCard"

export function generateStaticParams() {
  return departments.map((d) => ({ id: d.id }))
}

export function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  return params.then(({ id }) => {
    const dept = departments.find((d) => d.id === id)
    return { title: dept ? `${dept.nameJa} | Claude Hub` : "Not Found" }
  })
}

export default async function DepartmentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const dept = departments.find((d) => d.id === id)
  if (!dept) notFound()

  const deptEntries = entries.filter((e) => e.departments.includes(dept.id))

  const byType = entryTypes
    .map((type) => ({
      type,
      items: deptEntries.filter((e) => e.type === type.id),
    }))
    .filter((group) => group.items.length > 0)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-2">
        <Link
          href="/"
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600"
        >
          ← ホーム
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {dept.icon} {dept.nameJa}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">{dept.description}</p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
          {deptEntries.length} items
        </p>
      </div>

      {byType.map(({ type, items }) => (
        <section key={type.id} className="mb-10">
          <h2 className="text-lg font-semibold mb-3">
            {type.icon} {type.nameJa} ({items.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
