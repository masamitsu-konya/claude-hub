"use client"

import { useState, useMemo, useCallback } from "react"
import { EntryCard } from "@/components/EntryCard"
import { SkillCard } from "@/components/SkillCard"
import { CatalogItemCard } from "@/components/CatalogItemCard"
import { StatsBar } from "@/components/StatsBar"
import type { Entry, DepartmentInfo, TypeInfo, Maturity, SkillItem, HookItem, PluginItem, McpServerItem, SubagentItem, RuleItem } from "@/data/types"

const maturityOptions: { id: Maturity; label: string; icon: string }[] = [
  { id: "official", label: "公式", icon: "🟢" },
  { id: "high", label: "高品質", icon: "🔵" },
  { id: "medium", label: "中", icon: "🟡" },
  { id: "community", label: "コミュニティ", icon: "⚪" },
]

type ViewMode = "resources" | "skills" | "plugins" | "mcp-servers" | "subagents" | "hooks" | "rules"

interface Props {
  entries: Entry[]
  departments: DepartmentInfo[]
  entryTypes: TypeInfo[]
  featuredEntries: Entry[]
  skills: SkillItem[]
  hooks: readonly HookItem[]
  plugins: readonly PluginItem[]
  mcpServers: readonly McpServerItem[]
  subagents: readonly SubagentItem[]
  rules: readonly RuleItem[]
}

