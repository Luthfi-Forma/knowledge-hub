import { type ComponentType } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from 'recharts';
import Scrollytelling, { type ScrollytellingSection } from '../../islands/Scrollytelling';

/*
 * Bespoke data + viz for src/content/posts/jabung-lampung-coastal-development.mdx.
 * Figures are read directly from Bappeda Lampung Timur's "Penyusunan
 * Wilayah Jabung dan Kawasan Pesisir Kabupaten Lampung Timur" (Laporan
 * Akhir, 2024). Correction from the previous version of this post: the
 * report's actual method is a Skalogram settlement-hierarchy analysis
 * (Bab IV.2) plus SWOT (IV.4) — the word "gravitasi"/"gravity" does not
 * appear anywhere in the 93-page report; the "gravity model" description
 * on the original post was inaccurate and has been replaced.
 */

const ACCENT = 'var(--color-chart-1)';
const SECOND = 'var(--color-chart-2)';
const MUTED = 'var(--color-ink-muted)';

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

const tooltipStyle = {
  background: 'var(--color-paper)',
  border: '1px solid var(--color-line)',
  borderRadius: 2,
  color: 'var(--color-ink)',
};

function VizIntro() {
  const reduceMotion = useReducedMotion() ?? false;
  const names = [
    'Way Jepara', 'Labuhan Maringgai', 'Sekampung Udik', 'Pasir Sakti', 'Mataram Baru',
    'Jabung', 'Waway Karya', 'Marga Sekampung', 'Bandar Sribhawono', 'Melinting', 'Gunung Pelindung', 'Braja Selebah',
  ];
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6">
      <div className="text-5xl font-semibold" style={{ color: ACCENT }}>12</div>
      <div className="mt-2 text-xs tracking-[0.25em] text-ink-muted uppercase">kecamatan, one planning area</div>
      <div className="mt-8 grid grid-cols-4 gap-2">
        {names.map((n, i) => (
          <motion.div
            key={n}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: reduceMotion ? 0 : i * 0.05, duration: reduceMotion ? 0 : 0.4 }}
            className="flex h-14 w-20 items-center justify-center px-1 text-center text-[9px] leading-tight text-ink-muted"
            style={{ background: n === 'Way Jepara' ? ACCENT : 'var(--color-line)', color: n === 'Way Jepara' ? 'var(--color-paper)' : undefined }}
          >
            {n}
          </motion.div>
        ))}
      </div>
      <div className="mt-3 text-[10px] tracking-widest text-ink-muted uppercase">Ek Jabung–Ek Labuhan Maringgai, Lampung Timur</div>
    </div>
  );
}

function VizProblem() {
  const reduceMotion = useReducedMotion() ?? false;
  return (
    <div className="flex h-full w-full flex-col justify-center gap-3 p-6">
      {RTRW_TIERS.map((t, i) => (
        <motion.div
          key={t.code}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: reduceMotion ? 0 : i * 0.1, duration: reduceMotion ? 0 : 0.4 }}
          className="border border-line bg-paper px-4 py-2.5"
        >
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-xs font-semibold" style={{ color: ACCENT }}>{t.code}</span>
            <span className="text-xs text-ink">{t.label}</span>
          </div>
          <div className="mt-1 text-[11px] text-ink-muted">{t.desc}</div>
        </motion.div>
      ))}
      <div className="mt-2 text-center text-[10px] text-ink-muted italic">
        Four RTRW tiers — but which one is actually fit to lead growth?
      </div>
    </div>
  );
}

function VizMethod() {
  const reduceMotion = useReducedMotion() ?? false;
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
            style={i === steps.length - 1 ? { borderColor: ACCENT, color: ACCENT, fontWeight: 500 } : { borderColor: 'var(--color-line)', color: 'var(--color-ink-muted)' }}
          >
            {s}
          </div>
          {i < steps.length - 1 && <div className="mx-auto h-4 w-px" style={{ background: 'var(--color-line)' }} />}
        </motion.div>
      ))}
    </div>
  );
}

