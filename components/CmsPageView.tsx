import Link from "next/link";
import type {ReactNode} from "react";

import {Container} from "@/components/Container";
import {Gallery} from "@/components/Gallery";
import {Card} from "@/components/Card";
import {Prose} from "@/components/Prose";
import type {CmsPage} from "@/lib/cms";

function ctaClass(tone: "primary" | "secondary" = "secondary") {
  if (tone === "primary") {
    return "rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200";
  }

  return "rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900";
}

export function CmsPageView({
  page,
  children,
}: {
  page: CmsPage;
  children?: ReactNode;
}) {
  return (
    <div className="py-12">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            {page.eyebrow ? (
              <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                {page.eyebrow}
              </div>
            ) : null}
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">{page.title}</h1>
            {page.intro ? (
              <p className="mt-3 text-zinc-600 dark:text-zinc-300">{page.intro}</p>
            ) : null}
          </div>

          {page.ctas.length ? (
            <div className="flex flex-wrap gap-3 lg:justify-end">
              {page.ctas.map((link) => (
                <Link
                  key={`${link.href}-${link.label}`}
                  href={link.href}
                  className={ctaClass(link.tone)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        {page.heroImage ? (
          <div className="mt-8 overflow-hidden rounded-3xl border border-zinc-200/70 bg-zinc-100 shadow-sm dark:border-zinc-800/70 dark:bg-zinc-900/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={page.heroImage}
              alt={page.heroImageAlt ?? page.title}
              className="h-full max-h-[420px] w-full object-cover"
            />
          </div>
        ) : null}

        {page.cards.length ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {page.cards.map((card) => (
              <Card
                key={`${card.title}-${card.href ?? card.anchor ?? "card"}`}
                title={card.title}
                description={card.description}
                href={card.href ?? (card.anchor ? `#${card.anchor}` : undefined)}
              />
            ))}
          </div>
        ) : null}

        {page.gallery.length ? (
          <div className="mt-8">
            <Gallery images={page.gallery} columns={2} />
          </div>
        ) : null}

        {children}

        {page.bodyHtml ? (
          <div className="mt-10 rounded-3xl border border-zinc-200/70 bg-white p-6 shadow-sm dark:border-zinc-800/70 dark:bg-zinc-950">
            <Prose html={page.bodyHtml} />
          </div>
        ) : null}
      </Container>
    </div>
  );
}
