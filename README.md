
# EMD Lab Website (Next.js + Tailwind)

This is a modern, **fast**, and **easy-to-update** lab website starter that uses:

- **Next.js (App Router)** + **TypeScript**
- **Tailwind CSS** + Typography
- **Markdown content** for:
  - News posts
  - People profiles (with per-member portfolio sections)
  - Projects & Publications

> You can update content without touching code — just edit the Markdown files in `content/`.

---

## 1) Run locally

### Requirements
- Node.js 18+ (recommended 20+)

### Install & run
```bash
npm install
npm run dev
```

Open: http://localhost:3000

---

## 2) Update content (no code needed)

### News (with photos)
Create a new Markdown file in:
- `content/news/YYYY-MM-DD-some-title.md`

Frontmatter example:
```yaml
---
title: "Lab news title"
date: "2025-12-31"
summary: "One-line summary shown on the list page"
tags: ["Award", "Conference"]
cover: "/uploads/news/2025-12-31-cover.jpg"
---
```

Put images into:
- `public/uploads/news/`

Then reference them in Markdown:
```md
![caption](/uploads/news/2025-12-31-cover.jpg)
```

### People (each member can write their portfolio)
Each member has one file:
- `content/people/<slug>.md`

They can edit:
- name, role, interests, links, photo
- plus **portfolio content in the body** (projects, papers, talks, code links, etc.)

If `photo` is omitted, the site shows an **initial-based avatar** automatically.

---

## 3) “Edit this page” links (recommended)

Set your repository edit URL in `config/site.ts`:

```ts
repoEditBase: "https://github.com/<org>/<repo>/edit/main"
```

Then every People/News page shows an **Edit on GitHub** button so each member can update their own page in a browser.

---

## 4) Deploy (Vercel / Netlify)

### Vercel (simple)
1. Push this repo to GitHub.
2. Import in Vercel.
3. Done.

### Netlify (works great too)
Same flow: connect GitHub repo → deploy.

---

## Optional: CMS UI for non-technical updates

If you want a web admin UI (blog-like editor + image uploads), you can add **Decap CMS** later.
This starter is already structured so adding a CMS is straightforward.

---

## Folder structure

- `app/` – Next.js pages
- `components/` – UI building blocks
- `content/` – Markdown content
- `public/uploads/` – images uploaded for news/people
- `lib/` – Markdown loaders & helpers

---

## License
MIT


---

## 3) CMS (블로그처럼 /admin에서 글쓰기)

이 템플릿은 **Decap CMS**(구 Netlify CMS)를 포함합니다.

- 로컬 실행 중에도: http://localhost:3000/admin
- 배포 후에도: https://YOUR_DOMAIN/admin

### 가장 쉬운 운영 방법: Netlify 배포 + Identity 활성화

Decap CMS가 가장 간단히 동작하는 조합은 **Netlify + Identity + Git Gateway**입니다.

1) GitHub에 이 프로젝트 업로드 (main 브랜치)
2) Netlify에서 `New site from Git`로 연결
3) Site settings → **Identity** 활성화
4) Identity → **Git Gateway** 활성화
5) Identity → Invite users 로 연구실 구성원 이메일 초대
6) 이제 구성원은 `/admin`에서 뉴스/프로필을 블로그처럼 작성 가능

> Vercel도 배포는 쉽지만, CMS 로그인/권한까지 “가장” 쉽게 하려면 Netlify가 유리합니다.

---

## 4) 포트폴리오형 구성원 페이지

`content/people/*.md`의 frontmatter에 아래 필드를 추가하면,
오른쪽 사이드바에 **Highlights / Projects / Selected Publications** 카드가 자동 생성됩니다.

```yaml
highlights:
  - "IEEE TEVC 1저자 (2025)"
  - "AFPM 설계 자동화 파이프라인 구축"
projects:
  - title: "High-speed traction motor optimization"
    role: "Lead"
    period: "2024–"
    summary: "멀티피직스 최적화 및 검증"
    link: "https://..."
publications:
  - citation: "A. Author, "Paper title," IEEE Trans..., 2025."
    link: "https://doi.org/..."
```

---

## 5) 배포 (추천: Vercel / CMS 포함 운영: Netlify)

### Vercel (공개 사이트 빠르게)
- GitHub repo 생성 → 코드 푸시
- Vercel에서 Import → 자동 배포

### Netlify (CMS 포함 운영)
- GitHub repo 생성 → 코드 푸시
- Netlify에서 Import
- Identity + Git Gateway 활성화 (위 CMS 섹션 참고)
