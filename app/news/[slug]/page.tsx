
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { Prose } from "@/components/Prose";
import { Tag } from "@/components/Tag";
import { getAllNews, getNewsBySlug } from "@/lib/content";
import { editLink, formatDate } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export async function generateStaticParams() {
  const posts = await getAllNews();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getNewsBySlug(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary || undefined,
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getNewsBySlug(params.slug);
  if (!post) return notFound();

  const edit = editLink(siteConfig.repoEditBase, post.filePath);

  return (
    <div className="py-12">
      <Container>
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
            <span>{formatDate(post.date)}</span>
            <span>·</span>
            <span>{post.readingMinutes} min read</span>
          </div>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            {post.title}
          </h1>

          {post.summary ? (
            <p className="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-300">
              {post.summary}
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/news"
              className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              ← News 목록
            </Link>
            {edit ? (
              <a
                href={edit}
                className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                target="_blank"
                rel="noreferrer"
              >
                Edit on GitHub
              </a>
            ) : null}
          </div>
        </div>

        <Prose html={post.html} />
      </Container>
    </div>
  );
}
