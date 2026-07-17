import { useEffect, useMemo, useRef, useState, type ComponentType, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

export interface ScrollytellingCitation {
  label: string;
  where: string;
  quote?: string;
}

export interface ScrollytellingSection {
  id: string;
  kicker: string;
  title: string;
  body: string;
  citations: ScrollytellingCitation[];
  vizCitation?: { fig: string; source: string };
}

export interface ScrollytellingProps {
  eyebrow: string;
  title: ReactNode;
  dek: string;
  meta: string;
  sections: ScrollytellingSection[];
  viz: Record<string, ComponentType>;
  sourceCitation: ReactNode;
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(`sec-${id}`))
      .filter((el): el is HTMLElement => Boolean(el));
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id.replace('sec-', ''));
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(',')]);
  return active;
}

/** Whether `ref`'s element has any part in the viewport — used to only dock
 * the mobile viz panel while the reader is actually inside the scrollytelling
 * section, so it doesn't permanently cover the tags/related-posts below it. */
function useWithinViewport<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [within, setWithin] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setWithin(entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, within] as const;
}

function CitationBlock({ citations, sectionNumber }: { citations: ScrollytellingCitation[]; sectionNumber: number }) {
  if (citations.length === 0) return null;
  return (
    <details className="group mt-8 border border-line bg-paper-raised/60 open:bg-paper-raised">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-xs tracking-[0.2em] text-ink-muted uppercase hover:text-accent">
        <span>
          <span className="text-accent">§{sectionNumber}</span> · Sources for this claim
        </span>
        <span className="font-mono text-[10px] normal-case tracking-normal opacity-60 group-open:hidden">show ↓</span>
        <span className="hidden font-mono text-[10px] normal-case tracking-normal opacity-60 group-open:inline">
          hide ↑
        </span>
      </summary>
      <ul className="space-y-3 px-4 pt-1 pb-4">
        {citations.map((c, i) => (
          <li key={i} className="border-l-2 border-accent/50 pl-3 text-sm">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="font-medium text-ink">{c.label}</span>
              <span className="text-xs text-ink-muted">{c.where}</span>
            </div>
            {c.quote && (
              <blockquote className="mt-1 text-xs leading-relaxed text-ink-muted italic">“{c.quote}”</blockquote>
            )}
          </li>
        ))}
      </ul>
    </details>
  );
}

