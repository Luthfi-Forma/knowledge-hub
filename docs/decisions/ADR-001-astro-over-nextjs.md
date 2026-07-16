# ADR-001: Astro menggantikan Next.js untuk situs konten knowledge-hub

Status: Accepted
Date: 2026-07-16

## Context

Default stack OS untuk `web-app` adalah Next.js + TypeScript + Tailwind
(`standards/architecture/technology-selection.md`). knowledge-hub adalah situs
yang hampir seluruhnya konten statis (MDX) dengan kebutuhan inti: frontmatter
tervalidasi, taxonomy tag/type, dan performa baca. Interaktivitas client-side
minimal (filter, search). User sudah menguasai Next.js dari 4 proyek lain, tapi
Next.js membawa runtime React ke setiap halaman untuk situs yang tidak
membutuhkannya, dan validasi konten harus dirakit sendiri (tooling pihak ketiga
seperti contentlayer tidak lagi terawat).

## Decision

1. knowledge-hub dibangun dengan **Astro** + Tailwind CSS + MDX.
2. Konten dikelola sebagai **content collections** Astro dengan schema zod —
   frontmatter invalid menggagalkan build.
3. Deploy tetap **Vercel** (adapter Astro resmi).
4. Interaktivitas ditambahkan per-komponen (Astro islands) hanya bila terbukti
   perlu; default zero-JS.

## Rationale

- **Content collections bawaan** dengan validasi zod adalah kebutuhan inti #1
  proyek ini — di Astro fitur first-class, di Next.js harus dirakit sendiri.
- **Zero-JS default** → performa dan Lighthouse ≥ 90 (success criteria BRIEF)
  tercapai tanpa usaha ekstra.
- **MDX first-class** untuk artikel/case study.
- Kriteria tetap: complexity (lebih rendah untuk situs konten), solo-operability
  (setara), cost (setara, free tier), reversibility (tinggi — konten MDX +
  frontmatter portabel ke Next.js/framework lain kapan pun).

## Alternatives considered

- **Next.js + MDX (default OS)** — sudah dikuasai user, tapi validasi konten dan
  taxonomy harus dirakit manual; React runtime tak diperlukan situs statis.
  Ditolak: lebih banyak kode infrastruktur untuk hasil sama.
- **Plain HTML/CSS/JS (static-site, seperti portfolio lama)** — sudah terbukti
  tidak scale: tiap konten baru = edit HTML manual. Ditolak.
- **Platform deploy alternatif** (dipertimbangkan atas pertanyaan user):
  **Cloudflare Pages** (bandwidth unlimited gratis, tapi platform baru lagi dan
  image optimization berbayar), **Netlify** (setara Vercel, tanpa keunggulan
  berarti), **GitHub Pages** (statis murni — menutup pintu serverless untuk
  fitur v2, tanpa preview deploy). Ditolak demi konsistensi dengan proyek lain
  yang sudah di Vercel; situs statis mudah dipindah bila kelak perlu.

## Consequences

- (+) Schema konten enforced sejak hari pertama; menambah post = menambah file MDX.
- (+) Performa default tinggi tanpa tuning.
- (−) Satu teknologi baru untuk dipelajari (Astro) — dimitigasi: konsep
  (komponen, routing berbasis file, Tailwind) mirip Next.js.
- (−) Pengetahuan `knowledge/react-nextjs.md` OS tidak langsung berlaku; gotcha
  Astro dicatat di `docs/memory/LESSONS.md` dan di-harvest ke OS.
- Follow-up: baris `knowledge/react-nextjs.md` di CLAUDE.md proyek tidak relevan
  penuh — deviasi dicatat di `docs/RULES.md`.
