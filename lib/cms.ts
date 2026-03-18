import type {Metadata} from "next";
import {groq} from "next-sanity";
import {remark} from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

import {siteConfig} from "@/config/site";
import {readMarkdownDoc} from "@/lib/content";
import {sanityFetch} from "@/sanity/lib/client";
import {urlFor} from "@/sanity/lib/image";
import {getSanityTags} from "@/sanity/lib/tags";

export type CmsTone = "primary" | "secondary";

export type CmsLink = {
  label: string;
  href: string;
  tone?: CmsTone;
};

export type CmsNavItem = CmsLink & {
  children: CmsLink[];
};

export type CmsCard = {
  title: string;
  description?: string;
  href?: string;
  anchor?: string;
};

export type CmsGalleryImage = {
  src: string;
  alt?: string;
  caption?: string;
};

export type CmsSiteSettings = {
  name: string;
  longName: string;
  institution: string;
  locale: string;
  url: string;
  description: string;
  contactEmail: string;
  addressKo: string;
  addressEn: string;
  navItems: CmsNavItem[];
  footerLinks: CmsLink[];
  footerNote?: string;
};

export type CmsHomePage = {
  eyebrow: string;
  title: string;
  description: string;
  heroImage?: string;
  heroImageAlt?: string;
  heroImageCaption?: string;
  heroCtas: CmsLink[];
  labGallery: CmsGalleryImage[];
  researchTitle: string;
  researchIntro?: string;
  researchCards: CmsCard[];
  strengthsTitle: string;
  strengthsIntro?: string;
  strengths: CmsCard[];
  newsTitle: string;
  newsIntro?: string;
  peopleTitle: string;
  peopleIntro?: string;
  hiringTitle: string;
  hiringDescription?: string;
  hiringCtas: CmsLink[];
};

export type CmsResearchSection = {
  anchor: string;
  title: string;
  intro?: string;
  bodyRaw: string;
  bodyHtml: string;
  image?: string;
  imageAlt?: string;
  imageCaption?: string;
  gallery: CmsGalleryImage[];
  cards: CmsCard[];
};

export type CmsResearchPage = {
  title: string;
  intro?: string;
  sections: CmsResearchSection[];
  closingTitle?: string;
  closingBody?: string;
  closingLinks: CmsLink[];
};

export type CmsPage = {
  title: string;
  route: string;
  eyebrow?: string;
  intro?: string;
  heroImage?: string;
  heroImageAlt?: string;
  gallery: CmsGalleryImage[];
  cards: CmsCard[];
  ctas: CmsLink[];
  bodyRaw: string;
  bodyHtml: string;
  seoTitle?: string;
  seoDescription?: string;
};

type SanityLinkRecord = {
  label?: unknown;
  href?: unknown;
  tone?: unknown;
  children?: unknown;
};

type SanityCardRecord = {
  title?: unknown;
  description?: unknown;
  href?: unknown;
  anchor?: unknown;
};

type SanityGalleryImageRecord = {
  image?: unknown;
  imageUrl?: unknown;
  alt?: unknown;
  caption?: unknown;
};

type SanitySiteSettingsRecord = {
  name?: unknown;
  longName?: unknown;
  institution?: unknown;
  locale?: unknown;
  url?: unknown;
  description?: unknown;
  contactEmail?: unknown;
  addressKo?: unknown;
  addressEn?: unknown;
  navItems?: unknown;
  footerLinks?: unknown;
  footerNote?: unknown;
};

type SanityHomePageRecord = {
  eyebrow?: unknown;
  title?: unknown;
  description?: unknown;
  heroImage?: unknown;
  heroImageAlt?: unknown;
  heroImageCaption?: unknown;
  heroImageUrl?: unknown;
  heroCtas?: unknown;
  labGallery?: unknown;
  researchTitle?: unknown;
  researchIntro?: unknown;
  researchCards?: unknown;
  strengthsTitle?: unknown;
  strengthsIntro?: unknown;
  strengths?: unknown;
  newsTitle?: unknown;
  newsIntro?: unknown;
  peopleTitle?: unknown;
  peopleIntro?: unknown;
  hiringTitle?: unknown;
  hiringDescription?: unknown;
  hiringCtas?: unknown;
};

type SanityResearchSectionRecord = {
  anchor?: unknown;
  title?: unknown;
  intro?: unknown;
  body?: unknown;
  image?: unknown;
  imageAlt?: unknown;
  imageCaption?: unknown;
  imageUrl?: unknown;
  gallery?: unknown;
  cards?: unknown;
};

