import Link from "next/link";

import {Avatar} from "@/components/Avatar";
import {Card} from "@/components/Card";
import {Container} from "@/components/Container";
import {Gallery} from "@/components/Gallery";
import {Hero} from "@/components/Hero";
import {Tag} from "@/components/Tag";
import {getHomePage, getSiteSettings} from "@/lib/cms";
import {getAllNews, getAllPeople} from "@/lib/content";
import {formatDate} from "@/lib/utils";

export const dynamic = "force-dynamic";

function ctaClass(tone: "primary" | "secondary" = "secondary") {
  if (tone === "primary") {
    return "inline-flex rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200";
  }

  return "inline-flex rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900";
}

export default async function HomePage() {
  const [settings, home, allNews, allPeople] = await Promise.all([
    getSiteSettings(),
    getHomePage(),
    getAllNews(),
    getAllPeople(),
  ]);

  const news = allNews.slice(0, 3);
  const professor = allPeople.find((person) => person.category === "Professor") ?? allPeople[0];
  const featuredPeople = [
    professor,
    ...allPeople.filter((person) => person.category === "Graduate").slice(0, 3),
  ].filter(Boolean);

  return (
    <>
      <Hero settings={settings} home={home} />

      {home.labGallery.length ? (
        <section className="border-b border-zinc-200/60 py-12 dark:border-zinc-800/60">
          <Container>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold tracking-tight">Lab Gallery</h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-300">
                Studio에서 업로드한 연구실 사진과 장비 이미지를 여기에 노출합니다.
              </p>
            </div>
            <Gallery images={home.labGallery} columns={3} />
          </Container>
        </section>
      ) : null}

      <section className="py-12">
        <Container>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">{home.researchTitle}</h2>
              {home.researchIntro ? (
                <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-300">
                  {home.researchIntro}
                </p>
              ) : null}
            </div>
            <Link
              href="/research"
              className="text-sm font-medium text-zinc-700 underline underline-offset-4 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
            >
              전체 보기
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {home.researchCards.map((card) => (
              <Card
                key={card.title}
                title={card.title}
                description={card.description}
                href={card.href}
              />
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-zinc-200/60 py-12 dark:border-zinc-800/60">
        <Container>
          <h2 className="text-2xl font-semibold tracking-tight">{home.strengthsTitle}</h2>
          {home.strengthsIntro ? (
            <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-300">
              {home.strengthsIntro}
            </p>
          ) : null}

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {home.strengths.map((strength) => (
              <Card
                key={strength.title}
                title={strength.title}
                description={strength.description}
              />
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-zinc-200/60 py-12 dark:border-zinc-800/60">
        <Container>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">{home.newsTitle}</h2>
              {home.newsIntro ? (
                <p className="mt-2 text-zinc-600 dark:text-zinc-300">{home.newsIntro}</p>
              ) : null}
            </div>
            <Link
              href="/news"
              className="text-sm font-medium text-zinc-700 underline underline-offset-4 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
            >
              전체 보기
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {news.map((post) => (
              <Link
                key={post.slug}
                href={`/news/${post.slug}`}
                className="group block rounded-2xl border border-zinc-200/70 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-zinc-800/70 dark:bg-zinc-950"
              >
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                  {formatDate(post.date)}
                </div>
                <div className="mt-2 text-base font-semibold text-zinc-900 group-hover:underline group-hover:underline-offset-4 dark:text-zinc-50">
                  {post.title}
                </div>
                {post.summary ? (
                  <div className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                    {post.summary}
                  </div>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-zinc-200/60 py-12 dark:border-zinc-800/60">
        <Container>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">{home.peopleTitle}</h2>
              {home.peopleIntro ? (
                <p className="mt-2 text-zinc-600 dark:text-zinc-300">{home.peopleIntro}</p>
              ) : null}
            </div>
            <Link
              href="/people"
              className="text-sm font-medium text-zinc-700 underline underline-offset-4 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
            >
              전체 보기
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {featuredPeople.map((person) => (
              <Link
                key={person.slug}
                href={`/people/${person.slug}`}
                className="flex items-start gap-4 rounded-2xl border border-zinc-200/70 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-zinc-800/70 dark:bg-zinc-950"
              >
                <Avatar name={person.name} photo={person.photo} size={56} />
                <div className="min-w-0">
                  <div className="truncate text-base font-semibold text-zinc-900 dark:text-zinc-50">
                    {person.name}
                  </div>
                  <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                    {person.role}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {person.interests.slice(0, 3).map((interest) => (
                      <Tag key={interest}>{interest}</Tag>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-zinc-200/60 py-12 dark:border-zinc-800/60">
        <Container>
          <div className="rounded-2xl border border-zinc-200/70 bg-zinc-50 p-8 dark:border-zinc-800/70 dark:bg-zinc-900">
            <h2 className="text-xl font-semibold tracking-tight">{home.hiringTitle}</h2>
            {home.hiringDescription ? (
              <p className="mt-2 max-w-2xl text-zinc-700 dark:text-zinc-200">
                {home.hiringDescription}
              </p>
            ) : null}
            {home.hiringCtas.length ? (
              <div className="mt-5 flex flex-wrap gap-3">
                {home.hiringCtas.map((link) => (
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
        </Container>
      </section>
    </>
  );
}
