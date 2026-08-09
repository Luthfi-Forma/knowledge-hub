/*
 * The screen-reader fallback for a chart (M10/T-74, ADR-005).
 *
 * This is the single largest duplication in the scrollytelling code: the same
 * `<table className="sr-only">` block — caption, `<thead>` of `scope="col"`
 * headers, `<tbody>` mapping the very array already handed to Recharts — was
 * hand-written about sixteen times across the four modules. Every copy is a
 * chance to omit one, and omitting one means a chart that is `aria-hidden`
 * with no textual equivalent at all: a WCAG 1.1.1 failure that no build error
 * and no test would surface. (The tables exist because M6/ADR-004 added them
 * as one of its four accessibility fixes; the risk is losing them by
 * attrition, not by decision.)
 *
 * `<Chart>` composes this automatically so a chart cannot ship without one.
 * Use this component directly only for a visual that isn't a Recharts chart —
 * a hand-drawn SVG diagram carrying real figures, for instance.
 */

export type Cell = string | number;

export interface DataTableProps {
  /** Describes the data. Usually the same sentence as the chart's visible label. */
  caption: string;
  /** Column headers. The first names the row-header column. */
  columns: string[];
  /** One array per row, in `columns` order. The first cell becomes the row header. */
  rows: Cell[][];
}

/*
 * Numbers are formatted here rather than by the caller so every table reads
 * consistently — the original copies were inconsistent about this, some
 * calling `.toLocaleString('en-US')` and some interpolating the raw number.
 * Strings pass through untouched, which is the escape hatch for a value that
 * needs its own units or formatting ('1,092.49 ha', '1989–2027').
 */
function format(cell: Cell): string {
  return typeof cell === 'number' ? cell.toLocaleString('en-US') : cell;
}

export default function DataTable({ caption, columns, rows }: DataTableProps) {
  return (
    <table className="sr-only">
      <caption>{caption}</caption>
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c} scope="col">
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) =>
              // First cell is the row header, so a screen reader announces
              // "Cikarang Barat, Industrial, 1,825" rather than a bare number
              // stripped of what it belongs to.
              j === 0 ? (
                <th key={j} scope="row">
                  {format(cell)}
                </th>
              ) : (
                <td key={j}>{format(cell)}</td>
              ),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
