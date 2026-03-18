import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const rootDir = process.cwd();
const contentDir = path.join(rootDir, "content");
const outputPath = path.join(rootDir, "sanity", "seed", "content.json");

function readDirSafe(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  return fs.readdirSync(dirPath);
}

function readMatter(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const {data, content} = matter(raw);
  return {data, content};
}

function readMarkdownFile(relativePath) {
  const filePath = path.join(rootDir, relativePath);
  if (!fs.existsSync(filePath)) return null;
  return readMatter(filePath);
}

function slugFromFilename(fileName) {
  return fileName.replace(/\.(md|mdx)$/i, "");
}

function stringValue(value, fallback = "") {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function optionalString(value) {
  if (typeof value !== "string") return undefined;
  return value.trim() ? value : undefined;
}

function stringArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string") return value ? [value] : [];
  return [];
}

function makeKey(prefix, value, index) {
  const safeValue = String(value ?? index)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);

  return `${prefix}-${safeValue || index}-${index}`;
}

function buildChildLink(label, href, index) {
  return {
    _key: makeKey("child", label, index),
    _type: "childLink",
    label,
    href,
  };
}

function buildCtaLink(label, href, tone = "secondary", index = 0) {
  return {
    _key: makeKey("cta", label, index),
    _type: "ctaLink",
    label,
    href,
    tone,
  };
}

function buildNavLink(label, href, children = [], index = 0) {
  return {
    _key: makeKey("nav", label, index),
    _type: "navLink",
    label,
    href,
    children: children.map((child, childIndex) =>
      buildChildLink(child.label, child.href, childIndex)
    ),
  };
}

function buildCard({title, description, href, anchor}, index) {
  return {
    _key: makeKey("card", title, index),
    _type: "card",
    title,
    description,
    href,
    anchor,
  };
}

function buildResearchSection(section, index) {
  return {
    _key: makeKey("research", section.anchor, index),
    _type: "researchSection",
    anchor: section.anchor,
    title: section.title,
    intro: section.intro,
    body: section.body,
    cards: section.cards.map((card, cardIndex) => buildCard(card, cardIndex)),
  };
}

function normalizeLinks(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;
      const label = stringValue(item.label);
      const url = stringValue(item.url);
      if (!label || !url) return null;

      return {
        _key: makeKey("link", label, index),
        _type: "link",
        label,
        url,
      };
    })
    .filter(Boolean);
}

function normalizeProjects(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;
      const title = stringValue(item.title);
      if (!title) return null;

      return {
        _key: makeKey("project", title, index),
        _type: "personProject",
        title,
        role: optionalString(item.role),
        period: optionalString(item.period),
        summary: optionalString(item.summary),
        link: optionalString(item.link),
      };
    })
    .filter(Boolean);
}

function normalizeSelectedPublications(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;
      const citation = stringValue(item.citation);
      if (!citation) return null;

      return {
        _key: makeKey("publication", citation, index),
        _type: "selectedPublication",
        citation,
        link: optionalString(item.link),
      };
    })
    .filter(Boolean);
}

function normalizeDate(value) {
  const date = stringValue(value);
  if (!date) return undefined;

  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return `${date}T00:00:00.000Z`;
  }

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractMarkdownSection(content, startHeading, endHeading) {
  if (!content) return "";
  const expression = new RegExp(
    `${escapeRegExp(startHeading)}\\s*\\n([\\s\\S]*?)${endHeading ? `\\n${escapeRegExp(endHeading)}` : "$"}`
  );
  const match = content.match(expression);
  if (!match) return "";
  return `${startHeading}\n\n${match[1].trim()}`.trim();
}

function buildPeopleDocs() {
  const dirPath = path.join(contentDir, "people");
  const files = readDirSafe(dirPath).filter((fileName) => /\.(md|mdx)$/i.test(fileName));

  return files.map((fileName) => {
    const slug = slugFromFilename(fileName);
    const filePath = path.join(dirPath, fileName);
    const {data, content} = readMatter(filePath);
    const highlights = stringArray(data.highlights);

    return {
      _id: `people.${slug}`,
      _type: "people",
      name: stringValue(data.name, slug),
      slug: {
        _type: "slug",
        current: slug,
      },
      role: stringValue(data.role),
      position: stringValue(data.role),
      category: stringValue(data.category, "Graduate"),
      email: optionalString(data.email),
      photoUrl: optionalString(data.photo),
      interests: stringArray(data.interests),
      links: normalizeLinks(data.links),
      order:
        data.order !== undefined && Number.isFinite(Number(data.order))
          ? Number(data.order)
          : undefined,
      highlights: highlights.length ? highlights : undefined,
      projects: normalizeProjects(data.projects),
      publications: normalizeSelectedPublications(data.publications),
      body: content,
    };
  });
}

