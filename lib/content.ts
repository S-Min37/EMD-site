
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import readingTime from "reading-time";

export type NewsPost = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  cover?: string;
  readingMinutes: number;
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

  // Portfolio-style optional fields (can be edited by each member)
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

const CONTENT_DIR = path.join(process.cwd(), "content");

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
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") return [value];
  return [];
}

function normalizeLinks(value: unknown): Array<{ label: string; url: string }> {
  if (!value) return [];
  if (!Array.isArray(value)) return [];
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
export async function getAllNews(): Promise<NewsPost[]> {
  const dir = path.join(CONTENT_DIR, "news");
  const files = readDirSafe(dir).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

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
    };
  });

  posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  return posts;
}

export async function getNewsBySlug(slug: string): Promise<NewsPostFull | null> {
  const dir = path.join(CONTENT_DIR, "news");
  const candidates = [
    path.join(dir, `${slug}.md`),
    path.join(dir, `${slug}.mdx`),
  ];
  const filePath = candidates.find((p) => fs.existsSync(p));
  if (!filePath) return null;

  const raw = readFileSafe(filePath);
  const { data, content } = matter(raw);

  const title = String(data.title ?? slug);
  const date = String(data.date ?? "1970-01-01");
  const summary = String(data.summary ?? "");
  const tags = normalizeArray(data.tags);
  const cover = data.cover ? String(data.cover) : undefined;

  const html = await markdownToHtml(content);

  return {
    slug,
    title,
    date,
    summary,
    tags,
    cover,
    readingMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
    html,
    raw,
    filePath: path.relative(process.cwd(), filePath),
  };
}

export async function getAllPeople(): Promise<Person[]> {
  const dir = path.join(CONTENT_DIR, "people");
  const files = readDirSafe(dir).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

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
    const highlights = normalizeArray((data as any).highlights);
    const projects = normalizePersonProjects((data as any).projects);
    const publications = normalizePersonPublications((data as any).publications);

    return { slug, name, role, category, interests, email, photo, links, order, highlights: highlights.length ? highlights : undefined, projects, publications };
  });

  people.sort((a, b) => {
    const ao = a.order ?? 9999;
    const bo = b.order ?? 9999;
    if (ao !== bo) return ao - bo;
    return a.name.localeCompare(b.name);
  });

  return people;
}

export async function getPersonBySlug(slug: string): Promise<PersonFull | null> {
  const dir = path.join(CONTENT_DIR, "people");
  const candidates = [
    path.join(dir, `${slug}.md`),
    path.join(dir, `${slug}.mdx`),
  ];
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

  const html = await markdownToHtml(content);

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
    highlights: highlights.length ? highlights : undefined,
    projects,
    publications,
    html,
    raw,
    filePath: path.relative(process.cwd(), filePath),
  };
}

export type SimpleItem = { title: string; year?: string; org?: string; period?: string; note?: string };

export function readMarkdownDoc(docPath: string) {
  const fullPath = path.join(process.cwd(), docPath);
  if (!fs.existsSync(fullPath)) return null;
  const raw = readFileSafe(fullPath);
  const { data, content } = matter(raw);
  return { data, content, filePath: path.relative(process.cwd(), fullPath) };
}

export async function getMarkdownDocHtml(docPath: string) {
  const doc = readMarkdownDoc(docPath);
  if (!doc) return null;
  const html = await markdownToHtml(doc.content);
  return { ...doc, html };
}
