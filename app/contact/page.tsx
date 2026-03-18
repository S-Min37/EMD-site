import type {Metadata} from "next";
import {notFound} from "next/navigation";

import {CmsPageView} from "@/components/CmsPageView";
import {buildPageMetadata, getPageByRoute, getSiteSettings} from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("contact");
}

export default async function ContactPage() {
  const [page, settings] = await Promise.all([
    getPageByRoute("contact"),
    getSiteSettings(),
  ]);

  if (!page) {
    notFound();
  }

  return (
    <CmsPageView page={page}>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200/70 bg-white p-6 shadow-sm dark:border-zinc-800/70 dark:bg-zinc-950">
          <h2 className="text-lg font-semibold">Email</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            연구 참여와 공동연구 문의는 아래 이메일로 연락하실 수 있습니다.
          </p>
          <a
            className="mt-4 inline-block text-sm font-medium text-zinc-800 underline underline-offset-4 hover:text-zinc-950 dark:text-zinc-200 dark:hover:text-white"
            href={`mailto:${settings.contactEmail}`}
          >
            {settings.contactEmail}
          </a>
        </div>

        <div className="rounded-2xl border border-zinc-200/70 bg-white p-6 shadow-sm dark:border-zinc-800/70 dark:bg-zinc-950">
          <h2 className="text-lg font-semibold">Location</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            {settings.addressKo}
          </p>
          <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
            {settings.addressEn}
          </p>
        </div>
      </div>
    </CmsPageView>
  );
}
