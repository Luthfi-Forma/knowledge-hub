import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from 'recharts';
import StoryStage from '../../islands/StoryStage';
import type { StageState } from '../../components/story/types';
import Chart from '../../components/story/viz/Chart';
import DataTable from '../../components/story/viz/DataTable';
import Legend from '../../components/story/viz/Legend';
import { CHART_1, CHART_2, MUTED, NEUTRAL, tooltipStyle, VIZ_DURATION_MS } from '../../components/story/viz/theme';

/*
 * Visuals for src/content/posts/jabung-lampung-coastal-development.mdx
 * (M10/T-79 — first post migrated to the story framework, ADR-005).
 *
 * The prose that used to live here is now in the MDX body, where it is real
 * markdown that Pagefind indexes as content and that can be edited without
 * touching TypeScript. What stays is what genuinely is code: the figures and
 * the drawings made from them.
 *
 * Figures are read directly from Bappeda Lampung Timur's "Penyusunan Wilayah
 * Jabung dan Kawasan Pesisir Kabupaten Lampung Timur" (Laporan Akhir, 2024).
 * Correction carried over from the previous version of this post: the
 * report's actual method is a Skalogram settlement-hierarchy analysis
 * (Bab IV.2) plus SWOT (IV.4) — the word "gravitasi"/"gravity" does not
 * appear anywhere in the 93-page report; the "gravity model" description on
 * the original post was inaccurate and was replaced.
 *
 * Every visual takes `reduceMotion` from its props rather than calling
 * `useReducedMotion()` (ADR-005 #4): the stage resolves it once and passes it
 * down, so it cannot be forgotten in a new visual and can be tested by
 * flipping a single value.
 */

const KECAMATAN = [
  'Way Jepara', 'Labuhan Maringgai', 'Sekampung Udik', 'Pasir Sakti', 'Mataram Baru',
  'Jabung', 'Waway Karya', 'Marga Sekampung', 'Bandar Sribhawono', 'Melinting', 'Gunung Pelindung', 'Braja Selebah',
];

const RTRW_TIERS = [
  { code: 'PKL', label: 'Pusat Kegiatan Lokal', desc: 'Labuhan Maringgai' },
  { code: 'PKLp', label: 'Pusat Kegiatan Lokal Promosi', desc: 'Sekampung Udik, Bandar Sribhawono, Jabung, Pasir Sakti' },
  { code: 'PPK', label: 'Pusat Pelayanan Kawasan', desc: 'Melinting, Gunung Pelindung, Mataram Baru, Marga Sekampung' },
  { code: 'PPL', label: 'Pusat Pelayanan Lingkungan', desc: 'Waway Karya' },
];

const CAPITAL_CANDIDATES = [
  { name: 'Way Jepara', hierarchy: 'Hierarki 1', ipd: 32.73, facilities: 13 },
  { name: 'Labuhan Maringgai', hierarchy: 'Hierarki 2', ipd: 26.61, facilities: 17 },
];

const HIERARCHY_TIERS = [
  { name: 'Main growth pole', value: 1 },
  { name: 'Secondary growth pole', value: 4 },
  { name: 'Hinterland area', value: 7 },
];

const SCENARIOS = [
  { name: 'Optimistic', kawasan: 100, infrastruktur: 100 },
  { name: 'Moderate', kawasan: 80, infrastruktur: 80 },
  { name: 'Pessimistic', kawasan: 50, infrastruktur: 50 },
];

const TIER_COLORS = [CHART_1, CHART_2, NEUTRAL];

function VizIntro({ reduceMotion }: StageState) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6">
      <div className="text-5xl font-semibold" style={{ color: CHART_1 }}>12</div>
      <div className="text-ink-muted mt-2 text-xs tracking-[0.25em] uppercase">kecamatan, one planning area</div>
      <div className="mt-8 grid grid-cols-4 gap-2">
        {KECAMATAN.map((n, i) => (
          <motion.div
            key={n}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: reduceMotion ? 0 : i * 0.05, duration: reduceMotion ? 0 : 0.4 }}
            className="text-ink-muted flex h-14 w-20 items-center justify-center px-1 text-center text-[9px] leading-tight"
            style={{
              background: n === 'Way Jepara' ? CHART_1 : NEUTRAL,
              color: n === 'Way Jepara' ? 'var(--color-paper)' : undefined,
            }}
          >
            {n}
          </motion.div>
        ))}
      </div>
      <div className="text-ink-muted mt-3 text-[10px] tracking-widest uppercase">
        Ek Jabung–Ek Labuhan Maringgai, Lampung Timur
      </div>
    </div>
  );
}

