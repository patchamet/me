// theme-toggle.jsx — round Sun/Moon button with icon-pop animation.
// Persists choice in localStorage. Sets data-theme="light|dark" on <html>.

import React from 'react';

export function useTheme(defaultTheme = 'light', storageKey = 'theme') {
  const [theme, setTheme] = React.useState(() => {
    try { return localStorage.getItem(storageKey) || defaultTheme; }
    catch (_) { return defaultTheme; }
  });

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(storageKey, theme); } catch (_) {}
  }, [theme, storageKey]);

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  return [theme, toggle, setTheme];
}

export function ThemeToggle({ theme, onToggle }) {
  const dark = theme === 'dark';
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle theme"
      style={{
        position: 'fixed', top: 18, right: 20, zIndex: 50,
        width: 42, height: 42, borderRadius: 999,
        border: '1px solid var(--line-2)',
        background: 'var(--bg)', color: 'var(--ink)',
        cursor: 'pointer', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--mono)', fontSize: 16,
        backdropFilter: 'blur(8px)',
        transition:
          'background .35s, color .35s, border-color .35s, transform .25s var(--ease-overshoot)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08) rotate(-12deg)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = ''; }}
    >
      {/* `key={theme}` forces re-mount so the keyframe replays on each switch */}
      <span
        key={theme}
        style={{
          display: 'inline-block',
          animation: 'theme-pop .4s cubic-bezier(.2, 1.6, .5, 1)',
        }}
      >
        {dark ? '☾' : '☀'}
      </span>
    </button>
  );
}

// Usage:
//   const [theme, toggle] = useTheme();
//   return <ThemeToggle theme={theme} onToggle={toggle} />;
