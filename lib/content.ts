import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { groq } from "next-sanity";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import readingTime from "reading-time";

import { sanityFetch } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { getSanityTags } from "@/sanity/lib/tags";

export type ContentSource = "sanity" | "filesystem";

export type NewsPost = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  cover?: string;
  readingMinutes: number;
  source?: ContentSource;
};

export type NewsPostFull = NewsPost & {
  html: string;
  raw: string;
  filePath: string;
};

export type PersonCategory =
  | "Professor"
  | "Postdoc"
  | "Graduate"
  | "Undergraduate"
  | "Staff";

export type Person = {
  slug: string;
  name: string;
  role: string;
  category: PersonCategory | string;
  interests: string[];
  email?: string;
  photo?: string;
  links: Array<{ label: string; url: string }>;
  order?: number;
  source?: ContentSource;
  highlights?: string[];
  projects?: Array<{
    title: string;
    role?: string;
    period?: string;
    summary?: string;
    link?: string;
  }>;
  publications?: Array<{
    citation: string;
    link?: string;
  }>;
};

export type PersonFull = Person & {
  html: string;
  raw: string;
  filePath: string;
};

type MarkdownDocType = "publication" | "project";

type MarkdownDoc = {
  data: Record<string, unknown>;
  content: string;
  filePath: string;
  source: ContentSource;
};

type MarkdownDocHtml = MarkdownDoc & {
  html: string;
};

type SanityNewsRecord = {
  title?: string;
  slug?: string;
  date?: string;
  summary?: string;
  tags?: unknown;
  cover?: unknown;
  coverUrl?: string;
  body?: string;
};

type SanityPersonRecord = {
  name?: string;
  slug?: string;
  role?: string;
  category?: string;
  interests?: unknown;
  email?: string;
  photo?: unknown;
  photoUrl?: string;
  links?: unknown;
  order?: number | string;
  highlights?: unknown;
  projects?: unknown;
  publications?: unknown;
  body?: string;
};

type SanityMarkdownRecord = {
  title?: string;
  body?: string;
};

const CONTENT_DIR = path.join(process.cwd(), "content");
const SANITY_MARKDOWN_DOCS: Partial<Record<string, MarkdownDocType>> = {
  "content/publications.md": "publication",
  "content/projects.md": "project",
};

const allNewsQuery = groq`
  *[_type == "news" && defined(slug.current)]
  | order(coalesce(publishedAt, _createdAt) desc) {
    title,
    "slug": slug.current,
    "date": coalesce(publishedAt, _createdAt),
    "summary": coalesce(excerpt, ""),
    "tags": coalesce(tags, []),
    cover,
    coverUrl,
    body
  }
`;

const newsBySlugQuery = groq`
  *[_type == "news" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    "date": coalesce(publishedAt, _createdAt),
    "summary": coalesce(excerpt, ""),
    "tags": coalesce(tags, []),
    cover,
    coverUrl,
    body
  }
`;

const allPeopleQuery = groq`
  *[_type == "people" && defined(slug.current)]{
    name,
    "slug": slug.current,
    "role": coalesce(position, role, ""),
    "category": coalesce(category, "Graduate"),
    "interests": coalesce(interests, []),
    email,
    photo,
    photoUrl,
    "links": coalesce(links, []),
    order,
    "highlights": coalesce(highlights, []),
    "projects": coalesce(projects, []),
    "publications": coalesce(publications, []),
    body
  }
`;

const personBySlugQuery = groq`
  *[_type == "people" && slug.current == $slug][0]{
    name,
    "slug": slug.current,
    "role": coalesce(position, role, ""),
    "category": coalesce(category, "Graduate"),
    "interests": coalesce(interests, []),
    email,
    photo,
    photoUrl,
    "links": coalesce(links, []),
    order,
    "highlights": coalesce(highlights, []),
    "projects": coalesce(projects, []),
    "publications": coalesce(publications, []),
    body
  }
`;

const markdownDocumentQuery = groq`
  *[_type == $type] | order(_updatedAt desc)[0]{
    title,
    body
  }
`;

let hasLoggedSanityReadError = false;

function readDirSafe(dir: string) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir);
}

function readFileSafe(filePath: string) {
  return fs.readFileSync(filePath, "utf8");
}

async function markdownToHtml(markdown: string) {
  const processed = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(markdown);

  return processed.toString();
}

function normalizeArray(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string") return value ? [value] : [];
  return [];
}

