import { motion } from 'motion/react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from 'recharts';
import StoryStage from '../../islands/StoryStage';
import type { StageState } from '../../components/story/types';
import AnimatedNumber from '../../components/story/viz/AnimatedNumber';
import DataTable from '../../components/story/viz/DataTable';
import Legend from '../../components/story/viz/Legend';
import { CHART_1, CHART_2, MUTED, NEUTRAL, tooltipStyle, VIZ_DURATION_MS } from '../../components/story/viz/theme';

/*
 * Visuals for src/content/posts/rpplh-south-papua.mdx (M10/T-79, ADR-005).
 * Prose now lives in the MDX body.
 *
 * Figures are read directly from "Draft Materi Teknis RPPLH Provinsi Papua
 * Selatan" (Merauke, August 2024) — the draft technical RPPLH document. All
 * figures are aggregate/spatial (hectares, percentages, counts) already
 * present in the source deck.
 *
 * Arithmetic re-checked at migration (T-79), after T-78 found a live post
 * whose figures contradicted each other. Everything the prose claims holds:
 * class-4 food service is 74.63% of the study area and class-5 biodiversity
 * is 67.88%, both exact; the seven cultural-space categories sum to
 * 471,026.19 ha with the three named ones matching to the hectare; village
 * statuses sum to 125; and the road figures reconcile (5 + 135 = 140 km).
 *
 * One benign discrepancy, checked so nobody re-investigates it: the two
 * ecosystem-service tables total 2,297,698.43 and 2,297,698.44 ha — a 0.01 ha
 * difference, i.e. rounding in the source classification, not a conflict.
 */

const FE_DISTRICTS = ['Merauke', 'Tanah Miring', 'Semangga', 'Kurik', 'Janggebob', 'Malind'];

// Food-provisioning ecosystem-service score (class 1-5), total 2,297,698.43 ha
const FOOD_SERVICE = [
  { name: 'Class 1', value: 767.69 },
  { name: 'Class 2', value: 225494.1 },
  { name: 'Class 3', value: 244335.32 },
  { name: 'Class 4', value: 1714672.51 },
  { name: 'Class 5', value: 112428.81 },
];
// Biodiversity/habitat-support ecosystem-service score (class 1-5), same total area
const KEHATI_SERVICE = [
  { name: 'Class 1', value: 3485.62 },
  { name: 'Class 2', value: 411005.45 },
  { name: 'Class 3', value: 266760.44 },
  { name: 'Class 4', value: 56872.36 },
  { name: 'Class 5', value: 1559574.57 },
];

// Indicative cultural space within the Food Estate area (ha) — 471,026.19 ha total
const CULTURAL_SPACE = [
  { name: 'Sacred sites', value: 158513.69 },
  { name: 'Sago groves', value: 110358.39 },
  { name: 'Customary conservation areas', value: 85856.85 },
  { name: 'Water sources', value: 47450.66 },
  { name: 'Ancestral pathways', value: 41700.39 },
  { name: 'Ancestor resting places', value: 25911.06 },
  { name: 'Old/sacred kampung', value: 1235.15 },
];
const CULTURAL_TOTAL = CULTURAL_SPACE.reduce((s, d) => s + d.value, 0);

// Village development status (IDM) within the Food Estate area — 125 villages
const VILLAGE_STATUS = [
  { name: 'Underdeveloped', value: 71 },
  { name: 'Very underdeveloped', value: 40 },
  { name: 'Developing', value: 13 },
  { name: 'Advanced', value: 1 },
];

const STATUS_COLORS = [CHART_2, CHART_1, NEUTRAL, MUTED];
const ha = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 2 });

function VizIntro({ reduceMotion }: StageState) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6">
      <div className="text-4xl font-semibold" style={{ color: CHART_1 }}>
        <AnimatedNumber value={1.2} decimals={1} reduceMotion={reduceMotion} /> million ha
      </div>
      <div className="text-ink-muted mt-2 text-xs tracking-[0.25em] uppercase">planned Food Estate area</div>
      <div className="mt-8 grid grid-cols-3 gap-2">
        {FE_DISTRICTS.map((d, i) => (
          <motion.div
            key={d}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: reduceMotion ? 0 : i * 0.08, duration: reduceMotion ? 0 : 0.4 }}
            className="text-ink-muted flex h-14 w-24 items-center justify-center px-1 text-center text-[10px]"
            style={{ background: NEUTRAL }}
          >
            {d}
          </motion.div>
        ))}
      </div>
      <div className="text-ink-muted mt-3 text-[10px] tracking-widest uppercase">6 distrik, Papua Selatan</div>
    </div>
  );
}