function VizFinding1() {
  const reduceMotion = useReducedMotion() ?? false;
  return (
    <div className="flex h-full w-full flex-col p-4">
      <div className="mb-3 text-sm text-ink-muted">Capital candidates — IPD score &amp; facility-type count (of 19)</div>
      <div className="flex-1" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={CAPITAL_CANDIDATES} margin={{ left: 0, right: 20, top: 10, bottom: 10 }}>
            <XAxis dataKey="name" stroke={MUTED} tick={{ fill: 'var(--color-ink)', fontSize: 11 }} />
            <YAxis stroke={MUTED} tick={{ fill: MUTED, fontSize: 10 }} />
            <Tooltip cursor={{ fill: 'var(--color-line)' }} contentStyle={tooltipStyle} />
            <Bar dataKey="ipd" name="IPD score" fill={ACCENT} animationDuration={800} isAnimationActive={!reduceMotion} />
            <Bar dataKey="facilities" name="Facility types (/19)" fill={SECOND} animationDuration={800} isAnimationActive={!reduceMotion} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <table className="sr-only">
        <caption>Capital candidates — IPD score and facility-type count (of 19)</caption>
        <thead>
          <tr>
            <th scope="col">Kecamatan</th>
            <th scope="col">IPD score</th>
            <th scope="col">Facility types (/19)</th>
          </tr>
        </thead>
        <tbody>
          {CAPITAL_CANDIDATES.map((d) => (
            <tr key={d.name}>
              <th scope="row">{d.name}</th>
              <td>{d.ipd}</td>
              <td>{d.facilities}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-2 flex items-center gap-4 text-xs text-ink-muted">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5" style={{ background: ACCENT }} /> IPD score</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5" style={{ background: SECOND }} /> Facility types</span>
      </div>
    </div>
  );
}

function VizFinding2() {
  const reduceMotion = useReducedMotion() ?? false;
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6">
      <div aria-hidden="true">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={HIERARCHY_TIERS} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2} isAnimationActive={!reduceMotion}>
              {HIERARCHY_TIERS.map((_, i) => (
                <Cell key={i} fill={[ACCENT, SECOND, 'var(--color-line)'][i]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <table className="sr-only">
        <caption>Settlement hierarchy tiers, 12 kecamatan</caption>
        <thead>
          <tr>
            <th scope="col">Tier</th>
            <th scope="col">Kecamatan</th>
          </tr>
        </thead>
        <tbody>
          {HIERARCHY_TIERS.map((t) => (
            <tr key={t.name}>
              <th scope="row">{t.name}</th>
              <td>{t.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-2 space-y-1 text-xs text-ink-muted">
        {HIERARCHY_TIERS.map((t, i) => (
          <div key={t.name} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5" style={{ background: [ACCENT, SECOND, 'var(--color-line)'][i] }} />
            {t.name} — {t.value} kecamatan
          </div>
        ))}
      </div>
    </div>
  );
}

function VizFinding3() {
  const reduceMotion = useReducedMotion() ?? false;
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
          className="flex flex-1 flex-col items-center gap-2 border border-line bg-paper px-4 py-5 text-center"
        >
          <div className="text-xs font-medium tracking-widest uppercase" style={{ color: ACCENT }}>{z.label}</div>
          <div className="text-sm text-ink">{z.place}</div>
          <div className="mt-1 flex flex-wrap justify-center gap-1">
            {z.items.map((it) => (
              <span key={it} className="border border-line px-1.5 py-0.5 text-[10px] text-ink-muted">{it}</span>
            ))}
          </div>
          <div className="mt-1 text-[10px] text-ink-muted italic">{z.note}</div>
        </motion.div>
      ))}
    </div>
  );
}

function VizConclusion() {
  const reduceMotion = useReducedMotion() ?? false;
  return (
    <div className="flex h-full w-full flex-col p-4">
      <div className="mb-3 text-sm text-ink-muted">Three planning scenarios — % final achievement</div>
      <div className="flex-1" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={SCENARIOS} margin={{ left: 0, right: 20, top: 10, bottom: 10 }}>
            <XAxis dataKey="name" stroke={MUTED} tick={{ fill: 'var(--color-ink)', fontSize: 11 }} />
            <YAxis stroke={MUTED} tick={{ fill: MUTED, fontSize: 10 }} unit="%" />
            <Tooltip cursor={{ fill: 'var(--color-line)' }} contentStyle={tooltipStyle} />
            <Bar dataKey="kawasan" name="Area development" fill={ACCENT} animationDuration={800} isAnimationActive={!reduceMotion} />
            <Bar dataKey="infrastruktur" name="Infrastructure development" fill={SECOND} animationDuration={800} isAnimationActive={!reduceMotion} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <table className="sr-only">
        <caption>Planning scenarios — % final achievement</caption>
        <thead>
          <tr>
            <th scope="col">Scenario</th>
            <th scope="col">Area development</th>
            <th scope="col">Infrastructure development</th>
          </tr>
        </thead>
        <tbody>
          {SCENARIOS.map((s) => (
            <tr key={s.name}>
              <th scope="row">{s.name}</th>
              <td>{s.kawasan}%</td>
              <td>{s.infrastruktur}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-2 flex items-center gap-4 text-xs text-ink-muted">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5" style={{ background: ACCENT }} /> Area</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5" style={{ background: SECOND }} /> Infrastructure</span>
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
    title: 'Twelve sub-districts, one coastal planning area — but not one role each.',
    body: 'East Lampung Regency’s Jabung sub-region and its coastal strip span twelve kecamatan, from inland agricultural land to fishing ports on the Java Sea. The regency wanted two development models running at once — agropolitan zoning inland, minapolitan zoning along the coast — but pursuing both everywhere at once would have meant no real center for either.',
    citations: [{ label: 'Bappeda Lampung Timur (2024)', where: 'Background, Chapter I' }],
  },
  {
    id: 'problem',
    kicker: 'The gap',
    title: 'RTRW already sorts kecamatan into four tiers. It doesn’t say which one should lead.',
    body: 'The regency’s existing spatial plan (RTRW 2011–2031) already classifies each kecamatan as a Pusat Kegiatan Lokal, Promosi, Kawasan, or Lingkungan center — a policy label, not a ranking. Deciding which sub-districts had the underlying capacity to anchor real growth needed a method that scored them against each other, not just against an administrative category.',
    citations: [{ label: 'Bappeda Lampung Timur (2024)', where: 'Table IV.3 Service Center System, p. 56' }],
    vizCitation: { fig: 'Table IV.3', source: 'Service Center System, p. 56' },
  },
  {
    id: 'method',
    kicker: 'Method',
    title: 'Skalogram Analysis — not a gravity model.',
    body: 'The actual method scores each kecamatan against 19 facility and service indicators, weights them, and produces a Skalogram hierarchy score — the higher the score, the more developed the sub-district’s service base, and the stronger its case to anchor growth rather than depend on a neighboring center.',
    citations: [{ label: 'Bappeda Lampung Timur (2024)', where: 'Skalogram Analysis, pp. 56–57' }],
  },
  {
    id: 'finding1',
    kicker: 'Finding 01',
    title: 'Way Jepara scores highest — and becomes a candidate for a new district capital.',
    body: 'Way Jepara lands at Hierarki 1 with an IPD score of 32.73 and 13 of 19 facility types present — the strongest service base in the study area. Labuhan Maringgai, at Hierarki 2, actually carries more facility types (17 of 19) and a strategic coastal position, making both kecamatan candidates should Lampung Timur ever split into a new regency.',
    citations: [{ label: 'Bappeda Lampung Timur (2024)', where: 'Table IV.4 Skalogram Analysis Results, pp. 56–62' }],
    vizCitation: { fig: 'Table IV.4', source: 'Area Skalogram Analysis Results, pp. 56–62' },
  },
  {
    id: 'finding2',
    kicker: 'Finding 02',
    title: 'One main center, four secondary, seven hinterland.',
    body: 'Sorting all twelve kecamatan by their Skalogram hierarchy produces a clear shape: Way Jepara alone as the main growth pole, four kecamatan (Labuhan Maringgai, Sekampung Udik, Pasir Sakti, Mataram Baru) as secondary centers, and the remaining seven classified as hinterland — areas the plan supports rather than expects to lead.',
    citations: [{ label: 'Bappeda Lampung Timur (2024)', where: 'Table IV.4 Skalogram Analysis Results, pp. 56–62' }],
    vizCitation: { fig: 'Table IV.4', source: 'Area Skalogram Analysis Results, pp. 56–62' },
  },
  {
    id: 'finding3',
    kicker: 'Finding 03',
    title: 'The hierarchy becomes two zones: Agropolitan and Minapolitan.',
    body: 'Bandar Sribhawono — corn, cassava, rice, rubber, and palm oil, sitting on the province’s Feeder Road corridor — anchors the Agropolitan zone. Labuhan Maringgai and Pasir Sakti, with three working fishing ports and a growing crab-processing trade, anchor Minapolitan. Neither label was applied uniformly across the coastline — each traces back to a specific kecamatan’s Skalogram profile.',
    citations: [{ label: 'Bappeda Lampung Timur (2024)', where: 'Agropolitan & Minapolitan Concept, pp. 76–79' }],
    vizCitation: { fig: 'Area development concept', source: 'Chapter V.2, pp. 76–79' },
  },
  {
    id: 'conclusion',
    kicker: 'Where this leads',
    title: 'Three futures, same map — the difference is how much of it actually gets built.',
    body: 'The plan carries three delivery scenarios: optimistic (100% of planned area and infrastructure development realized), moderate (80%), and pessimistic (50%) — each tied directly to whether economic growth, the human development index, and infrastructure provisioning hit, undershoot, or badly miss the plan’s targets. The hierarchy and zoning are fixed; how much of them materializes isn’t.',
    citations: [{ label: 'Bappeda Lampung Timur (2024)', where: 'Table V.1 Scenario Comparison, p. 80' }],
    vizCitation: { fig: 'Table V.1', source: 'Planning Scenario Comparison, p. 80' },
  },
];

export default function JabungLampungCoastalDevelopmentScrollytelling() {
  return (
    <Scrollytelling
      eyebrow="A data-driven reading of Bappeda Lampung Timur's coastal area plan"
      title={
        <>
          One coastline, <em className="text-research not-italic">two centers</em> — sorted by the numbers.
        </>
      }
      dek="How a settlement-hierarchy analysis across twelve East Lampung sub-districts identified one main growth pole, four secondary centers, and the case for one Agropolitan and one Minapolitan zone."
      meta="Lampung Timur · 2024"
      sections={sections}
      viz={viz}
      sourceCitation={
        <>
          <div className="text-xs tracking-[0.25em] text-research uppercase">Source</div>
          <p className="mt-2 text-ink">Regional Development Planning Agency (Bappeda), Lampung Timur Regency.</p>
          <p className="italic">Penyusunan Wilayah Jabung dan Kawasan Pesisir Kabupaten Lampung Timur.</p>
          <p className="mt-1 text-xs">Final Report, 2024.</p>
        </>
      }
    />
  );
}