function SourcesPanel({
  open,
  onClose,
  activeId,
  sections,
  sourceCitation,
  reduceMotion,
}: {
  open: boolean;
  onClose: () => void;
  activeId: string;
  sections: ScrollytellingSection[];
  sourceCitation: ReactNode;
  reduceMotion: boolean;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-ink/40"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 280, damping: 32 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-line bg-paper shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <div>
                <div className="text-xs tracking-[0.3em] text-accent uppercase">Sources</div>
                <div className="font-display mt-1 text-lg text-ink">Where every claim comes from</div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="border border-line px-3 py-1 text-xs text-ink-muted hover:border-ink hover:text-ink"
              >
                Close
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="mb-6 border border-line bg-paper-raised p-4 text-sm leading-relaxed text-ink-muted">
                {sourceCitation}
              </div>
              <ol className="space-y-6">
                {sections.map((s, i) => {
                  const isActive = s.id === activeId;
                  return (
                    <li
                      key={s.id}
                      className={`border p-4 ${isActive ? 'border-accent bg-paper-raised' : 'border-line bg-paper-raised/40'}`}
                    >
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-xs text-accent">§{String(i + 1).padStart(2, '0')}</span>
                        <span className="text-xs tracking-[0.2em] text-ink-muted uppercase">{s.kicker}</span>
                      </div>
                      <div className="font-display mt-1 text-base text-ink">{s.title}</div>
                      {s.vizCitation && (
                        <div className="mt-3 text-xs">
                          <div className="tracking-[0.2em] text-ink-muted uppercase">Visualization</div>
                          <div className="mt-1 text-ink">
                            {s.vizCitation.fig} <span className="text-ink-muted">— {s.vizCitation.source}</span>
                          </div>
                        </div>
                      )}
                      <div className="mt-3 text-xs tracking-[0.2em] text-ink-muted uppercase">Text citations</div>
                      <ul className="mt-1 space-y-2">
                        {s.citations.map((c, ci) => (
                          <li key={ci} className="border-l-2 border-accent/40 pl-3 text-xs">
                            <div className="text-ink">
                              {c.label} <span className="text-ink-muted">· {c.where}</span>
                            </div>
                            {c.quote && <div className="mt-0.5 text-ink-muted italic">“{c.quote}”</div>}
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                })}
              </ol>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export default function Scrollytelling({ eyebrow, title, dek, meta, sections, viz, sourceCitation }: ScrollytellingProps) {
  const ids = useMemo(() => sections.map((s) => s.id), [sections]);
  const active = useActiveSection(ids);
  const activeIndex = Math.max(0, ids.indexOf(active));
  const activeSection = sections[activeIndex];
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const reduceMotion = useReducedMotion() ?? false;
  const [containerRef, withinViewport] = useWithinViewport<HTMLDivElement>();

  useEffect(() => {
    const isTypingTarget = (el: EventTarget | null) => {
      if (!(el instanceof HTMLElement)) return false;
      return el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName);
    };
    let animating = false;
    const onKey = (e: KeyboardEvent) => {
      if (sourcesOpen || isTypingTarget(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
      const isDown = e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey);
      const isUp = e.key === 'PageUp' || (e.key === ' ' && e.shiftKey);
      if (!isDown && !isUp) return;

      const anchors = [
        0,
        ...ids
          .map((id) => {
            const el = document.getElementById(`sec-${id}`);
            if (!el) return null;
            return el.getBoundingClientRect().top + window.scrollY - 96;
          })
          .filter((n): n is number => n !== null),
      ].sort((a, b) => a - b);

      const y = window.scrollY;
      let target: number | null = null;
      if (isDown) {
        target = anchors.find((a) => a > y + 8) ?? null;
      } else {
        for (let i = anchors.length - 1; i >= 0; i--) {
          if (anchors[i] < y - 8) {
            target = anchors[i];
            break;
          }
        }
      }
      if (target == null || animating) return;
      e.preventDefault();
      animating = true;
      window.scrollTo({ top: Math.max(0, target), behavior: reduceMotion ? 'auto' : 'smooth' });
      window.setTimeout(() => {
        animating = false;
      }, 700);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [ids, sourcesOpen, reduceMotion]);

  const ActiveViz = viz[active];

  return (
    <div className="border-y border-line">
      <SourcesPanel
        open={sourcesOpen}
        onClose={() => setSourcesOpen(false)}
        activeId={active}
        sections={sections}
        sourceCitation={sourceCitation}
        reduceMotion={reduceMotion}
      />

      {/* Hero — no horizontal padding/max-w of its own: the caller (post
          detail page) already constrains width via its .max-w-(--container-content) */}
      <section className="flex flex-col items-center justify-center py-16 text-center">
        <p className="mb-4 text-xs tracking-[0.35em] text-accent uppercase">{eyebrow}</p>
        <h2 className="font-display max-w-3xl text-4xl leading-[1.1] font-extrabold text-ink sm:text-5xl">{title}</h2>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-muted">{dek}</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs tracking-wide text-ink-muted uppercase">
          <span>{meta}</span>
          <button
            type="button"
            onClick={() => setSourcesOpen(true)}
            className="border border-line px-3 py-1.5 text-ink-muted hover:border-accent hover:text-accent"
          >
            Sources
          </button>
        </div>
      </section>

      {/* Body — same width-inheriting rule as the hero above */}
      <div ref={containerRef} className="pb-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Text column */}
          <div className="lg:col-span-6">
            {sections.map((s, i) => (
              <section key={s.id} id={`sec-${s.id}`} className="flex min-h-[70vh] flex-col justify-center py-14 first:pt-0">
                <div className="mb-3 flex items-center gap-3">
                  <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-xs tracking-[0.3em] text-ink-muted uppercase">{s.kicker}</span>
                </div>
                <h3 className="font-display text-2xl leading-[1.2] text-ink sm:text-3xl">{s.title}</h3>
                <p className="mt-4 text-base leading-relaxed text-ink-muted">{s.body}</p>
                <CitationBlock citations={s.citations} sectionNumber={i + 1} />
              </section>
            ))}
          </div>

          {/* Sticky viz (desktop) */}
          <div className="hidden lg:col-span-6 lg:block">
            <div className="sticky top-20 flex h-[calc(100vh-6rem)] flex-col justify-center gap-3">
              <div className="relative h-[68vh] w-full overflow-hidden border border-line bg-paper-raised">
                <div className="absolute inset-x-0 top-0 z-10 h-[2px] bg-line">
                  <motion.div
                    className="h-full origin-left bg-accent"
                    animate={{ scaleX: (activeIndex + 1) / sections.length }}
                    transition={{ duration: reduceMotion ? 0 : 0.4 }}
                  />
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
                    transition={{ duration: reduceMotion ? 0 : 0.4 }}
                    className="absolute inset-0"
                  >
                    {ActiveViz && <ActiveViz />}
                  </motion.div>
                </AnimatePresence>
                <div className="pointer-events-none absolute right-4 bottom-3 font-mono text-[10px] tracking-widest text-ink-muted uppercase">
                  fig. {String(activeIndex + 1).padStart(2, '0')}
                </div>
              </div>
              {activeSection?.vizCitation && (
                <div className="flex items-center justify-between gap-4 border border-line bg-paper-raised/60 px-4 py-2 text-xs">
                  <span className="flex items-center gap-2 text-ink-muted">
                    <span className="font-mono text-[10px] tracking-widest text-accent uppercase">Drawn from</span>
                    <span className="text-ink">{activeSection.vizCitation.fig}</span>
                  </span>
                  <span className="truncate text-ink-muted">{activeSection.vizCitation.source}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile viz — fixed dock, only while the reader is inside this section */}
        {withinViewport && (
          <div className="fixed inset-x-0 bottom-0 z-30 h-[38vh] border-t border-line bg-paper-raised lg:hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.3 }}
                className="h-full"
              >
                {ActiveViz && <ActiveViz />}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
        <div className="h-[38vh] lg:hidden" />
      </div>
    </div>
  );
}
