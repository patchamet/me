// staged-hero.jsx — reference implementation of the staged hero sequence.
// Uses tokens.css + animations.css + hooks.jsx.

import React from 'react';
import { PromptLine, MagneticButton } from './hooks.jsx';

export function StagedHero({
  eyebrow = '$ whoami',
  lines = ['Patchamet', 'Sriaksorn'],
  parens = '(Ohm Ω)',
  role  = 'fullstack developer',
  intro = 'A short paragraph that types itself in once the hero is settled.',
  primary   = { label: 'See timeline ↓', href: '#timeline' },
  secondary = { label: 'Get in touch',   href: 'mailto:hi@example.com' },
}) {
  // Step counter — each tick advances which lines are mounted/visible.
  const [step, setStep] = React.useState(0);

  React.useEffect(() => {
    const m = window.__SPD__ || 1;
    const ts = [120, 700, 700, 700, 600]; // ms between step transitions
    let i = 0;
    const tick = () => {
      i++;
      setStep(i);
      if (i < ts.length) setTimeout(tick, ts[i] / m);
    };
    setTimeout(tick, ts[0] / m);
  }, []);

  return (
    <section style={{ padding: '48px 32px 32px', position: 'relative', overflow: 'hidden' }}>
      {/* Soft decorative blob */}
      <div className="blob" style={{ width: 280, height: 280, top: -60, right: -80 }} />

      {/* Eyebrow — fades in at step 1 */}
      <div
        style={{
          fontFamily: 'var(--mono)', fontSize: 11,
          letterSpacing: '.16em', textTransform: 'uppercase',
          color: 'var(--ink-3)',
          opacity: step >= 1 ? 1 : 0, transition: 'opacity .4s',
        }}
      >
        <span className="prompt-pre">{eyebrow}</span>
      </div>

      {/* Display headline — types in at step 2 */}
      <h1
        style={{
          fontFamily: 'var(--sans)', fontWeight: 700,
          letterSpacing: '-0.04em', lineHeight: .92,
          fontSize: 60, margin: '14px 0 12px',
          minHeight: 60 * 3 * 0.92, // reserve space so layout doesn't jump
        }}
      >
        {step >= 2 && (
          <>
            <PromptLine text={lines[0]} speed={28} />
            <br />
            <PromptLine text={lines[1]} speed={28} startDelay={400} />
            <br />
            <span style={{ color: 'var(--ink-2)' }}>
              <PromptLine text={parens.replace('Ω', '')} speed={28} startDelay={900} caretAfter={false} />
              {step >= 3 && <span className="wobble">Ω</span>}
            </span>
          </>
        )}
      </h1>

      {/* Role — types in at step 3 */}
      <div
        style={{
          fontFamily: 'var(--mono)', fontSize: 13,
          letterSpacing: '.04em', color: 'var(--ink-2)',
          marginBottom: 22, minHeight: 18,
        }}
      >
        {step >= 3 && (
          <>
            <span className="prompt-pre">// </span>
            <PromptLine text={role} speed={22} />
          </>
        )}
      </div>

      {/* Intro paragraph — types in at step 4 */}
      <p
        style={{
          maxWidth: 380, color: 'var(--ink-2)',
          lineHeight: 1.6, fontSize: 14.5,
          marginBottom: 24, minHeight: 70,
        }}
      >
        {step >= 4 && <PromptLine text={intro} speed={8} />}
      </p>

      {/* Buttons — fade up at step 5 */}
      <div
        style={{
          display: 'flex', gap: 10, flexWrap: 'wrap',
          opacity: step >= 5 ? 1 : 0,
          transform: step >= 5 ? 'none' : 'translateY(8px)',
          transition: 'opacity .5s, transform .5s var(--ease-overshoot)',
        }}
      >
        <MagneticButton href={primary.href}>{primary.label}</MagneticButton>
        <MagneticButton href={secondary.href} secondary>{secondary.label}</MagneticButton>
      </div>
    </section>
  );
}
