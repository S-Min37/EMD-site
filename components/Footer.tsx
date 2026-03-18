import Link from "next/link";

import {Container} from "@/components/Container";
import type {CmsSiteSettings} from "@/lib/cms";

export function Footer({settings}: {settings: CmsSiteSettings}) {
  return (
    <footer className="border-t border-zinc-200/60 py-10 text-sm dark:border-zinc-800/60">
      <Container className="grid gap-6 md:grid-cols-2">
        <div>
          <div className="font-semibold text-zinc-900 dark:text-zinc-50">
            {settings.longName}
          </div>
          <div className="mt-1 text-zinc-600 dark:text-zinc-400">
            {settings.institution}
          </div>
          <div className="mt-3 text-zinc-600 dark:text-zinc-400">
            <div>{settings.addressKo}</div>
            <div className="mt-1">
              <a
                className="underline underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-200"
                href={`mailto:${settings.contactEmail}`}
              >
                {settings.contactEmail}
              </a>
            </div>
          </div>
        </div>

        <div className="md:text-right">
          <div className="text-zinc-500 dark:text-zinc-500">
            © {new Date().getFullYear()} {settings.name}
          </div>
          {settings.footerNote ? (
            <div className="mt-2 text-zinc-500 dark:text-zinc-400">
              {settings.footerNote}
            </div>
          ) : null}
          <div className="mt-3 flex gap-4 md:justify-end">
            {settings.footerLinks.map((link) => (
              <Link
                key={link.href}
                className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
