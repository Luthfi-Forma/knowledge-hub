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
  PieChart,
  Pie,
} from 'recharts';
import Scrollytelling, { type ScrollytellingSection } from '../../islands/Scrollytelling';

/*
 * Bespoke data + viz for src/content/posts/bontang-poverty-mapping.mdx.
 * Figures are read directly from Bappeda Kalimantan Timur's "Kajian
 * Pemetaan Karakteristik Masyarakat Miskin Provinsi Kalimantan Timur"
 * (Bahan Paparan, 12 June 2023) — a province-wide P3KE-based poverty
 * mapping study. At the time of that report, Kota Bontang was the only one
 * of Kalimantan Timur's 10 kabupaten/kota with both analysis tracks
 * (hotspot mapping + characteristic clustering) fully complete, which is
 * why this post centers on Bontang while opening with the province-wide
 * picture. No individual-level P3KE records (names, NIK, addresses) are
 * reproduced here — every figure is an aggregate count already present in
 * the public presentation deck.
 */

const ACCENT = 'var(--color-chart-1)';
const SECOND = 'var(--color-chart-2)';
const MUTED = 'var(--color-ink-muted)';

// Individuals in P3KE desil-1 (extreme poor) by kabupaten/kota — province map slide
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
  { name: 'Selesai (kedua sasaran)', value: 1 },
  { name: 'Sebagian (sasaran 1 saja)', value: 3 },
  { name: 'Belum dimulai', value: 6 },
];

// Kelurahan Tanjung Laut Indah, Kec. Bontang Selatan — 590 KK sampled
const TLI_TENURE = [
  { name: 'Kontrak/Sewa', value: 298 },
  { name: 'Milik Sendiri', value: 157 },
  { name: 'Menumpang', value: 106 },
  { name: 'Bebas Sewa', value: 29 },
];
const TLI_ASSETS = [
  { name: 'Tidak ada', value: 408 },
  { name: 'Ada', value: 182 },
];
const TLI_STUNTING = [
  { name: 'Risiko 1', value: 354 },
  { name: 'Tidak berisiko (0)', value: 145 },
  { name: 'Risiko 2', value: 91 },
];

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const startTime = performance.now();
    const dur = 900;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - startTime) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return <span className="tabular-nums">{display.toLocaleString('id-ID')}</span>;
}

const tooltipStyle = {
  background: 'var(--color-paper)',
  border: '1px solid var(--color-line)',
  borderRadius: 2,
  color: 'var(--color-ink)',
};

function VizIntro() {
  const tiles = POOR_BY_REGION.map((r) => ({ ...r, isBontang: r.name === 'Bontang' }));
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6">
      <div className="text-5xl font-semibold" style={{ color: ACCENT }}>
        <AnimatedNumber value={TOTAL_POOR} />
      </div>
      <div className="mt-2 text-xs tracking-[0.25em] text-ink-muted uppercase">
        individu miskin ekstrem terdata (P3KE), 10 kabupaten/kota
      </div>
      <div className="mt-8 grid grid-cols-5 gap-2">
        {tiles.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            className="flex h-12 w-12 items-center justify-center text-[9px] font-medium"
            style={{
              background: r.isBontang ? ACCENT : 'var(--color-line)',
              color: r.isBontang ? 'var(--color-paper)' : 'var(--color-ink-muted)',
            }}
            title={r.name}
          >
            {r.isBontang ? 'BTG' : ''}
          </motion.div>
        ))}
      </div>
      <div className="mt-3 text-[10px] tracking-widest text-ink-muted uppercase">Kalimantan Timur</div>
    </div>
  );
}