function VizProblem({ reduceMotion }: StageState) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <svg viewBox="0 0 400 300" className="h-full max-h-[340px] w-full max-w-[380px]" aria-hidden="true">
        <motion.circle
          cx="130"
          cy="150"
          r="70"
          fill={CHART_1}
          opacity="0.55"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.55 }}
          transition={{ duration: reduceMotion ? 0 : 0.8 }}
        />
        <motion.circle
          cx="270"
          cy="150"
          r="70"
          fill={CHART_2}
          opacity="0.55"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.55 }}
          transition={{ duration: reduceMotion ? 0 : 0.8, delay: reduceMotion ? 0 : 0.2 }}
        />
        <text x="90" y="150" textAnchor="middle" fill="var(--color-ink)" fontSize="11" letterSpacing="1">Food</text>
        <text x="90" y="165" textAnchor="middle" fill="var(--color-ink)" fontSize="11" letterSpacing="1">Estate</text>
        <text x="310" y="150" textAnchor="middle" fill="var(--color-ink)" fontSize="11" letterSpacing="1">Ruang</text>
        <text x="310" y="165" textAnchor="middle" fill="var(--color-ink)" fontSize="11" letterSpacing="1">budaya</text>
        <text x="200" y="150" textAnchor="middle" fill="var(--color-paper)" fontSize="12" fontWeight="600">overlap</text>
      </svg>
    </div>
  );
}

function VizMethod({ reduceMotion }: StageState) {
  const steps = ['Driver', 'Pressure', 'State', 'Impact', 'Response'];
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2.5 p-6">
      {steps.map((s, i) => (
        <motion.div
          key={s}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: reduceMotion ? 0 : i * 0.12, duration: reduceMotion ? 0 : 0.4 }}
          className="flex w-full max-w-xs items-center gap-3"
        >
          <span className="font-mono text-xs" style={{ color: CHART_1 }}>{String(i + 1).padStart(2, '0')}</span>
          <div className="border-line bg-paper text-ink-muted flex-1 border px-3 py-2 text-center text-xs">{s}</div>
        </motion.div>
      ))}
      <div className="text-ink-muted mt-2 text-center text-[10px] italic">
        Kerangka DPSIR + inventarisasi jasa lingkungan (KLHK, 2022)
      </div>
    </div>
  );
}

/*
 * Two stacked charts in one scene, so <Chart> (one chart, one table) does not
 * fit — it composes DataTable directly instead and keeps its own layout.
 */
