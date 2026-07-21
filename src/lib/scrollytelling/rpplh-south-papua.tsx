import { useEffect, useState, type ComponentType } from 'react';
import { motion } from 'motion/react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from 'recharts';
import Scrollytelling, { type ScrollytellingSection } from '../../islands/Scrollytelling';

/*
 * Bespoke data + viz for src/content/posts/rpplh-south-papua.mdx.
 * Figures are read directly from "Draft Materi Teknis RPPLH Provinsi Papua
 * Selatan" (Merauke, August 2024) — the draft technical RPPLH document.
 * All figures are aggregate/spatial (hectares, percentages, counts) already
 * public in the source deck — no individual-level or precisely-located
 * customary-site data is reproduced beyond what the source itself
 * aggregates by category.
 */

const ACCENT = 'var(--color-chart-1)';
const SECOND = 'var(--color-chart-2)';
const MUTED = 'var(--color-ink-muted)';

const FE_DISTRICTS = ['Merauke', 'Tanah Miring', 'Semangga', 'Kurik', 'Janggebob', 'Malind'];

// Skor jasa lingkungan penyedia pangan (class 1-5), total 2,297,698.43 ha
const FOOD_SERVICE = [
  { name: 'Kelas 1', value: 767.69 },
  { name: 'Kelas 2', value: 225494.1 },
  { name: 'Kelas 3', value: 244335.32 },
  { name: 'Kelas 4', value: 1714672.51 },
  { name: 'Kelas 5', value: 112428.81 },
];
// Skor jasa lingkungan pendukung kehati & habitat (class 1-5), sama total area
const KEHATI_SERVICE = [
  { name: 'Kelas 1', value: 3485.62 },
  { name: 'Kelas 2', value: 411005.45 },
  { name: 'Kelas 3', value: 266760.44 },
  { name: 'Kelas 4', value: 56872.36 },
  { name: 'Kelas 5', value: 1559574.57 },
];

// Ruang budaya indikatif di kawasan Food Estate (ha) — 471,026.19 ha total
const CULTURAL_SPACE = [
  { name: 'Tempat Sakral', value: 158513.69 },
  { name: 'Dusun Sagu', value: 110358.39 },
  { name: 'Tempat Konservasi Adat', value: 85856.85 },
  { name: 'Sumber Air', value: 47450.66 },
  { name: 'Jalur Arwah', value: 41700.39 },
  { name: 'Tempat Persinggahan Leluhur', value: 25911.06 },
  { name: 'Kampung Tua/Kramat', value: 1235.15 },
];
const CULTURAL_TOTAL = CULTURAL_SPACE.reduce((s, d) => s + d.value, 0);

// Status desa (IPD) di kawasan Food Estate — 125 desa
const VILLAGE_STATUS = [
  { name: 'Desa Tertinggal', value: 71 },
  { name: 'Desa Sangat Tertinggal', value: 40 },
  { name: 'Desa Berkembang', value: 13 },
  { name: 'Desa Maju', value: 1 },
];

function AnimatedNumber({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const startTime = performance.now();
    const dur = 900;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - startTime) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return (
    <span className="tabular-nums">
      {display.toLocaleString('id-ID', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
    </span>
  );
}

const tooltipStyle = {
  background: 'var(--color-paper)',
  border: '1px solid var(--color-line)',
  borderRadius: 2,
  color: 'var(--color-ink)',
};

function VizIntro() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6">
      <div className="text-4xl font-semibold" style={{ color: ACCENT }}>
        <AnimatedNumber value={1.2} decimals={1} /> juta ha
      </div>
      <div className="mt-2 text-xs tracking-[0.25em] text-ink-muted uppercase">rencana kawasan Food Estate</div>
      <div className="mt-8 grid grid-cols-3 gap-2">
        {FE_DISTRICTS.map((d, i) => (
          <motion.div
            key={d}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="flex h-14 w-24 items-center justify-center px-1 text-center text-[10px] text-ink-muted"
            style={{ background: 'var(--color-line)' }}
          >
            {d}
          </motion.div>
        ))}
      </div>
      <div className="mt-3 text-[10px] tracking-widest text-ink-muted uppercase">6 distrik, Papua Selatan</div>
    </div>
  );
}

