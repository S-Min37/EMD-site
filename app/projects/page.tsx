
import Link from "next/link";
import { Metadata } from "next";
import { Container } from "@/components/Container";
import { Prose } from "@/components/Prose";
import { getMarkdownDocHtml } from "@/lib/content";
import { editLink } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Projects",
};

export default async function ProjectsPage() {
  const doc = await getMarkdownDocHtml("content/projects.md");
  const edit = doc ? editLink(siteConfig.repoEditBase, doc.filePath) : "";

  return (
    <div className="py-12">
      <Container>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
            <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-300">
              과제 목록은 `content/projects.md`에서 Markdown으로 관리합니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/research"
              className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              ← Research
            </Link>
            {edit ? (
              <a
                href={edit}
                className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                target="_blank"
                rel="noreferrer"
              >
                Edit projects
              </a>
            ) : null}
          </div>
        </div>

        <div className="mt-10">
          {doc ? <Prose html={doc.html} /> : <p>Projects 문서를 찾을 수 없습니다.</p>}
        </div>
      </Container>
    </div>
  );
}