type SanityResearchPageRecord = {
  title?: unknown;
  intro?: unknown;
  sections?: unknown;
  closingTitle?: unknown;
  closingBody?: unknown;
  closingLinks?: unknown;
};

type SanityPageRecord = {
  title?: unknown;
  route?: unknown;
  eyebrow?: unknown;
  intro?: unknown;
  heroImage?: unknown;
  heroImageAlt?: unknown;
  heroImageUrl?: unknown;
  gallery?: unknown;
  cards?: unknown;
  ctas?: unknown;
  body?: unknown;
  seoTitle?: unknown;
  seoDescription?: unknown;
};

const siteSettingsQuery = groq`
  *[_type == "siteSettings" && _id == "siteSettings"][0]{
    name,
    longName,
    institution,
    locale,
    url,
    description,
    contactEmail,
    addressKo,
    addressEn,
    "navItems": coalesce(navItems, []),
    "footerLinks": coalesce(footerLinks, []),
    footerNote
  }
`;

const homePageQuery = groq`
  *[_type == "homePage" && _id == "homePage"][0]{
    eyebrow,
    title,
    description,
    heroImage,
    "heroImageUrl": heroImage.asset->url,
    heroImageAlt,
    heroImageCaption,
    "heroCtas": coalesce(heroCtas, []),
    "labGallery": coalesce(labGallery[]{
      image,
      "imageUrl": image.asset->url,
      alt,
      caption
    }, []),
    researchTitle,
    researchIntro,
    "researchCards": coalesce(researchCards, []),
    strengthsTitle,
    strengthsIntro,
    "strengths": coalesce(strengths, []),
    newsTitle,
    newsIntro,
    peopleTitle,
    peopleIntro,
    hiringTitle,
    hiringDescription,
    "hiringCtas": coalesce(hiringCtas, [])
  }
`;

const researchPageQuery = groq`
  *[_type == "researchPage" && _id == "researchPage"][0]{
    title,
    intro,
    "sections": coalesce(sections[]{
      anchor,
      title,
      intro,
      body,
      image,
      "imageUrl": image.asset->url,
      imageAlt,
      imageCaption,
      "gallery": coalesce(gallery[]{
        image,
        "imageUrl": image.asset->url,
        alt,
        caption
      }, []),
      "cards": coalesce(cards, [])
    }, []),
    closingTitle,
    closingBody,
    "closingLinks": coalesce(closingLinks, [])
  }
`;

const pageByRouteQuery = groq`
  *[_type == "page" && route == $route][0]{
    title,
    route,
    eyebrow,
    intro,
    heroImage,
    "heroImageUrl": heroImage.asset->url,
    heroImageAlt,
    "gallery": coalesce(gallery[]{
      image,
      "imageUrl": image.asset->url,
      alt,
      caption
    }, []),
    "cards": coalesce(cards, []),
    "ctas": coalesce(ctas, []),
    body,
    seoTitle,
    seoDescription
  }
`;

const allPageRoutesQuery = groq`
  *[_type == "page" && defined(route)]{
    route
  }
`;

const fallbackSiteSettings: CmsSiteSettings = {
  name: siteConfig.name,
  longName: siteConfig.longName,
  institution: siteConfig.institution,
  locale: siteConfig.locale,
  url: siteConfig.url,
  description: siteConfig.description,
  contactEmail: siteConfig.contact.email,
  addressKo: siteConfig.contact.addressKo,
  addressEn: siteConfig.contact.addressEn,
  navItems: [
    {label: "Research", href: "/research", children: []},
    {label: "Projects", href: "/projects", children: []},
    {
      label: "Publications",
      href: "/publications",
      children: [
        {label: "Journals", href: "/publications/journals"},
        {label: "Conferences", href: "/publications/conferences"},
        {label: "Patents", href: "/publications/patents"},
      ],
    },
    {
      label: "People",
      href: "/people",
      children: [{label: "Alumni", href: "/alumni"}],
    },
    {label: "News", href: "/news", children: []},
    {label: "Courses", href: "/courses", children: []},
    {label: "Contact", href: "/contact", children: []},
  ],
  footerLinks: [
    {label: "News", href: "/news"},
    {label: "People", href: "/people"},
    {label: "Contact", href: "/contact"},
  ],
  footerNote:
    "Research in electric machines, machine drives, sensors, and electrified mobility systems.",
};

