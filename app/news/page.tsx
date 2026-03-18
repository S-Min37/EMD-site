import Link from "next/link";
import { Metadata } from "next";
import { Container } from "@/components/Container";
import { getAllNews } from "@/lib/content";
import { NewsList } from "@/components/NewsList";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "News",
};

export default async function NewsListPage() {
  const posts = await getAllNews();

  return (
    <div className="py-12">
      <Container>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">News</h1>
            <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-300">
              Latest lab updates, awards, publications, and conference news.
            </p>
          </div>

          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            Total {posts.length}
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-zinc-200/70 bg-white p-6 shadow-sm dark:border-zinc-800/70 dark:bg-zinc-950">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                Research news archive
              </div>
              <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                Browse announcements from the lab, including awards, conference
                presentations, and project milestones.
              </div>
            </div>
          </div>
        </div>

        <NewsList posts={posts} />
      </Container>
    </div>
  );
}
