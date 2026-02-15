
import Link from "next/link";
import { Container } from "@/components/Container";
import { siteConfig } from "@/config/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-zinc-200/60 py-16 dark:border-zinc-800/60">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-20%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-zinc-200 via-white to-zinc-200 blur-3xl dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900" />
      </div>

      <Container>
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {siteConfig.institution}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-5xl">
            {siteConfig.longName}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
            전기기기/드라이브, 센서, e-모빌리티 전동화 시스템을 중심으로{" "}
            <span className="font-medium text-zinc-800 dark:text-zinc-200">
              설계–해석–제어–검증
            </span>{" "}
            까지 연결되는 연구를 합니다.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/research"
              className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              Research 보기
            </Link>
            <Link
              href="/news"
              className="rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              최신 소식
            </Link>
            <Link
              href="/contact"
              className="rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              Join / Contact
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
