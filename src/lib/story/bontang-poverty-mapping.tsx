import { motion } from 'motion/react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from 'recharts';
import StoryStage from '../../islands/StoryStage';
import type { StageState } from '../../components/story/types';
import AnimatedNumber from '../../components/story/viz/AnimatedNumber';
import Chart from '../../components/story/viz/Chart';
import DataTable from '../../components/story/viz/DataTable';
import Legend from '../../components/story/viz/Legend';
import { CHART_1, CHART_2, MUTED, NEUTRAL, tooltipStyle, VIZ_DURATION_MS } from '../../components/story/viz/theme';

/*
 * Visuals for src/content/posts/bontang-poverty-mapping.mdx
 * (M10/T-79, ADR-005). Prose now lives in the MDX body.
 *
 * Figures are read directly from Bappeda Kalimantan Timur's "Kajian Pemetaan
 * Karakteristik Masyarakat Miskin Provinsi Kalimantan Timur" (Bahan Paparan,
 * 12 June 2023) — a province-wide P3KE-based poverty mapping study. At the
 * time of that report, Kota Bontang was the only one of Kalimantan Timur's 10
 * kabupaten/kota with both analysis tracks (hotspot mapping + characteristic
 * clustering) fully complete, which is why this post centers on Bontang while
 * opening with the province-wide picture. No individual-level P3KE records
 * (names, NIK, addresses) are reproduced here — every figure is an aggregate
 * count already present in the public presentation deck.
 *
 * Arithmetic re-checked at migration (T-79), since T-78 found a live post
 * whose figures contradicted each other: the ten regional counts sum to
 * 238,464; Kutai Kartanegara is 8.96x Bontang ("nine times"); Bontang is the
 * second-smallest caseload; the progress table yields exactly 1 complete /
 * 3 partial / 6 not started; and all three Tanjung Laut Indah breakdowns sum
 * to 590 KK, giving the 50.5% / 69.2% / 60.0% the prose quotes. Every claim
 * in the MDX matches its data.
 */

const POOR_BY_REGION = [
  { name: 'Kutai Kartanegara', count: 65380 },
  { name: 'Samarinda', count: 44524 },
  { name: 'Kutai Timur', count: 29630 },
  { name: 'Paser', count: 26291 },
  { name: 'Balikpapan', count: 21767 },
  { name: 'Penajam Paser Utara', count: 14358 },
  { name: 'Berau', count: 13760 },
  { name: 'Kutai Barat', count: 12598 },
  { name: 'Bontang', count: 7297 },
  { name: 'Mahakam Ulu', count: 2859 },
];
const TOTAL_POOR = POOR_BY_REGION.reduce((sum, r) => sum + r.count, 0);

// Progress table, Sasaran 1 (hotspot map) vs Sasaran 2 (characteristic clustering), % complete
const PROGRESS_BY_REGION = [
  { name: 'Bontang', sasaran1: 100, sasaran2: 100 },
  { name: 'Mahakam Ulu', sasaran1: 100, sasaran2: 0 },
  { name: 'Penajam Paser Utara', sasaran1: 100, sasaran2: 0 },
  { name: 'Kutai Barat', sasaran1: 75, sasaran2: 0 },
  { name: 'Samarinda', sasaran1: 0, sasaran2: 0 },
  { name: 'Balikpapan', sasaran1: 0, sasaran2: 0 },
  { name: 'Berau', sasaran1: 0, sasaran2: 0 },
  { name: 'Kutai Kartanegara', sasaran1: 0, sasaran2: 0 },
  { name: 'Kutai Timur', sasaran1: 0, sasaran2: 0 },
  { name: 'Paser', sasaran1: 0, sasaran2: 0 },
];
const ROLLOUT_STATUS = [
  { name: 'Complete (both tracks)', value: 1 },
  { name: 'Partial (Sasaran 1 only)', value: 3 },
  { name: 'Not started', value: 6 },
];

// Kelurahan Tanjung Laut Indah, Kec. Bontang Selatan — 590 KK sampled
const TLI_TENURE = [
  { name: 'Rent', value: 298 },
  { name: 'Own', value: 157 },
  { name: 'Living with family', value: 106 },
  { name: 'Rent-free', value: 29 },
];
const TLI_ASSETS = [
  { name: 'None', value: 408 },
  { name: 'Has assets', value: 182 },
];
const TLI_STUNTING = [
  { name: 'Risk band 1', value: 354 },
  { name: 'No risk (0)', value: 145 },
  { name: 'Risk band 2', value: 91 },
];

const ROLLOUT_COLORS = [CHART_1, CHART_2, NEUTRAL];
const STUNTING_COLORS = [CHART_2, NEUTRAL, CHART_1];

