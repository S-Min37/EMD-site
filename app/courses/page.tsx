import type {Metadata} from "next";
import {notFound} from "next/navigation";

import {CmsPageView} from "@/components/CmsPageView";
import {buildPageMetadata, getPageByRoute} from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("courses");
}

export default async function CoursesPage() {
  const page = await getPageByRoute("courses");
  if (!page) {
    notFound();
  }

  return <CmsPageView page={page} />;
}