function buildNewsDocs() {
  const dirPath = path.join(contentDir, "news");
  const files = readDirSafe(dirPath).filter((fileName) => /\.(md|mdx)$/i.test(fileName));

  return files.map((fileName) => {
    const slug = slugFromFilename(fileName);
    const filePath = path.join(dirPath, fileName);
    const {data, content} = readMatter(filePath);

    return {
      _id: `news.${slug}`,
      _type: "news",
      title: stringValue(data.title, slug),
      slug: {
        _type: "slug",
        current: slug,
      },
      publishedAt: normalizeDate(data.date),
      excerpt: stringValue(data.summary),
      tags: stringArray(data.tags),
      coverUrl: optionalString(data.cover),
      body: content,
    };
  });
}

function buildLegacyDoc(type, fileName, fallbackTitle) {
  const doc = readMarkdownFile(path.join("content", fileName));
  if (!doc) return null;

  return {
    _id: `${type}.content`,
    _type: type,
    title: stringValue(doc.data.title, fallbackTitle),
    body: doc.content,
  };
}

function buildSiteSettingsDoc() {
  return {
    _id: "siteSettings",
    _type: "siteSettings",
    name: "EMD Lab",
    longName: "Electric Machines and Drives Lab",
    institution: "Inha University, Department of Electrical Engineering",
    locale: "ko-KR",
    url: "https://example.com",
    description:
      "Electric Machines and Drives Lab at Inha University researches electric machines, drives, sensors, and electrified propulsion systems for e-mobility.",
    contactEmail: "gchoi@inha.ac.kr",
    addressKo:
      "인천광역시 미추홀구 인하로 100 인하대학교 하이테크센터 605호(교수 연구실) / 630호(학생 연구실)",
    addressEn:
      "Hi-Tech Building Rm. 605 (Professor) / Rm. 630 (Students), 100 Inha-ro, Michuhol-gu, Incheon 22212, Korea",
    navItems: [
      buildNavLink("Research", "/research", [], 0),
      buildNavLink("Projects", "/projects", [], 1),
      buildNavLink(
        "Publications",
        "/publications",
        [
          {label: "Journals", href: "/publications/journals"},
          {label: "Conferences", href: "/publications/conferences"},
          {label: "Patents", href: "/publications/patents"},
        ],
        2
      ),
      buildNavLink("People", "/people", [{label: "Alumni", href: "/alumni"}], 3),
      buildNavLink("News", "/news", [], 4),
      buildNavLink("Courses", "/courses", [], 5),
      buildNavLink("Contact", "/contact", [], 6),
    ],
    footerLinks: [
      buildCtaLink("News", "/news", "secondary", 0),
      buildCtaLink("People", "/people", "secondary", 1),
      buildCtaLink("Contact", "/contact", "secondary", 2),
    ],
    footerNote:
      "Research in electric machines, machine drives, sensors, and electrified mobility systems.",
  };
}