function VizIntro({ reduceMotion }: StageState) {
  const tiles = POOR_BY_REGION.map((r) => ({ ...r, isBontang: r.name === 'Bontang' }));
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6">
      <div className="text-5xl font-semibold" style={{ color: CHART_1 }}>
        <AnimatedNumber value={TOTAL_POOR} reduceMotion={reduceMotion} />
      </div>
      <div className="text-ink-muted mt-2 text-xs tracking-[0.25em] uppercase">
        extreme-poor individuals recorded (P3KE), 10 kabupaten/kota
      </div>
      <div className="mt-8 grid grid-cols-5 gap-2">
        {tiles.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: reduceMotion ? 0 : i * 0.06, duration: reduceMotion ? 0 : 0.4 }}
            className="flex h-12 w-12 items-center justify-center text-[9px] font-medium"
            style={{
              background: r.isBontang ? CHART_1 : NEUTRAL,
              color: r.isBontang ? 'var(--color-paper)' : 'var(--color-ink-muted)',
            }}
            title={r.name}
          >
            {r.isBontang ? 'BTG' : ''}
          </motion.div>
        ))}
      </div>
      <div className="text-ink-muted mt-3 text-[10px] tracking-widest uppercase">Kalimantan Timur</div>
    </div>
  );
}

function VizProblem({ reduceMotion }: StageState) {
  const data = [...POOR_BY_REGION].sort((a, b) => a.count - b.count);
  return (
    <Chart
      label="Extreme-poor individuals (P3KE decile 1) per kabupaten/kota"
      table={{
        columns: ['Kabupaten/kota', 'Individuals'],
        rows: data.map((d) => [d.name, d.count]),
      }}
    >
      <BarChart data={data} layout="vertical" margin={{ left: 20, right: 30, top: 10, bottom: 10 }}>
        <XAxis type="number" stroke={MUTED} tick={{ fill: MUTED, fontSize: 10 }} />
        <YAxis type="category" dataKey="name" stroke={MUTED} tick={{ fill: 'var(--color-ink)', fontSize: 11 }} width={110} />
        <Tooltip cursor={{ fill: 'var(--color-line)' }} contentStyle={tooltipStyle} />
        <Bar dataKey="count" animationDuration={VIZ_DURATION_MS} isAnimationActive={!reduceMotion}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.name === 'Bontang' ? CHART_1 : NEUTRAL} />
          ))}
        </Bar>
      </BarChart>
    </Chart>
  );
}

