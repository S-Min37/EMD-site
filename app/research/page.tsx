import type {Metadata} from "next";
import Link from "next/link";

import {Card} from "@/components/Card";
import {Container} from "@/components/Container";
import {Gallery} from "@/components/Gallery";
import {Prose} from "@/components/Prose";
import {getResearchPage, getSiteSettings} from "@/lib/cms";

export const dynamic = "force-dynamic";

function ctaClass(tone: "primary" | "secondary" = "secondary") {
  if (tone === "primary") {
    return "rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200";
  }

  return "rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900";
}

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getResearchPage(), getSiteSettings()]);

  return {
    title: page.title,
    description: page.intro ?? settings.description,
  };
}

export default async function ResearchPage() {
  const page = await getResearchPage();

  return (
    <div className="py-12">
      <Container>
        <h1 className="text-3xl font-semibold tracking-tight">{page.title}</h1>
        {page.intro ? (
          <p className="mt-3 max-w-3xl text-zinc-600 dark:text-zinc-300">{page.intro}</p>
        ) : null}

        {page.sections.length ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {page.sections.map((section) => (
              <Card
                key={section.anchor}
                title={section.title}
                description={section.intro}
                href={`#${section.anchor}`}
                media={
                  section.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={section.image}
                      alt={section.imageAlt ?? section.title}
                      className="h-44 w-full bg-zinc-100 object-cover dark:bg-zinc-900/40"
                    />
                  ) : undefined
                }
              />
            ))}
          </div>
        ) : null}

        <div className="mt-14 grid gap-14">
          {page.sections.map((section) => (
            <section key={section.anchor} id={section.anchor} className="scroll-mt-24">
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">{section.title}</h2>
                  {section.intro ? (
                    <p className="mt-3 text-zinc-600 dark:text-zinc-300">{section.intro}</p>
                  ) : null}
                  {section.bodyHtml ? (
                    <div className="mt-6 rounded-3xl border border-zinc-200/70 bg-white p-6 shadow-sm dark:border-zinc-800/70 dark:bg-zinc-950">
                      <Prose html={section.bodyHtml} />
                    </div>
                  ) : null}
                  {section.cards.length ? (
                    <div className="mt-6 grid gap-6 md:grid-cols-2">
                      {section.cards.map((card) => (
                        <Card
                          key={`${section.anchor}-${card.title}`}
                          title={card.title}
                          description={card.description}
                          href={card.href}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>

                {section.image ? (
                  <figure className="overflow-hidden rounded-3xl border border-zinc-200/70 bg-zinc-100 shadow-sm dark:border-zinc-800/70 dark:bg-zinc-900/40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={section.image}
                      alt={section.imageAlt ?? section.title}
                      className="h-full w-full object-cover"
                    />
                    {section.imageCaption ? (
                      <figcaption className="border-t border-zinc-200/70 bg-white px-4 py-3 text-sm text-zinc-600 dark:border-zinc-800/70 dark:bg-zinc-950 dark:text-zinc-300">
                        {section.imageCaption}
                      </figcaption>
                    ) : null}
                  </figure>
                ) : null}
              </div>

              {section.gallery.length ? (
                <div className="mt-6">
                  <Gallery images={section.gallery} columns={3} />
                </div>
              ) : null}
            </section>
          ))}
        </div>

        {page.closingTitle || page.closingBody || page.closingLinks.length ? (
          <div className="mt-14 rounded-2xl border border-zinc-200/70 bg-zinc-50 p-6 dark:border-zinc-800/70 dark:bg-zinc-900">
            {page.closingTitle ? (
              <div className="text-base font-semibold">{page.closingTitle}</div>
            ) : null}
            {page.closingBody ? (
              <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-200">{page.closingBody}</p>
            ) : null}
            {page.closingLinks.length ? (
              <div className="mt-4 flex flex-wrap gap-3">
                {page.closingLinks.map((link) => (
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
        ) : null}
      </Container>
    </div>
  );
}
