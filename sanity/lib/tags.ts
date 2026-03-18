export const SANITY_TAGS = {
  all: "sanity",
  siteSettings: "siteSettings",
  homePage: "homePage",
  researchPage: "researchPage",
  page: "page",
  people: "people",
  news: "news",
  publication: "publication",
  project: "project",
} as const;

export type SanityDocumentTag = Exclude<keyof typeof SANITY_TAGS, "all">;

export function getSanityTags(...tags: SanityDocumentTag[]) {
  return [SANITY_TAGS.all, ...new Set(tags.map((tag) => SANITY_TAGS[tag]))];
}

export function getSanityTagsForType(type: string) {
  switch (type) {
    case "siteSettings":
      return getSanityTags("siteSettings");
    case "homePage":
      return getSanityTags("homePage");
    case "researchPage":
      return getSanityTags("researchPage");
    case "page":
      return getSanityTags("page");
    case "people":
      return getSanityTags("people");
    case "news":
      return getSanityTags("news");
    case "publication":
      return getSanityTags("publication");
    case "project":
      return getSanityTags("project");
    default:
      return [SANITY_TAGS.all];
  }
}
