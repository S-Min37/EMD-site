
import { Metadata } from "next";
import { Container } from "@/components/Container";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <div className="py-12">
      <Container>
        <h1 className="text-3xl font-semibold tracking-tight">Contact / Join</h1>
        <p className="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-300">
          연구 참여(학부연구생/대학원생/공동연구) 문의는 이메일로 부탁드립니다.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200/70 bg-white p-6 shadow-sm dark:border-zinc-800/70 dark:bg-zinc-950">
            <h2 className="text-lg font-semibold">Email</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              교수님/연구실로 연락주세요.
            </p>
            <a
              className="mt-4 inline-block text-sm font-medium underline underline-offset-4 text-zinc-800 hover:text-zinc-950 dark:text-zinc-200 dark:hover:text-white"
              href={`mailto:${siteConfig.contact.email}`}
            >
              {siteConfig.contact.email}
            </a>
          </div>

          <div className="rounded-2xl border border-zinc-200/70 bg-white p-6 shadow-sm dark:border-zinc-800/70 dark:bg-zinc-950">
            <h2 className="text-lg font-semibold">Location</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              {siteConfig.contact.addressKo}
            </p>
            <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
              {siteConfig.contact.addressEn}
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-zinc-200/70 bg-zinc-50 p-8 dark:border-zinc-800/70 dark:bg-zinc-900">
          <h2 className="text-xl font-semibold tracking-tight">지원/합류 가이드</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-zinc-700 dark:text-zinc-200">
            <li>
              관심 분야(키워드 3개 정도)와 함께 간단한 자기소개/이력(이력서 또는 CV)을 보내주세요.
            </li>
            <li>
              학부연구생은 희망 기간(학기/방학), 가능한 주당 시간, 관심 주제를 알려주면 매칭이 빨라요.
            </li>
            <li>
              대학원 지원자는 희망 연구주제 + 본인 강점(해석/제어/프로그래밍/실험 등)을 구체적으로 적어주세요.
            </li>
          </ul>
          <p className="mt-5 text-sm text-zinc-600 dark:text-zinc-300">
            * 위 내용은 템플릿입니다. 연구실 스타일에 맞게 수정해 주세요.
          </p>
        </div>
      </Container>
    </div>
  );
}
