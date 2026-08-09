/*
 * One legend, replacing three inline variants (M10/T-74, ADR-005).
 *
 * cikarang had factored a local `Legend()` and reused it three times; the
 * other three modules hand-wrote swatch lists at each call site, in two
 * different shapes and with drifting spacing:
 *
 *   cikarang        mt-3, row gap-5, item gap-2
 *   bontang/jabung  mt-2, row gap-4, item gap-1.5
 *   rpplh           mt-2, COLUMN (space-y-1), item gap-2
 *
 * Two real layouts, so both survive as a prop; the spacing differences were
 * drift, so they collapse to one value each. The 10px swatch was the one
 * thing all four agreed on.
 */

export interface LegendItem {
  label: string;
  /** A token reference from ./theme — CHART_1, CHART_2, NEUTRAL — never a hex literal. */
  color: string;
}

export interface LegendProps {
  items: LegendItem[];
  /**
   * 'inline' reads as a caption under a chart with two or three series.
   * 'stacked' is for longer label text, or more entries than fit on one line
   * — it was rpplh's reason for going vertical.
   */
  layout?: 'inline' | 'stacked';
}

export default function Legend({ items, layout = 'inline' }: LegendProps) {
  const container =
    layout === 'inline'
      ? 'mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted'
      : 'mt-2 flex flex-col gap-1 text-xs text-ink-muted';

  return (
    // aria-hidden: the legend restates the encoding of a chart that is itself
    // aria-hidden, and <Chart>'s DataTable already carries every label and
    // figure in a form a screen reader can navigate. Announcing the swatch
    // list too would just be a second, worse copy of the same data.
    <div className={container} aria-hidden="true">
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 shrink-0" style={{ background: item.color }} />
          {item.label}
        </span>
      ))}
    </div>
  );
}
