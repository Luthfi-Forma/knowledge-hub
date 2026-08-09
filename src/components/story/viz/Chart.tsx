import type { ReactElement } from 'react';
import { ResponsiveContainer } from 'recharts';
import DataTable, { type Cell } from './DataTable';
import Legend, { type LegendItem } from './Legend';

/*
 * A Recharts chart plus the things it must never ship without (M10/T-74,
 * ADR-005).
 *
 * The point of this component is not to save the ~8 lines of wrapper markup.
 * It is that the accessible fallback is a REQUIRED PROP: `table` has no
 * default, so a chart without a screen-reader equivalent does not typecheck.
 * Previously the pairing was a convention maintained by copy-paste across
 * sixteen call sites — the kind of obligation that survives right up until
 * someone adds the seventeenth chart in a hurry.
 *
 * The same reasoning covers `aria-hidden` on the visual: it is applied here,
 * once, rather than being remembered per chart. A Recharts SVG announces as a
 * pile of unlabelled shapes, so hiding it and exposing the table instead is
 * what makes the figure legible rather than merely present.
 *
 * Verification note: `ResponsiveContainer` needs ResizeObserver, which does
 * not fire in this project's browser tool (docs/memory/LESSONS.md), so charts
 * render as empty boxes there. The DataTable does not depend on it — so the
 * table is the part that stays checkable in-tool, and confirming its rows
 * confirms the data reached the component even when the chart is invisible.
 */
export interface ChartProps {
  /** Visible one-line description above the chart. Also the table caption unless overridden. */
  label: string;
  /** Required: the screen-reader equivalent. `caption` defaults to `label`. */
  table: { columns: string[]; rows: Cell[][]; caption?: string };
  /** Optional swatch key, rendered under the chart. */
  legend?: LegendItem[];
  legendLayout?: 'inline' | 'stacked';
  /** A single Recharts chart element (BarChart, LineChart, PieChart, ...). */
  children: ReactElement;
}

export default function Chart({ label, table, legend, legendLayout, children }: ChartProps) {
  return (
    <div className="flex h-full w-full flex-col p-4">
      <div className="mb-3 text-sm text-ink-muted">{label}</div>
      <div className="min-h-0 flex-1" aria-hidden="true">
        {/* min-h-0 on the flex child above: without it the implicit
            `min-height: auto` lets a tall chart push past the container
            instead of shrinking into it — the same trap documented for
            aspect-ratio in Plate.astro (LESSONS 2026-08-04). */}
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
      {legend && <Legend items={legend} layout={legendLayout} />}
      <DataTable caption={table.caption ?? label} columns={table.columns} rows={table.rows} />
    </div>
  );
}