function VizProblem() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <svg viewBox="0 0 400 300" className="h-full max-h-[340px] w-full max-w-[380px]">
        <motion.circle
          cx="130"
          cy="150"
          r="70"
          fill={ACCENT}
          opacity="0.55"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.55 }}
          transition={{ duration: 0.8 }}
        />
        <motion.circle
          cx="270"
          cy="150"
          r="70"
          fill={SECOND}
          opacity="0.55"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.55 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
        <text x="90" y="150" textAnchor="middle" fill="var(--color-ink)" fontSize="11" letterSpacing="1">
          Food
        </text>
        <text x="90" y="165" textAnchor="middle" fill="var(--color-ink)" fontSize="11" letterSpacing="1">
          Estate
        </text>
        <text x="310" y="150" textAnchor="middle" fill="var(--color-ink)" fontSize="11" letterSpacing="1">
          Ruang
        </text>
        <text x="310" y="165" textAnchor="middle" fill="var(--color-ink)" fontSize="11" letterSpacing="1">
          budaya
        </text>
        <text x="200" y="150" textAnchor="middle" fill="var(--color-paper)" fontSize="12" fontWeight="600">
          overlap
        </text>
      </svg>
    </div>
  );
}

function VizMethod() {
  const steps = ['Driver', 'Pressure', 'State', 'Impact', 'Response'];
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2.5 p-6">
      {steps.map((s, i) => (
        <motion.div
          key={s}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.12, duration: 0.4 }}
          className="flex w-full max-w-xs items-center gap-3"
        >
          <span className="font-mono text-xs" style={{ color: ACCENT }}>{String(i + 1).padStart(2, '0')}</span>
          <div className="flex-1 border border-line bg-paper px-3 py-2 text-center text-xs text-ink-muted">{s}</div>
        </motion.div>
      ))}
      <div className="mt-2 text-center text-[10px] text-ink-muted italic">Kerangka DPSIR + inventarisasi jasa lingkungan (KLHK, 2022)</div>
    </div>
  );
}