function buildHomePageDoc() {
  return {
    _id: "homePage",
    _type: "homePage",
    eyebrow: "Inha University, Department of Electrical Engineering",
    title: "Electric Machines and Drives Lab",
    description:
      "전기기기, 드라이브, 센서, e-모빌리티 전동화 시스템을 중심으로 설계, 해석, 제어, 검증까지 연결되는 연구를 수행합니다.",
    heroCtas: [
      buildCtaLink("Research 보기", "/research", "primary", 0),
      buildCtaLink("최신 소식", "/news", "secondary", 1),
      buildCtaLink("Join / Contact", "/contact", "secondary", 2),
    ],
    researchTitle: "Research Areas",
    researchIntro:
      "EMD Lab은 전기기기 설계부터 드라이브 제어, 센서, e-모빌리티 응용까지 연결된 연구 스택을 운영합니다.",
    researchCards: [
      buildCard(
        {
          title: "Electric Machines",
          description: "전동기 토폴로지, 전자기 해석, 열·구조·NVH, 고성능 설계를 다룹니다.",
          href: "/research#electric-machines",
        },
        0
      ),
      buildCard(
        {
          title: "Machine Drives",
          description: "인버터, 제어기, HIL 기반 구동 시스템 검증과 fault-tolerant drive를 다룹니다.",
          href: "/research#machine-drives",
        },
        1
      ),
      buildCard(
        {
          title: "Sensors",
          description: "구동 시스템용 위치 센서와 VR resolver 설계를 연구합니다.",
          href: "/research#sensors",
        },
        2
      ),
      buildCard(
        {
          title: "Mobility Applications",
          description: "EV powertrain, e-mobility traction systems, digital-twin 기반 시스템 분석을 수행합니다.",
          href: "/research#mobility",
        },
        3
      ),
    ],
    strengthsTitle: "Lab Strengths",
    strengthsIntro:
      "단일 부품 수준이 아니라 설계-해석-제어-시스템 검증까지 연결된 연구 프로세스를 갖춘 것이 연구실의 핵심 강점입니다.",
    strengths: [
      buildCard(
        {
          title: "End-to-end workflow",
          description:
            "전동기 설계, 전자기·열·구조 해석, 제어기 설계, HIL 및 실험 검증까지 한 흐름으로 다룹니다.",
        },
        0
      ),
      buildCard(
        {
          title: "E-mobility focus",
          description:
            "BEV, PHEV, FCEV와 personal mobility를 포함한 전동화 시스템 응용에 집중합니다.",
        },
        1
      ),
      buildCard(
        {
          title: "Multiphysics optimization",
          description:
            "전자기, 열, 구조, NVH를 함께 고려하는 surrogate-assisted optimization을 수행합니다.",
        },
        2
      ),
      buildCard(
        {
          title: "Industry-linked projects",
          description:
            "국책과제와 산학 프로젝트를 통해 실제 제약 조건을 반영한 연구를 진행합니다.",
        },
        3
      ),
    ],
    newsTitle: "Latest News",
    newsIntro: "최근 수상, 학회 발표, 연구실 공지와 주요 업데이트를 확인할 수 있습니다.",
    peopleTitle: "People",
    peopleIntro: "교수, 연구원, 대학원생, 학부연구생 등 현재 연구실 구성원을 소개합니다.",
    hiringTitle: "Join EMD Lab",
    hiringDescription:
      "모터, 드라이브, 전동화 시스템, 센서, 최적화 연구에 관심 있는 학생과 공동연구자를 모집합니다.",
    hiringCtas: [buildCtaLink("Contact / Join 안내", "/contact", "primary", 0)],
  };
}

