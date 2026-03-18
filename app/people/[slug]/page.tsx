import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Container } from "@/components/Container";
import { Prose } from "@/components/Prose";
import { Tag } from "@/components/Tag";
import { Avatar } from "@/components/Avatar";
import { Card } from "@/components/Card";
import { getPersonBySlug } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const person = await getPersonBySlug(params.slug);
  if (!person) return {};
  return {
    title: person.name,
    description: `${person.role} · ${person.category}`,
  };
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="underline underline-offset-4 text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
    >
      {children}
    </a>
  );
}

export default async function PersonPage({ params }: { params: { slug: string } }) {
  const person = await getPersonBySlug(params.slug);
  if (!person) return notFound();

  const highlights = person.highlights ?? [];
  const projects = person.projects ?? [];
  const pubs = person.publications ?? [];

  return (
    <div className="py-10">
      <Container>

        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl border border-zinc-200/70 bg-white p-6 shadow-sm dark:border-zinc-800/70 dark:bg-zinc-950">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900" />

          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">

            <div className="flex items-start gap-5">
              <Avatar name={person.name} photo={person.photo} size={104} />

              <div className="min-w-0">
                <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                  {person.name}
                </h1>

                <div className="mt-2 text-zinc-600 dark:text-zinc-300">
                  {person.role} · {person.category}
                </div>

                {person.email ? (
                  <div className="mt-3 text-sm">
                    <a
                      href={`mailto:${person.email}`}
                      className="underline underline-offset-4 text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
                    >
                      {person.email}
                    </a>
                  </div>
                ) : null}

                {person.links.length ? (
                  <div className="mt-3 flex flex-wrap gap-3 text-sm">
                    {person.links.map((l) => (
                      <ExternalLink key={l.url} href={l.url}>
                        {l.label}
                      </ExternalLink>
                    ))}
                  </div>
                ) : null}

                {person.interests.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {person.interests.map((x) => (
                      <Tag key={x}>{x}</Tag>
                    ))}
                  </div>
                ) : null}

              </div>
            </div>

            {/* 오른쪽 버튼 */}
            <div className="flex flex-wrap gap-3 md:justify-end">

              <Link
                href="/people"
                className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
              >
                ← People 목록
              </Link>

              <Link
                href="/news"
                className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
              >
                News
              </Link>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="mt-8 grid gap-6 lg:grid-cols-12">

          <div className="lg:col-span-8">
            <div className="rounded-3xl border border-zinc-200/70 bg-white p-6 shadow-sm dark:border-zinc-800/70 dark:bg-zinc-950">
              <Prose html={person.html} />
            </div>
          </div>

          <aside className="lg:col-span-4 flex flex-col gap-5">

            {highlights.length ? (
              <Card title="Highlights" description="핵심 성과/관심 분야를 한눈에">
                <ul className="mt-4 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                  {highlights.map((h) => (
                    <li key={h} className="flex gap-2">
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400 dark:bg-zinc-500" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ) : null}

            {projects.length ? (
              <Card title="Projects" description="진행/참여 프로젝트">
                <div className="mt-4 grid gap-3">
                  {projects.map((p) => (
                    <div
                      key={p.title}
                      className="rounded-2xl border border-zinc-200/70 bg-zinc-50 p-4 dark:border-zinc-800/70 dark:bg-zinc-900/30"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="font-medium text-zinc-900 dark:text-zinc-50">
                          {p.link ? (
                            <ExternalLink href={p.link}>{p.title}</ExternalLink>
                          ) : (
                            p.title
                          )}
                        </div>

                        {p.period ? (
                          <div className="text-xs text-zinc-500 dark:text-zinc-400">
                            {p.period}
                          </div>
                        ) : null}
                      </div>

                      {p.role ? (
                        <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">
                          {p.role}
                        </div>
                      ) : null}

                      {p.summary ? (
                        <div className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                          {p.summary}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </Card>
            ) : null}

            {pubs.length ? (
              <Card title="Selected Publications" description="대표 논문/성과">
                <ol className="mt-4 space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
                  {pubs.map((x, i) => (
                    <li key={x.citation} className="flex gap-3">
                      <div className="mt-[2px] w-6 shrink-0 text-zinc-500 dark:text-zinc-400">
                        {i + 1}.
                      </div>
                      <div className="min-w-0">
                        {x.link ? (
                          <ExternalLink href={x.link}>{x.citation}</ExternalLink>
                        ) : (
                          <span>{x.citation}</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </Card>
            ) : null}

          </aside>

        </div>
      </Container>
    </div>
  );
}
