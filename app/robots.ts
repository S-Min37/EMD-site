import type {MetadataRoute} from "next";

import {getSiteSettings} from "@/lib/cms";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings();
  const base = settings.url.replace(/\/$/, "");

  return {
    rules: [{userAgent: "*", allow: "/"}],
    sitemap: `${base}/sitemap.xml`,
  };
}
