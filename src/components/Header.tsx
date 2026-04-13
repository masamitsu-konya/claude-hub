import Link from "next/link"

export function Header() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🔮</span>
          <span className="text-xl font-bold">Claude Hub</span>
        </Link>
      </div>
    </header>
  )
}