function VizProblem({ reduceMotion }: StageState) {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-3 p-6">
      {RTRW_TIERS.map((t, i) => (
        <motion.div
          key={t.code}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: reduceMotion ? 0 : i * 0.1, duration: reduceMotion ? 0 : 0.4 }}
          className="border-line bg-paper border px-4 py-2.5"
        >
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-xs font-semibold" style={{ color: CHART_1 }}>{t.code}</span>
            <span className="text-ink text-xs">{t.label}</span>
          </div>
          <div className="text-ink-muted mt-1 text-[11px]">{t.desc}</div>
        </motion.div>
      ))}
      <div className="text-ink-muted mt-2 text-center text-[10px] italic">
        Four RTRW tiers, but which one is actually fit to lead growth?
      </div>
    </div>
  );
}

function VizMethod({ reduceMotion }: StageState) {
  const steps = ['19 facility & service indicators', 'Weighting per kecamatan', 'Skalogram score', 'Hierarki 1 / 2 / 3'];
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6">
      {steps.map((s, i) => (
        <motion.div
          key={s}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduceMotion ? 0 : i * 0.15, duration: reduceMotion ? 0 : 0.4 }}
          className="w-full max-w-xs"
        >
          <div
            className="border px-4 py-2.5 text-center text-xs"
            style={
              i === steps.length - 1
                ? { borderColor: CHART_1, color: CHART_1, fontWeight: 500 }
                : { borderColor: 'var(--color-line)', color: 'var(--color-ink-muted)' }
            }
          >
            {s}
          </div>
          {i < steps.length - 1 && <div className="mx-auto h-4 w-px" style={{ background: 'var(--color-line)' }} />}
        </motion.div>
      ))}
    </div>
  );
}

function VizFinding1({ reduceMotion }: StageState) {
  return (
    <Chart
      label="Capital candidates: IPD score & facility-type count (of 19)"
      legend={[
        { label: 'IPD score', color: CHART_1 },
        { label: 'Facility types', color: CHART_2 },
      ]}
      table={{
        caption: 'Capital candidates: IPD score and facility-type count (of 19)',
        columns: ['Kecamatan', 'IPD score', 'Facility types (/19)'],
        rows: CAPITAL_CANDIDATES.map((d) => [d.name, d.ipd, d.facilities]),
      }}
    >
      <BarChart data={CAPITAL_CANDIDATES} margin={{ left: 0, right: 20, top: 10, bottom: 10 }}>
        <XAxis dataKey="name" stroke={MUTED} tick={{ fill: 'var(--color-ink)', fontSize: 11 }} />
        <YAxis stroke={MUTED} tick={{ fill: MUTED, fontSize: 10 }} />
        <Tooltip cursor={{ fill: 'var(--color-line)' }} contentStyle={tooltipStyle} />
        <Bar dataKey="ipd" name="IPD score" fill={CHART_1} animationDuration={VIZ_DURATION_MS} isAnimationActive={!reduceMotion} />
        <Bar dataKey="facilities" name="Facility types (/19)" fill={CHART_2} animationDuration={VIZ_DURATION_MS} isAnimationActive={!reduceMotion} />
      </BarChart>
    </Chart>
  );
}

/*
 * Not wrapped in <Chart>: this one centres a fixed-height donut rather than
 * filling the panel, and its legend spells out the count per tier instead of
 * naming a series. Forcing it into the wrapper would change how it sits on
 * the page, which a migration should not do — so it composes DataTable and
 * Legend directly and keeps its own layout.
 */