function VizFinding1({ reduceMotion }: StageState) {
  return (
    <div className="flex h-full w-full flex-col gap-4 p-4">
      <div>
        <div className="text-ink-muted mb-1.5 text-xs">Jasa lingkungan penyedia pangan</div>
        <div aria-hidden="true">
          <ResponsiveContainer width="100%" height={90}>
            <BarChart data={FOOD_SERVICE} layout="vertical" margin={{ left: 10, right: 20, top: 0, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" stroke={MUTED} tick={{ fill: MUTED, fontSize: 9 }} width={45} />
              <Tooltip cursor={{ fill: 'var(--color-line)' }} contentStyle={tooltipStyle} />
              <Bar dataKey="value" animationDuration={VIZ_DURATION_MS} isAnimationActive={!reduceMotion}>
                {FOOD_SERVICE.map((_, i) => (
                  <Cell key={i} fill={i === 3 ? CHART_1 : NEUTRAL} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <DataTable
          caption="Jasa lingkungan penyedia pangan, per kelas (ha)"
          columns={['Kelas', 'Luas (ha)']}
          rows={FOOD_SERVICE.map((d) => [d.name, ha(d.value)])}
        />
      </div>
      <div>
        <div className="text-ink-muted mb-1.5 text-xs">Jasa lingkungan pendukung kehati &amp; habitat</div>
        <div aria-hidden="true">
          <ResponsiveContainer width="100%" height={90}>
            <BarChart data={KEHATI_SERVICE} layout="vertical" margin={{ left: 10, right: 20, top: 0, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" stroke={MUTED} tick={{ fill: MUTED, fontSize: 9 }} width={45} />
              <Tooltip cursor={{ fill: 'var(--color-line)' }} contentStyle={tooltipStyle} />
              <Bar dataKey="value" animationDuration={VIZ_DURATION_MS} isAnimationActive={!reduceMotion}>
                {KEHATI_SERVICE.map((_, i) => (
                  <Cell key={i} fill={i === 4 ? CHART_2 : NEUTRAL} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <DataTable
          caption="Jasa lingkungan pendukung kehati dan habitat, per kelas (ha)"
          columns={['Kelas', 'Luas (ha)']}
          rows={KEHATI_SERVICE.map((d) => [d.name, ha(d.value)])}
        />
      </div>
      <div className="text-ink-muted text-center text-[10px]">
        74.63% food-service score is class 4 · 67.88% biodiversity score is class 5 (of 2,297,698 ha)
      </div>
    </div>
  );
}

/*
 * Not wrapped in <Chart>: this scene ends with a visible total line under the
 * bars, and the wrapper has no place for one. Dropping that line to fit the
 * abstraction would delete a published figure, so the scene keeps its own
 * layout and composes DataTable directly.
 */
function VizFinding2({ reduceMotion }: StageState) {
  const data = [...CULTURAL_SPACE].sort((a, b) => a.value - b.value);
  return (
    <div className="flex h-full w-full flex-col p-4">
      <div className="text-ink-muted mb-3 text-sm">Indicative cultural space within the Food Estate area (ha)</div>
      <div className="min-h-0 flex-1" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 30, top: 10, bottom: 10 }}>
            <XAxis type="number" stroke={MUTED} tick={{ fill: MUTED, fontSize: 9 }} />
            <YAxis type="category" dataKey="name" stroke={MUTED} tick={{ fill: 'var(--color-ink)', fontSize: 10 }} width={140} />
            <Tooltip cursor={{ fill: 'var(--color-line)' }} contentStyle={tooltipStyle} />
            <Bar dataKey="value" fill={CHART_1} animationDuration={VIZ_DURATION_MS} isAnimationActive={!reduceMotion} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <DataTable
        caption="Indicative cultural space within the Food Estate area (ha)"
        columns={['Category', 'Area (ha)']}
        rows={data.map((d) => [d.name, ha(d.value)])}
      />
      <div className="text-ink-muted mt-2 text-center text-[10px]">
        Total {CULTURAL_TOTAL.toLocaleString('en-US', { maximumFractionDigits: 0 })} ha across 7 categories
      </div>
    </div>
  );
}

// Static stat cards — no animation, and no chart to pair a table with.
function VizFinding3(_: StageState) {
  return (
    <div className="flex h-full w-full flex-col gap-4 p-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="border-line bg-paper border px-3 py-3 text-center">
          <div className="text-2xl font-semibold" style={{ color: CHART_1 }}>200</div>
          <div className="text-ink-muted mt-1 text-[10px]">excavators landed at the former Wanam port</div>
        </div>
        <div className="border-line bg-paper border px-3 py-3 text-center">
          <div className="text-2xl font-semibold" style={{ color: CHART_2 }}>135/140</div>
          <div className="text-ink-muted mt-1 text-[10px]">km of the Ilwayab–Wanam–Ngguti–Muting road has no AMDAL</div>
        </div>
      </div>
      <div className="border-line bg-paper border px-3 py-3 text-center">
        <div className="text-xl font-semibold" style={{ color: CHART_1 }}>35 m planned → up to 1 km open</div>
        <div className="text-ink-muted mt-1 text-[10px]">road corridor width in the field, due to deep swamp terrain</div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="border-line bg-paper border px-3 py-3 text-center">
          <div className="text-ink text-sm">Rice</div>
          <div className="text-ink-muted mt-1 text-[10px]">Desa Telaga Sari: irrigation &amp; water pumps already built</div>
        </div>
        <div className="border-line bg-paper border px-3 py-3 text-center">
          <div className="text-ink text-sm">Sugarcane</div>
          <div className="text-ink-muted mt-1 text-[10px]">Distrik Kurik: bioethanol cluster, near KTM Salor</div>
        </div>
      </div>
    </div>
  );
}

function VizConclusion({ reduceMotion }: StageState) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6">
      <div aria-hidden="true">
        <PieChart width={240} height={160}>
          <Pie
            data={VILLAGE_STATUS}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={70}
            paddingAngle={2}
            isAnimationActive={!reduceMotion}
          >
            {VILLAGE_STATUS.map((_, i) => (
              <Cell key={i} fill={STATUS_COLORS[i]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
        </PieChart>
      </div>
      <DataTable
        caption="Village development status (IDM) within the Food Estate area"
        columns={['Status', 'Villages']}
        rows={VILLAGE_STATUS.map((d) => [d.name, d.value])}
      />
      <Legend
        layout="stacked"
        items={VILLAGE_STATUS.map((d, i) => ({
          label: `${d.name} · ${d.value} villages`,
          color: STATUS_COLORS[i],
        }))}
      />
      <div className="text-ink-muted mt-2 text-[10px]">
        125 villages · 31,321 residents within the Food Estate area
      </div>
    </div>
  );
}

export default function RpplhStage(props: {
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

