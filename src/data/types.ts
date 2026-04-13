export type Department =
  | "sales"
  | "marketing"
  | "customer-support"
  | "product-management"
  | "legal"
  | "finance"
  | "hr"
  | "operations"
  | "executive"
  | "design"
  | "data-analytics"
  | "education"
  | "journalism"
  | "consulting"
  | "nonprofit"
  | "engineering"
  | "research"
  | "all"

export type EntryType =
  | "skill"
  | "plugin"
  | "mcp-server"
  | "claude-md"
  | "subagent"
  | "hook"
  | "rule"
  | "template"
  | "course"
  | "guide"
  | "awesome-list"
  | "marketplace"

export type Maturity = "official" | "high" | "medium" | "community"

export interface Entry {
  id: string
  name: string
  description: string
  type: EntryType
  departments: Department[]
  sourceUrl: string
  repoUrl?: string
  author?: string
  maturity: Maturity
  highlights?: string[]
  installCommand?: string
  mcpTools?: number
  skills?: number
  stars?: number
}

export interface DepartmentInfo {
  id: Department
  name: string
  nameJa: string
  icon: string
  description: string
}

export interface TypeInfo {
  id: EntryType
  name: string
  nameJa: string
  icon: string
  description: string
}

export interface SkillItem {
  id: string
  name: string
  description: string
  entryId: string
  departments: Department[]
  sourceUrl?: string
}

export interface HookItem {
  id: string
  name: string
  description: string
  entryId: string
  departments: Department[]
  sourceUrl: string
  event: string
  hookType: string
}

export interface PluginItem {
  id: string
  name: string
  description: string
  entryId: string
  departments: Department[]
  sourceUrl: string
}

export interface McpServerItem {
  id: string
  name: string
  description: string
  entryId: string
  departments: Department[]
  sourceUrl: string
  category: string
}

export interface SubagentItem {
  id: string
  name: string
  description: string
  entryId: string
  departments: Department[]
  sourceUrl: string
  role: string
}

export interface RuleItem {
  id: string
  name: string
  description: string
  entryId: string
  departments: Department[]
  sourceUrl: string
  ruleType: string
}
