import type {Metadata} from "next";
import {notFound} from "next/navigation";

import {CmsPageView} from "@/components/CmsPageView";
import {buildPageMetadata, getPageByRoute} from "@/lib/cms";

const allowedSections = new Set(["journals", "conferences", "patents"]);

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: {section: string};
}): Promise<Metadata> {
  if (!allowedSections.has(params.section)) {
    return {};
  }

  return buildPageMetadata(`publications/${params.section}`);
}

export default async function PublicationSectionPage({
  params,
}: {
  params: {section: string};
}) {
  if (!allowedSections.has(params.section)) {
    notFound();
  }

  const page = await getPageByRoute(`publications/${params.section}`);
  if (!page) {
    notFound();
  }

  return <CmsPageView page={page} />;
}