function VizProblem() {
  const data = [...POOR_BY_REGION].sort((a, b) => a.count - b.count);
  return (
    <div className="flex h-full w-full flex-col p-4">
      <div className="mb-3 text-sm text-ink-muted">Individu miskin ekstrem (P3KE desil 1) per kabupaten/kota</div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 30, top: 10, bottom: 10 }}>
            <XAxis type="number" stroke={MUTED} tick={{ fill: MUTED, fontSize: 10 }} />
            <YAxis type="category" dataKey="name" stroke={MUTED} tick={{ fill: 'var(--color-ink)', fontSize: 11 }} width={110} />
            <Tooltip cursor={{ fill: 'var(--color-line)' }} contentStyle={tooltipStyle} />
            <Bar dataKey="count" animationDuration={900}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.name === 'Bontang' ? ACCENT : 'var(--color-line)'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function VizMethod() {
  const tracks = [
    { label: 'Sasaran 1', steps: ['Digitasi titik per-individu', 'Overlay batas & citra', 'Kernel density'], out: 'Peta konsentrasi' },
    { label: 'Sasaran 2', steps: ['19 indikator P3KE', 'Overlay sebaran', 'Klaster karakteristik'], out: 'Peta karakteristik' },
  ];
  return (
    <div className="flex h-full w-full items-center justify-center gap-6 p-6">
      {tracks.map((t, ti) => (
        <motion.div
          key={t.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: ti * 0.15, duration: 0.5 }}
          className="flex flex-1 flex-col items-center gap-2"
        >
          <div className="text-xs font-medium tracking-widest uppercase" style={{ color: ACCENT }}>
            {t.label}
          </div>
          {t.steps.map((s, si) => (
            <div key={si} className="w-full border border-line bg-paper px-3 py-2 text-center text-[11px] text-ink-muted">
              {s}
            </div>
          ))}
          <div className="mt-1 w-full border px-3 py-2 text-center text-xs font-medium" style={{ borderColor: ACCENT, color: ACCENT }}>
            {t.out}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function VizFinding1() {
  return (
    <div className="flex h-full w-full flex-col p-4">
      <div className="mb-3 text-sm text-ink-muted">Progres pemetaan per kabupaten/kota — Juni 2023</div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={PROGRESS_BY_REGION} margin={{ left: 0, right: 20, top: 10, bottom: 50 }}>
            <XAxis dataKey="name" stroke={MUTED} tick={{ fill: 'var(--color-ink)', fontSize: 9 }} angle={-35} textAnchor="end" interval={0} />
            <YAxis stroke={MUTED} tick={{ fill: MUTED, fontSize: 10 }} unit="%" />
            <Tooltip cursor={{ fill: 'var(--color-line)' }} contentStyle={tooltipStyle} />
            <Bar dataKey="sasaran1" name="Sasaran 1 (peta konsentrasi)" fill={ACCENT} animationDuration={800} />
            <Bar dataKey="sasaran2" name="Sasaran 2 (karakteristik)" fill={SECOND} animationDuration={800} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex items-center gap-4 text-xs text-ink-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5" style={{ background: ACCENT }} /> Sasaran 1
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5" style={{ background: SECOND }} /> Sasaran 2
        </span>
      </div>
    </div>
  );
}

function VizFinding2() {
  // Qualitative hotspot-vs-spread visual (no citywide % figures were published for this comparison).
  return (
    <div className="flex h-full w-full items-center justify-around p-6">
      {[
        { label: 'Sebaran', dots: 24, spread: true },
        { label: 'Konsentrasi (kernel density)', dots: 24, spread: false },
      ].map((panel) => (
        <div key={panel.label} className="flex flex-col items-center gap-3">
          <svg viewBox="0 0 200 200" className="h-40 w-40">
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
                  fill={ACCENT}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: panel.spread ? 0.5 : 0.85 }}
                  transition={{ delay: i * 0.02, duration: 0.4 }}
                />
              );
            })}
            {!panel.spread && <circle cx="100" cy="100" r="30" fill={ACCENT} opacity="0.15" />}
          </svg>
          <div className="text-xs text-ink-muted">{panel.label}</div>
        </div>
      ))}
    </div>
  );
}