function VizFinding1() {
  return (
    <div className="flex h-full w-full flex-col gap-4 p-4">
      <div>
        <div className="mb-1.5 text-xs text-ink-muted">Jasa lingkungan penyedia pangan</div>
        <ResponsiveContainer width="100%" height={90}>
          <BarChart data={FOOD_SERVICE} layout="vertical" margin={{ left: 10, right: 20, top: 0, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" stroke={MUTED} tick={{ fill: MUTED, fontSize: 9 }} width={45} />
            <Tooltip cursor={{ fill: 'var(--color-line)' }} contentStyle={tooltipStyle} />
            <Bar dataKey="value" animationDuration={800}>
              {FOOD_SERVICE.map((d, i) => (
                <Cell key={i} fill={i === 3 ? ACCENT : 'var(--color-line)'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div>
        <div className="mb-1.5 text-xs text-ink-muted">Jasa lingkungan pendukung kehati &amp; habitat</div>
        <ResponsiveContainer width="100%" height={90}>
          <BarChart data={KEHATI_SERVICE} layout="vertical" margin={{ left: 10, right: 20, top: 0, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" stroke={MUTED} tick={{ fill: MUTED, fontSize: 9 }} width={45} />
            <Tooltip cursor={{ fill: 'var(--color-line)' }} contentStyle={tooltipStyle} />
            <Bar dataKey="value" animationDuration={800}>
              {KEHATI_SERVICE.map((d, i) => (
                <Cell key={i} fill={i === 4 ? SECOND : 'var(--color-line)'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center text-[10px] text-ink-muted">74,63% skor pangan kelas 4 · 67,88% skor kehati kelas 5 (dari 2.297.698 ha)</div>
    </div>
  );
}

function VizFinding2() {
  const data = [...CULTURAL_SPACE].sort((a, b) => a.value - b.value);
  return (
    <div className="flex h-full w-full flex-col p-4">
      <div className="mb-3 text-sm text-ink-muted">Ruang budaya indikatif di kawasan Food Estate (ha)</div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 30, top: 10, bottom: 10 }}>
            <XAxis type="number" stroke={MUTED} tick={{ fill: MUTED, fontSize: 9 }} />
            <YAxis type="category" dataKey="name" stroke={MUTED} tick={{ fill: 'var(--color-ink)', fontSize: 10 }} width={140} />
            <Tooltip cursor={{ fill: 'var(--color-line)' }} contentStyle={tooltipStyle} />
            <Bar dataKey="value" fill={ACCENT} animationDuration={900} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 text-center text-[10px] text-ink-muted">
        Total {CULTURAL_TOTAL.toLocaleString('id-ID', { maximumFractionDigits: 0 })} ha di 7 kategori
      </div>
    </div>
  );
}

function VizFinding3() {
  return (
    <div className="flex h-full w-full flex-col gap-4 p-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="border border-line bg-paper px-3 py-3 text-center">
          <div className="text-2xl font-semibold" style={{ color: ACCENT }}>200</div>
          <div className="mt-1 text-[10px] text-ink-muted">unit ekskavator mendarat di eks-pelabuhan Wanam</div>
        </div>
        <div className="border border-line bg-paper px-3 py-3 text-center">
          <div className="text-2xl font-semibold" style={{ color: SECOND }}>135/140</div>
          <div className="mt-1 text-[10px] text-ink-muted">km jalan Ilwayab–Wanam–Ngguti–Muting belum ber-AMDAL</div>
        </div>
      </div>
      <div className="border border-line bg-paper px-3 py-3 text-center">
        <div className="text-xl font-semibold" style={{ color: ACCENT }}>35 m rencana → hingga 1 km terbuka</div>
        <div className="mt-1 text-[10px] text-ink-muted">lebar trase jalan di lapangan, akibat medan rawa dalam</div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="border border-line bg-paper px-3 py-3 text-center">
          <div className="text-sm text-ink">Padi</div>
          <div className="mt-1 text-[10px] text-ink-muted">Desa Telaga Sari — irigasi &amp; pompa air sudah dibangun</div>
        </div>
        <div className="border border-line bg-paper px-3 py-3 text-center">
          <div className="text-sm text-ink">Tebu</div>
          <div className="mt-1 text-[10px] text-ink-muted">Distrik Kurik — klaster bioetanol, dekat KTM Salor</div>
        </div>
      </div>
    </div>
  );
}

function VizConclusion() {
  const data = [...VILLAGE_STATUS];
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6">
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70} paddingAngle={2}>
            {data.map((_, i) => (
              <Cell key={i} fill={[SECOND, ACCENT, 'var(--color-line)', 'var(--color-ink-muted)'][i]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-2 space-y-1 text-xs text-ink-muted">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5" style={{ background: [SECOND, ACCENT, 'var(--color-line)', 'var(--color-ink-muted)'][i] }} />
            {d.name} — {d.value} desa
          </div>
        ))}
      </div>
      <div className="mt-2 text-[10px] text-ink-muted">125 desa · 31.321 jiwa di kawasan Food Estate</div>
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
    title: 'A megabiodiverse province, splitting off, planning a 1.2-million-hectare food program at the same time.',
    body: 'South Papua became Indonesia’s newest province under Law No. 14/2022. As one of its first statutory obligations, it needed an RPPLH — an Environmental Protection and Management Plan — precisely as the national Food Estate program began staking out land inside it. Indonesia is megabiodiverse and already exposed to the triple planetary crisis (climate change, pollution, biodiversity loss); a new province writing its first environmental plan while a large land-conversion program moves in is not a routine timing.',
    citations: [{ label: 'RPPLH Papua Selatan (2024)', where: 'Latar Belakang, slides 3–4' }],
  },
  {
    id: 'problem',
    kicker: 'The overlap',
    title: 'Food Estate and customary land occupy the same ground.',
    body: 'The Food Estate program targets 1.2 million hectares across six districts — Merauke, Tanah Miring, Semangga, Kurik, Janggebob, and Malind — part of a national push toward food self-sufficiency (Asta Cita 2). None of that land is empty: it sits inside a landscape already organized around sago groves, sacred sites, and customary conservation areas that predate the program by generations.',
    citations: [{ label: 'RPPLH Papua Selatan (2024)', where: 'Latar Belakang, slide 5' }],
  },
  {
    id: 'method',
    kicker: 'Method',
    title: 'DPSIR, plus an ecosystem-service inventory to make the vulnerability concrete.',
    body: 'The RPPLH is structured around the DPSIR framework — Driver, Pressure, State, Impact, Response — the standard planning lens for tracing how a development driver turns into environmental pressure and, eventually, a policy response. On top of it, KLHK’s 2022 ecosystem-service scoring gives that framework real numbers: how much of the Food Estate footprint is high-value for food production versus biodiversity support.',
    citations: [{ label: 'RPPLH Papua Selatan (2024)', where: 'Konsepsi DPSIR, slide 2; Inventarisasi, slides 15–16' }],
  },
  {
    id: 'finding1',
    kicker: 'Finding 01',
    title: 'The land best suited to grow food is also the land richest in biodiversity.',
    body: '74.63% of the 2.3-million-hectare study area scores class-4 (high) for food-provisioning ecosystem services — exactly what makes it attractive for Food Estate. But 67.88% of that same area also scores class-5 (very high) for biodiversity and habitat support, meaning the most food-productive land is simultaneously the most ecologically irreplaceable and the most vulnerable to conversion.',
    citations: [{ label: 'RPPLH Papua Selatan (2024)', where: 'Jasa Lingkungan Penyedia Pangan & Pendukung Kehati, slides 15–16' }],
    vizCitation: { fig: 'Skor jasa lingkungan', source: 'Pengolahan Data KLHK (2022), slides 15–16' },
  },
  {
    id: 'finding2',
    kicker: 'Finding 02',
    title: '471,026 hectares of indicative cultural space sit inside the Food Estate footprint.',
    body: 'Seven categories of customary and sacred space were mapped inside the development area — sacred sites alone account for 158,514 hectares, sago groves (a subsistence and cultural staple) for 110,358, customary conservation areas for 85,857, water sources, ancestral pathways, ancestor resting places, and old/sacred kampung for the rest. None of these were incidental findings; each was digitized and measured against the Food Estate boundary specifically.',
    citations: [{ label: 'RPPLH Papua Selatan (2024)', where: 'Indikasi Ruang Budaya, slide 19' }],
    vizCitation: { fig: 'Tabel indikasi ruang budaya', source: 'Pengolahan Data WWF, slide 19' },
  },
  {
    id: 'finding3',
    kicker: 'Finding 03',
    title: 'The ground is already moving faster than the paperwork.',
    body: 'Field verification found rice already planted at Desa Telaga Sari, with irrigation infrastructure under construction, and sugarcane at Distrik Kurik feeding a bioethanol cluster near Kota Terpadu Mandiri Salor. Two hundred excavators landed at a closed former fishing port at Wanam to start road works — a planned 140-km, 35-meter-wide route between Ilwayab, Wanam, Ngguti, and Muting, of which only 5 km carries environmental permits (UKL/UPL) and 135 km has no AMDAL at all. In the deep swamp sections, clearing has already spread to roughly a kilometer wide.',
    citations: [{ label: 'RPPLH Papua Selatan (2024)', where: 'Temuan Lapangan, slides 21–22' }],
    vizCitation: { fig: 'Temuan lapangan', source: 'Kunjungan Lapangan, slides 21–22' },
  },
  {
    id: 'conclusion',
    kicker: 'Where this leads',
    title: 'The people already living there have a 1,000-day answer.',
    body: 'Orang Asli Papua communities in the area already practice Sasi — a customary ritual, observed by every marga and its chief, that restricts resource extraction from a site for up to 1,000 days to let wildlife and vegetation regenerate. The RPPLH’s DPSIR "Response" stage points to documenting and folding that local knowledge into Food Estate planning directly, rather than treating conservation and development as a choice the program makes without it.',
    citations: [{ label: 'RPPLH Papua Selatan (2024)', where: 'Masyarakat Papua OAP sebagai Komunitas Bio-Kurtural, slide 20' }],
    vizCitation: { fig: 'Status desa (IPD) di kawasan FE', source: 'Pengolahan Data IDM (2018), slide 17' },
  },
];

export default function RpplhSouthPapuaScrollytelling() {
  return (
    <Scrollytelling
      eyebrow="A data-driven reading of South Papua's draft RPPLH"
      title={
        <>
          One landscape, <em className="text-accent not-italic">two claims</em> on the same ground.
        </>
      }
      dek="How South Papua's first Environmental Protection and Management Plan measured what a 1.2-million-hectare Food Estate program would actually displace — ecologically and culturally — before the land was fully converted."
      meta="Papua Selatan · 2024"
      sections={sections}
      viz={viz}
      sourceCitation={
        <>
          <div className="text-xs tracking-[0.25em] text-accent uppercase">Sumber</div>
          <p className="mt-2 text-ink">Pemerintah Provinsi Papua Selatan.</p>
          <p className="italic">Draft Materi Teknis Rencana Perlindungan dan Pengelolaan Lingkungan Hidup (RPPLH) Provinsi Papua Selatan.</p>
          <p className="mt-1 text-xs">Merauke, Agustus 2024. Data ekosistem: KLHK (2022); ruang budaya: WWF; status desa: IDM (2018).</p>
        </>
      }
    />
  );
}