const fallbackHomePage: CmsHomePage = {
  eyebrow: siteConfig.institution,
  title: siteConfig.longName,
  description:
    "전기기기, 드라이브, 센서, e-모빌리티 전동화 시스템을 중심으로 설계, 해석, 제어, 검증까지 연결되는 연구를 수행합니다.",
  heroImage: "/uploads/hero-lab.jpg",
  heroImageAlt: "EMD Lab",
  heroImageCaption: "EMD Lab overview",
  heroCtas: [
    {label: "Research 보기", href: "/research", tone: "primary"},
    {label: "최신 소식", href: "/news", tone: "secondary"},
    {label: "Join / Contact", href: "/contact", tone: "secondary"},
  ],
  labGallery: [],
  researchTitle: "Research Areas",
  researchIntro:
    "EMD Lab은 전기기기 설계부터 드라이브 제어, 센서, e-모빌리티 응용까지 연결된 연구 스택을 운영합니다.",
  researchCards: [
    {
      title: "Electric Machines",
      description: "전동기 토폴로지, 전자기 해석, 열·구조·NVH, 고성능 설계를 다룹니다.",
      href: "/research#electric-machines",
    },
    {
      title: "Machine Drives",
      description: "인버터, 제어기, HIL 기반 구동 시스템 검증과 fault-tolerant drive를 다룹니다.",
      href: "/research#machine-drives",
    },
    {
      title: "Sensors",
      description: "구동 시스템용 위치 센서와 VR resolver 설계를 연구합니다.",
      href: "/research#sensors",
    },
    {
      title: "Mobility Applications",
      description: "EV powertrain, e-mobility traction systems, digital-twin 기반 시스템 분석을 수행합니다.",
      href: "/research#mobility",
    },
  ],
  strengthsTitle: "Lab Strengths",
  strengthsIntro:
    "단일 부품 수준이 아니라 설계-해석-제어-시스템 검증까지 연결된 연구 프로세스를 갖춘 것이 연구실의 핵심 강점입니다.",
  strengths: [
    {
      title: "End-to-end workflow",
      description:
        "전동기 설계, 전자기·열·구조 해석, 제어기 설계, HIL 및 실험 검증까지 한 흐름으로 다룹니다.",
    },
    {
      title: "E-mobility focus",
      description:
        "BEV, PHEV, FCEV와 personal mobility를 포함한 전동화 시스템 응용에 집중합니다.",
    },
    {
      title: "Multiphysics optimization",
      description:
        "전자기, 열, 구조, NVH를 함께 고려하는 surrogate-assisted optimization을 수행합니다.",
    },
    {
      title: "Industry-linked projects",
      description:
        "국책과제와 산학 프로젝트를 통해 실제 제약 조건을 반영한 연구를 진행합니다.",
    },
  ],
  newsTitle: "Latest News",
  newsIntro: "최근 수상, 학회 발표, 연구실 공지와 주요 업데이트를 확인할 수 있습니다.",
  peopleTitle: "People",
  peopleIntro: "교수, 연구원, 대학원생, 학부연구생 등 현재 연구실 구성원을 소개합니다.",
  hiringTitle: "Join EMD Lab",
  hiringDescription:
    "모터, 드라이브, 전동화 시스템, 센서, 최적화 연구에 관심 있는 학생과 공동연구자를 모집합니다.",
  hiringCtas: [{label: "Contact / Join 안내", href: "/contact", tone: "primary"}],
};

