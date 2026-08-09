import { useEffect, useRef, useState } from 'react';
import { VIZ_DURATION_MS } from './theme';

/*
 * One counting number, replacing three divergent copies (M10/T-74, ADR-005).
 *
 * The three shipped versions did not merely duplicate code — they behaved
 * differently, and one of them did not animate at all:
 *
 *   cikarang  {value, decimals, suffix}  useState(value), tweened from the
 *             previous display value. Since it initialises to `value`, the
 *             tween's start already equals its end, so it never animated on
 *             mount; and because every value in these modules is a module-
 *             level constant, `value` never changes either. In practice this
 *             copy was a STATIC number wearing an animation's clothes.
 *   bontang   {value}                    useState(0), tweened 0 -> value,
 *             Math.round'ed, 'en-US', 900ms.
 *   rpplh     {value, decimals}          useState(0), tweened 0 -> value, no
 *             rounding, 'en-US', 900ms.
 *
 * Reconciled semantics: initialise to `value`, and tween only when `value`
 * CHANGES. There is no count-up from zero on first mount, and that is a
 * deliberate correctness decision rather than a simplification.
 *
 * `useState(0)` is not merely a different animation choice — it puts a FALSE
 * FIGURE in the server-rendered HTML. Measured against the shipped build:
 * dist/posts/bontang-poverty-mapping/index.html contains "0" twice where
 * poverty counts belong, and rpplh-south-papua "0.0" twice. Astro renders the
 * island to static HTML, so anyone reading before hydration — JS disabled, a
 * failed or deferred hydration (T-71 measured `client:visible` never
 * hydrating in this project's own verification environment), a crawler, a
 * reader-mode extension — sees zero presented as a research finding. A
 * count-up from zero is worth nothing next to that.
 *
 * Initialising to `value` also happens to be what cikarang's copy did, which
 * is why cikarang is the one module whose figures were never wrong. Its
 * apparent bug (never animating) was the same line that kept it correct.
 *
 * The tween that remains is the one the persistent stage in ADR-005 #3
 * actually needs: when `value` changes because the reader scrolled to a
 * different scene, the figure morphs from the old number to the new one
 * rather than snapping. Under today's remounting shell values never change,
 * so this renders as a plain formatted number — correct, and honest about it.
 *
 * `reduceMotion` is a required prop, not a `useReducedMotion()` call (ADR-005
 * #4). Twenty-odd scattered hook calls each carried a chance of being
 * forgotten, and RULES.md puts the obligation on every island individually
 * because the global CSS net cannot reach JS motion. Passing it makes the
 * omission impossible and makes the reduced-motion path testable by flipping
 * one prop.
 */
export interface AnimatedNumberProps {
  value: number;
  /** Fraction digits, fixed (both min and max) so the width doesn't jitter mid-count. */
  decimals?: number;
  /** Appended verbatim after the formatted number, e.g. '%' or ' ha'. */
  suffix?: string;
  /** Resolved once by the stage and passed down — never read from a hook here. */
  reduceMotion: boolean;
  durationMs?: number;
}

export default function AnimatedNumber({
  value,
  decimals = 0,
  suffix = '',
  reduceMotion,
  durationMs = VIZ_DURATION_MS,
}: AnimatedNumberProps) {
  // Seeded with `value`, not 0 — this is what puts the true figure in the
  // server-rendered HTML. See the note above.
  const [display, setDisplay] = useState(value);
  // Mirrors `display` so the effect can read the current figure as its start
  // point without listing `display` as a dependency — which would restart the
  // tween on every frame it sets.
  const displayRef = useRef(value);

  useEffect(() => {
    if (reduceMotion) {
      displayRef.current = value;
      setDisplay(value);
      return;
    }
    const start = displayRef.current;
    // First mount (start === value) is a no-op tween; skip the rAF loop
    // entirely rather than scheduling a frame that changes nothing.
    if (start === value) return;
    const startTime = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - startTime) / durationMs);
      // Cubic ease-out. Matches --ease-out's character (fast start, long
      // settle) closely enough that the counter feels of a piece with the
      // rest of the interface; it was already hand-rolled identically in all
      // three original copies.
      const eased = 1 - Math.pow(1 - p, 3);
      const next = start + (value - start) * eased;
      displayRef.current = next;
      setDisplay(next);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, reduceMotion, durationMs]);

  return (
    <span className="tabular-nums">
      {/* 'en-US' explicitly, not undefined: cikarang's copy used the visitor's
          own locale, so the same figure rendered with different separators
          depending on who was reading. Site content is English throughout. */}
      {display.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}
