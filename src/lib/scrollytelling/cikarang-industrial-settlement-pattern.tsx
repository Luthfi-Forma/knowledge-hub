import { useEffect, useState, type ComponentType } from 'react';
import { motion } from 'motion/react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import Scrollytelling, { type ScrollytellingSection } from '../../islands/Scrollytelling';

/*
 * Bespoke data + viz for one post (src/content/posts/cikarang-industrial-
 * settlement-pattern.mdx). Figures are drawn directly from the published
 * paper this post now cites: Rahman, Y. & Hernanda, A. L. (2025). Spatial
 * Analysis of Industrial and Residential Growth Patterns in Cikarang,
 * Bekasi (2016 – 2023). Jurnal Tunas Geografi, Institut Teknologi Sumatera.
 * There's no generic auto-chart system — a new scrollytelling post gets its
 * own file like this one, reusing only the Scrollytelling shell.
 *
 * This module's default export is the whole wired-up island: Astro can only
 * hydrate a component with JSON-serializable props, and `viz` is a map of
 * component functions — so the section/viz data can't be passed in from
 * `.astro` frontmatter as props. Instead this file wires Scrollytelling +
 * its own data internally and exports one ready-to-mount component; the
 * post page just does `<CikarangIndustrialSettlementScrollytelling
 * client:visible />`.
 */

const IND = 'var(--color-chart-1)';
const RES = 'var(--color-chart-2)';
const MUTED = 'var(--color-ink-muted)';

// Total land use, hectares — Table 1
const TOTAL_LAND = {
  industry: { 2016: 4477.99, 2023: 5570.68 },
  residential: { 2016: 6236.05, 2023: 7328.73 },
};

// Total buildings — Table 2
const TOTAL_BUILDINGS_GROWTH = [
  { name: 'Industrial', land: 15.35, buildings: 50.26 },
  { name: 'Residential', land: 9.99, buildings: 61.94 },
];

// Land use by district, 2023 (hectares) — Table 1
const LAND_BY_DISTRICT_2023 = [
  { name: 'Cikarang Barat', industry: 1825.43, residential: 1572.13 },
  { name: 'Cikarang Utara', industry: 889.79, residential: 1430.69 },
  { name: 'Cikarang Timur', industry: 158.42, residential: 1052.25 },
  { name: 'Cikarang Selatan', industry: 1200.3, residential: 1875.2 },
  { name: 'Cikarang Pusat', industry: 1092.49, residential: 929.07 },
];

// District growth deltas (hectares), 2016 → 2023 — Table 1
const DISTRICT_GROWTH = [
  { name: 'Cikarang Pusat', indDelta: 285.83, resDelta: 72.53 },
  { name: 'Cikarang Barat', indDelta: 218.54, resDelta: 139.26 },
  { name: 'Cikarang Utara', indDelta: 103.24, resDelta: 115.91 },
  { name: 'Cikarang Selatan', indDelta: 64.65, resDelta: 205.26 },
  { name: 'Cikarang Timur', indDelta: 15.18, resDelta: 89.95 },
].sort((a, b) => b.indDelta + b.resDelta - (a.indDelta + a.resDelta));

// Two-phase temporal shift (hectares added) — body text, Temporal Pattern
const PHASES = [
  { phase: '2016 – 2019', industry: 259.05, residential: 323.13 },
  { phase: '2019 – 2023', industry: 428.39, residential: 299.77 },
];