const fallbackResearchPage: Omit<CmsResearchPage, "sections"> & {
  sections: Array<{
    anchor: string;
    title: string;
    intro: string;
    bodyRaw: string;
    image?: string;
    imageAlt?: string;
    imageCaption?: string;
    gallery: CmsGalleryImage[];
    cards: CmsCard[];
  }>;
} = {
  title: "Research",
  intro:
    "EMD Lab은 전기기기와 구동 시스템, 센서, e-모빌리티 응용을 연결해 이론과 실험을 함께 다루는 연구를 수행합니다.",
  sections: [
    {
      anchor: "electric-machines",
      title: "Electric Machines",
      intro:
        "고성능 traction motor와 특수 목적 전동기를 대상으로 설계, 해석, 최적화, NVH까지 통합적으로 연구합니다.",
      bodyRaw:
        "- High-performance machine topologies\n- Core loss, DC bias, PWM effects\n- Thermal, structural, NVH integrated analysis\n- Multi-objective and multiphysics optimization",
      gallery: [],
      cards: [
        {
          title: "High-performance topologies",
          description: "Wound-field, PM, flux-switching, vernier 등 다양한 전동기 구조를 설계합니다.",
        },
        {
          title: "Thermal / Structural / NVH",
          description: "전자기 성능뿐 아니라 열, 구조, 소음·진동 성능까지 함께 고려합니다.",
        },
      ],
    },
    {
      anchor: "machine-drives",
      title: "Machine Drives",
      intro:
        "전력변환기, 제어기, 시스템 시뮬레이션, HIL 환경을 포함한 drive-system 설계와 검증을 수행합니다.",
      bodyRaw:
        "- Coupled electromagnetic-circuit simulation\n- High-fidelity system simulation\n- Characterization and hardware integration\n- Fault diagnosis and tolerant control",
      gallery: [],
      cards: [
        {
          title: "Coupled simulation",
          description: "PWM, 전자기, 회로 모델을 함께 묶어 drive-level 성능을 예측합니다.",
        },
        {
          title: "HIL verification",
          description: "실시간 시뮬레이션과 HIL 환경에서 제어 알고리즘과 시스템 응답을 검증합니다.",
        },
      ],
    },
    {
      anchor: "sensors",
      title: "Sensors",
      intro:
        "전동기 구동을 위한 위치·각도 센서 설계와 민감도 분석, 자동차용 resolver 연구를 진행합니다.",
      bodyRaw:
        "- Variable reluctance resolver design\n- Sensitivity and tolerance analysis\n- Drive-system sensor integration",
      gallery: [],
      cards: [
        {
          title: "VR Resolver",
          description: "자동차 및 e-mobility 응용을 위한 variable reluctance resolver를 설계합니다.",
        },
      ],
    },
    {
      anchor: "mobility",
      title: "Mobility Applications",
      intro:
        "EV powertrain부터 system-level operation, energy consumption, digital twin까지 확장된 응용 연구를 수행합니다.",
      bodyRaw:
        "- EV powertrain modeling\n- Digital-twin based operation analysis\n- Transportation and grid integration\n- System databases for reuse",
      gallery: [],
      cards: [
        {
          title: "EV powertrain modeling",
          description: "차량 주행과 동력계 모델을 연결해 에너지 소비와 성능을 분석합니다.",
        },
        {
          title: "Integrated systems",
          description: "교통 시스템과 전력망을 함께 고려하는 운용 분석과 최적화를 연구합니다.",
        },
      ],
    },
  ],
  closingTitle: "Related Content",
  closingBody:
    "연구분야와 연결된 프로젝트, 논문, 특허, 수업 정보도 Sanity Studio에서 함께 관리할 수 있습니다.",
  closingLinks: [
    {label: "Projects", href: "/projects", tone: "primary"},
    {label: "Publications", href: "/publications", tone: "secondary"},
    {label: "Courses", href: "/courses", tone: "secondary"},
  ],
};

const publicationsDoc = readMarkdownDoc("content/publications.md");
const projectsDoc = readMarkdownDoc("content/projects.md");
const alumniDoc = readMarkdownDoc("content/alumni.md");

function normalizeString(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function normalizeOptionalString(value: unknown) {
  if (typeof value !== "string") return undefined;
  return value.trim() ? value : undefined;
}

function normalizeTone(value: unknown): CmsTone | undefined {
  return value === "primary" || value === "secondary" ? value : undefined;
}

function normalizeLinks(value: unknown): CmsLink[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as SanityLinkRecord;
      const label = normalizeString(record.label);
      const href = normalizeString(record.href);
      if (!label || !href) return null;
      return {
        label,
        href,
        tone: normalizeTone(record.tone),
      };
    })
    .filter(Boolean) as CmsLink[];
}

function normalizeNavItems(value: unknown): CmsNavItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as SanityLinkRecord;
      const label = normalizeString(record.label);
      const href = normalizeString(record.href);
      if (!label || !href) return null;
      return {
        label,
        href,
        children: normalizeLinks(record.children),
      };
    })
    .filter(Boolean) as CmsNavItem[];
}

function normalizeCards(value: unknown): CmsCard[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as SanityCardRecord;
      const title = normalizeString(record.title);
      if (!title) return null;
      return {
        title,
        description: normalizeOptionalString(record.description),
        href: normalizeOptionalString(record.href),
        anchor: normalizeOptionalString(record.anchor),
      };
    })
    .filter(Boolean) as CmsCard[];
}