function VizFinding2({ reduceMotion }: StageState) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6">
      <div aria-hidden="true">
        <PieChart width={240} height={180}>
          <Pie
            data={HIERARCHY_TIERS}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={75}
            paddingAngle={2}
            isAnimationActive={!reduceMotion}
          >
            {HIERARCHY_TIERS.map((_, i) => (
              <Cell key={i} fill={TIER_COLORS[i]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
        </PieChart>
      </div>
      <DataTable
        caption="Settlement hierarchy tiers, 12 kecamatan"
        columns={['Tier', 'Kecamatan']}
        rows={HIERARCHY_TIERS.map((t) => [t.name, t.value])}
      />
      <Legend
        layout="stacked"
        items={HIERARCHY_TIERS.map((t, i) => ({
          label: `${t.name} · ${t.value} kecamatan`,
          color: TIER_COLORS[i],
        }))}
      />
    </div>
  );
}

function VizFinding3({ reduceMotion }: StageState) {
  const zones = [
    { label: 'Agropolitan', place: 'Bandar Sribhawono', items: ['Corn', 'Cassava', 'Rice', 'Rubber', 'Palm oil'], note: 'Feeder Road corridor' },
    { label: 'Minapolitan', place: 'Labuhan Maringgai + Pasir Sakti', items: ['Pel. Maringgai', 'Pel. Way Penet', 'Pel. Way Sekampung'], note: 'Crab processing' },
  ];
  return (
    <div className="flex h-full w-full items-center justify-around gap-4 p-6">
      {zones.map((z, i) => (
        <motion.div
          key={z.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduceMotion ? 0 : i * 0.15, duration: reduceMotion ? 0 : 0.4 }}
          className="border-line bg-paper flex flex-1 flex-col items-center gap-2 border px-4 py-5 text-center"
        >
          <div className="text-xs font-medium tracking-widest uppercase" style={{ color: CHART_1 }}>{z.label}</div>
          <div className="text-ink text-sm">{z.place}</div>
          <div className="mt-1 flex flex-wrap justify-center gap-1">
            {z.items.map((it) => (
              <span key={it} className="border-line text-ink-muted border px-1.5 py-0.5 text-[10px]">{it}</span>
            ))}
          </div>
          <div className="text-ink-muted mt-1 text-[10px] italic">{z.note}</div>
        </motion.div>
      ))}
    </div>
  );
}

function VizConclusion({ reduceMotion }: StageState) {
  return (
    <Chart
      label="Three planning scenarios: % final achievement"
      legend={[
        { label: 'Area', color: CHART_1 },
        { label: 'Infrastructure', color: CHART_2 },
      ]}
      table={{
        caption: 'Planning scenarios: % final achievement',
        columns: ['Scenario', 'Area development', 'Infrastructure development'],
        rows: SCENARIOS.map((s) => [s.name, `${s.kawasan}%`, `${s.infrastruktur}%`]),
      }}
    >
      <BarChart data={SCENARIOS} margin={{ left: 0, right: 20, top: 10, bottom: 10 }}>
        <XAxis dataKey="name" stroke={MUTED} tick={{ fill: 'var(--color-ink)', fontSize: 11 }} />
        <YAxis stroke={MUTED} tick={{ fill: MUTED, fontSize: 10 }} unit="%" />
        <Tooltip cursor={{ fill: 'var(--color-line)' }} contentStyle={tooltipStyle} />
        <Bar dataKey="kawasan" name="Area development" fill={CHART_1} animationDuration={VIZ_DURATION_MS} isAnimationActive={!reduceMotion} />
        <Bar dataKey="infrastruktur" name="Infrastructure development" fill={CHART_2} animationDuration={VIZ_DURATION_MS} isAnimationActive={!reduceMotion} />
      </BarChart>
    </Chart>
  );
}

export default function JabungStage(props: {
  sceneIds: string[];
  vizCitations?: Record<string, { fig: string; source: string }>;
}) {
  return (
    <StoryStage
      {...props}
      visual={{
        kind: 'per-scene',
        viz: {
          intro: VizIntro,
          problem: VizProblem,
          method: VizMethod,
          finding1: VizFinding1,
          finding2: VizFinding2,
          finding3: VizFinding3,
          conclusion: VizConclusion,
        },
      }}
    />
  );
}
