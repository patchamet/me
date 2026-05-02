// hooks.jsx — small React helpers for the Ohm style/animation system.
// Trivially portable: each one is self-contained. Adapt to your stack as needed.

import React from 'react';

/* ──────────────────────────────────────────────────────────────────────────
   useInView — watch an element; flip `seen` to true once it enters viewport.
   Adds `.in` to elements with classes like .reveal / .mask-line / .marker.
   ────────────────────────────────────────────────────────────────────────── */
export function useInView({ threshold = 0.12, root = null, once = true } = {}) {
  const ref = React.useRef(null);
  const [seen, setSeen] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setSeen(true);
            if (once) obs.disconnect();
          } else if (!once) {
            setSeen(false);
          }
        }
      },
      { root, threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, root, once]);

  return [ref, seen];
}

/* ──────────────────────────────────────────────────────────────────────────
   useStaggeredIn — when in view, increments `n` from 0..count over time.
   Use for revealing list items one-by-one.
   ────────────────────────────────────────────────────────────────────────── */
export function useStaggeredIn(count, { step = 40, threshold = 0.1 } = {}) {
  const [ref, seen] = useInView({ threshold });
  const [n, setN] = React.useState(0);

  React.useEffect(() => {
    if (!seen) return;
    let cancelled = false;
    let i = 0;
    const m = window.__SPD__ || 1;
    const tick = () => {
      if (cancelled) return;
      setN(++i);
      if (i < count) setTimeout(tick, step / m);
    };
    tick();
    return () => { cancelled = true; };
  }, [seen, count, step]);

  return [ref, n];
}

/* ──────────────────────────────────────────────────────────────────────────
   <PromptLine> — types text once on mount with a blinking caret.
   ────────────────────────────────────────────────────────────────────────── */
export function PromptLine({ text, speed = 22, startDelay = 0, caretAfter = true }) {
  const [out, setOut] = React.useState('');
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    const m = window.__SPD__ || 1;
    let i = 0;
    const tick = () => {
      if (cancelled) return;
      i++;
      setOut(text.slice(0, i));
      if (i < text.length) setTimeout(tick, speed / m);
      else setDone(true);
    };
    const t = setTimeout(tick, startDelay / m);
    return () => { cancelled = true; clearTimeout(t); };
  }, [text, speed, startDelay]);

  return (
    <span>
      {out}
      {caretAfter && !done && <span className="tw-caret">▍</span>}
    </span>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   <PromptOnView> — types text only when the element scrolls into view.
   ────────────────────────────────────────────────────────────────────────── */
export function PromptOnView({ text, speed = 8 }) {
  const [ref, seen] = useInView({ threshold: 0.05 });
  const [out, setOut] = React.useState('');
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    if (!seen) return;
    let cancelled = false;
    const m = window.__SPD__ || 1;
    let i = 0;
    const tick = () => {
      if (cancelled) return;
      i++;
      setOut(text.slice(0, i));
      if (i < text.length) setTimeout(tick, speed / m);
      else setDone(true);
    };
    tick();
    return () => { cancelled = true; };
  }, [seen, text, speed]);

  return (
    <span ref={ref}>
      {out}
      {!done && seen && <span className="tw-caret">▍</span>}
    </span>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   <MagneticButton> — pulls toward the cursor on hover.
   Use the `.magnet` / `.magnet--secondary` classes from animations.css.
   ────────────────────────────────────────────────────────────────────────── */
export function MagneticButton({ children, href, secondary = false, strength = 0.35, ...rest }) {
  const ref = React.useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * strength;
    const y = (e.clientY - r.top - r.height / 2) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };
  const reset = () => { if (ref.current) ref.current.style.transform = ''; };

  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={'magnet' + (secondary ? ' magnet--secondary' : '')}
      {...rest}
    >
      {children}
    </a>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   <Reveal> — convenience wrapper that adds .reveal and toggles .in on view.
   ────────────────────────────────────────────────────────────────────────── */
export function Reveal({ as: Tag = 'div', className = '', children, ...rest }) {
  const [ref, seen] = useInView();
  return (
    <Tag ref={ref} className={`reveal ${seen ? 'in' : ''} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