function normalizeGallery(value: unknown): CmsGalleryImage[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as SanityGalleryImageRecord;
      const src = resolveImageUrl(
        record.image,
        normalizeOptionalString(record.imageUrl),
        1400
      );
      if (!src) return null;
      return {
        src,
        alt: normalizeOptionalString(record.alt),
        caption: normalizeOptionalString(record.caption),
      };
    })
    .filter(Boolean) as CmsGalleryImage[];
}

function resolveImageUrl(source: unknown, fallback?: string, width = 1600) {
  if (fallback) return fallback;
  if (!source) return undefined;

  try {
    return urlFor(source as never).width(width).fit("max").auto("format").url();
  } catch {
    return undefined;
  }
}

async function markdownToHtml(markdown: string) {
  const processed = await remark()
    .use(remarkGfm)
    .use(remarkHtml, {sanitize: false})
    .process(markdown);

  return processed.toString();
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
    if (
      !(
        error &&
        typeof error === "object" &&
        "digest" in error &&
        error.digest === "DYNAMIC_SERVER_USAGE"
      )
    ) {
      console.warn("Sanity CMS read failed.", error);
    }
    return null;
  }
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractMarkdownSection(content: string | undefined, startHeading: string, endHeading?: string) {
  if (!content) return "";
  const start = new RegExp(`${escapeRegExp(startHeading)}\\s*\\n([\\s\\S]*?)${endHeading ? `\\n${escapeRegExp(endHeading)}` : "$"}`);
  const match = content.match(start);
  if (!match) return "";
  return `${startHeading}\n\n${match[1].trim()}`.trim();
}

function mapSiteSettings(record: SanitySiteSettingsRecord): CmsSiteSettings {
  return {
    name: normalizeString(record.name, fallbackSiteSettings.name),
    longName: normalizeString(record.longName, fallbackSiteSettings.longName),
    institution: normalizeString(record.institution, fallbackSiteSettings.institution),
    locale: normalizeString(record.locale, fallbackSiteSettings.locale),
    url: normalizeString(record.url, fallbackSiteSettings.url),
    description: normalizeString(record.description, fallbackSiteSettings.description),
    contactEmail: normalizeString(record.contactEmail, fallbackSiteSettings.contactEmail),
    addressKo: normalizeString(record.addressKo, fallbackSiteSettings.addressKo),
    addressEn: normalizeString(record.addressEn, fallbackSiteSettings.addressEn),
    navItems: normalizeNavItems(record.navItems).length
      ? normalizeNavItems(record.navItems)
      : fallbackSiteSettings.navItems,
    footerLinks: normalizeLinks(record.footerLinks).length
      ? normalizeLinks(record.footerLinks)
      : fallbackSiteSettings.footerLinks,
    footerNote: normalizeOptionalString(record.footerNote) ?? fallbackSiteSettings.footerNote,
  };
}

function mapHomePage(record: SanityHomePageRecord): CmsHomePage {
  return {
    eyebrow: normalizeString(record.eyebrow, fallbackHomePage.eyebrow),
    title: normalizeString(record.title, fallbackHomePage.title),
    description: normalizeString(record.description, fallbackHomePage.description),
    heroImage:
      resolveImageUrl(record.heroImage, normalizeOptionalString(record.heroImageUrl), 1200) ??
      fallbackHomePage.heroImage,
    heroImageAlt: normalizeOptionalString(record.heroImageAlt) ?? fallbackHomePage.heroImageAlt,
    heroImageCaption:
      normalizeOptionalString(record.heroImageCaption) ?? fallbackHomePage.heroImageCaption,
    heroCtas: normalizeLinks(record.heroCtas).length
      ? normalizeLinks(record.heroCtas)
      : fallbackHomePage.heroCtas,
    labGallery: normalizeGallery(record.labGallery),
    researchTitle: normalizeString(record.researchTitle, fallbackHomePage.researchTitle),
    researchIntro:
      normalizeOptionalString(record.researchIntro) ?? fallbackHomePage.researchIntro,
    researchCards: normalizeCards(record.researchCards).length
      ? normalizeCards(record.researchCards)
      : fallbackHomePage.researchCards,
    strengthsTitle: normalizeString(record.strengthsTitle, fallbackHomePage.strengthsTitle),
    strengthsIntro:
      normalizeOptionalString(record.strengthsIntro) ?? fallbackHomePage.strengthsIntro,
    strengths: normalizeCards(record.strengths).length
      ? normalizeCards(record.strengths)
      : fallbackHomePage.strengths,
    newsTitle: normalizeString(record.newsTitle, fallbackHomePage.newsTitle),
    newsIntro: normalizeOptionalString(record.newsIntro) ?? fallbackHomePage.newsIntro,
    peopleTitle: normalizeString(record.peopleTitle, fallbackHomePage.peopleTitle),
    peopleIntro: normalizeOptionalString(record.peopleIntro) ?? fallbackHomePage.peopleIntro,
    hiringTitle: normalizeString(record.hiringTitle, fallbackHomePage.hiringTitle),
    hiringDescription:
      normalizeOptionalString(record.hiringDescription) ?? fallbackHomePage.hiringDescription,
    hiringCtas: normalizeLinks(record.hiringCtas).length
      ? normalizeLinks(record.hiringCtas)
      : fallbackHomePage.hiringCtas,
  };
}

