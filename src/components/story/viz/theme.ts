/*
 * Shared visual constants for story visualisations (M10/T-74, ADR-005).
 *
 * Before this file, every scrollytelling module re-declared the same values
 * privately: `tooltipStyle` appeared as a byte-identical object literal in all
 * four modules, and the colour constants were aliased three times under one
 * set of names (ACCENT/SECOND/MUTED) and once under another (IND/RES/MUTED in
 * cikarang) for the same underlying tokens. Nothing enforced that they stayed
 * equal; they simply hadn't drifted yet.
 *
 * Values are CSS custom-property references, never hex literals. That is what
 * lets a palette change in global.css reach every chart with zero React edits
 * — the invariant ADR-003 #5 established and ADR-004 #4 deliberately carried
 * forward by keeping --color-chart-1/2 alive as aliases.
 */

/** Series 1. Aliases --color-research (green). */
export const CHART_1 = 'var(--color-chart-1)';

/** Series 2. Aliases --color-project (blue). */
export const CHART_2 = 'var(--color-chart-2)';

/** Axes, ticks, and secondary labels. */
export const MUTED = 'var(--color-ink-muted)';

/*
 * Filler for a third-or-later category. Atlas defines exactly two data series
 * (docs/design/atlas/README.md), so anything beyond two is deliberately
 * NEUTRAL rather than a third invented hue — a chart that needs three
 * distinguishable series is a signal the chart should be split, not that the
 * palette should grow.
 *
 * --color-line is 1.5:1 against paper and documented as decorative-only, so
 * it must never be the sole carrier of meaning: pair it with a direct label
 * or the sr-only DataTable that <Chart> already enforces.
 */
export const NEUTRAL = 'var(--color-line)';

/**
 * Recharts `<Tooltip contentStyle>`. `borderRadius: 2` is the one surviving
 * non-zero radius in the codebase — it predates Atlas's zero-radius rule and
 * is kept here only so extracting this object changes nothing visually. If
 * the radius audit (`grep -rn "border-radius" src/`) is ever tightened to
 * include JS style objects, this is the single place to set it to 0.
 */
export const tooltipStyle = {
  background: 'var(--color-paper)',
  border: '1px solid var(--color-line)',
  borderRadius: 2,
  color: 'var(--color-ink)',
} as const;

/**
 * Duration for a chart's own entrance animation, in ms.
 *
 * Deliberately outside Atlas's 120/200/300ms ceiling: that ceiling governs UI
 * chrome (hover, focus, drawers, state swaps), while a chart drawing itself is
 * *explanatory* motion — the animation is the explanation, and compressing it
 * to 300ms destroys what it explains. This is the second motion category
 * written into docs/RULES.md by T-72. The binding rules that DO apply here:
 * it plays once (never `repeat: Infinity`, a real WCAG 2.2.2 failure found in
 * T-35) and it must be skippable via reduced motion.
 *
 * 900ms reconciles the 800/900/1000/1200 values the four modules used ad hoc.
 */
export const VIZ_DURATION_MS = 900;
