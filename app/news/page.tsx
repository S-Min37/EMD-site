import Link from "next/link";
import { Metadata } from "next";
import { Container } from "@/components/Container";
import { getAllNews } from "@/lib/content";
import { NewsList } from "@/components/NewsList";

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
              뉴스는 <span className="font-medium">/admin</span>에서 블로그처럼 작성하거나,
              GitHub에서 <span className="font-medium">content/news</span>에 Markdown 파일을 추가하면 자동으로 반영됩니다.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin"
              className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              뉴스 작성하기 (CMS)
            </Link>
            <a
              href="https://www.markdownguide.org/basic-syntax/"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              Markdown 문법
            </a>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-zinc-200/70 bg-white p-6 shadow-sm dark:border-zinc-800/70 dark:bg-zinc-950">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                사진/업데이트가 쉬운 운영 방식
              </div>
              <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                CMS는 이미지 업로드를 지원합니다. 수동으로 올릴 때는 <span className="font-medium">public/uploads</span>에 이미지를 넣고,
                글에서 <span className="font-medium">/uploads/...</span> 경로로 넣으면 됩니다.
              </div>
            </div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              총 {posts.length}개
            </div>
          </div>
        </div>

        <NewsList posts={posts} />
      </Container>
    </div>
  );
}
