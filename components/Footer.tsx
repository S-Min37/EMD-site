
import Link from "next/link";
import { Container } from "@/components/Container";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200/60 py-10 text-sm dark:border-zinc-800/60">
      <Container className="grid gap-6 md:grid-cols-2">
        <div>
          <div className="font-semibold text-zinc-900 dark:text-zinc-50">
            {siteConfig.longName}
          </div>
          <div className="mt-1 text-zinc-600 dark:text-zinc-400">
            {siteConfig.institution}
          </div>
          <div className="mt-3 text-zinc-600 dark:text-zinc-400">
            <div>{siteConfig.contact.addressKo}</div>
            <div className="mt-1">
              <a
                className="underline underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-200"
                href={`mailto:${siteConfig.contact.email}`}
              >
                {siteConfig.contact.email}
              </a>
            </div>
          </div>
        </div>

        <div className="md:text-right">
          <div className="text-zinc-500 dark:text-zinc-500">
            © {new Date().getFullYear()} {siteConfig.name}
          </div>
          <div className="mt-2 flex gap-4 md:justify-end">
            <Link
              className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              href="/news"
            >
              News
            </Link>
            <Link
              className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              href="/people"
            >
              People
            </Link>
            <Link
              className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              href="/contact"
            >
              Contact
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
