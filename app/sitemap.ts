import type {MetadataRoute} from "next";

import {getAllCmsRoutes, getSiteSettings} from "@/lib/cms";
import {getAllNews, getAllPeople} from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [settings, contentRoutes, news, people] = await Promise.all([
    getSiteSettings(),
    getAllCmsRoutes(),
    getAllNews(),
    getAllPeople(),
  ]);
  const base = settings.url.replace(/\/$/, "");

  const routes: MetadataRoute.Sitemap = contentRoutes.map((route) => ({
    url: `${base}${route === "/" ? "" : route}`,
    lastModified: new Date(),
  }));

  news.forEach((post) =>
    routes.push({
      url: `${base}/news/${post.slug}`,
      lastModified: new Date(post.date),
    })
  );

  people.forEach((person) =>
    routes.push({
      url: `${base}/people/${person.slug}`,
      lastModified: new Date(),
    })
  );

  return routes;
}
