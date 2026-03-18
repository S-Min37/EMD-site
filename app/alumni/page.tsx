import type {Metadata} from "next";
import {notFound} from "next/navigation";

import {CmsPageView} from "@/components/CmsPageView";
import {buildPageMetadata, getPageByRoute} from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("alumni");
}

export default async function AlumniPage() {
  const page = await getPageByRoute("alumni");
  if (!page) {
    notFound();
  }

  return <CmsPageView page={page} />;
}
