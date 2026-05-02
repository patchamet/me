# Handoff — Style & Animation System (Ohm portfolio)

## Overview
This bundle captures the **visual style and animation behaviors** from the Ohm portfolio prototype. It is intentionally scoped to **CSS / motion only** — no app structure, routing, or content logic. Use it to dress up an existing site or component library so it has the same look and feel.

## About the Design Files
The HTML in `reference/Ohm.html` is a working **design reference** built with React + inline `<style>` tags via Babel-in-the-browser. It shows the exact final look. The task is to **port the styles + animations into your real codebase** (React, Vue, Svelte, plain HTML — whatever you use), not to copy the HTML wholesale.

`tokens.css` and `animations.css` are framework-agnostic — drop them into any project. The React hooks in `hooks.jsx` are small and trivially portable to whatever scroll/observer pattern you prefer (e.g. `IntersectionObserver` directly, Framer Motion, Motion One, etc.).

## Fidelity
**High-fidelity.** Exact tokens, timings, easings, and keyframes. Match these values; do not approximate.

---

## 1. Design Tokens

See `tokens.css` for copy-pasteable CSS custom properties.

### Color (light + dark)
| token | light | dark |
|---|---|---|
| `--bg` | `#fafaf7` | `#0e0d0a` |
| `--ink` | `#16140f` | `#f4f2ec` |
| `--ink-2` | `rgba(22,20,15,.62)` | `rgba(244,242,236,.62)` |
| `--ink-3` | `rgba(22,20,15,.38)` | `rgba(244,242,236,.38)` |
| `--line` | `rgba(22,20,15,.10)` | `rgba(244,242,236,.10)` |
| `--line-2` | `rgba(22,20,15,.18)` | `rgba(244,242,236,.18)` |
| `--chip` | `rgba(22,20,15,.04)` | `rgba(244,242,236,.06)` |
| `--accent` | `#16140f` | `#f4f2ec` |

Theme switch: set `data-theme="dark"` on `<html>`. Transition `background .35s, color .35s` on `html, body`.

### Type
- **Sans (UI):** Inter — weights 400/500/600/700
- **Serif (display only):** Instrument Serif — 400 + italic
- **Mono (code/eyebrow/buttons):** JetBrains Mono — 400/500/600

