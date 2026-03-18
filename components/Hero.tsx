import Link from "next/link";

import {Container} from "@/components/Container";
import type {CmsHomePage, CmsSiteSettings} from "@/lib/cms";

function ctaClass(tone: "primary" | "secondary" = "secondary") {
  if (tone === "primary") {
    return "rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200";
  }

  return "rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900";
}

export function Hero({
  settings,
  home,
}: {
  settings: CmsSiteSettings;
  home: CmsHomePage;
}) {
  return (
    <section className="relative overflow-hidden border-b border-zinc-200/60 py-16 dark:border-zinc-800/60 lg:py-20">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#f7f7f8_0%,#ededf0_100%)] dark:bg-[linear-gradient(180deg,#09090b_0%,#111827_100%)]" />
        <div className="absolute left-[18%] top-[16%] h-40 w-40 rounded-full bg-amber-300/25 blur-3xl dark:bg-amber-500/15" />
        <div className="absolute right-[18%] top-[10%] h-56 w-56 rounded-full bg-sky-400/15 blur-3xl dark:bg-sky-500/10" />
        <div className="absolute bottom-[-10%] left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-white/35 blur-3xl dark:bg-white/5" />

        {home.heroImage ? (
          <div className="absolute right-[max(1.5rem,5vw)] top-1/2 hidden h-[280px] w-[min(36rem,40vw)] -translate-y-1/2 overflow-hidden rounded-[2rem] border border-white/60 bg-zinc-200/50 shadow-[0_24px_80px_rgba(15,23,42,0.16)] lg:block dark:border-white/10 dark:bg-zinc-900/40 xl:h-[320px]">
            <div className="absolute inset-[8px] overflow-hidden rounded-[1.5rem] bg-white/35 dark:bg-zinc-950/35">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={home.heroImage}
                alt={home.heroImageAlt ?? settings.longName}
                className="h-full w-full object-contain object-center"
              />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(15,23,42,0.28)_100%)] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(2,6,23,0.42)_100%)]" />
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white/35 to-transparent dark:from-white/10" />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white/18 to-transparent dark:from-black/20" />
            {home.heroImageCaption ? (
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/72 px-4 py-2 text-xs text-zinc-700 shadow-sm backdrop-blur dark:bg-zinc-950/65 dark:text-zinc-200">
                {home.heroImageCaption}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <Container>
        <div className="max-w-2xl lg:max-w-[46%]">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {home.eyebrow || settings.institution}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-5xl">
            {home.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
            {home.description}
          </p>

          {home.heroCtas.length ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {home.heroCtas.map((link) => (
                <Link key={`${link.href}-${link.label}`} href={link.href} className={ctaClass(link.tone)}>
                  {link.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