function normalizeLinks(value: unknown): Array<{ label: string; url: string }> {
  if (!value || !Array.isArray(value)) return [];
  return value
    .map((x) => {
      if (!x || typeof x !== "object") return null;
      const obj = x as Record<string, unknown>;
      const label = typeof obj.label === "string" ? obj.label : "";
      const url = typeof obj.url === "string" ? obj.url : "";
      if (!label || !url) return null;
      return { label, url };
    })
    .filter(Boolean) as Array<{ label: string; url: string }>;
}

function normalizePersonProjects(value: unknown): Person["projects"] {
  if (!value || !Array.isArray(value)) return undefined;
  const items = value
    .map((x) => {
      if (!x || typeof x !== "object") return null;
      const obj = x as Record<string, unknown>;
      const title = typeof obj.title === "string" ? obj.title : "";
      if (!title) return null;
      return {
        title,
        role: typeof obj.role === "string" ? obj.role : undefined,
        period: typeof obj.period === "string" ? obj.period : undefined,
        summary: typeof obj.summary === "string" ? obj.summary : undefined,
        link: typeof obj.link === "string" ? obj.link : undefined,
      };
    })
    .filter(Boolean) as NonNullable<Person["projects"]>;
  return items.length ? items : undefined;
}

function normalizePersonPublications(value: unknown): Person["publications"] {
  if (!value || !Array.isArray(value)) return undefined;
  const items = value
    .map((x) => {
      if (!x || typeof x !== "object") return null;
      const obj = x as Record<string, unknown>;
      const citation = typeof obj.citation === "string" ? obj.citation : "";
      if (!citation) return null;
      return {
        citation,
        link: typeof obj.link === "string" ? obj.link : undefined,
      };
    })
    .filter(Boolean) as NonNullable<Person["publications"]>;
  return items.length ? items : undefined;
}