```html
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

Stack:
```css
--serif: 'Instrument Serif', 'Times New Roman', serif;
--sans:  'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
--mono:  'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
```

Common type roles:
- **Display H1** — sans, weight 700, letter-spacing −0.04em, line-height 0.92, ~60px
- **Section H2** — sans, weight 600, 18px, letter-spacing 0
- **Body** — sans, 14.5px, line-height 1.7, color `--ink-2`
- **Eyebrow / mono accents** — mono, 11px, letter-spacing 0.16em, uppercase, color `--ink-3`
- **Buttons** — mono, 12px, letter-spacing 0.04em

### Spacing & shape
- Section padding: `32px 32px`
- Standalone content max-width: `760px`, centered, with `padding-inline: clamp(20px, 4vw, 32px)`
- Pill radius: `999px` · button radius: `999px` · card radius: `0` (intentionally hard-edged)
- Hairlines: `1px solid var(--line)` (subtle), `var(--line-2)` (a touch firmer)

### Selection
```css
::selection { background: var(--ink); color: var(--bg); }
```

---

## 2. Easings & Timings (these are the personality)

Three easings do most of the work. Use them consistently or the vibe breaks.

| name | curve | use for |
|---|---|---|
| **`overshoot`** | `cubic-bezier(.18, 1.4, .4, 1)` | reveals, hovers, magnetic buttons — the playful springy one |
| **`smooth`** | `cubic-bezier(.2, .7, .2, 1)` | scroll reveals, drawing lines |
| **`pop`** | `cubic-bezier(.2, 1.6, .5, 1)` | dots, theme toggle, small "appear" pops |

Standard durations:
- micro hover: **250ms**
- reveal: **800ms**
- editorial mask-line slide: **1000ms**
- timeline draw: **1400ms**

### Speed multiplier (optional)
Every animation duration in the prototype is divided by `var(--spd-mult, 1)` (CSS) or `window.__SPD__` (JS). Wire a slow/normal/fast control by setting `--spd-mult` to `0.55 / 1 / 1.7`. Skip if you don't need it.

### Reduced motion
Wrap or include this — non-negotiable for accessibility:
```css
body[data-rm="on"] *,
body[data-rm="on"] *::before,
body[data-rm="on"] *::after,
@media (prefers-reduced-motion: reduce) {
  & *, & *::before, & *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 3. Animation patterns

See `animations.css` for full CSS, and `hooks.jsx` for the JS helpers.

### A. Scroll reveal (`.reveal` → `.reveal.in`)
Default state: `opacity: 0; transform: translateY(20px) scale(.98)`. When `.in` is added: ease back to identity over **800ms** with `overshoot`.

```css
.reveal { opacity: 0; transform: translateY(20px) scale(.98);
  transition: opacity .8s, transform .8s cubic-bezier(.18,1.4,.4,1); }
.reveal.in { opacity: 1; transform: none; }
```

Toggle `.in` via `IntersectionObserver` (threshold ~0.1) or the included `useInView` hook.

### B. Editorial mask-reveal text (line slides up from clip)
For headlines that should feel bookish/editorial:
```css
.mask-line { display: block; overflow: hidden; padding-bottom: .06em; }
.mask-line > span { display: inline-block; transform: translateY(110%);
  transition: transform 1s cubic-bezier(.2, .8, .2, 1); }
.mask-line.in > span { transform: none; }
```
Markup: `<h1><span class="mask-line"><span>Patchamet</span></span> ...</h1>`

### C. Underline link (animates from left)
```css
.underline-link { position: relative; color: inherit; text-decoration: none; }
.underline-link::after { content: ''; position: absolute; left: 0; right: 0; bottom: -2px;
  height: 1px; background: currentColor; transform: scaleX(0); transform-origin: left;
  transition: transform .35s cubic-bezier(.2, .7, .2, 1); }
.underline-link:hover::after { transform: scaleX(1); }
```

### D. Pill / chip (lift + invert on hover)
```css
.pill { padding: 8px 16px; border: 1px solid var(--line-2); border-radius: 999px;
  font: 500 12px var(--mono); white-space: nowrap; background: var(--bg);
  transition: transform .25s cubic-bezier(.18,1.4,.4,1), background .25s, color .25s; }
.pill:hover { transform: translateY(-3px) rotate(-2deg);
  background: var(--ink); color: var(--bg); }
```

### E. Marquee (infinite horizontal scroll)
Duplicate the items array, set `width: max-content`, animate `translateX(0) → translateX(-50%)`.
```css
.marquee { display: flex; gap: 14px; width: max-content;
  animation: marq calc(28s / var(--spd-mult, 1)) linear infinite; }
.marquee:hover { animation-play-state: paused; }
@keyframes marq { from { transform: translateX(0); } to { transform: translateX(-50%); } }
```

### F. Magnetic button (cursor pull)
On `mousemove`, set the button's `transform: translate(x, y)` where:
- `x = (mouseX - rectCenterX) * 0.35`
- `y = (mouseY - rectCenterY) * 0.35`

On `mouseleave` reset transform. CSS:
```css
.magnet { transition: transform .25s cubic-bezier(.18,1.4,.4,1), background .3s, color .3s; }
.magnet:hover { background: var(--ink); color: var(--bg); }
```

### G. Typewriter (with caret)
Reveal `text.slice(0, i)` over `setTimeout(speed)`, default `speed = 22ms` per char. Caret:
```css
.tw-caret { display: inline-block; width: 1ch;
  animation: blink 1s step-end infinite; color: var(--ink); }
@keyframes blink { 50% { opacity: 0; } }
```
Two flavors in `hooks.jsx`:
- **`<PromptLine>`** — types immediately on mount (good for staged hero)
- **`<PromptOnView>`** — types when scrolled into view

### H. Prompt prefix (terminal-style section titles)
Mono-tinted `$ cat` / `$ whoami` etc. before titles:
```css
.prompt-pre { font-family: var(--mono); color: var(--ink-3);
  margin-right: 8px; font-size: .78em; letter-spacing: .04em; }
```

### I. Wobble (decorative — applied to `Ω` glyph)
```css
.ohm-symbol { display: inline-block; animation: wobble 6s ease-in-out infinite; }
@keyframes wobble {
  0%, 100% { transform: rotate(-3deg); }
  50%      { transform: rotate(5deg); }
}
```

### J. Marker (horizontal line scales in)
```css
.marker { display: inline-block; height: 1px; width: 24px; background: currentColor;
  vertical-align: middle; margin-right: 10px; transform-origin: left;
  transform: scaleX(0); transition: transform .8s cubic-bezier(.2, .8, .2, 1) .15s; }
.marker.in { transform: scaleX(1); }
```

### K. Timeline (line draws + dots pop)
```css
.tl-line { position: absolute; left: 0; top: 0; width: 1px; height: 0;
  background: var(--ink); transition: height 1.4s cubic-bezier(.2, .7, .2, 1); }
.tl-line.in { height: 100%; }
.tl-dot  { position: absolute; left: -3px; width: 7px; height: 7px; border-radius: 50%;
  background: var(--bg); border: 1px solid var(--ink); transform: scale(0);
  transition: transform .5s cubic-bezier(.2, 1.6, .5, 1); }
.tl-dot.in { transform: scale(1); }
```
Stagger dots by adding `transition-delay: ${idx * 60 + 200}ms` per item.

### L. Theme toggle (round corner button)
- 42 × 42 circle, `border: 1px solid var(--line-2)`, `background: var(--bg)`, `color: var(--ink)`
- On hover: `transform: scale(1.08) rotate(-12deg)` over 250ms `overshoot`
- On change: animate the icon in with:
```css
@keyframes theme-pop {
  0%   { transform: scale(.4) rotate(-90deg); opacity: 0; }
  100% { transform: scale(1)   rotate(0);     opacity: 1; }
}
```
Apply via `key={theme}` in React (re-mount ⇒ animation replays) or by toggling a class.

### M. Card hover (timeline cards / similar)
```css
.tl-card { transition: transform .35s cubic-bezier(.18,1.4,.4,1), border-color .35s; }
.tl-card:hover { transform: translateY(-2px) rotate(-.4deg); border-color: var(--ink); }
```

### N. Decorative blob (soft background blur)
```css
.blob { position: absolute; border-radius: 50%; filter: blur(40px);
  opacity: .18; background: var(--ink); pointer-events: none; }
```
Place inside a hero with `position: relative; overflow: hidden;`.

---

## 4. Putting it together — staged hero sequence

Staged fade-ins make the hero feel composed (instead of everything popping at once). Pattern used in the Ohm hero:

```
t=0ms     eyebrow fades in
t=120ms   line 1 starts typing
t=820ms   line 2 starts typing (parens, italic accent)
t=1520ms  role line types
t=2220ms  intro paragraph types
t=2820ms  buttons fade up (8px translateY → 0)
```

A `useState(step)` counter advanced on `setTimeout` is enough — no animation library needed. See `staged-hero.jsx`.

---

## 5. Files in this bundle

| file | what it is |
|---|---|
| `tokens.css` | CSS custom properties — colors, fonts, easings. Drop into your global styles. |
| `animations.css` | All keyframes + utility classes (`.reveal`, `.pill`, `.marquee`, `.tw-caret` etc.) |
| `hooks.jsx` | Tiny React helpers: `useInView`, `useStaggeredIn`, `<PromptLine>`, `<PromptOnView>`, `<MagneticButton>`. ~80 lines, easy to translate. |
| `staged-hero.jsx` | Reference implementation of the staged hero sequence above. |
| `theme-toggle.jsx` | The round Sun/Moon toggle, including the `theme-pop` icon animation. |
| `reference/Ohm.html` | The full live prototype — open in a browser to see every animation in motion. |

## Implementation checklist

1. Drop `tokens.css` and `animations.css` into your global stylesheet pipeline.
2. Add the Google Fonts `<link>` to your document `<head>`.
3. Add `data-theme="light|dark"` toggling on `<html>`. Persist in `localStorage`.
4. For each scroll-driven animation, add `.reveal` (or `.mask-line`, `.marker` etc.) to the element and toggle `.in` when it enters the viewport. Use your stack's preferred IntersectionObserver wrapper.
5. Add `<MagneticButton>` and `<PromptLine>` where you want the personality moments — don't over-use them; the rule of thumb in the original is **one typewriter per page section**, **one or two magnetic buttons per page**.
6. Respect `prefers-reduced-motion` — the `body[data-rm="on"]` block in `tokens.css` covers both the manual toggle and the media query.
