"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Tag } from "@/components/Tag";
import { formatDate } from "@/lib/utils";
import type { NewsPost } from "@/lib/content";

function uniq(arr: string[]) {
  return Array.from(new Set(arr)).filter(Boolean);
}

export function NewsList({ posts }: { posts: NewsPost[] }) {
  const [q, setQ] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tags = posts.flatMap((p) => p.tags || []);
    return uniq(tags).sort((a, b) => a.localeCompare(b));
  }, [posts]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return posts.filter((p) => {
      const matchesQuery =
        !query ||
        p.title.toLowerCase().includes(query) ||
        (p.summary || "").toLowerCase().includes(query) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(query));
      const matchesTag = !activeTag || (p.tags || []).includes(activeTag);
      return matchesQuery && matchesTag;
    });
  }, [posts, q, activeTag]);

  return (
    <div className="mt-8">
      {/* Controls */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="검색: 키워드 / 태그"
              className="w-full md:w-[340px] rounded-2xl border border-zinc-200/70 bg-white px-4 py-2 text-sm text-zinc-900 shadow-sm outline-none ring-0 focus:border-zinc-300 dark:border-zinc-800/70 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-700"
            />
          </div>
          {activeTag ? (
            <button
              onClick={() => setActiveTag(null)}
              className="text-sm text-zinc-600 underline underline-offset-4 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
            >
              태그 해제
            </button>
          ) : null}
        </div>

        <div className="text-sm text-zinc-500 dark:text-zinc-400">
          {filtered.length} / {posts.length}
        </div>
      </div>

      {allTags.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {allTags.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTag((prev) => (prev === t ? null : t))}
              className="text-left"
              aria-pressed={activeTag === t}
              title={activeTag === t ? "태그 해제" : `태그: ${t}`}
            >
              <Tag active={activeTag === t}>{t}</Tag>
            </button>
          ))}
        </div>
      ) : null}

      {/* List */}
      <div className="mt-6 grid gap-4">
        {filtered.map((p) => (
          <Link
            key={p.slug}
            href={`/news/${p.slug}`}
            className="group block rounded-3xl border border-zinc-200/70 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-zinc-800/70 dark:bg-zinc-950"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start">
              {p.cover ? (
                <div className="shrink-0 overflow-hidden rounded-2xl border border-zinc-200/70 bg-zinc-100 dark:border-zinc-800/70 dark:bg-zinc-900/40 md:h-[96px] md:w-[160px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.cover}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
              ) : null}

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                  <div>{formatDate(p.date)}</div>
                  <div>· {p.readingMinutes} min read</div>
                </div>

                <div className="mt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {p.title}
                </div>

                {p.summary ? (
                  <div className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                    {p.summary}
                  </div>
                ) : null}

                {(p.tags || []).length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
