// canvas-nav.jsx — Fixed top-left page switcher + theme toggle.
// Used by every canvas page (pipeline, source, crop, …). Renders a small
// floating pill linking between sibling canvases so the user can jump
// between pages instead of scrolling one huge canvas.

const CANVAS_LINKS = [
  { id: 'home',     name: '←',                href: '../index.html', title: 'Launcher' },
  { id: 'template', name: 'App shell',        href: '../template/index.html' },
  { id: 'projects', name: 'Projects',         href: '../projects/index.html' },
  { id: 'pipeline', name: 'Pipeline',         href: '../pipeline/index.html' },
  { id: 'source',   name: '1 · Source',       href: '../source/index.html' },
  { id: 'grayscale',name: '2 · Grayscale',    href: '../grayscale/index.html' },
  { id: 'crop',     name: '3 · Crop',         href: '../crop/index.html' },
  { id: 'hyphen_join', name: '14 · Hyphen',   href: '../hyphen_join/index.html' },
];

const CanvasNav = ({ current, theme, setTheme }) => (
  <div style={{
    position: 'fixed', top: 12, left: 16, zIndex: 50,
    display: 'flex', alignItems: 'center', gap: 6,
    background: 'rgba(21,21,27,0.85)', backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 999,
    padding: '3px 4px', boxShadow: '0 3px 10px rgba(0,0,0,0.35)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
    fontSize: 12,
  }}>
    {CANVAS_LINKS.map((l, i) => {
      const a = l.id === current;
      return (
        <React.Fragment key={l.id}>
          <a href={l.href} title={l.title || l.name} style={{
            textDecoration: 'none',
            background: a ? '#d6925a' : 'transparent',
            color: a ? '#1a0f08' : '#b0b0b8',
            padding: '5px 11px', borderRadius: 999, fontWeight: a ? 600 : 500,
            display: 'inline-flex', alignItems: 'center', gap: 6,
            letterSpacing: '0.01em',
          }}>
            {l.name}
          </a>
          {i === 0 ? (
            <span style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.10)', margin: '0 2px' }} />
          ) : null}
        </React.Fragment>
      );
    })}
    <span style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.10)', margin: '0 2px' }} />
    {['light', 'dark'].map(t => (
      <button key={t} onClick={() => setTheme(t)} style={{
        border: 0, cursor: 'pointer',
        background: theme === t ? '#d6925a' : 'transparent',
        color: theme === t ? '#1a0f08' : '#b0b0b8',
        padding: '5px 10px', borderRadius: 999, fontWeight: 500,
        display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12,
        fontFamily: 'inherit',
      }}>
        <Icon name={t === 'dark' ? 'moon' : 'sun'} size={12} />
        {t === 'dark' ? 'Dark' : 'Light'}
      </button>
    ))}
  </div>
);

Object.assign(window, { CanvasNav, CANVAS_LINKS });