function AnimatedNumber({ value, decimals = 0, suffix = '' }: { value: number; decimals?: number; suffix?: string }) {
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    const start = display;
    const startTime = performance.now();
    const dur = 800;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - startTime) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(start + (value - start) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return (
    <span className="tabular-nums">
      {display.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

function Legend() {
  return (
    <div className="mt-3 flex items-center gap-5 text-xs text-ink-muted">
      <span className="flex items-center gap-2">
        <span className="h-2.5 w-2.5" style={{ background: IND }} />
        Industrial
      </span>
      <span className="flex items-center gap-2">
        <span className="h-2.5 w-2.5" style={{ background: RES }} />
        Residential
      </span>
    </div>
  );
}

const tooltipStyle = {
  background: 'var(--color-paper)',
  border: '1px solid var(--color-line)',
  borderRadius: 2,
  color: 'var(--color-ink)',
};

function VizIntro() {
  const tiles = Array.from({ length: 40 });
  const factory = new Set([9, 10, 11, 17, 18, 19, 25, 26]);
  const home = new Set([31, 32, 33, 38, 39]);
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <div className="grid grid-cols-8 gap-1.5 p-8">
        {tiles.map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.015, duration: 0.4 }}
            className="h-7 w-7"
            style={{
              background: factory.has(i) ? IND : home.has(i) ? RES : 'var(--color-line)',
            }}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-5 text-center text-[10px] tracking-[0.3em] text-ink-muted uppercase">
        Each tile ≈ one hectare of Cikarang
      </div>
    </div>
  );
}

function VizProblem() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <svg viewBox="0 0 400 320" className="h-full max-h-[380px] w-full max-w-[380px]">
        <rect x="150" y="110" width="100" height="100" fill="none" stroke={MUTED} strokeDasharray="4 4" />
        <motion.circle
          cx="80"
          cy="160"
          r="40"
          fill={IND}
          animate={{ cx: [80, 105, 80] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.circle
          cx="320"
          cy="160"
          r="40"
          fill={RES}
          animate={{ cx: [320, 295, 320] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <text x="80" y="225" textAnchor="middle" fill={IND} fontSize="12" letterSpacing="2">
          INDUSTRY
        </text>
        <text x="320" y="225" textAnchor="middle" fill={RES} fontSize="12" letterSpacing="2">
          HOMES
        </text>
        <text x="200" y="100" textAnchor="middle" fill={MUTED} fontSize="11" letterSpacing="2">
          ONE PARCEL
        </text>
      </svg>
    </div>
  );
}

function VizFinding1() {
  const data = [
    { name: 'Industrial', 2016: TOTAL_LAND.industry[2016], 2023: TOTAL_LAND.industry[2023], fill: IND },
    { name: 'Residential', 2016: TOTAL_LAND.residential[2016], 2023: TOTAL_LAND.residential[2023], fill: RES },
  ];
  return (
    <div className="flex h-full w-full flex-col p-4">
      <div className="mb-3 text-sm text-ink-muted">Hectares of land use, 2016 vs. 2023</div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 40, top: 10, bottom: 10 }}>
            <XAxis type="number" stroke={MUTED} tick={{ fill: MUTED, fontSize: 11 }} />
            <YAxis type="category" dataKey="name" stroke={MUTED} tick={{ fill: 'var(--color-ink)', fontSize: 13 }} width={90} />
            <Tooltip cursor={{ fill: 'var(--color-line)' }} contentStyle={tooltipStyle} />
            <Bar dataKey="2016" fill={MUTED} animationDuration={800} />
            <Bar dataKey="2023" animationDuration={1000}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-4 border-t border-line pt-3 text-sm">
        <div>
          <div className="text-2xl font-semibold" style={{ color: IND }}>
            +<AnimatedNumber value={687.45} decimals={2} /> ha
          </div>
          <div className="text-xs text-ink-muted">industrial land added</div>
        </div>
        <div>
          <div className="text-2xl font-semibold" style={{ color: RES }}>
            +<AnimatedNumber value={622.9} decimals={2} /> ha
          </div>
          <div className="text-xs text-ink-muted">residential land added</div>
        </div>
      </div>
    </div>
  );
}

function VizFinding2() {
  return (
    <div className="flex h-full w-full flex-col p-4">
      <div className="mb-3 text-sm text-ink-muted">Hectares added per district, 2016 – 2023</div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={DISTRICT_GROWTH} margin={{ left: 0, right: 20, top: 10, bottom: 40 }}>
            <XAxis
              dataKey="name"
              stroke={MUTED}
              tick={{ fill: 'var(--color-ink)', fontSize: 10 }}
              angle={-20}
              textAnchor="end"
              interval={0}
            />
            <YAxis stroke={MUTED} tick={{ fill: MUTED, fontSize: 11 }} />
            <Tooltip cursor={{ fill: 'var(--color-line)' }} contentStyle={tooltipStyle} />
            <Bar dataKey="indDelta" name="Industry" fill={IND} animationDuration={900} />
            <Bar dataKey="resDelta" name="Residential" fill={RES} animationDuration={900} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Legend />
    </div>
  );
}

function VizFinding3() {
  return (
    <div className="flex h-full w-full flex-col p-4">
      <div className="mb-3 text-sm text-ink-muted">Hectares added per phase — watch the lines cross</div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={PHASES} margin={{ left: 10, right: 30, top: 20, bottom: 20 }}>
            <CartesianGrid stroke="var(--color-line)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="phase" stroke={MUTED} tick={{ fill: 'var(--color-ink)', fontSize: 12 }} />
            <YAxis stroke={MUTED} tick={{ fill: MUTED, fontSize: 11 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="industry" stroke={IND} strokeWidth={3} dot={{ r: 6, fill: IND }} animationDuration={1200} />
            <Line
              type="monotone"
              dataKey="residential"
              stroke={RES}
              strokeWidth={3}
              dot={{ r: 6, fill: RES }}
              animationDuration={1200}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Legend />
    </div>
  );
}

function VizFinding4() {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-8 p-6">
      <div className="text-sm text-ink-muted">Growth 2016 → 2023 — land vs. buildings</div>
      {TOTAL_BUILDINGS_GROWTH.map((r) => (
        <div key={r.name} className="space-y-2">
          <div className="text-sm font-medium" style={{ color: r.name === 'Industrial' ? IND : RES }}>
            {r.name}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="w-16 text-xs text-ink-muted">Land</div>
              <div className="relative h-3 flex-1 overflow-hidden bg-line/60">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${r.land}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full"
                  style={{ background: r.name === 'Industrial' ? IND : RES, opacity: 0.55 }}
                />
              </div>
              <div className="w-14 text-right text-sm tabular-nums" style={{ color: r.name === 'Industrial' ? IND : RES }}>
                +{r.land}%
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-16 text-xs text-ink-muted">Buildings</div>
              <div className="relative h-3 flex-1 overflow-hidden bg-line/60">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${r.buildings}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: 0.15 }}
                  className="h-full"
                  style={{ background: r.name === 'Industrial' ? IND : RES }}
                />
              </div>
              <div
                className="w-14 text-right text-sm font-semibold tabular-nums"
                style={{ color: r.name === 'Industrial' ? IND : RES }}
              >
                +{r.buildings}%
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="border border-line bg-paper p-3 text-xs leading-relaxed text-ink-muted">
        Buildings grow ~3–6× faster than land — Cikarang is densifying, not just spreading.
      </div>
    </div>
  );
}

function VizConclusion() {
  const data = LAND_BY_DISTRICT_2023.map((d) => ({ ...d, name: d.name.replace('Cikarang ', '') }));
  return (
    <div className="flex h-full w-full flex-col p-4">
      <div className="mb-3 text-sm text-ink-muted">Land use footprint by district, 2023 (ha)</div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: 0, right: 20, top: 10, bottom: 30 }}>
            <XAxis dataKey="name" stroke={MUTED} tick={{ fill: 'var(--color-ink)', fontSize: 11 }} />
            <YAxis stroke={MUTED} tick={{ fill: MUTED, fontSize: 11 }} />
            <Tooltip cursor={{ fill: 'var(--color-line)' }} contentStyle={tooltipStyle} />
            <Bar dataKey="industry" stackId="a" fill={IND} animationDuration={900} />
            <Bar dataKey="residential" stackId="a" fill={RES} animationDuration={900} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Legend />
    </div>
  );
}

const viz: Record<string, ComponentType> = {
  intro: VizIntro,
  problem: VizProblem,
  finding1: VizFinding1,
  finding2: VizFinding2,
  finding3: VizFinding3,
  finding4: VizFinding4,
  conclusion: VizConclusion,
};

const sections: ScrollytellingSection[] = [
  {
    id: 'intro',
    kicker: 'Setting the scene',
    title: 'Cikarang is one parcel of land with two things growing on it at once.',
    body: 'Between 2016 and 2023, Cikarang added both factory floor and family homes — often on the same stretch of ground, with very little formal separation between them. This is the same corridor the thesis above studied at the building level; this section walks through the province-scale numbers behind it, drawn from the published paper.',
    citations: [
      { label: 'Rahman & Hernanda (2025)', where: 'Abstract, p. 1' },
    ],
  },
  {
    id: 'problem',
    kicker: 'The tension',
    title: 'Industry and housing are both expanding into the same limited ground.',
    body: 'Neither land use is static, and neither is contained. Industrial estates push outward for logistics access; residential growth follows the jobs those estates create. Where the two fronts meet is exactly where the earlier building-level analysis found the most friction.',
    citations: [{ label: 'Rahman & Hernanda (2025)', where: 'Introduction ¶4–5, p. 2' }],
  },
  {
    id: 'finding1',
    kicker: 'Finding 01',
    title: 'Industrial land grew faster than residential land — by hectares, not just percent.',
    body: 'Industrial land use rose from 4,477.99 to 5,570.68 hectares — an addition of 687.45 hectares. Residential land grew by 622.9 hectares over the same period, from 6,236.05 to 7,328.73 hectares. Industry starts from a smaller base but adds more raw ground.',
    citations: [{ label: 'Table 1', where: 'Land Use Change Analysis, p. 5' }],
    vizCitation: { fig: 'Table 1 · sub-totals', source: 'Land Use Change Analysis, p. 5' },
  },
  {
    id: 'finding2',
    kicker: 'Finding 02',
    title: "Growth isn't even across Cikarang's five districts.",
    body: 'Cikarang Pusat added the most industrial land (285.83 ha) while Cikarang Selatan added the most residential land (205.26 ha) — the two fastest-growing districts are growing in opposite directions, which is exactly the kind of divergence a district-blind average would hide.',
    citations: [{ label: 'Table 1', where: 'Industrial/Residential Land Use by District, pp. 5–6' }],
    vizCitation: { fig: 'Table 1 · district deltas', source: 'Industrial/Residential Land Use by District, pp. 5–6' },
  },
  {
    id: 'finding3',
    kicker: 'Finding 03',
    title: 'The pace of growth flipped between the two study periods.',
    body: 'From 2016–2019, residential land (323.13 ha) grew faster than industrial land (259.05 ha). From 2019–2023, industry overtook it — 428.39 ha of industrial growth against 299.77 ha of residential growth. Industrial expansion accelerated in the second period; residential growth slowed.',
    citations: [{ label: 'Body text', where: 'Temporal Pattern (2016-2019 vs 2019-2023), p. 7' }],
    vizCitation: { fig: 'Body text · temporal split', source: 'Temporal Pattern (2016-2019 vs 2019-2023), p. 7' },
  },
  {
    id: 'finding4',
    kicker: 'Finding 04',
    title: 'Cikarang is densifying, not just spreading.',
    body: 'Land use grew 15.35% for industry and 9.99% for residential — but building counts grew 50.26% and 61.94% respectively. Buildings are appearing 3–6× faster than the land under them, meaning both new construction on already-classified land and finer subdivision are doing more of the work than outright expansion.',
    citations: [{ label: 'Table 2', where: 'Building Growth Analysis, pp. 8–9' }],
    vizCitation: { fig: 'Table 2 · overall growth', source: 'Building Growth Analysis, pp. 8–9' },
  },
  {
    id: 'conclusion',
    kicker: 'Where this leads',
    title: 'The 2023 footprint is the map a spatial plan has to work with now.',
    body: "This is the same overlap the building-level thesis above flags for buffer requirements and zoning revision — except now it's measured province-scale, across seven years, with numbers a planning document can cite directly. Cikarang Pusat and Cikarang Selatan are the districts where that revision is most overdue.",
    citations: [{ label: 'Table 1', where: '2023 composition, discussed pp. 13–17' }],
    vizCitation: { fig: 'Table 1 · 2023 composition', source: 'Discussion & Conclusion, pp. 13–17' },
  },
];

export default function CikarangIndustrialSettlementScrollytelling() {
  return (
    <Scrollytelling
      eyebrow="A data-driven reading of the published paper"
      title={
        <>
          Two land uses, <em className="text-accent not-italic">one corridor</em>.
        </>
      }
      dek="How Cikarang added 687 hectares of factory and 623 hectares of home in seven years — mapped, counted, and re-told from the published paper."
      meta="Cikarang · Bekasi · 2016 – 2023"
      sections={sections}
      viz={viz}
      sourceCitation={
        <>
          <div className="text-xs tracking-[0.25em] text-accent uppercase">Paper</div>
          <p className="mt-2 text-ink">Rahman, Y. &amp; Hernanda, A. L. (2025).</p>
          <p className="italic">
            Spatial Analysis of Industrial and Residential Growth Patterns in Cikarang, Bekasi (2016 – 2023).
          </p>
          <p className="mt-1 text-xs">Jurnal Tunas Geografi · Institut Teknologi Sumatera.</p>
        </>
      }
    />
  );
}
