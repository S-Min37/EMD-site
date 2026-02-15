
import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getAllNews, getAllPeople } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url.replace(/\/$/, "");

  const routes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/research`, lastModified: new Date() },
    { url: `${base}/projects`, lastModified: new Date() },
    { url: `${base}/publications`, lastModified: new Date() },
    { url: `${base}/people`, lastModified: new Date() },
    { url: `${base}/alumni`, lastModified: new Date() },
    { url: `${base}/news`, lastModified: new Date() },
    { url: `${base}/contact`, lastModified: new Date() },
  ];

  const [news, people] = await Promise.all([getAllNews(), getAllPeople()]);
  news.forEach((p) =>
    routes.push({
      url: `${base}/news/${p.slug}`,
      lastModified: new Date(p.date),
    })
  );
  people.forEach((p) =>
    routes.push({
      url: `${base}/people/${p.slug}`,
      lastModified: new Date(),
    })
  );

  return routes;
}