function VizMethod({ reduceMotion }: StageState) {
  const tracks = [
    { label: 'Sasaran 1', steps: ['Per-individual point digitization', 'Boundary & imagery overlay', 'Kernel density'], out: 'Concentration map' },
    { label: 'Sasaran 2', steps: ['19 P3KE indicators', 'Distribution overlay', 'Characteristic clustering'], out: 'Characteristic map' },
  ];
  return (
    <div className="flex h-full w-full items-center justify-center gap-6 p-6">
      {tracks.map((t, ti) => (
        <motion.div
          key={t.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduceMotion ? 0 : ti * 0.15, duration: reduceMotion ? 0 : 0.5 }}
          className="flex flex-1 flex-col items-center gap-2"
        >
          <div className="text-xs font-medium tracking-widest uppercase" style={{ color: CHART_1 }}>{t.label}</div>
          {t.steps.map((s, si) => (
            <div key={si} className="border-line bg-paper text-ink-muted w-full border px-3 py-2 text-center text-[11px]">
              {s}
            </div>
          ))}
          <div className="mt-1 w-full border px-3 py-2 text-center text-xs font-medium" style={{ borderColor: CHART_1, color: CHART_1 }}>
            {t.out}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function VizFinding1({ reduceMotion }: StageState) {
  return (
    <Chart
      label="Mapping progress per kabupaten/kota: June 2023"
      legend={[
        { label: 'Sasaran 1', color: CHART_1 },
        { label: 'Sasaran 2', color: CHART_2 },
      ]}
      table={{
        caption: 'Mapping progress per kabupaten/kota, June 2023',
        columns: ['Kabupaten/kota', 'Sasaran 1 (concentration map)', 'Sasaran 2 (characteristics)'],
        rows: PROGRESS_BY_REGION.map((d) => [d.name, `${d.sasaran1}%`, `${d.sasaran2}%`]),
      }}
    >
      <BarChart data={PROGRESS_BY_REGION} margin={{ left: 0, right: 20, top: 10, bottom: 50 }}>
        <XAxis dataKey="name" stroke={MUTED} tick={{ fill: 'var(--color-ink)', fontSize: 9 }} angle={-35} textAnchor="end" interval={0} />
        <YAxis stroke={MUTED} tick={{ fill: MUTED, fontSize: 10 }} unit="%" />
        <Tooltip cursor={{ fill: 'var(--color-line)' }} contentStyle={tooltipStyle} />
        <Bar dataKey="sasaran1" name="Sasaran 1 (concentration map)" fill={CHART_1} animationDuration={VIZ_DURATION_MS} isAnimationActive={!reduceMotion} />
        <Bar dataKey="sasaran2" name="Sasaran 2 (characteristics)" fill={CHART_2} animationDuration={VIZ_DURATION_MS} isAnimationActive={!reduceMotion} />
      </BarChart>
    </Chart>
  );
}

// Qualitative hotspot-vs-spread visual (no citywide % figures were published
// for this comparison), so there is no table to pair with it.
function VizFinding2({ reduceMotion }: StageState) {
  return (
    <div className="flex h-full w-full items-center justify-around p-6">
      {[
        { label: 'Distribution', dots: 24, spread: true },
        { label: 'Concentration (kernel density)', dots: 24, spread: false },
      ].map((panel) => (
        <div key={panel.label} className="flex flex-col items-center gap-3">
          <svg viewBox="0 0 200 200" className="h-40 w-40" aria-hidden="true">
            {Array.from({ length: panel.dots }).map((_, i) => {
              const angle = (i / panel.dots) * Math.PI * 2;
              const r = panel.spread ? 40 + (i % 5) * 15 : 20 + (i % 3) * 8;
              const cx = 100 + Math.cos(angle) * r * (panel.spread ? 1 : 0.6);
              const cy = 100 + Math.sin(angle) * r * (panel.spread ? 1 : 0.6);
              return (
                <motion.circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r={panel.spread ? 3 : 5}
                  fill={CHART_1}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: panel.spread ? 0.5 : 0.85 }}
                  transition={{ delay: reduceMotion ? 0 : i * 0.02, duration: reduceMotion ? 0 : 0.4 }}
                />
              );
            })}
            {!panel.spread && <circle cx="100" cy="100" r="30" fill={CHART_1} opacity="0.15" />}
          </svg>
          <div className="text-ink-muted text-xs">{panel.label}</div>
        </div>
      ))}
    </div>
  );
}

function VizFinding3({ reduceMotion }: StageState) {
  const tenureTotal = TLI_TENURE.reduce((s, d) => s + d.value, 0);
  return (
    <div className="flex h-full w-full flex-col gap-4 overflow-y-auto p-4">
      <div className="text-ink-muted text-sm">Kelurahan Tanjung Laut Indah, Kec. Bontang Selatan: 590 KK</div>
      <div>
        <div className="text-ink-muted mb-1.5 text-xs">Housing tenure status</div>
        {TLI_TENURE.map((d) => (
          <div key={d.name} className="mb-1 flex items-center gap-2">
            <div className="text-ink-muted w-24 text-[10px]">{d.name}</div>
            <div className="bg-line/60 relative h-3 flex-1 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(d.value / tenureTotal) * 100}%` }}
                transition={{ duration: reduceMotion ? 0 : 0.8 }}
                className="h-full"
                style={{ background: CHART_1 }}
              />
            </div>
            <div className="text-ink-muted w-10 text-right text-[10px] tabular-nums">{d.value}</div>
          </div>
        ))}
      </div>
      <DataTable
        caption="Housing tenure status, Tanjung Laut Indah"
        columns={['Tenure', 'Households']}
        rows={TLI_TENURE.map((d) => [d.name, d.value])}
      />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-ink-muted mb-1 text-xs">Owns assets</div>
          <div aria-hidden="true">
            <ResponsiveContainer width="100%" height={90}>
              <PieChart>
                <Pie data={TLI_ASSETS} dataKey="value" nameKey="name" innerRadius={20} outerRadius={38} isAnimationActive={!reduceMotion}>
                  {TLI_ASSETS.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? NEUTRAL : CHART_1} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <DataTable
            caption="Owns assets, Tanjung Laut Indah"
            columns={['Status', 'Households']}
            rows={TLI_ASSETS.map((d) => [d.name, d.value])}
          />
        </div>
        <div>
          <div className="text-ink-muted mb-1 text-xs">Stunting risk</div>
          <div aria-hidden="true">
            <ResponsiveContainer width="100%" height={90}>
              <PieChart>
                <Pie data={TLI_STUNTING} dataKey="value" nameKey="name" innerRadius={20} outerRadius={38} isAnimationActive={!reduceMotion}>
                  {TLI_STUNTING.map((_, i) => (
                    <Cell key={i} fill={STUNTING_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <DataTable
            caption="Child stunting risk, Tanjung Laut Indah"
            columns={['Risk band', 'Children']}
            rows={TLI_STUNTING.map((d) => [d.name, d.value])}
          />
        </div>
      </div>
    </div>
  );
}

function VizConclusion({ reduceMotion }: StageState) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6">
      <div aria-hidden="true">
        <PieChart width={240} height={180}>
          <Pie
            data={ROLLOUT_STATUS}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={75}
            paddingAngle={2}
            isAnimationActive={!reduceMotion}
          >
            {ROLLOUT_STATUS.map((_, i) => (
              <Cell key={i} fill={ROLLOUT_COLORS[i]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
        </PieChart>
      </div>
      <DataTable
        caption="Mapping rollout status, 10 kabupaten/kota"
        columns={['Status', 'Kabupaten/kota']}
        rows={ROLLOUT_STATUS.map((r) => [r.name, r.value])}
      />
      <Legend
        layout="stacked"
        items={ROLLOUT_STATUS.map((r, i) => ({
          label: `${r.name} · ${r.value} kab/kota`,
          color: ROLLOUT_COLORS[i],
        }))}
      />
    </div>
  );
}

export default function BontangStage(props: {
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
