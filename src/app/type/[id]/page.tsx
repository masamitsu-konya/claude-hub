import { notFound } from "next/navigation"
import Link from "next/link"
import { departments, entries, entryTypes } from "@/data"
import { EntryCard } from "@/components/EntryCard"

export function generateStaticParams() {
  return entryTypes.map((t) => ({ id: t.id }))
}

export function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  return params.then(({ id }) => {
    const type = entryTypes.find((t) => t.id === id)
    return { title: type ? `${type.nameJa} | Claude Hub` : "Not Found" }
  })
}

export default async function TypePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const type = entryTypes.find((t) => t.id === id)
  if (!type) notFound()

  const typeEntries = entries.filter((e) => e.type === type.id)

  const byDept = departments
    .map((dept) => ({
      dept,
      items: typeEntries.filter((e) => e.departments.includes(dept.id)),
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
          {type.icon} {type.nameJa}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">{type.description}</p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
          {typeEntries.length} items
        </p>
      </div>

      {byDept.map(({ dept, items }) => (
        <section key={dept.id} className="mb-10">
          <h2 className="text-lg font-semibold mb-3">
            {dept.icon} {dept.nameJa} ({items.length})
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