export function FilterableCatalog({
  entries,
  departments,
  entryTypes,
  featuredEntries,
  skills,
  hooks,
  plugins,
  mcpServers,
  subagents,
  rules,
}: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>("resources")
  const [query, setQuery] = useState("")
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedMaturities, setSelectedMaturities] = useState<string[]>([])
  const [openSections, setOpenSections] = useState({
    department: true,
    type: true,
    maturity: true,
  })

  const toggleSection = useCallback(
    (key: "department" | "type" | "maturity") => {
      setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }))
    },
    []
  )

  const filteredEntries = useMemo(() => {
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
      if (
        selectedDepartments.length > 0 &&
        !entry.departments.some((d) => selectedDepartments.includes(d))
      )
        return false
      if (selectedTypes.length > 0 && !selectedTypes.includes(entry.type))
        return false
      if (
        selectedMaturities.length > 0 &&
        !selectedMaturities.includes(entry.maturity)
      )
        return false
      return true
    })
  }, [entries, query, selectedDepartments, selectedTypes, selectedMaturities])

  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      if (query) {
        const q = query.toLowerCase()
        const matchesText =
          skill.name.toLowerCase().includes(q) ||
          skill.description.toLowerCase().includes(q)
        if (!matchesText) return false
      }
      if (
        selectedDepartments.length > 0 &&
        !skill.departments.some((d) => selectedDepartments.includes(d))
      )
        return false
      return true
    })
  }, [skills, query, selectedDepartments])

  const filterByQueryAndDept = useCallback(
    <T extends { name: string; description: string; departments: readonly string[] }>(items: readonly T[]): T[] => {
      return items.filter((item) => {
        if (query) {
          const q = query.toLowerCase()
          if (!item.name.toLowerCase().includes(q) && !item.description.toLowerCase().includes(q))
            return false
        }
        if (selectedDepartments.length > 0 && !item.departments.some((d) => selectedDepartments.includes(d)))
          return false
        return true
      })
    },
    [query, selectedDepartments]
  )

  const filteredPlugins = useMemo(() => filterByQueryAndDept(plugins), [plugins, filterByQueryAndDept])
  const filteredMcpServers = useMemo(() => filterByQueryAndDept(mcpServers), [mcpServers, filterByQueryAndDept])
  const filteredSubagents = useMemo(() => filterByQueryAndDept(subagents), [subagents, filterByQueryAndDept])
  const filteredHooks = useMemo(() => filterByQueryAndDept(hooks), [hooks, filterByQueryAndDept])
  const filteredRules = useMemo(() => filterByQueryAndDept(rules), [rules, filterByQueryAndDept])

  const toggle = (
    list: string[],
    setList: (v: string[]) => void,
    id: string
  ) => {
    setList(list.includes(id) ? list.filter((x) => x !== id) : [...list, id])
  }

  const clearAll = () => {
    setQuery("")
    setSelectedDepartments([])
    setSelectedTypes([])
    setSelectedMaturities([])
  }

  const hasFilters =
    query !== "" ||
    selectedDepartments.length > 0 ||
    selectedTypes.length > 0 ||
    selectedMaturities.length > 0

  const deptCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const dept of departments) {
      counts[dept.id] = entries.filter((e) =>
        e.departments.includes(dept.id)
      ).length
    }
    return counts
  }, [entries, departments])

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const type of entryTypes) {
      counts[type.id] = entries.filter((e) => e.type === type.id).length
    }
    return counts
  }, [entries, entryTypes])

  const maturityCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const m of maturityOptions) {
      counts[m.id] = entries.filter((e) => e.maturity === m.id).length
    }
    return counts
  }, [entries])

  return (
    <div className="flex min-h-screen">
      {/* Sidebar — fixed left */}
      <aside className="hidden lg:block w-64 shrink-0 border-r border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="sticky top-0 overflow-y-auto max-h-screen p-4 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm">絞り込み</h3>
            {hasFilters && (
              <button
                onClick={clearAll}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                クリア
              </button>
            )}
          </div>

          {/* Keyword search */}
          <div>
            <input
              type="text"
              placeholder="キーワードで検索..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Department filter */}
          <div>
            <button
              onClick={() => toggleSection("department")}
              className="flex items-center justify-between w-full text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2"
            >
              <span>部門別</span>
              <span className="text-[10px]">
                {openSections.department ? "▲" : "▼"}
              </span>
            </button>
            {openSections.department && (
              <div className="space-y-0.5">
                {departments
                  .filter((d) => d.id !== "all")
                  .map((dept) => (
                    <label
                      key={dept.id}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded text-sm cursor-pointer transition-colors ${
                        selectedDepartments.includes(dept.id)
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedDepartments.includes(dept.id)}
                        onChange={() =>
                          toggle(
                            selectedDepartments,
                            setSelectedDepartments,
                            dept.id
                          )
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>{dept.icon}</span>
                      <span className="flex-1 truncate">{dept.nameJa}</span>
                      <span className="text-xs text-gray-400">
                        {deptCounts[dept.id]}
                      </span>
                    </label>
                  ))}
              </div>
            )}
          </div>

          {/* Type filter */}
          <div>
            <button
              onClick={() => toggleSection("type")}
              className="flex items-center justify-between w-full text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2"
            >
              <span>タイプ別</span>
              <span className="text-[10px]">
                {openSections.type ? "▲" : "▼"}
              </span>
            </button>
            {openSections.type && (
              <div className="space-y-0.5">
                {entryTypes.map((type) => (
                  <label
                    key={type.id}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded text-sm cursor-pointer transition-colors ${
                      selectedTypes.includes(type.id)
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type.id)}
                      onChange={() =>
                        toggle(selectedTypes, setSelectedTypes, type.id)
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{type.icon}</span>
                    <span className="flex-1 truncate">{type.nameJa}</span>
                    <span className="text-xs text-gray-400">
                      {typeCounts[type.id]}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Maturity filter */}
          <div>
            <button
              onClick={() => toggleSection("maturity")}
              className="flex items-center justify-between w-full text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2"
            >
              <span>成熟度</span>
              <span className="text-[10px]">
                {openSections.maturity ? "▲" : "▼"}
              </span>
            </button>
            {openSections.maturity && (
              <div className="space-y-0.5">
                {maturityOptions.map((m) => (
                  <label
                    key={m.id}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded text-sm cursor-pointer transition-colors ${
                      selectedMaturities.includes(m.id)
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedMaturities.includes(m.id)}
                      onChange={() =>
                        toggle(selectedMaturities, setSelectedMaturities, m.id)
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{m.icon}</span>
                    <span className="flex-1 truncate">{m.label}</span>
                    <span className="text-xs text-gray-400">
                      {maturityCounts[m.id]}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile filter bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 p-3 space-y-2">
        <input
          type="text"
          placeholder="キーワードで検索..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-2 overflow-x-auto pb-1">
          {hasFilters && (
            <button
              onClick={clearAll}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
            >
              クリア
            </button>
          )}
          {departments
            .filter((d) => d.id !== "all")
            .map((dept) => (
              <button
                key={dept.id}
                onClick={() =>
                  toggle(
                    selectedDepartments,
                    setSelectedDepartments,
                    dept.id
                  )
                }
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedDepartments.includes(dept.id)
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                }`}
              >
                {dept.icon} {dept.nameJa}
              </button>
            ))}
          <span className="shrink-0 w-px bg-gray-300 dark:bg-gray-700 mx-1" />
          {entryTypes.map((type) => (
            <button
              key={type.id}
              onClick={() =>
                toggle(selectedTypes, setSelectedTypes, type.id)
              }
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedTypes.includes(type.id)
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
              }`}
            >
              {type.icon} {type.nameJa}
            </button>
          ))}
          <span className="shrink-0 w-px bg-gray-300 dark:bg-gray-700 mx-1" />
          {maturityOptions.map((m) => (
            <button
              key={m.id}
              onClick={() =>
                toggle(selectedMaturities, setSelectedMaturities, m.id)
              }
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedMaturities.includes(m.id)
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
              }`}
            >
              {m.icon} {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {!hasFilters && (
            <>
              {/* Hero */}
              <div className="text-center mb-10">
                <h1 className="text-4xl font-bold mb-3">Claude Hub</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  あらゆる職種で使える Claude Code 設定を網羅的に収集
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 max-w-2xl mx-auto">
                  スキル、プラグイン、MCPサーバー、CLAUDE.md、サブエージェント、フック...
                  営業からマーケ、CS、法務、HR、経営層まで。
                  世界中のGitHub、ブログ、X、公式ドキュメントから収集。
                </p>
              </div>

              {/* Stats */}
              <div className="mb-10">
                <StatsBar />
              </div>

              {/* Featured */}
              <section className="mb-12">
                <h2 className="text-xl font-bold mb-4">注目のリソース</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {featuredEntries.map((entry) => (
                    <EntryCard key={entry.id} entry={entry} />
                  ))}
                </div>
              </section>
            </>
          )}

          {/* View mode tabs */}
          <div className="flex items-center gap-1 mb-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            {([
              { mode: "resources" as ViewMode, label: "リソース", icon: "📦", total: entries.length, filtered: filteredEntries.length },
              { mode: "skills" as ViewMode, label: "スキル", icon: "⚡", total: skills.length, filtered: filteredSkills.length },
              { mode: "plugins" as ViewMode, label: "プラグイン", icon: "🔌", total: plugins.length, filtered: filteredPlugins.length },
              { mode: "mcp-servers" as ViewMode, label: "MCP", icon: "🔗", total: mcpServers.length, filtered: filteredMcpServers.length },
              { mode: "subagents" as ViewMode, label: "エージェント", icon: "🤖", total: subagents.length, filtered: filteredSubagents.length },
              { mode: "hooks" as ViewMode, label: "フック", icon: "🪝", total: hooks.length, filtered: filteredHooks.length },
              { mode: "rules" as ViewMode, label: "ルール", icon: "📏", total: rules.length, filtered: filteredRules.length },
            ] as const).map((tab) => (
              <button
                key={tab.mode}
                onClick={() => setViewMode(tab.mode)}
                className={`shrink-0 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  viewMode === tab.mode
                    ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {tab.icon} {tab.label} ({hasFilters ? tab.filtered : tab.total})
              </button>
            ))}
          </div>

          {/* Content based on view mode */}
          <section className="mb-12 lg:mb-0">
            {viewMode === "resources" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">
                    {hasFilters ? "検索結果" : "すべてのリソース"}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {hasFilters ? (
                      <>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {filteredEntries.length}
                        </span>
                        {" / "}
                        {entries.length} リソース
                      </>
                    ) : (
                      <>全 {entries.length} リソース</>
                    )}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredEntries.map((entry) => (
                    <EntryCard key={entry.id} entry={entry} />
                  ))}
                </div>
                {filteredEntries.length === 0 && (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <p className="text-lg mb-2">該当するリソースがありません</p>
                    <button onClick={clearAll} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">フィルタをクリア</button>
                  </div>
                )}
              </>
            )}

            {viewMode === "skills" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">{hasFilters ? "検索結果" : "すべてのスキル"}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {hasFilters ? (<><span className="font-medium text-gray-900 dark:text-gray-100">{filteredSkills.length}</span>{" / "}{skills.length} スキル</>) : (<>全 {skills.length} スキル</>)}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredSkills.map((skill) => (
                    <SkillCard key={skill.id} skill={skill} />
                  ))}
                </div>
                {filteredSkills.length === 0 && (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <p className="text-lg mb-2">該当するスキルがありません</p>
                    <button onClick={clearAll} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">フィルタをクリア</button>
                  </div>
                )}
              </>
            )}

            {viewMode === "plugins" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">{hasFilters ? "検索結果" : "すべてのプラグイン"}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {hasFilters ? (<><span className="font-medium text-gray-900 dark:text-gray-100">{filteredPlugins.length}</span>{" / "}{plugins.length} プラグイン</>) : (<>全 {plugins.length} プラグイン</>)}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredPlugins.map((item) => (
                    <CatalogItemCard key={item.id} item={item} icon="🔌" />
                  ))}
                </div>
                {filteredPlugins.length === 0 && (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <p className="text-lg mb-2">該当するプラグインがありません</p>
                    <button onClick={clearAll} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">フィルタをクリア</button>
                  </div>
                )}
              </>
            )}

            {viewMode === "mcp-servers" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">{hasFilters ? "検索結果" : "すべてのMCPサーバー"}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {hasFilters ? (<><span className="font-medium text-gray-900 dark:text-gray-100">{filteredMcpServers.length}</span>{" / "}{mcpServers.length} MCPサーバー</>) : (<>全 {mcpServers.length} MCPサーバー</>)}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredMcpServers.map((item) => (
                    <CatalogItemCard key={item.id} item={item} icon="🔗" badge={item.category} badgeColor="green" />
                  ))}
                </div>
                {filteredMcpServers.length === 0 && (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <p className="text-lg mb-2">該当するMCPサーバーがありません</p>
                    <button onClick={clearAll} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">フィルタをクリア</button>
                  </div>
                )}
              </>
            )}

            {viewMode === "subagents" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">{hasFilters ? "検索結果" : "すべてのエージェント"}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {hasFilters ? (<><span className="font-medium text-gray-900 dark:text-gray-100">{filteredSubagents.length}</span>{" / "}{subagents.length} エージェント</>) : (<>全 {subagents.length} エージェント</>)}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredSubagents.map((item) => (
                    <CatalogItemCard key={item.id} item={item} icon="🤖" badge={item.role} badgeColor="purple" />
                  ))}
                </div>
                {filteredSubagents.length === 0 && (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <p className="text-lg mb-2">該当するエージェントがありません</p>
                    <button onClick={clearAll} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">フィルタをクリア</button>
                  </div>
                )}
              </>
            )}

            {viewMode === "hooks" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">{hasFilters ? "検索結果" : "すべてのフック"}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {hasFilters ? (<><span className="font-medium text-gray-900 dark:text-gray-100">{filteredHooks.length}</span>{" / "}{hooks.length} フック</>) : (<>全 {hooks.length} フック</>)}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredHooks.map((item) => (
                    <CatalogItemCard key={item.id} item={item} icon="🪝" badge={item.event} badgeColor="orange" />
                  ))}
                </div>
                {filteredHooks.length === 0 && (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <p className="text-lg mb-2">該当するフックがありません</p>
                    <button onClick={clearAll} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">フィルタをクリア</button>
                  </div>
                )}
              </>
            )}

            {viewMode === "rules" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">{hasFilters ? "検索結果" : "すべてのルール"}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {hasFilters ? (<><span className="font-medium text-gray-900 dark:text-gray-100">{filteredRules.length}</span>{" / "}{rules.length} ルール</>) : (<>全 {rules.length} ルール</>)}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredRules.map((item) => (
                    <CatalogItemCard key={item.id} item={item} icon="📏" badge={item.ruleType} badgeColor="blue" />
                  ))}
                </div>
                {filteredRules.length === 0 && (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <p className="text-lg mb-2">該当するルールがありません</p>
                    <button onClick={clearAll} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">フィルタをクリア</button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
