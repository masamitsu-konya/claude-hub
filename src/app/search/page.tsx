"use client"

import { useState, useMemo } from "react"
import { entries, departments, entryTypes } from "@/data"
import { Department, EntryType, Maturity } from "@/data/types"
import { EntryCard } from "@/components/EntryCard"

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [selectedDept, setSelectedDept] = useState<Department | "">("")
  const [selectedType, setSelectedType] = useState<EntryType | "">("")
  const [selectedMaturity, setSelectedMaturity] = useState<Maturity | "">("")

  const filtered = useMemo(() => {
    return entries.filter((entry) => {
      if (query) {
        const q = query.toLowerCase()
        const matchesText =
          entry.name.toLowerCase().includes(q) ||
          entry.description.toLowerCase().includes(q) ||
          (entry.author && entry.author.toLowerCase().includes(q)) ||
          (entry.highlights &&
            entry.highlights.some((h) => h.toLowerCase().includes(q)))
        if (!matchesText) return false
      }
      if (selectedDept && !entry.departments.includes(selectedDept))
        return false
      if (selectedType && entry.type !== selectedType) return false
      if (selectedMaturity && entry.maturity !== selectedMaturity) return false
      return true
    })
  }, [query, selectedDept, selectedType, selectedMaturity])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">検索</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <input
          type="text"
          placeholder="キーワードで検索..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value as Department | "")}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm"
        >
          <option value="">全部門</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.icon} {d.nameJa}
            </option>
          ))}
        </select>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as EntryType | "")}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm"
        >
          <option value="">全タイプ</option>
          {entryTypes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.icon} {t.nameJa}
            </option>
          ))}
        </select>
        <select
          value={selectedMaturity}
          onChange={(e) =>
            setSelectedMaturity(e.target.value as Maturity | "")
          }
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm"
        >
          <option value="">全レベル</option>
          <option value="official">公式</option>
          <option value="high">高品質</option>
          <option value="medium">中</option>
          <option value="community">コミュニティ</option>
        </select>
      </div>

      {/* Results */}
      <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        {filtered.length} / {entries.length} 件
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((entry) => (
          <EntryCard key={entry.id} entry={entry} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          条件に一致するエントリが見つかりません
        </div>
      )}
    </div>
  )
}
