
import Link from "next/link";
import { Metadata } from "next";
import { Container } from "@/components/Container";
import { Avatar } from "@/components/Avatar";
import { Tag } from "@/components/Tag";
import { getAllPeople } from "@/lib/content";

export const metadata: Metadata = {
  title: "People",
};

function groupByCategory<T extends { category: string }>(items: T[]) {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const key = item.category || "Other";
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  return groups;
}

const categoryOrder = ["Professor", "Postdoc", "Graduate", "Undergraduate", "Staff"];

export default async function PeoplePage() {
  const people = await getAllPeople();
  const groups = groupByCategory(people);

  const orderedCategories = [
    ...categoryOrder.filter((c) => groups.has(c)),
    ...Array.from(groups.keys()).filter((c) => !categoryOrder.includes(c)),
  ];

  return (
    <div className="py-12">
      <Container>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">People</h1>
            <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-300">
              각 구성원은 자기 페이지(포트폴리오)를 직접 수정할 수 있습니다.
              (GitHub “Edit” 버튼 또는 Markdown 파일 수정)
            </p>
          </div>
          <Link
            href="/alumni"
            className="text-sm font-medium text-zinc-700 underline underline-offset-4 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
          >
            Alumni 보기 →
          </Link>
        </div>

        <div className="mt-10 grid gap-12">
          {orderedCategories.map((category) => (
            <section key={category}>
              <h2 className="text-xl font-semibold tracking-tight">{category}</h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {(groups.get(category) ?? []).map((p) => (
                  <Link
                    key={p.slug}
                    href={`/people/${p.slug}`}
                    className="flex items-start gap-4 rounded-2xl border border-zinc-200/70 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-zinc-800/70 dark:bg-zinc-950"
                  >
                    <Avatar name={p.name} photo={p.photo} size={56} />
                    <div className="min-w-0">
                      <div className="truncate text-base font-semibold text-zinc-900 dark:text-zinc-50">
                        {p.name}
                      </div>
                      <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                        {p.role}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {p.interests.slice(0, 4).map((x) => (
                          <Tag key={x}>{x}</Tag>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Container>
    </div>
  );
}