function VizFinding3() {
  const tenureTotal = TLI_TENURE.reduce((s, d) => s + d.value, 0);
  return (
    <div className="flex h-full w-full flex-col gap-4 overflow-y-auto p-4">
      <div className="text-sm text-ink-muted">Kelurahan Tanjung Laut Indah, Kec. Bontang Selatan — 590 KK</div>
      <div>
        <div className="mb-1.5 text-xs text-ink-muted">Status kepemilikan rumah</div>
        {TLI_TENURE.map((d) => (
          <div key={d.name} className="mb-1 flex items-center gap-2">
            <div className="w-24 text-[10px] text-ink-muted">{d.name}</div>
            <div className="relative h-3 flex-1 overflow-hidden bg-line/60">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(d.value / tenureTotal) * 100}%` }}
                transition={{ duration: 0.8 }}
                className="h-full"
                style={{ background: ACCENT }}
              />
            </div>
            <div className="w-10 text-right text-[10px] tabular-nums text-ink-muted">{d.value}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="mb-1 text-xs text-ink-muted">Memiliki aset</div>
          <ResponsiveContainer width="100%" height={90}>
            <PieChart>
              <Pie data={TLI_ASSETS} dataKey="value" nameKey="name" innerRadius={20} outerRadius={38}>
                {TLI_ASSETS.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? 'var(--color-line)' : ACCENT} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div>
          <div className="mb-1 text-xs text-ink-muted">Risiko stunting</div>
          <ResponsiveContainer width="100%" height={90}>
            <PieChart>
              <Pie data={TLI_STUNTING} dataKey="value" nameKey="name" innerRadius={20} outerRadius={38}>
                {TLI_STUNTING.map((_, i) => (
                  <Cell key={i} fill={[SECOND, 'var(--color-line)', ACCENT][i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function VizConclusion() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6">
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie data={ROLLOUT_STATUS} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
            {ROLLOUT_STATUS.map((_, i) => (
              <Cell key={i} fill={[ACCENT, SECOND, 'var(--color-line)'][i]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-2 space-y-1 text-xs text-ink-muted">
        {ROLLOUT_STATUS.map((r, i) => (
          <div key={r.name} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5" style={{ background: [ACCENT, SECOND, 'var(--color-line)'][i] }} />
            {r.name} — {r.value} kab/kota
          </div>
        ))}
      </div>
    </div>
  );
}

const viz: Record<string, ComponentType> = {
  intro: VizIntro,
  problem: VizProblem,
  method: VizMethod,
  finding1: VizFinding1,
  finding2: VizFinding2,
  finding3: VizFinding3,
  conclusion: VizConclusion,
};

const sections: ScrollytellingSection[] = [
  {
    id: 'intro',
    kicker: 'Setting the scene',
    title: 'Kalimantan Timur knows roughly how many of its people are extremely poor. It didn’t know where.',
    body: 'Presidential Instruction No. 4/2022 tasked every governor with coordinating and updating extreme-poverty target data toward a 0% national rate by 2024. Kalimantan Timur has the 10th-lowest poverty rate in Indonesia — but 6.31% of its population, up 0.04 points from the prior period, still meant close to a quarter-million individuals flagged extremely poor across the province’s ten kabupaten/kota.',
    citations: [{ label: 'Bappeda Kaltim (2023)', where: 'Latar Belakang, slide 6' }],
  },
  {
    id: 'problem',
    kicker: 'The gap',
    title: 'P3KE is a list. A planning team needs a map.',
    body: 'P3KE — Indonesia’s national extreme-poverty registry — already holds per-individual, address-level records for every province. What it doesn’t provide is any built-in way to see where those households cluster. Kutai Kartanegara alone carries 65,380 flagged individuals, nine times Bontang’s 7,297 — a gap invisible in a spreadsheet, and the whole reason this mapping study exists.',
    citations: [{ label: 'Bappeda Kaltim (2023)', where: 'Peta jumlah individu miskin ekstrem P3KE, slide 8' }],
    vizCitation: { fig: 'Peta P3KE per kabupaten/kota', source: 'Sumber Data, slide 8' },
  },
  {
    id: 'method',
    kicker: 'Method',
    title: 'Two tracks: where they are, and what their lives look like.',
    body: 'Sasaran 1 digitized every P3KE individual as a point on the road network, joined to their household attributes, then ran kernel density estimation to turn scattered points into a concentration surface. Sasaran 2 ran a separate characteristic-cluster analysis across 19 P3KE indicators — gender, work, education, housing materials, utilities, aid-program enrollment, and child stunting risk — to explain what a hotspot is actually made of.',
    citations: [{ label: 'Bappeda Kaltim (2023)', where: 'Metode Sasaran 1 & 2, slides 9–14' }],
  },
  {
    id: 'finding1',
    kicker: 'Finding 01',
    title: 'Of ten kabupaten/kota, exactly one had finished both tracks: Bontang.',
    body: 'By this report’s cut-off, Bontang was the only region at 100% on both the concentration map and the characteristic clustering. Mahakam Ulu and Penajam Paser Utara had only the hotspot map done; Kutai Barat was 75% through it; the remaining six — including Samarinda and Kutai Kartanegara, the two largest poor populations in the province — hadn’t started either track yet. Bontang’s comparatively small caseload, second-smallest of the ten, made it the tractable place to prove the method first.',
    citations: [{ label: 'Bappeda Kaltim (2023)', where: 'Progres Pekerjaan, slide 16' }],
    vizCitation: { fig: 'Tabel progres per kabupaten/kota', source: 'Progres Pekerjaan, slide 16' },
  },
  {
    id: 'finding2',
    kicker: 'Finding 02',
    title: 'A hotspot map isn’t the same as a headcount.',
    body: 'Bontang’s two output maps — raw point distribution and kernel-density concentration — show the same households from two angles: one where poverty reads as scattered dots across the city, the other where kernel density collapses those dots into a small number of dense pockets. That distinction is the entire point of the method: a scattered spread and a concentrated pocket carrying the same headcount call for different interventions.',
    citations: [{ label: 'Bappeda Kaltim (2023)', where: 'Progres Pemetaan Karakteristik, Kota Bontang, slide 18' }],
    vizCitation: { fig: 'Peta persebaran vs. kernel density', source: 'Kota Bontang, slide 18' },
  },
  {
    id: 'finding3',
    kicker: 'Finding 03',
    title: 'One kelurahan, up close: Tanjung Laut Indah.',
    body: 'Of Bontang’s dozens of kelurahan profiled under Sasaran 2, Tanjung Laut Indah (Kecamatan Bontang Selatan, 590 KK sampled) shows what the 19-indicator layer adds: half the sampled households rent rather than own, 69% report no savings, valuables, or livestock to fall back on, and 60% of children sit in the middle stunting-risk band. None of this shows up in a raw headcount — it’s exactly the texture a program needs to decide whether to lead with housing, livelihood, or health support.',
    citations: [{ label: 'Bappeda Kaltim (2023)', where: 'Kelurahan Tanjung Laut Indah, slide 58' }],
    vizCitation: { fig: 'Infografis karakteristik kelurahan', source: 'Kecamatan Bontang Selatan, slide 58' },
  },
  {
    id: 'conclusion',
    kicker: 'Where this leads',
    title: 'Bontang is the template. Nine kabupaten/kota are still the to-do list.',
    body: 'The same P3KE pipeline that mapped Bontang now has a working, repeatable shape — the province’s task is running it nine more times. The study also became more than a static report: a live web GIS tool now lets planners query individual-level characteristics by location directly, the same per-individual data this analysis draws on, without waiting for the next paparan deck.',
    citations: [{ label: 'Bappeda Kaltim (2023)', where: 'Tindak Lanjut, slide 60' }],
    vizCitation: { fig: 'Status tindak lanjut, 10 kab/kota', source: 'Tindak Lanjut, slide 60' },
  },
];

export default function BontangPovertyMappingScrollytelling() {
  return (
    <Scrollytelling
      eyebrow="A data-driven reading of Bappeda Kaltim's poverty mapping study"
      title={
        <>
          Ten regions, <em className="text-accent not-italic">one method</em> — proven in Bontang first.
        </>
      }
      dek="How a province-wide poverty mapping initiative in Kalimantan Timur turned raw P3KE household records into hotspot maps and characteristic profiles, with Bontang as the first city to see it through."
      meta="Kalimantan Timur · 2023"
      sections={sections}
      viz={viz}
      sourceCitation={
        <>
          <div className="text-xs tracking-[0.25em] text-accent uppercase">Sumber</div>
          <p className="mt-2 text-ink">Badan Perencanaan Pembangunan Daerah (Bappeda) Provinsi Kalimantan Timur.</p>
          <p className="italic">Kajian Pemetaan Karakteristik Masyarakat Miskin Provinsi Kalimantan Timur.</p>
          <p className="mt-1 text-xs">Bahan Paparan, 12 Juni 2023. Data sumber: P3KE (Kemenko PMK).</p>
        </>
      }
    />
  );
}
