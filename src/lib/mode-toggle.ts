// Shared Reading/Immersive mode logic (M5, ADR-003) — used by both the
// header toggle button (Header.astro) and the registration seam
// (RegistrationSeam.astro), so the two controls can't drift out of sync
// with each other. Tier-1 vanilla, imported as a plain ES module into
// component <script> tags — no framework, no client:* directive.
const KEY = 'kh-mode';

export type Mode = 'reading' | 'immersive';

export function getMode(): Mode {
  return document.documentElement.dataset.mode === 'immersive' ? 'immersive' : 'reading';
}

export function setMode(mode: Mode) {
  if (mode === 'immersive') {
    document.documentElement.dataset.mode = 'immersive';
  } else {
    delete document.documentElement.dataset.mode;
  }
  try {
    localStorage.setItem(KEY, mode);
  } catch {
    // localStorage unavailable (private mode, disabled storage, etc.) — the
    // mode still applies for this page view, it just won't persist.
  }
  // Lets any other control on the page (e.g. the registration seam) stay in
  // sync when the mode changes from elsewhere, without a hard dependency
  // between the two components.
  document.dispatchEvent(new CustomEvent<Mode>('kh-mode-change', { detail: mode }));
}