async function mapResearchSection(record: SanityResearchSectionRecord): Promise<CmsResearchSection | null> {
  const anchor = normalizeString(record.anchor);
  const title = normalizeString(record.title);
  if (!anchor || !title) return null;

  const bodyRaw = normalizeString(record.body);

  return {
    anchor,
    title,
    intro: normalizeOptionalString(record.intro),
    bodyRaw,
    bodyHtml: bodyRaw ? await markdownToHtml(bodyRaw) : "",
    image: resolveImageUrl(record.image, normalizeOptionalString(record.imageUrl), 1200),
    imageAlt: normalizeOptionalString(record.imageAlt),
    imageCaption: normalizeOptionalString(record.imageCaption),
    gallery: normalizeGallery(record.gallery),
    cards: normalizeCards(record.cards),
  };
}

async function mapResearchPage(record: SanityResearchPageRecord): Promise<CmsResearchPage> {
  const sections = await Promise.all(
    (Array.isArray(record.sections) ? record.sections : []).map((section) =>
      mapResearchSection(section as SanityResearchSectionRecord)
    )
  );

  return {
    title: normalizeString(record.title, fallbackResearchPage.title),
    intro: normalizeOptionalString(record.intro) ?? fallbackResearchPage.intro,
    sections: sections.filter(Boolean) as CmsResearchSection[],
    closingTitle:
      normalizeOptionalString(record.closingTitle) ?? fallbackResearchPage.closingTitle,
    closingBody:
      normalizeOptionalString(record.closingBody) ?? fallbackResearchPage.closingBody,
    closingLinks: normalizeLinks(record.closingLinks).length
      ? normalizeLinks(record.closingLinks)
      : fallbackResearchPage.closingLinks,
  };
}

async function mapPage(record: SanityPageRecord): Promise<CmsPage | null> {
  const route = normalizeString(record.route);
  const title = normalizeString(record.title);
  if (!route || !title) return null;
  const bodyRaw = normalizeString(record.body);

  return {
    title,
    route,
    eyebrow: normalizeOptionalString(record.eyebrow),
    intro: normalizeOptionalString(record.intro),
    heroImage: resolveImageUrl(record.heroImage, normalizeOptionalString(record.heroImageUrl), 1200),
    heroImageAlt: normalizeOptionalString(record.heroImageAlt),
    gallery: normalizeGallery(record.gallery),
    cards: normalizeCards(record.cards),
    ctas: normalizeLinks(record.ctas),
    bodyRaw,
    bodyHtml: bodyRaw ? await markdownToHtml(bodyRaw) : "",
    seoTitle: normalizeOptionalString(record.seoTitle),
    seoDescription: normalizeOptionalString(record.seoDescription),
  };
}

function routeToPath(route: string) {
  return `/${route.replace(/^\/+/, "")}`;
}

async function buildFallbackResearchPage(): Promise<CmsResearchPage> {
  const sections = await Promise.all(
    fallbackResearchPage.sections.map(async (section) => ({
      ...section,
      bodyHtml: section.bodyRaw ? await markdownToHtml(section.bodyRaw) : "",
    }))
  );

  return {
    title: fallbackResearchPage.title,
    intro: fallbackResearchPage.intro,
    sections,
    closingTitle: fallbackResearchPage.closingTitle,
    closingBody: fallbackResearchPage.closingBody,
    closingLinks: fallbackResearchPage.closingLinks,
  };
}