function normalizeString(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function normalizeOptionalString(value: unknown) {
  if (typeof value !== "string") return undefined;
  return value.trim() ? value : undefined;
}

function normalizeNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function fallbackSlug(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function resolveImageUrl(source: unknown, fallback?: string, width = 1200) {
  if (fallback) return fallback;
  if (!source) return undefined;

  try {
    return urlFor(source as never).width(width).fit("max").auto("format").url();
  } catch {
    return undefined;
  }
}

function logSanityReadError(error: unknown) {
  if (hasLoggedSanityReadError) return;
  if (
    error &&
    typeof error === "object" &&
    "digest" in error &&
    error.digest === "DYNAMIC_SERVER_USAGE"
  ) {
    return;
  }
  hasLoggedSanityReadError = true;
  console.warn("Sanity read failed for Studio-managed content.", error);
}

async function safeFetchSanity<T>(
  query: string,
  params?: Record<string, unknown>,
  tags: string[] = []
): Promise<T | null> {
  try {
    return await sanityFetch<T>({
      query,
      params: (params ?? {}) as never,
      tags,
    });
  } catch (error) {
    logSanityReadError(error);
    return null;
  }
}

function mapSanityNewsPost(record: SanityNewsRecord): NewsPost {
  const slug = normalizeString(record.slug) || fallbackSlug(normalizeString(record.title, "news"));
  const body = normalizeString(record.body);

  return {
    slug,
    title: normalizeString(record.title, slug),
    date: normalizeString(record.date, "1970-01-01"),
    summary: normalizeString(record.summary),
    tags: normalizeArray(record.tags),
    cover: resolveImageUrl(record.cover, normalizeOptionalString(record.coverUrl)),
    readingMinutes: Math.max(1, Math.round(readingTime(body).minutes)),
    source: "sanity",
  };
}

async function mapSanityNewsPostFull(record: SanityNewsRecord): Promise<NewsPostFull> {
  const post = mapSanityNewsPost(record);
  const raw = normalizeString(record.body);

  return {
    ...post,
    html: await markdownToHtml(raw),
    raw,
    filePath: "",
  };
}

function mapSanityPerson(record: SanityPersonRecord): Person {
  const name = normalizeString(record.name, "Unknown");
  const slug = normalizeString(record.slug) || fallbackSlug(name);

  return {
    slug,
    name,
    role: normalizeString(record.role),
    category: normalizeString(record.category, "Graduate"),
    interests: normalizeArray(record.interests),
    email: normalizeOptionalString(record.email),
    photo: resolveImageUrl(record.photo, normalizeOptionalString(record.photoUrl), 400),
    links: normalizeLinks(record.links),
    order: normalizeNumber(record.order),
    highlights: normalizeArray(record.highlights).length
      ? normalizeArray(record.highlights)
      : undefined,
    projects: normalizePersonProjects(record.projects),
    publications: normalizePersonPublications(record.publications),
    source: "sanity",
  };
}

async function mapSanityPersonFull(record: SanityPersonRecord): Promise<PersonFull> {
  const person = mapSanityPerson(record);
  const raw = normalizeString(record.body);

  return {
    ...person,
    html: await markdownToHtml(raw),
    raw,
    filePath: "",
  };
}

function sortPeople(people: Person[]) {
  return [...people].sort((a, b) => {
    const ao = a.order ?? 9999;
    const bo = b.order ?? 9999;
    if (ao !== bo) return ao - bo;
    return a.name.localeCompare(b.name);
  });
}

async function getAllNewsFromSanity(): Promise<NewsPost[]> {
  const records = await safeFetchSanity<SanityNewsRecord[]>(
    allNewsQuery,
    undefined,
    getSanityTags("news")
  );
  if (!records?.length) return [];
  return records.map(mapSanityNewsPost);
}

async function getNewsBySlugFromSanity(slug: string): Promise<NewsPostFull | null> {
  const record = await safeFetchSanity<SanityNewsRecord | null>(
    newsBySlugQuery,
    { slug },
    getSanityTags("news")
  );
  if (!record) return null;
  return mapSanityNewsPostFull(record);
}

async function getAllPeopleFromSanity(): Promise<Person[]> {
  const records = await safeFetchSanity<SanityPersonRecord[]>(
    allPeopleQuery,
    undefined,
    getSanityTags("people")
  );
  if (!records?.length) return [];
  return sortPeople(records.map(mapSanityPerson));
}

async function getPersonBySlugFromSanity(slug: string): Promise<PersonFull | null> {
  const record = await safeFetchSanity<SanityPersonRecord | null>(
    personBySlugQuery,
    { slug },
    getSanityTags("people")
  );
  if (!record) return null;
  return mapSanityPersonFull(record);
}

async function getMarkdownDocFromSanity(
  docPath: string
): Promise<MarkdownDocHtml | null> {
  const type = SANITY_MARKDOWN_DOCS[docPath];
  if (!type) return null;

  const doc = await safeFetchSanity<SanityMarkdownRecord | null>(
    markdownDocumentQuery,
    { type },
    getSanityTags(type)
  );
  if (!doc?.body) return null;

  const content = normalizeString(doc.body);
  const title =
    normalizeOptionalString(doc.title) ??
    path.basename(docPath, path.extname(docPath));

  return {
    data: { title },
    content,
    filePath: "",
    html: await markdownToHtml(content),
    source: "sanity",
  };
}

function getAllNewsFromFilesystem(): NewsPost[] {
  const dir = path.join(CONTENT_DIR, "news");
  const files = readDirSafe(dir).filter(
    (f) => f.endsWith(".md") || f.endsWith(".mdx")
  );

  const posts: NewsPost[] = files.map((file) => {
    const filePath = path.join(dir, file);
    const raw = readFileSafe(filePath);
    const { data, content } = matter(raw);

    const slug = file.replace(/\.(md|mdx)$/, "");
    const title = String(data.title ?? slug);
    const date = String(data.date ?? "1970-01-01");
    const summary = String(data.summary ?? "");
    const tags = normalizeArray(data.tags);
    const cover = data.cover ? String(data.cover) : undefined;

    return {
      slug,
      title,
      date,
      summary,
      tags,
      cover,
      readingMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
      source: "filesystem",
    };
  });

  posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  return posts;
}

async function getNewsBySlugFromFilesystem(slug: string): Promise<NewsPostFull | null> {
  const dir = path.join(CONTENT_DIR, "news");
  const candidates = [path.join(dir, `${slug}.md`), path.join(dir, `${slug}.mdx`)];
  const filePath = candidates.find((p) => fs.existsSync(p));
  if (!filePath) return null;

  const raw = readFileSafe(filePath);
  const { data, content } = matter(raw);

  const title = String(data.title ?? slug);
  const date = String(data.date ?? "1970-01-01");
  const summary = String(data.summary ?? "");
  const tags = normalizeArray(data.tags);
  const cover = data.cover ? String(data.cover) : undefined;

  return {
    slug,
    title,
    date,
    summary,
    tags,
    cover,
    readingMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
    html: await markdownToHtml(content),
    raw,
    filePath: path.relative(process.cwd(), filePath),
    source: "filesystem",
  };
}

function getAllPeopleFromFilesystem(): Person[] {
  const dir = path.join(CONTENT_DIR, "people");
  const files = readDirSafe(dir).filter(
    (f) => f.endsWith(".md") || f.endsWith(".mdx")
  );

  const people: Person[] = files.map((file) => {
    const filePath = path.join(dir, file);
    const raw = readFileSafe(filePath);
    const { data } = matter(raw);

    const slug = file.replace(/\.(md|mdx)$/, "");
    const name = String(data.name ?? slug);
    const role = String(data.role ?? "");
    const category = String(data.category ?? "Graduate");
    const interests = normalizeArray(data.interests);
    const email = data.email ? String(data.email) : undefined;
    const photo = data.photo ? String(data.photo) : undefined;
    const links = normalizeLinks(data.links);
    const order = data.order !== undefined ? Number(data.order) : undefined;
    const highlightsArr = normalizeArray((data as Record<string, unknown>).highlights);
    const highlights = highlightsArr.length ? highlightsArr : undefined;
    const projects = normalizePersonProjects(
      (data as Record<string, unknown>).projects
    );
    const publications = normalizePersonPublications(
      (data as Record<string, unknown>).publications
    );

    return {
      slug,
      name,
      role,
      category,
      interests,
      email,
      photo,
      links,
      order,
      highlights,
      projects,
      publications,
      source: "filesystem",
    };
  });

  return sortPeople(people);
}

async function getPersonBySlugFromFilesystem(slug: string): Promise<PersonFull | null> {
  const dir = path.join(CONTENT_DIR, "people");
  const candidates = [path.join(dir, `${slug}.md`), path.join(dir, `${slug}.mdx`)];
  const filePath = candidates.find((p) => fs.existsSync(p));
  if (!filePath) return null;

  const raw = readFileSafe(filePath);
  const { data, content } = matter(raw);

  const name = String(data.name ?? slug);
  const role = String(data.role ?? "");
  const category = String(data.category ?? "Graduate");
  const interests = normalizeArray(data.interests);
  const email = data.email ? String(data.email) : undefined;
  const photo = data.photo ? String(data.photo) : undefined;
  const links = normalizeLinks(data.links);
  const order = data.order !== undefined ? Number(data.order) : undefined;
  const highlightsArr = normalizeArray((data as Record<string, unknown>).highlights);
  const highlights = highlightsArr.length ? highlightsArr : undefined;
  const projects = normalizePersonProjects(
    (data as Record<string, unknown>).projects
  );
  const publications = normalizePersonPublications(
    (data as Record<string, unknown>).publications
  );

  return {
    slug,
    name,
    role,
    category,
    interests,
    email,
    photo,
    links,
    order,
    highlights,
    projects,
    publications,
    html: await markdownToHtml(content),
    raw,
    filePath: path.relative(process.cwd(), filePath),
    source: "filesystem",
  };
}

export async function getAllNews(): Promise<NewsPost[]> {
  return getAllNewsFromSanity();
}

export async function getNewsBySlug(slug: string): Promise<NewsPostFull | null> {
  return getNewsBySlugFromSanity(slug);
}

export async function getAllPeople(): Promise<Person[]> {
  return getAllPeopleFromSanity();
}

export async function getPersonBySlug(slug: string): Promise<PersonFull | null> {
  return getPersonBySlugFromSanity(slug);
}

export type SimpleItem = {
  title: string;
  year?: string;
  org?: string;
  period?: string;
  note?: string;
};

export function readMarkdownDoc(docPath: string): MarkdownDoc | null {
  const fullPath = path.join(process.cwd(), docPath);
  if (!fs.existsSync(fullPath)) return null;
  const raw = readFileSafe(fullPath);
  const { data, content } = matter(raw);
  return {
    data: data as Record<string, unknown>,
    content,
    filePath: path.relative(process.cwd(), fullPath),
    source: "filesystem",
  };
}

export async function getMarkdownDocHtml(docPath: string): Promise<MarkdownDocHtml | null> {
  const sanityType = SANITY_MARKDOWN_DOCS[docPath];
  if (sanityType) {
    return getMarkdownDocFromSanity(docPath);
  }

  const doc = readMarkdownDoc(docPath);
  if (!doc) return null;

  return {
    ...doc,
    html: await markdownToHtml(doc.content),
  };
}
