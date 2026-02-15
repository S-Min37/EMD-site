
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import { Tag } from "@/components/Tag";
import { Avatar } from "@/components/Avatar";
import { getAllNews, getAllPeople } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export default async function HomePage() {
  const news = (await getAllNews()).slice(0, 3);
  const people = await getAllPeople();

  const professor = people.find((p) => p.category === "Professor") ?? people[0];
  const featuredPeople = [professor, ...people.filter((p) => p.category === "Graduate").slice(0, 3)].filter(Boolean);

  const strengths = [
    {
      title: "설계–해석–제어–검증까지 한 흐름",
      description:
        "전동기 설계/해석부터 구동 시스템, HILS/실험 검증까지 연결해 문제를 끝까지 해결합니다.",
    },
    {
      title: "e-모빌리티 중심의 실전 주제",
      description:
        "BEV/PHEV/FCEV 등 전동화 추진 시스템을 겨냥한 전기기기·드라이브 연구를 수행합니다.",
    },
    {
      title: "멀티피직스 최적화 & 고정밀 시뮬레이션",
      description:
        "전자계–열–구조–NVH 등 다물리 통합 관점에서 성능/효율/신뢰성을 동시에 개선합니다.",
    },
    {
      title: "산업 협력·프로젝트 기반 연구",
      description:
        "정부과제/산업체 과제를 통해 현실 제약(규격·안전·비용)을 고려한 연구를 지향합니다.",
    },
  ];

  return (
    <>
      <Hero />

      <section className="py-12">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            <Card
              title="Electric Machines"
              description="전기기기 설계/해석/최적화, 손실/열/구조/NVH까지"
              href="/research#electric-machines"
            />
            <Card
              title="Machine Drives"
              description="PWM/회로-전자계 연성, HIL 기반 구동 시스템 검증"
              href="/research#machine-drives"
            />
            <Card
              title="Sensors"
              description="모터 구동을 위한 센서/리졸버 설계 및 평가"
              href="/research#sensors"
            />
            <Card
              title="Mobility Applications"
              description="EV 파워트레인 모델, 디지털 트윈, 시스템 분석"
              href="/research#mobility"
            />
          </div>
        </Container>
      </section>

      <section className="border-t border-zinc-200/60 py-12 dark:border-zinc-800/60">
        <Container>
          <h2 className="text-2xl font-semibold tracking-tight">우리 연구실의 강점</h2>
          <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-300">
            “깔끔한 디자인”보다 더 중요한 건, 방문자가 한눈에 연구실의 강점을 이해하는 것.
            아래 구조는 그 목적에 맞춰 설계했습니다.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {strengths.map((s) => (
              <Card key={s.title} title={s.title} description={s.description} />
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-zinc-200/60 py-12 dark:border-zinc-800/60">
        <Container>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Latest News</h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-300">
                사진 포함 소식을 Markdown으로 쉽게 업데이트할 수 있습니다.
              </p>
            </div>
            <Link
              href="/news"
              className="text-sm font-medium text-zinc-700 underline underline-offset-4 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
            >
              전체 보기
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {news.map((p) => (
              <Link
                key={p.slug}
                href={`/news/${p.slug}`}
                className="group block rounded-2xl border border-zinc-200/70 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-zinc-800/70 dark:bg-zinc-950"
              >
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                  {formatDate(p.date)}
                </div>
                <div className="mt-2 text-base font-semibold text-zinc-900 group-hover:underline group-hover:underline-offset-4 dark:text-zinc-50">
                  {p.title}
                </div>
                {p.summary ? (
                  <div className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                    {p.summary}
                  </div>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tags.slice(0, 3).map((t) => (
                    <Tag key={t}>{t}</Tag>
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
              <h2 className="text-2xl font-semibold tracking-tight">People</h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-300">
                각 구성원 페이지는 본인이 직접 “포트폴리오”를 작성할 수 있게 되어 있습니다.
              </p>
            </div>
            <Link
              href="/people"
              className="text-sm font-medium text-zinc-700 underline underline-offset-4 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
            >
              전체 보기
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {featuredPeople.map((p) => (
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
                    {p.interests.slice(0, 3).map((x) => (
                      <Tag key={x}>{x}</Tag>
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
            <h2 className="text-xl font-semibold tracking-tight">We’re Hiring</h2>
            <p className="mt-2 max-w-2xl text-zinc-700 dark:text-zinc-200">
              모터·드라이브 응용 및 에너지 변환 분야에 관심 있는 학부 연구생 / 대학원생을
              모집합니다. (등록금 및 생활비 지원 가능)
            </p>
            <div className="mt-5">
              <Link
                href="/contact"
                className="inline-flex rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                Contact / Join 안내 보기
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