async function buildFallbackPage(route: string): Promise<CmsPage | null> {
  const publicationsContent = publicationsDoc?.content ?? "";
  const contactGuide = [
    "## Contact Guide",
    "",
    "- 관심 연구분야와 간단한 자기소개를 함께 보내 주세요.",
    "- 학부연구생은 가능한 활동 기간과 주당 가능 시간을 함께 적어 주세요.",
    "- 대학원 지원자는 관심 주제와 본인의 강점을 구체적으로 적어 주시면 검토가 수월합니다.",
  ].join("\n");

  const pages: Record<string, Omit<CmsPage, "bodyHtml">> = {
    "projects": {
      title: "Projects",
      route: "projects",
      intro: "연구실에서 수행 중인 주요 국가과제와 산학 프로젝트를 관리합니다.",
      gallery: [],
      cards: [],
      ctas: [{label: "Research", href: "/research", tone: "secondary"}],
      bodyRaw: projectsDoc?.content ?? "",
    },
    "publications": {
      title: "Publications",
      route: "publications",
      intro: "저널, 학회, 특허를 개별 페이지로 나눠 관리할 수 있도록 구성했습니다.",
      gallery: [],
      cards: [
        {title: "Journals", description: "Selected journal papers", href: "/publications/journals"},
        {title: "Conferences", description: "Conference proceedings", href: "/publications/conferences"},
        {title: "Patents", description: "Domestic and international patents", href: "/publications/patents"},
      ],
      ctas: [{label: "Projects", href: "/projects", tone: "secondary"}],
      bodyRaw: "",
    },
    "publications/journals": {
      title: "Journal Papers",
      route: "publications/journals",
      intro: "연구실의 주요 저널 논문 목록입니다.",
      gallery: [],
      cards: [],
      ctas: [{label: "Publications", href: "/publications", tone: "secondary"}],
      bodyRaw: extractMarkdownSection(
        publicationsContent,
        "## Journal Papers (selected)",
        "## Conference Proceedings (selected)"
      ),
    },
    "publications/conferences": {
      title: "Conference Proceedings",
      route: "publications/conferences",
      intro: "연구실의 학회 발표 및 conference proceeding 목록입니다.",
      gallery: [],
      cards: [],
      ctas: [{label: "Publications", href: "/publications", tone: "secondary"}],
      bodyRaw: extractMarkdownSection(
        publicationsContent,
        "## Conference Proceedings (selected)"
      ),
    },
    "publications/patents": {
      title: "Patents",
      route: "publications/patents",
      intro: "국내외 특허 및 출원 항목을 관리합니다.",
      gallery: [],
      cards: [],
      ctas: [{label: "Publications", href: "/publications", tone: "secondary"}],
      bodyRaw: [
        "## International Patents",
        "",
        "- Apparatus and method for monitoring magnet flux degradation of a permanent magnet motor, 2019, US Patent",
        "- Active masking of tonal noise using motor-based acoustic generator to improve sound quality, 2019, US Patent",
        "",
        "## Domestic Patents",
        "",
        "- 대리모델을 이용한 전동기 형상의 최적설계 방법 및 설계 시스템(출원), 2022",
        "- 와전류 브레이크를 이용한 전동킥보드용 제동장치(출원), 2021",
        "- 에너지 효율 향상을 위한 헤어핀 권선 전동기의 슬롯 구조(출원), 2021",
      ].join("\n"),
    },
    "courses": {
      title: "Courses",
      route: "courses",
      intro: "연구실에서 담당한 주요 강의 이력을 학기별로 정리합니다.",
      gallery: [],
      cards: [],
      ctas: [{label: "Contact", href: "/contact", tone: "secondary"}],
      bodyRaw: [
        "## 2024 Spring",
        "",
        "- ECE5026 - Electric Machine Control Theory (EN, Graduate Course)",
        "- EEE3317 - Electric Machines and Design",
        "- EEE4001 - Capstone Design Project",
        "- FVE4002 - Capstone Design Project 1",
        "- ACE9703 - Problem Solving Project 3",
        "- EEE2006 - Basic Experiment I",
        "",
        "## 2022 Spring",
        "",
        "- EEE3317 - Electric Machines and Design",
        "- ECE5026 - Electric Machine Control Theory (EN, Graduate Course)",
        "- IGV5002 - Introduction to EV Powertrain (Graduate Course)",
        "- EEE4001 - Capstone Design Project",
        "- EEE2006 - Basic Experiment I",
        "",
        "## 2021 Fall",
        "",
        "- EEE2002 - Circuit Analysis II (EN)",
        "- EEE3321 - Electric Vehicle Engineering",
        "- ECE6054 - Introduction to AC Machine Design (EN, Graduate Course)",
        "- ACE9704 - Problem Solving Project",
        "- EEE4001 - Capstone Design Project",
        "- EEE2007 - Basic Experiment II",
        "",
        "## 2021 Spring",
        "",
        "- EEE2001 - Circuit Analysis I",
        "- EEE3317 - Electric Machines and Design",
        "- ECE5026 - Electric Machine Control Theory (EN, Graduate Course)",
        "- ACE9703 - Problem Solving Project",
        "- EEE4001 - Capstone Design Project",
        "",
        "## 2020 Fall",
        "",
        "- EEE2002 - Circuit Analysis II (EN)",
        "- EEE3321 - Electric Vehicle Engineering",
        "",
        "## 2020 Spring",
        "",
        "- EEE2001 - Circuit Analysis I",
        "- EEE3317 - Electric Machines and Design",
      ].join("\n"),
    },
    "contact": {
      title: "Contact / Join",
      route: "contact",
      intro: "연구 참여와 공동연구 문의는 이메일로 연락할 수 있습니다.",
      gallery: [],
      cards: [],
      ctas: [{label: "People", href: "/people", tone: "secondary"}],
      bodyRaw: contactGuide,
    },
    "alumni": {
      title: "Alumni",
      route: "alumni",
      intro: "연구실을 거쳐 간 졸업생과 alumni 정보를 정리합니다.",
      gallery: [],
      cards: [],
      ctas: [{label: "People", href: "/people", tone: "secondary"}],
      bodyRaw: alumniDoc?.content ?? "",
    },
  };

  const page = pages[route];
  if (!page) return null;

  return {
    ...page,
    bodyHtml: page.bodyRaw ? await markdownToHtml(page.bodyRaw) : "",
  };
}