function buildResearchPageDoc() {
  const sections = [
    {
      anchor: "electric-machines",
      title: "Electric Machines",
      intro:
        "고성능 traction motor와 특수 목적 전동기를 대상으로 설계, 해석, 최적화, NVH까지 통합적으로 연구합니다.",
      body: [
        "- High-performance machine topologies",
        "- Core loss, DC bias, PWM effects",
        "- Thermal, structural, NVH integrated analysis",
        "- Multi-objective and multiphysics optimization",
      ].join("\n"),
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
      body: [
        "- Coupled electromagnetic-circuit simulation",
        "- High-fidelity system simulation",
        "- Characterization and hardware integration",
        "- Fault diagnosis and tolerant control",
      ].join("\n"),
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
      body: [
        "- Variable reluctance resolver design",
        "- Sensitivity and tolerance analysis",
        "- Drive-system sensor integration",
      ].join("\n"),
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
      body: [
        "- EV powertrain modeling",
        "- Digital-twin based operation analysis",
        "- Transportation and grid integration",
        "- System databases for reuse",
      ].join("\n"),
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
  ];

  return {
    _id: "researchPage",
    _type: "researchPage",
    title: "Research",
    intro:
      "EMD Lab은 전기기기와 구동 시스템, 센서, e-모빌리티 응용을 연결해 이론과 실험을 함께 다루는 연구를 수행합니다.",
    sections: sections.map((section, index) => buildResearchSection(section, index)),
    closingTitle: "Related Content",
    closingBody:
      "연구분야와 연결된 프로젝트, 논문, 특허, 수업 정보도 Sanity Studio에서 함께 관리할 수 있습니다.",
    closingLinks: [
      buildCtaLink("Projects", "/projects", "primary", 0),
      buildCtaLink("Publications", "/publications", "secondary", 1),
      buildCtaLink("Courses", "/courses", "secondary", 2),
    ],
  };
}

function buildPageDoc({
  route,
  title,
  intro,
  eyebrow,
  cards = [],
  ctas = [],
  body = "",
  seoTitle,
  seoDescription,
}) {
  return {
    _id: `page.${route.replace(/\//g, "-")}`,
    _type: "page",
    title,
    route,
    eyebrow,
    intro,
    cards: cards.map((card, index) => buildCard(card, index)),
    ctas: ctas.map((cta, index) => buildCtaLink(cta.label, cta.href, cta.tone, index)),
    body,
    seoTitle,
    seoDescription,
  };
}

function buildGenericPageDocs() {
  const publications = readMarkdownFile(path.join("content", "publications.md"));
  const projects = readMarkdownFile(path.join("content", "projects.md"));
  const alumni = readMarkdownFile(path.join("content", "alumni.md"));
  const publicationsContent = publications?.content ?? "";

  return [
    buildPageDoc({
      route: "projects",
      title: "Projects",
      intro: "연구실에서 수행 중인 주요 국가과제와 산학 프로젝트를 관리합니다.",
      ctas: [{label: "Research", href: "/research", tone: "secondary"}],
      body: projects?.content ?? "",
    }),
    buildPageDoc({
      route: "publications",
      title: "Publications",
      intro: "저널, 학회, 특허를 개별 페이지로 나눠 관리할 수 있도록 구성했습니다.",
      cards: [
        {title: "Journals", description: "Selected journal papers", href: "/publications/journals"},
        {title: "Conferences", description: "Conference proceedings", href: "/publications/conferences"},
        {title: "Patents", description: "Domestic and international patents", href: "/publications/patents"},
      ],
      ctas: [{label: "Projects", href: "/projects", tone: "secondary"}],
      body: "",
    }),
    buildPageDoc({
      route: "publications/journals",
      title: "Journal Papers",
      intro: "연구실의 주요 저널 논문 목록입니다.",
      ctas: [{label: "Publications", href: "/publications", tone: "secondary"}],
      body: extractMarkdownSection(
        publicationsContent,
        "## Journal Papers (selected)",
        "## Conference Proceedings (selected)"
      ),
    }),
    buildPageDoc({
      route: "publications/conferences",
      title: "Conference Proceedings",
      intro: "연구실의 학회 발표 및 conference proceeding 목록입니다.",
      ctas: [{label: "Publications", href: "/publications", tone: "secondary"}],
      body: extractMarkdownSection(
        publicationsContent,
        "## Conference Proceedings (selected)"
      ),
    }),
    buildPageDoc({
      route: "publications/patents",
      title: "Patents",
      intro: "국내외 특허 및 출원 항목을 관리합니다.",
      ctas: [{label: "Publications", href: "/publications", tone: "secondary"}],
      body: [
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
    }),
    buildPageDoc({
      route: "courses",
      title: "Courses",
      intro: "연구실에서 담당한 주요 강의 이력을 학기별로 정리합니다.",
      ctas: [{label: "Contact", href: "/contact", tone: "secondary"}],
      body: [
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
    }),
    buildPageDoc({
      route: "contact",
      title: "Contact / Join",
      intro: "연구 참여와 공동연구 문의는 이메일로 연락할 수 있습니다.",
      ctas: [{label: "People", href: "/people", tone: "secondary"}],
      body: [
        "## Contact Guide",
        "",
        "- 관심 연구분야와 간단한 자기소개를 함께 보내 주세요.",
        "- 학부연구생은 가능한 활동 기간과 주당 가능 시간을 함께 적어 주세요.",
        "- 대학원 지원자는 관심 주제와 본인의 강점을 구체적으로 적어 주시면 검토가 수월합니다.",
      ].join("\n"),
    }),
    buildPageDoc({
      route: "alumni",
      title: "Alumni",
      intro: "연구실을 거쳐 간 졸업생과 alumni 정보를 정리합니다.",
      ctas: [{label: "People", href: "/people", tone: "secondary"}],
      body: alumni?.content ?? "",
    }),
  ];
}

const docs = [
  buildSiteSettingsDoc(),
  buildHomePageDoc(),
  buildResearchPageDoc(),
  ...buildGenericPageDocs(),
  ...buildPeopleDocs(),
  ...buildNewsDocs(),
  buildLegacyDoc("publication", "publications.md", "Publications"),
  buildLegacyDoc("project", "projects.md", "Projects"),
].filter(Boolean);

fs.mkdirSync(path.dirname(outputPath), {recursive: true});
fs.writeFileSync(outputPath, `${JSON.stringify(docs, null, 2)}\n`, "utf8");

console.log(`Wrote ${docs.length} Sanity documents to ${path.relative(rootDir, outputPath)}`);
