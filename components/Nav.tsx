import Link from "next/link";

import {Container} from "@/components/Container";
import type {CmsSiteSettings} from "@/lib/cms";

export function Nav({settings}: {settings: CmsSiteSettings}) {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/60 bg-white/85 backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-950/75">
      <Container className="flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            {settings.name}
          </Link>
          <span className="hidden text-sm text-zinc-500 dark:text-zinc-400 md:inline">
            {settings.longName}
          </span>
        </div>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          {settings.navItems.map((item) =>
            item.children.length ? (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1 text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
                >
                  {item.label}
                  <span className="text-xs text-zinc-400">v</span>
                </Link>
                <div className="invisible absolute left-1/2 top-full z-30 mt-3 w-56 -translate-x-1/2 rounded-2xl border border-zinc-200/70 bg-white p-2 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100 dark:border-zinc-800/70 dark:bg-zinc-950">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block rounded-xl px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900 dark:hover:text-white"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <details className="relative md:hidden">
          <summary className="cursor-pointer select-none rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900">
            Menu
          </summary>
          <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-zinc-200 bg-white p-2 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
            {settings.navItems.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-xl px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900"
                >
                  {item.label}
                </Link>
                {item.children.length ? (
                  <div className="mb-2 ml-3 border-l border-zinc-200 pl-2 dark:border-zinc-800">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded-lg px-3 py-2 text-sm text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </details>
      </Container>
    </header>
  );
}