export async function getSiteSettings(): Promise<CmsSiteSettings> {
  const record = await safeFetchSanity<SanitySiteSettingsRecord | null>(
    siteSettingsQuery,
    undefined,
    getSanityTags("siteSettings")
  );

  return record ? mapSiteSettings(record) : fallbackSiteSettings;
}

export async function getHomePage(): Promise<CmsHomePage> {
  const record = await safeFetchSanity<SanityHomePageRecord | null>(
    homePageQuery,
    undefined,
    getSanityTags("homePage")
  );

  return record ? mapHomePage(record) : fallbackHomePage;
}

export async function getResearchPage(): Promise<CmsResearchPage> {
  const record = await safeFetchSanity<SanityResearchPageRecord | null>(
    researchPageQuery,
    undefined,
    getSanityTags("researchPage")
  );

  if (!record) return buildFallbackResearchPage();

  const page = await mapResearchPage(record);
  if (page.sections.length) return page;
  return buildFallbackResearchPage();
}

export async function getPageByRoute(route: string): Promise<CmsPage | null> {
  const normalizedRoute = route.replace(/^\/+/, "");
  const record = await safeFetchSanity<SanityPageRecord | null>(
    pageByRouteQuery,
    {route: normalizedRoute},
    getSanityTags("page")
  );

  if (record) {
    const page = await mapPage(record);
    if (page) return page;
  }

  return buildFallbackPage(normalizedRoute);
}

export async function getAllCmsRoutes() {
  const records = await safeFetchSanity<Array<{route?: string}> | null>(
    allPageRoutesQuery,
    undefined,
    getSanityTags("page")
  );

  const routes = new Set<string>([
    "/",
    "/research",
    "/projects",
    "/publications",
    "/publications/journals",
    "/publications/conferences",
    "/publications/patents",
    "/people",
    "/alumni",
    "/news",
    "/courses",
    "/contact",
  ]);

  for (const record of records ?? []) {
    const route = normalizeString(record.route);
    if (route) routes.add(routeToPath(route));
  }

  return Array.from(routes);
}

export async function buildPageMetadata(route: string): Promise<Metadata> {
  const [settings, page] = await Promise.all([getSiteSettings(), getPageByRoute(route)]);

  if (!page) {
    return {
      title: route,
      description: settings.description,
    };
  }

  return {
    title: page.seoTitle ?? page.title,
    description: page.seoDescription ?? page.intro ?? settings.description,
  };
}
