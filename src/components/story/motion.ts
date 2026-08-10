/*
 * The site's two easing curves, for JS motion (M10/T-76).
 *
 * Same values as --ease-out / --ease-in-out in global.css, restated as arrays
 * because motion/react cannot read a CSS custom property for its `ease`
 * field. They must stay in sync with the stylesheet — this is one system
 * expressed twice, not two systems.
 *
 * First written inline in src/islands/Scrollytelling.tsx during T-72; pulled
 * out here the moment a second consumer appeared, rather than left to be
 * copied. The same drift that produced four identical `tooltipStyle` objects
 * starts exactly this way.
 *
 * ease-out: anything entering, leaving, or responding to the reader.
 * ease-in-out: anything travelling across the screen while staying present.
 */
export const EASE_OUT = [0.23, 1, 0.32, 1] as const;
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;

/**
 * Duration for stage chrome, in seconds.
 *
 * 0.2s = the 200ms "layout/position" tier in docs/RULES.md. Stage chrome is UI,
 * so it is bound by Atlas's 300ms ceiling — unlike explanatory animation
 * *inside* a visualisation, which RULES.md treats as a separate category with
 * its own rules (see VIZ_DURATION_MS in ./viz/theme).
 */
export const STAGE_DURATION_S = 0.2;
