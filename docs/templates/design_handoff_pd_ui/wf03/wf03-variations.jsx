// wf03-variations.jsx — WF-03 Source Quality.
// Two directions for surfacing post-ingest quality flags inside the
// Project Configure → Pages tab. Edge-case-heavy mock data.

const { useState: useStE } = React;

/* ---------------------- Project Configure shell ---------------------- */

const ConfigureHeader = () => (
  <div style={{ padding: '24px 32px 18px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--ink-3)', marginBottom: 8 }}>
      <Icon name="chevL" size={12} />
      <span>Projects</span>
      <Icon name="chevR" size={11} style={{ color: 'var(--ink-4)' }} />
      <span style={{ color: 'var(--ink-2)' }}>belloc-survivals</span>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink-1)' }}>Belloc — Survivals & New Arrivals</h1>
          <Badge tone="brand" mono>configured</Badge>
        </div>
        <div className="mono" style={{ marginTop: 6, fontSize: 11.5, color: 'var(--ink-3)' }}>
          232 pages · ingested 12 min ago · f001–f016 · p001–p216
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="outline" size="md" icon="download">Build package</Button>
        <Button variant="primary" size="md" icon="arrowR">Run all dirty</Button>
      </div>
    </div>
  </div>
);

const ConfigureTabs = ({ current = 'pages' }) => {
  const items = [
    { id: 'pipeline', name: 'Pipeline' },
    { id: 'pages',    name: 'Pages',  count: '232' },
    { id: 'settings', name: 'Settings' },
  ];
  return (
    <div style={{
      padding: '0 32px',
      borderBottom: '1px solid var(--border-1)',
      display: 'flex', alignItems: 'flex-end', gap: 4,
    }}>
      {items.map(t => {
        const active = current === t.id;
        return (
          <div key={t.id} style={{
            padding: '12px 14px',
            borderBottom: active ? '2px solid var(--ink-1)' : '2px solid transparent',
            marginBottom: -1,
            display: 'flex', alignItems: 'center', gap: 8,
            color: active ? 'var(--ink-1)' : 'var(--ink-3)',
            fontSize: 13.5, fontWeight: active ? 600 : 500,
            cursor: 'pointer',
          }}>
            {t.name}
            {t.count ? <span className="mono" style={{
              padding: '0 6px', height: 18, borderRadius: 9,
              background: active ? 'var(--bg-raised)' : 'transparent',
              border: '1px solid var(--border-1)',
              fontSize: 11, color: 'var(--ink-3)',
              display: 'inline-flex', alignItems: 'center',
            }}>{t.count}</span> : null}
          </div>
        );
      })}
    </div>
  );
};

/* ---------------------- Banner (variation A) ---------------------- */

const QualityBanner = ({ flagged, total, severe, stage = 'source' }) => {
  const detail = STAGE_FLAG_DETAIL[stage] || STAGE_FLAG_DETAIL.source;
  const ratio = flagged / total;
  const extreme = severe || ratio > 0.7;
  return (
    <div style={{
      margin: '20px 32px 0',
      borderRadius: 10,
      border: `1px solid ${extreme ? 'color-mix(in oklab, var(--mismatch) 55%, var(--border-1))' : 'color-mix(in oklab, var(--fuzzy) 45%, var(--border-1))'}`,
      background: extreme ? 'color-mix(in oklab, var(--mismatch) 8%, var(--bg-surface))' : 'color-mix(in oklab, var(--fuzzy) 8%, var(--bg-surface))',
      display: 'flex', alignItems: 'stretch', overflow: 'hidden',
    }}>
      <div style={{ width: 4, background: extreme ? 'var(--mismatch)' : 'var(--fuzzy)' }} />
      <div style={{ flex: 1, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, minWidth: 0 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, flex: '0 0 auto',
            background: extreme ? 'color-mix(in oklab, var(--mismatch) 18%, var(--bg-surface))' : 'color-mix(in oklab, var(--fuzzy) 18%, var(--bg-surface))',
            color: extreme ? 'var(--mismatch)' : 'var(--fuzzy)',
            display: 'grid', placeItems: 'center',
          }}>
            <Icon name="alert" size={16} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-1)' }}>
              {extreme
                ? `${flagged} of ${total} pages flagged · ${detail.title.toLowerCase()}`
                : `${flagged} pages flagged · ${detail.title.toLowerCase()}`}
            </div>
            <div style={{ marginTop: 3, fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.5 }}>
              {detail.sub} <span style={{ color: 'var(--ink-3)' }}>Tune thresholds, re-run for selected, or accept and proceed.</span>
            </div>
            <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {detail.flags.map(f => (
                <FlagChip key={f.kind} kind={f.kind} count={extreme ? Math.round(f.count * 4) : f.count} />
              ))}
              {extreme ? <FlagChip kind="errored" count={3} /> : null}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flex: '0 0 auto' }}>
          <Button variant="outline" size="md">Tune thresholds</Button>
          <Button variant="primary" size="md" iconRight="arrowR">View flagged</Button>
        </div>
      </div>
      <button style={{
        width: 36, alignSelf: 'stretch', background: 'transparent', border: 0,
        borderLeft: '1px solid var(--border-1)', color: 'var(--ink-3)', cursor: 'pointer',
      }}>
        <Icon name="x" size={14} />
      </button>
    </div>
  );
};

/* ---------------------- Quality flags ---------------------- */

/* ---------------------- Pipeline stages + flag taxonomy ---------------------- */

const STAGE_DEFS = [
  { id: 'source',       short: 'source',      group: 'Source' },
  { id: 'initial_crop', short: 'init crop',   group: 'Source' },
  { id: 'dewarp',       short: 'dewarp',      group: 'Source' },
  { id: 'deskew',       short: 'deskew',      group: 'Source' },
  { id: 'grayscale',    short: 'grayscale',   group: 'Image' },
  { id: 'threshold',    short: 'threshold',   group: 'Image' },
  { id: 'denoise',      short: 'denoise',     group: 'Image' },
  { id: 'canvas_map',   short: 'canvas',      group: 'Image' },
  { id: 'text_zones',   short: 'zones',       group: 'OCR' },
  { id: 'ocr',          short: 'ocr',         group: 'OCR' },
  { id: 'spellcheck',   short: 'spell',       group: 'OCR' },
  { id: 'text_review',  short: 'review',      group: 'OCR' },
  { id: 'illust',       short: 'illust',      group: 'Pack' },
  { id: 'hyphen_join',  short: 'hyphen',      group: 'Pack' },
  { id: 'regex',        short: 'regex',       group: 'Pack' },
  { id: 'page_split',   short: 'split',       group: 'Pack' },
  { id: 'proof_pack',   short: 'proof',       group: 'Pack' },
  { id: 'validation',   short: 'validate',    group: 'Pack' },
  { id: 'zip',          short: 'zip',         group: 'Pack' },
  { id: 'build_package',short: 'package',     group: 'Pack' },
  { id: 'submit_check', short: 'submit',      group: 'Pack' },
  { id: 'archive',      short: 'archive',     group: 'Pack' },
];

const STAGE_FLAGS = {
  source:      ['blurry', 'skew', 'dark', 'sparse'],
  initial_crop:['cropped', 'asymmetric', 'loose'],
  threshold:   ['under', 'over', 'halftone', 'mixed'],
  deskew:      ['residual', 'baseline'],
  canvas_map:  ['overflow', 'blank', 'misaligned'],
  ocr:         ['low-conf', 'no-text', 'garbled', 'mixed-lang'],
};

const STAGE_FLAG_DETAIL = {
  source: {
    title: 'Source quality issues',
    sub: 'Detected before pipeline run · blur, contrast, skew, sparse content.',
    flags: [
      { kind: 'blurry', count: 22, blurb: 'Laplacian < 80' },
      { kind: 'skew',   count: 11, blurb: 'angle > 5°' },
      { kind: 'dark',   count: 8,  blurb: 'σ < 22 / contrast' },
      { kind: 'sparse', count: 14, blurb: 'bbox < 20%' },
    ],
  },
  threshold: {
    title: 'Threshold output needs attention',
    sub: 'Pixel-count anomalies after Otsu fallback. Re-run with tuned cutoff or accept.',
    flags: [
      { kind: 'over',     count: 12, blurb: 'fg > 38%'      },
      { kind: 'under',    count: 6,  blurb: 'fg < 4%'       },
      { kind: 'halftone', count: 9,  blurb: 'gray bleed'    },
      { kind: 'mixed',    count: 4,  blurb: 'two regions'   },
    ],
  },
  ocr: {
    title: 'OCR low-confidence pages',
    sub: 'Pages OCR fell back on, or returned implausible character distributions.',
    flags: [
      { kind: 'low-conf',   count: 18, blurb: 'mean < 0.74' },
      { kind: 'no-text',    count: 2,  blurb: '0 baselines'  },
      { kind: 'garbled',    count: 7,  blurb: '≥ 30% non-word' },
      { kind: 'mixed-lang', count: 3,  blurb: 'fr / la mix'    },
    ],
  },
};

const FLAG_TONE = {
  blurry: 'var(--fuzzy)', skew: '#a855f7', dark: 'var(--ink-2)', sparse: '#0ea5e9',
  cropped: 'var(--fuzzy)', asymmetric: '#a855f7', loose: '#0ea5e9',
  under: '#0ea5e9', over: 'var(--fuzzy)', halftone: '#a855f7', mixed: '#f97316',
  residual: 'var(--fuzzy)', baseline: '#0ea5e9',
  overflow: 'var(--mismatch)', blank: 'var(--ink-2)', misaligned: '#a855f7',
  'low-conf': 'var(--fuzzy)', 'no-text': 'var(--ink-2)', garbled: 'var(--mismatch)', 'mixed-lang': '#a855f7',
  errored: 'var(--mismatch)',
};

const toneFor = (k) => FLAG_TONE[k] || 'var(--ink-3)';

/* legacy FLAG_META for source-stage flags — used by banner & badges below */
const FLAG_META = {
  blurry:  { name: 'blurry',  tone: 'var(--fuzzy)',   icon: 'image' },
  skew:    { name: 'skew',    tone: '#a855f7',             icon: 'image' },
  dark:    { name: 'dark',    tone: 'var(--ink-2)',        icon: 'image' },
  sparse:  { name: 'sparse',  tone: '#0ea5e9',             icon: 'image' },
  errored: { name: 'errored', tone: 'var(--mismatch)',  icon: 'alert' },
};

const FlagChip = ({ kind, count, active, onClick, mute, label, tone }) => {
  const m = FLAG_META[kind] || { name: kind, tone: tone || toneFor(kind), icon: 'image' };
  return (
    <span onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      height: 22, padding: '0 9px', borderRadius: 999,
      fontSize: 11.5, fontWeight: 500, cursor: onClick ? 'pointer' : 'default',
      background: active ? `color-mix(in oklab, ${m.tone} 22%, var(--bg-surface))` : 'var(--bg-surface)',
      border: `1px solid ${active ? m.tone : 'var(--border-1)'}`,
      color: mute ? 'var(--ink-4)' : 'var(--ink-2)',
      opacity: mute ? 0.6 : 1,
    }}>
      <span style={{ width: 7, height: 7, borderRadius: 99, background: m.tone, opacity: mute ? 0.45 : 1 }} />
      <span>{label || m.name}</span>
      {count != null ? (
        <span className="mono" style={{
          padding: '0 5px', height: 14, borderRadius: 7,
          background: 'var(--bg-raised)', fontSize: 10, fontWeight: 600,
          color: 'var(--ink-2)', display: 'inline-flex', alignItems: 'center',
        }}>{count}</span>
      ) : null}
    </span>
  );
};

const RowFlagBadge = ({ kind }) => {
  const tone = toneFor(kind);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      height: 18, padding: '0 7px', borderRadius: 999, fontSize: 10.5, fontWeight: 600,
      letterSpacing: '.01em',
      background: `color-mix(in oklab, ${tone} 16%, var(--bg-surface))`,
      color: 'var(--ink-1)',
      border: `1px solid color-mix(in oklab, ${tone} 40%, var(--border-1))`,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: 99, background: tone }} />
      {kind}
    </span>
  );
};

/* ---------------------- Pipeline stage strip ---------------------- */

const STAGE_STATE_BY_INDEX = (currentIdx) => (i) => {
  if (i < currentIdx) return 'clean';
  if (i === currentIdx) return 'running';
  return 'notrun';
};

const StageJumpPopover = ({ currentStage }) => {
  const curIdx = Math.max(0, STAGE_DEFS.findIndex(s => s.id === currentStage));
  const groups = ['Source', 'Image', 'OCR', 'Pack'];
  // Pre-canned per-stage status for the mockup
  const detail = {
    source:        { state: 'clean',   counts: '232 clean' },
    initial_crop:  { state: 'clean',   counts: '232 clean' },
    dewarp:        { state: 'clean',   counts: '232 clean' },
    deskew:        { state: 'clean',   counts: '224 clean · 8 dirty' },
    grayscale:     { state: 'clean',   counts: '232 clean' },
    threshold:     { state: 'dirty',   counts: '167 dirty · 31 flagged' },
    denoise:       { state: 'notrun',  counts: '— pending' },
    canvas_map:    { state: 'notrun',  counts: '— pending' },
    text_zones:    { state: 'notrun',  counts: '— pending' },
    ocr:           { state: 'notrun',  counts: '— pending' },
    spellcheck:    { state: 'notrun',  counts: '— pending' },
    text_review:   { state: 'notrun',  counts: '— pending' },
    illust:        { state: 'notrun',  counts: '— pending' },
    hyphen_join:   { state: 'notrun',  counts: '— pending' },
    regex:         { state: 'notrun',  counts: '— pending' },
    page_split:    { state: 'notrun',  counts: '— pending' },
    proof_pack:    { state: 'notrun',  counts: '— pending' },
    validation:    { state: 'notrun',  counts: '— pending' },
    zip:           { state: 'notrun',  counts: '— pending' },
    build_package: { state: 'notrun',  counts: '— pending' },
    submit_check:  { state: 'notrun',  counts: '— pending' },
    archive:       { state: 'notrun',  counts: '— pending' },
  };
  return (
    <div style={{
      width: 420, maxHeight: 540, overflow: 'auto',
      background: 'var(--bg-surface)', borderRadius: 12,
      border: '1px solid var(--border-1)', boxShadow: 'var(--shadow-floating)',
      padding: 4,
    }}>
      <div style={{
        padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8,
        borderBottom: '1px solid var(--border-1)', position: 'sticky', top: -4,
        background: 'var(--bg-surface)', zIndex: 1, margin: -4, marginBottom: 4,
      }}>
        <Icon name="search" size={13} style={{ color: 'var(--ink-3)' }} />
        <input placeholder="Jump to stage…" style={{
          flex: 1, border: 0, outline: 0, background: 'transparent',
          fontSize: 12.5, color: 'var(--ink-1)',
        }} />
        <KeyCap>⌘P</KeyCap>
      </div>
      {groups.map(g => (
        <div key={g}>
          <div style={{
            padding: '8px 12px 4px', fontSize: 10, fontWeight: 600,
            letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink-4)',
          }}>{g}</div>
          {STAGE_DEFS.filter(s => s.group === g).map(s => {
            const i = STAGE_DEFS.findIndex(x => x.id === s.id);
            const cur = i === curIdx;
            const done = i < curIdx;
            const d = detail[s.id] || { state: 'notrun', counts: '—' };
            return (
              <div key={s.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '6px 12px', borderRadius: 6,
                background: cur ? 'color-mix(in oklab, var(--ocr) 14%, var(--bg-surface))' : 'transparent',
                border: cur ? '1px solid color-mix(in oklab, var(--ocr) 50%, var(--border-1))' : '1px solid transparent',
                margin: '1px 4px', cursor: 'pointer',
              }}>
                <span style={{
                  width: 8, height: 8, borderRadius: 99,
                  background:
                    cur ? 'var(--ocr)' :
                    done || d.state === 'clean' ? 'var(--exact)' :
                    d.state === 'dirty' ? 'var(--fuzzy)' :
                    d.state === 'failed' ? 'var(--mismatch)' :
                    'var(--ink-4)',
                }} />
                <span className="mono" style={{
                  flex: 1, fontSize: 12, fontWeight: cur ? 600 : 500,
                  color: cur || done || d.state !== 'notrun' ? 'var(--ink-1)' : 'var(--ink-3)',
                }}>{s.id}</span>
                <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>{d.counts}</span>
                <span className="mono" style={{
                  fontSize: 10, padding: '0 5px', height: 16, borderRadius: 4,
                  background: 'var(--bg-raised)', border: '1px solid var(--border-1)',
                  color: 'var(--ink-3)', display: 'inline-flex', alignItems: 'center',
                }}>{i + 1}</span>
              </div>
            );
          })}
        </div>
      ))}
      <div style={{
        padding: '8px 12px', borderTop: '1px solid var(--border-1)', marginTop: 6,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontSize: 10.5, color: 'var(--ink-4)',
      }}>
        <span><KeyCap>↑</KeyCap><KeyCap>↓</KeyCap> navigate · <KeyCap>↵</KeyCap> jump</span>
        <span><KeyCap>esc</KeyCap> close</span>
      </div>
    </div>
  );
};

const StageContextStrip = ({ currentStage = 'source', flaggedAtStage = 47, dirtyAtStage = 167, jumpOpen }) => {
  const idx = Math.max(0, STAGE_DEFS.findIndex(s => s.id === currentStage));
  const state = STAGE_STATE_BY_INDEX(idx);
  const cur = STAGE_DEFS[idx];
  return (
    <div style={{
      margin: '14px 32px 0', position: 'relative',
      borderRadius: 10, border: '1px solid var(--border-1)',
      background: 'var(--bg-surface)', boxShadow: 'none',
      padding: '10px 14px',
      display: 'flex', alignItems: 'center', gap: 14,
      overflow: 'hidden',
    }}>
      {/* Left: stage label + meta */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: '0 0 auto', minWidth: 280, position: 'relative' }}>
        <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>Stage</div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          padding: '4px 10px 4px 10px', borderRadius: 7,
          border: '1px solid color-mix(in oklab, var(--ocr) 50%, var(--border-1))',
          background: jumpOpen ? 'var(--bg-raised)' : 'color-mix(in oklab, var(--ocr) 10%, var(--bg-surface))',
          cursor: 'pointer',
        }}>
          <span style={{ width: 8, height: 8, borderRadius: 99, background: 'var(--ocr)' }} />
          <span className="mono" style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-1)' }}>{cur.id}</span>
          <span className="mono" style={{ fontSize: 11, color: 'var(--ink-4)' }}>{idx + 1}/{STAGE_DEFS.length}</span>
          <Icon name="chevD" size={12} style={{ color: 'var(--ink-3)', marginLeft: 2 }} />
        </div>
        <KeyCap>⌘P</KeyCap>
      </div>
      <Divider vertical style={{ height: 22 }} />
      {/* Center: 22-dot pipeline visualization (clickable) */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 3, minWidth: 0, overflow: 'hidden' }}>
        {STAGE_DEFS.map((s, i) => {
          const st = state(i);
          const isCur = i === idx;
          return (
            <React.Fragment key={s.id}>
              {isCur ? (
                <div title={s.id} style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px',
                  borderRadius: 6, cursor: 'pointer',
                  background: 'color-mix(in oklab, var(--ocr) 14%, var(--bg-surface))',
                  border: '1px solid color-mix(in oklab, var(--ocr) 60%, var(--border-1))',
                }}>
                  <span style={{ width: 7, height: 7, borderRadius: 99, background: 'var(--ocr)' }} />
                  <span className="mono" style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-1)' }}>{s.short}</span>
                </div>
              ) : (
                <div title={`${i + 1}. ${s.id}`} style={{
                  width: 16, height: 22, borderRadius: 4, cursor: 'pointer',
                  display: 'grid', placeItems: 'center',
                  background: 'transparent',
                }}>
                  <span style={{
                    width: 9, height: 9, borderRadius: 99,
                    background: st === 'clean' ? 'var(--exact)' : 'var(--ink-4)',
                    opacity: st === 'clean' ? 1 : 0.55,
                    border: st === 'clean' ? '1px solid color-mix(in oklab, var(--exact) 60%, transparent)' : '1px solid var(--border-2)',
                  }} />
                </div>
              )}
              {i < STAGE_DEFS.length - 1 ? <span style={{ width: 4, height: 1, background: 'var(--border-2)' }} /> : null}
            </React.Fragment>
          );
        })}
      </div>
      <Divider vertical style={{ height: 22 }} />
      <div className="mono" style={{ fontSize: 11.5, color: 'var(--ink-3)', flex: '0 0 auto' }}>
        <span style={{ color: 'var(--ink-1)', fontWeight: 600 }}>{flaggedAtStage}</span> flagged · <span style={{ color: 'var(--ink-2)' }}>{dirtyAtStage}</span> dirty
      </div>
      <div style={{ display: 'flex', gap: 4, flex: '0 0 auto' }}>
        <Button variant="outline" size="sm" icon="chevL">Prev</Button>
        <Button variant="primary" size="sm" iconRight="chevR">Next</Button>
      </div>
    </div>
  );
};

/* ---------------------- View toggle + thumbnail grid ---------------------- */

const ViewToggle = ({ mode = 'list', onChange }) => (
  <div style={{
    display: 'inline-flex', padding: 3, background: 'var(--bg-raised)',
    border: '1px solid var(--border-1)', borderRadius: 7,
  }}>
    {[
      { id: 'list',  name: 'List',     icon: 'file' },
      { id: 'thumb', name: 'Thumbnails', icon: 'image' },
    ].map(o => {
      const a = mode === o.id;
      return (
        <div key={o.id} onClick={() => onChange && onChange(o.id)} style={{
          padding: '4px 9px', borderRadius: 5, cursor: 'pointer',
          background: a ? 'var(--bg-surface)' : 'transparent',
          boxShadow: a ? '0 1px 1px rgba(15,23,42,.06), 0 0 0 1px var(--border-1)' : 'none',
          color: a ? 'var(--ink-1)' : 'var(--ink-3)', fontSize: 12, fontWeight: a ? 600 : 500,
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>
          <Icon name={o.icon} size={12} />
          {o.name}
        </div>
      );
    })}
  </div>
);

const THUMB_SIZE_CFG = {
  s: { cols: 9,  barH: 24, fs: 10,   gap: 12, flagFs: 9,   flagMax: 1 },
  m: { cols: 7,  barH: 30, fs: 11,   gap: 14, flagFs: 10,  flagMax: 2 },
  l: { cols: 5,  barH: 36, fs: 12.5, gap: 18, flagFs: 11,  flagMax: 4 },
};

/* A canvas_map-style page thumbnail */
const PageThumb = ({ row, selected, hover, dim, size = 'm' }) => {
  const cfg = THUMB_SIZE_CFG[size];
  const flags = (row.flags || []).slice(0, cfg.flagMax);
  const extra = (row.flags || []).length - flags.length;
  return (
    <div style={{
      borderRadius: 10, border: `1px solid ${selected ? 'var(--accent)' : 'var(--border-1)'}`,
      background: 'var(--bg-surface)', boxShadow: selected ? '0 0 0 2px color-mix(in oklab, var(--accent) 35%, transparent)' : 'var(--shadow-floating)',
      position: 'relative', overflow: 'hidden', aspectRatio: '0.78',
      opacity: dim ? 0.45 : 1,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Thumb body */}
      <div style={{ flex: 1, position: 'relative', background: 'var(--bg-raised)', overflow: 'hidden' }}>
        {/* striped paper */}
        <div style={{ position: 'absolute', inset: size === 's' ? '6px 8px' : '10px 14px',
          backgroundImage: `repeating-linear-gradient(0deg, transparent 0 ${size === 's' ? 3 : 5}px, color-mix(in oklab, var(--ink-3) 22%, transparent) ${size === 's' ? 3 : 5}px ${size === 's' ? 4 : 6}px)`,
          borderTop: '1px solid color-mix(in oklab, var(--ink-3) 14%, transparent)',
          borderBottom: '1px solid color-mix(in oklab, var(--ink-3) 14%, transparent)',
        }} />
        {/* page-number stripe */}
        <div style={{ position: 'absolute', left: '14%', right: '14%', bottom: size === 's' ? 8 : 14, height: size === 's' ? 3 : 5,
          background: 'color-mix(in oklab, var(--ink-3) 30%, transparent)', borderRadius: 2 }} />

        {/* checkbox top-left (only on M/L) */}
        {size !== 's' ? (
          <span style={{
            position: 'absolute', top: 8, left: 8,
            width: size === 'l' ? 22 : 20, height: size === 'l' ? 22 : 20, borderRadius: 5,
            background: selected ? 'var(--accent)' : hover ? 'var(--bg-surface)' : 'transparent',
            border: selected ? 'none' : hover ? '1px solid var(--border-2)' : '1px solid transparent',
            display: 'grid', placeItems: 'center', color: 'var(--accent-ink)',
          }}>
            {selected ? <Icon name="check" size={size === 'l' ? 13 : 12} stroke={3} /> : null}
          </span>
        ) : selected ? (
          <span style={{
            position: 'absolute', top: 4, left: 4, width: 14, height: 14, borderRadius: 3,
            background: 'var(--accent)', color: 'var(--accent-ink)',
            display: 'grid', placeItems: 'center',
          }}><Icon name="check" size={9} stroke={3} /></span>
        ) : null}

        {/* flag badges top-right */}
        <div style={{
          position: 'absolute', top: size === 's' ? 4 : 8, right: size === 's' ? 4 : 8,
          display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-end',
        }}>
          {flags.map((f, i) => <ThumbFlagBadge key={i} kind={f} size={size} />)}
          {extra > 0 ? (
            <span style={{
              fontSize: cfg.flagFs, fontWeight: 600, padding: '2px 5px', borderRadius: 4,
              background: 'rgba(15,23,42,.7)', color: '#f8fafc',
            }}>+{extra}</span>
          ) : null}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        height: cfg.barH, padding: `0 ${size === 's' ? 8 : 10}px`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'color-mix(in oklab, var(--ink-1) 88%, transparent)', color: '#f1f5f9',
      }}>
        <span className="mono" style={{ fontSize: cfg.fs, fontWeight: 600 }}>{row.idx}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          {size !== 's' ? (
            <span style={{ fontSize: cfg.fs - 1, opacity: 0.7, fontFamily: 'var(--mono-font)' }}>{row.stage || 'dirty'}</span>
          ) : null}
          <span style={{
            width: size === 's' ? 6 : 7, height: size === 's' ? 6 : 7, borderRadius: 99,
            background:
              row.stage === 'clean' ? 'var(--exact)' :
              row.stage === 'running' ? 'var(--ocr)' :
              row.stage === 'failed' ? 'var(--mismatch)' :
              'var(--fuzzy)',
          }} />
        </span>
      </div>
    </div>
  );
};

const ThumbFlagBadge = ({ kind, size = 'm' }) => {
  const tone = toneFor(kind);
  const compact = size === 's';
  if (compact) {
    // Just a colored dot pill, no label
    return <span style={{
      width: 8, height: 8, borderRadius: 99, background: tone,
      boxShadow: '0 0 0 2px var(--bg-surface)',
    }} />;
  }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      height: size === 'l' ? 20 : 18, padding: '0 6px', borderRadius: 4,
      fontSize: THUMB_SIZE_CFG[size].flagFs, fontWeight: 600,
      background: `color-mix(in oklab, ${tone} 80%, var(--bg-surface))`,
      color: 'var(--bg-surface)',
      border: `1px solid color-mix(in oklab, ${tone} 90%, transparent)`,
      boxShadow: '0 1px 2px rgba(15,23,42,.18)',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: 99, background: 'var(--bg-surface)' }} />
      {kind}
    </span>
  );
};

/* Build a representative set of 21 page thumbs for a given stage */
const buildThumbRows = (stage) => {
  const flagSet = STAGE_FLAGS[stage] || STAGE_FLAGS.source;
  const make = (idx, stem, type, align, stageState, flags) => ({ idx, stem, type, align, stage: stageState, flags });
  // Spread of stage status + flag combos so the grid looks lived-in
  return [
    make('f001', 'belloc_0001.jp2', 'title', 'center', 'clean', []),
    make('f002', 'belloc_0002.jp2', 'blank', '—',      'clean', []),
    make('f003', 'belloc_0003.jp2', 'body',  'left',   'dirty', [flagSet[0]]),
    make('f004', 'belloc_0004.jp2', 'body',  'right',  'clean', []),
    make('f005', 'belloc_0005.jp2', 'body',  'left',   'dirty', [flagSet[1], flagSet[0]]),
    make('f006', 'belloc_0006.jp2', 'body',  'right',  'failed', ['errored']),
    make('f007', 'belloc_0007.jp2', 'body',  'left',   'dirty', [flagSet[2] || flagSet[0]]),
    make('p001', 'belloc_0017.jp2', 'body',  'left',   'clean', []),
    make('p002', 'belloc_0018.jp2', 'body',  'right',  'dirty', [flagSet[3] || flagSet[0]]),
    make('p003', 'belloc_0019.jp2', 'illust','center', 'clean', []),
    make('p004', 'belloc_0020.jp2', 'body',  'left',   'dirty', [flagSet[0], flagSet[2] || flagSet[1]]),
    make('p005', 'belloc_0021.jp2', 'body',  'right',  'clean', []),
    make('p006', 'belloc_0022.jp2', 'body',  'left',   'running', [flagSet[1]]),
    make('p007', 'belloc_0023.jp2', 'body',  'right',  'dirty', [flagSet[0]]),
    make('p008', 'belloc_0024.jp2', 'body',  'left',   'clean', []),
    make('p009', 'belloc_0025.jp2', 'body',  'right',  'dirty', [flagSet[2] || flagSet[0]]),
    make('p010', 'belloc_0026.jp2', 'body',  'left',   'clean', []),
    make('p011', 'belloc_0027.jp2', 'body',  'right',  'failed', ['errored']),
    make('p012', 'belloc_0028.jp2', 'body',  'left',   'dirty', [flagSet[0], flagSet[3] || flagSet[1]]),
    make('p013', 'belloc_0029.jp2', 'body',  'right',  'clean', []),
    make('p014', 'belloc_0030.jp2', 'body',  'left',   'dirty', [flagSet[1]]),
  ];
};

const ThumbGrid = ({ stage = 'source', selectedIdx = [], filterMode = 'all', size = 'm' }) => {
  const cfg = THUMB_SIZE_CFG[size];
  let rows = buildThumbRows(stage);
  if (filterMode === 'flagged') rows = rows.filter(r => r.flags.length > 0);
  // For S, repeat the row set so the grid feels populated
  if (size === 's') rows = [...rows, ...rows].slice(0, 36);
  return (
    <div style={{
      flex: 1, overflow: 'auto', padding: '12px 32px 24px',
    }}>
      <div style={{
        display: 'grid', gridTemplateColumns: `repeat(${cfg.cols}, 1fr)`, gap: cfg.gap,
      }}>
        {rows.map((r, i) => (
          <PageThumb key={`${r.idx}-${i}`} row={r} size={size}
            selected={selectedIdx.includes(r.idx)}
            hover={r.idx === 'f005' || r.idx === 'p007'} />
        ))}
      </div>
    </div>
  );
};

const BulkActionBar = ({ count, stage }) => (
  <div style={{
    height: 56, padding: '0 32px',
    background: 'var(--bg-surface)',
    borderTop: '1px solid var(--border-1)',
    boxShadow: '0 -8px 24px -8px rgba(15,23,42,.10)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-1)' }}>{count} pages selected</span>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        <Badge tone="neutral" mono>blurry · 3</Badge>
        <Badge tone="dirty" mono>skew · 1</Badge>
        <Badge tone="failed" mono>errored · 1</Badge>
      </div>
    </div>
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <span style={{ fontSize: 11.5, color: 'var(--ink-4)', display: 'flex', alignItems: 'center', gap: 6 }}>
        Shift+click to range select <KeyCap>⇧</KeyCap>
      </span>
      <Divider vertical style={{ height: 22 }} />
      <Button variant="outline" size="sm">Mark as fine</Button>
      <Button variant="outline" size="sm" icon="image">Open workbench</Button>
      <Button variant="primary" size="sm" icon="arrowR">Re-run from {stage}</Button>
      <Button variant="ghost" size="sm">Clear</Button>
    </div>
  </div>
);

const ThumbSizeToggle = ({ size = 'm', onChange }) => (
  <div style={{
    display: 'inline-flex', padding: 3, background: 'var(--bg-raised)',
    border: '1px solid var(--border-1)', borderRadius: 7,
  }}>
    {[
      { id: 's', label: 'S' },
      { id: 'm', label: 'M' },
      { id: 'l', label: 'L' },
    ].map(o => {
      const a = size === o.id;
      return (
        <div key={o.id} onClick={() => onChange && onChange(o.id)} style={{
          width: 26, height: 22, borderRadius: 5, cursor: 'pointer',
          background: a ? 'var(--bg-surface)' : 'transparent',
          boxShadow: a ? '0 1px 1px rgba(15,23,42,.06), 0 0 0 1px var(--border-1)' : 'none',
          color: a ? 'var(--ink-1)' : 'var(--ink-3)',
          fontSize: 11, fontWeight: a ? 700 : 600,
          fontFamily: 'var(--mono-font)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>{o.label}</div>
      );
    })}
  </div>
);

const FilterToolbar = ({ active = 'all', variant = 'plain', viewMode, onViewChange, thumbSize, onThumbSizeChange }) => {
  const filters = [
    { id: 'all',     name: 'All',     count: '232' },
    { id: 'flagged', name: 'Flagged', count: '47', dot: 'var(--fuzzy)' },
    { id: 'errors',  name: 'Errors',  count: '3',  dot: 'var(--mismatch)' },
    { id: 'dirty',   name: 'Dirty',   count: '17', dot: 'var(--fuzzy)' },
    { id: 'queued',  name: 'Queued',  count: '0' },
  ];
  return (
    <div style={{
      padding: variant === 'dashboard' ? '0 32px 0' : '14px 32px 0',
      display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
    }}>
      <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--bg-raised)', borderRadius: 8, border: '1px solid var(--border-1)' }}>
        {filters.map(f => {
          const a = f.id === active;
          return (
            <div key={f.id} style={{
              padding: '5px 10px', borderRadius: 6,
              background: a ? 'var(--bg-surface)' : 'transparent',
              boxShadow: a ? '0 1px 1px rgba(15,23,42,.06), 0 0 0 1px var(--border-1)' : 'none',
              display: 'flex', alignItems: 'center', gap: 7,
              color: a ? 'var(--ink-1)' : 'var(--ink-3)', fontSize: 12.5, fontWeight: a ? 600 : 500,
              cursor: 'pointer',
            }}>
              {f.dot ? <span style={{ width: 6, height: 6, borderRadius: 99, background: f.dot }} /> : null}
              {f.name}
              <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-4)' }}>{f.count}</span>
            </div>
          );
        })}
      </div>
      <Divider vertical style={{ height: 22 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--ink-3)' }}>
        <Icon name="search" size={13} />
        <span>Search pages…</span>
        <KeyCap>/</KeyCap>
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
        {viewMode != null ? <ViewToggle mode={viewMode} onChange={onViewChange} /> : null}
        {viewMode === 'thumb' && thumbSize != null ? (
          <ThumbSizeToggle size={thumbSize} onChange={onThumbSizeChange} />
        ) : null}
        <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>Show split parents</span>
        <Toggle on={false} />
        <Divider vertical style={{ height: 22 }} />
        <Button variant="outline" size="sm" iconRight="chevD">Bulk page type</Button>
      </div>
    </div>
  );
};

const Toggle = ({ on }) => (
  <span style={{
    width: 32, height: 18, borderRadius: 99, padding: 2,
    background: on ? 'var(--accent)' : 'var(--bg-sunk)',
    display: 'inline-flex', alignItems: 'center',
  }}>
    <span style={{
      width: 14, height: 14, borderRadius: 99, background: 'white',
      transform: on ? 'translateX(14px)' : 'translateX(0)',
      boxShadow: '0 1px 2px rgba(15,23,42,.2)',
    }} />
  </span>
);

/* ---------------------- Page rows ---------------------- */

const PAGE_TYPE_BADGE = {
  title:  { tone: 'brand',   name: 'title' },
  blank:  { tone: 'outline', name: 'blank' },
  body:   { tone: 'neutral', name: 'body' },
  illust: { tone: 'brand',   name: 'illust' },
};

const PageRow = ({ row, last, dimUnless }) => {
  const flags = row.flags || [];
  const muted = dimUnless && !flags.includes(dimUnless);
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '28px 36px 92px 1fr 80px 72px 18px 1fr 18px',
      alignItems: 'center', gap: 12,
      padding: '8px 32px',
      borderBottom: last ? 'none' : '1px solid var(--border-1)',
      opacity: muted ? 0.45 : 1,
      background: row.selected ? 'color-mix(in oklab, var(--accent) 6%, transparent)' : 'transparent',
    }}>
      <span style={{ color: 'var(--ink-4)', display: 'flex', justifyContent: 'center' }}>
        <Icon name="grip" size={14} />
      </span>
      <span style={{
        width: 18, height: 18, borderRadius: 4,
        border: '1px solid var(--border-2)',
        background: row.selected ? 'var(--accent)' : 'transparent',
        display: 'grid', placeItems: 'center', color: 'var(--accent-ink)',
      }}>
        {row.selected ? <Icon name="check" size={11} stroke={3} /> : null}
      </span>
      <span className="mono" style={{ fontSize: 12, color: 'var(--ink-1)', fontWeight: 500 }}>{row.idx}</span>
      <span className="mono" style={{
        fontSize: 11.5, color: 'var(--ink-3)',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>{row.stem}</span>
      <span><Badge tone={PAGE_TYPE_BADGE[row.type].tone}>{PAGE_TYPE_BADGE[row.type].name}</Badge></span>
      <span style={{ fontSize: 11.5, color: 'var(--ink-3)', fontFamily: 'var(--mono-font)' }}>{row.align}</span>
      <span style={{
        width: 10, height: 10, borderRadius: 99,
        background:
          row.stage === 'clean' ? 'var(--exact)' :
          row.stage === 'dirty' ? 'var(--fuzzy)' :
          row.stage === 'running' ? 'var(--ocr)' :
          row.stage === 'failed' ? 'var(--mismatch)' :
          'var(--ink-4)',
      }} />
      <span style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {flags.map((f, i) => <RowFlagBadge key={i} kind={f} />)}
      </span>
      <Icon name="chevR" size={13} style={{ color: 'var(--ink-4)' }} />
    </div>
  );
};

const ROWS_BASE = [
  { idx: 'f001', stem: 'belloc_0001.jp2', type: 'title',  align: 'center', stage: 'clean',   flags: [] },
  { idx: 'f002', stem: 'belloc_0002.jp2', type: 'blank',  align: '—',      stage: 'clean',   flags: [] },
  { idx: 'f003', stem: 'belloc_0003.jp2', type: 'body',   align: 'left',   stage: 'dirty',   flags: ['blurry'] },
  { idx: 'f004', stem: 'belloc_0004.jp2', type: 'body',   align: 'right',  stage: 'clean',   flags: [] },
  { idx: 'f005', stem: 'belloc_0005.jp2', type: 'body',   align: 'left',   stage: 'dirty',   flags: ['skew', 'blurry'] },
  { idx: 'f006', stem: 'belloc_0006.jp2', type: 'body',   align: 'right',  stage: 'failed',  flags: ['errored'] },
  { idx: 'f007', stem: 'belloc_0007.jp2', type: 'body',   align: 'left',   stage: 'dirty',   flags: ['dark'] },
  { idx: 'p001', stem: 'belloc_0017.jp2', type: 'body',   align: 'left',   stage: 'clean',   flags: [] },
  { idx: 'p002', stem: 'belloc_0018.jp2', type: 'body',   align: 'right',  stage: 'dirty',   flags: ['sparse'] },
  { idx: 'p003', stem: 'belloc_0019.jp2', type: 'illust', align: 'center', stage: 'clean',   flags: [] },
  { idx: 'p004', stem: 'belloc_0020.jp2', type: 'body',   align: 'left',   stage: 'dirty',   flags: ['blurry', 'dark'] },
  { idx: 'p005', stem: 'belloc_0021.jp2', type: 'body',   align: 'right',  stage: 'clean',   flags: [] },
  { idx: 'p006', stem: 'belloc_0022.jp2', type: 'body',   align: 'left',   stage: 'running', flags: ['skew'] },
  { idx: 'p007', stem: 'belloc_0023.jp2', type: 'body',   align: 'right',  stage: 'dirty',   flags: ['blurry'] },
  { idx: 'p008', stem: 'belloc_0024.jp2', type: 'body',   align: 'left',   stage: 'clean',   flags: [] },
];

const ROWS_FLAGGED_ONLY = ROWS_BASE.filter(r => r.flags.length > 0);
const ROWS_BLURRY_ONLY  = ROWS_BASE.filter(r => r.flags.includes('blurry'));

const TableHeader = () => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: '28px 36px 92px 1fr 80px 72px 18px 1fr 18px',
    gap: 12, padding: '12px 32px',
    fontSize: 10.5, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase',
    color: 'var(--ink-4)',
    borderBottom: '1px solid var(--border-1)',
    background: 'var(--bg-page)', position: 'sticky', top: 0,
  }}>
    <span />
    <span />
    <span>Page</span>
    <span>Source stem</span>
    <span>Type</span>
    <span>Align</span>
    <span />
    <span>Quality</span>
    <span />
  </div>
);

const TableFooter = ({ total = '15 of 232 · scroll for more', selected = 0 }) => (
  <div style={{
    padding: '12px 32px', borderTop: '1px solid var(--border-1)',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    background: 'var(--bg-surface)',
    fontSize: 12, color: 'var(--ink-3)',
  }}>
    <span className="mono">{total}</span>
    {selected > 0 ? (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 12, color: 'var(--ink-1)', fontWeight: 600 }}>{selected} selected</span>
        <Button variant="outline" size="sm">Re-run from initial_crop</Button>
        <Button variant="ghost" size="sm">Clear</Button>
      </div>
    ) : (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11.5, color: 'var(--ink-4)' }}>
        <span>Shift+click to range select</span>
        <KeyCap>↑</KeyCap><KeyCap>↓</KeyCap>
      </div>
    )}
  </div>
);

/* ---------------------- Dashboard summary strip (variation B) ---------------------- */

const SummaryStrip = ({ activeFlag, severe }) => (
  <div style={{
    margin: '20px 32px 0',
    borderRadius: 12, overflow: 'hidden',
    border: '1px solid var(--border-1)', background: 'var(--bg-surface)',
    boxShadow: 'none',
  }}>
    <div style={{
      display: 'grid', gridTemplateColumns: '1.2fr repeat(5, 1fr) auto',
      gap: 0, alignItems: 'stretch',
    }}>
      <div style={{ padding: '16px 18px', borderRight: '1px solid var(--border-1)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>
          Quality report
        </div>
        <div className="mono" style={{ marginTop: 6, fontSize: 22, fontWeight: 600, color: severe ? 'var(--mismatch)' : 'var(--ink-1)' }}>
          {severe ? '192' : '47'}<span style={{ fontSize: 13, color: 'var(--ink-4)', fontWeight: 500 }}> / 232</span>
        </div>
        <div style={{ marginTop: 2, fontSize: 11, color: 'var(--ink-3)' }}>flagged before pipeline run</div>
      </div>
      <SummaryCell kind="blurry"  count={severe ? 96 : 22} active={activeFlag === 'blurry'}  mute={activeFlag && activeFlag !== 'blurry'} />
      <SummaryCell kind="skew"    count={severe ? 38 : 11} active={activeFlag === 'skew'}    mute={activeFlag && activeFlag !== 'skew'} />
      <SummaryCell kind="dark"    count={severe ? 52 :  8} active={activeFlag === 'dark'}    mute={activeFlag && activeFlag !== 'dark'} />
      <SummaryCell kind="sparse"  count={severe ? 21 : 14} active={activeFlag === 'sparse'}  mute={activeFlag && activeFlag !== 'sparse'} />
      <SummaryCell kind="errored" count={severe ?  6 :  3} active={activeFlag === 'errored'} mute={activeFlag && activeFlag !== 'errored'} />
      <div style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 8, borderLeft: '1px solid var(--border-1)' }}>
        <Button variant="outline" size="sm">Tune thresholds</Button>
        <Button variant="ghost" size="sm">Dismiss</Button>
      </div>
    </div>
    {severe ? (
      <div style={{
        padding: '8px 18px',
        background: 'color-mix(in oklab, var(--mismatch) 8%, transparent)',
        borderTop: '1px solid color-mix(in oklab, var(--mismatch) 30%, var(--border-1))',
        fontSize: 12, color: 'var(--ink-2)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <Icon name="alert" size={13} style={{ color: 'var(--mismatch)' }} />
        <span><b style={{ color: 'var(--ink-1)' }}>192 of 232 pages flagged</b> — likely a source scan issue. Consider re-scanning or trying a different scan set before running the pipeline.</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <Button variant="ghost" size="sm">Re-ingest source</Button>
          <Button variant="primary" size="sm">Pick a new source</Button>
        </div>
      </div>
    ) : null}
  </div>
);

const SummaryCell = ({ kind, count, active, mute }) => {
  const m = FLAG_META[kind] || { name: kind, tone: toneFor(kind) };
  return (
    <div style={{
      padding: '16px 14px', borderRight: '1px solid var(--border-1)',
      background: active ? `color-mix(in oklab, ${m.tone} 10%, transparent)` : 'transparent',
      opacity: mute ? 0.55 : 1,
      cursor: 'pointer', position: 'relative',
    }}>
      {active ? <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: m.tone }} /> : null}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 8, height: 8, borderRadius: 99, background: m.tone }} />
        <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ink-2)', textTransform: 'capitalize' }}>{m.name}</span>
      </div>
      <div className="mono" style={{ marginTop: 6, fontSize: 20, fontWeight: 600, color: 'var(--ink-1)' }}>{count}</div>
      <div style={{ marginTop: 2, fontSize: 10.5, color: 'var(--ink-3)' }}>{kindBlurb(kind)}</div>
    </div>
  );
};

const kindBlurb = (k) => ({
  blurry:  'Laplacian < 80',
  skew:    'angle > 5°',
  dark:    'σ < 22 / contrast',
  sparse:  'bbox < 20%',
  errored: 'open failed',
}[k] || '');

/* ---------------------- Full screens ---------------------- */

const VariationA = ({ severe, filterMode, theme = 'light', stage = 'source', viewMode = 'list', thumbSize = 'm', selected = [], showJumpPopover = false }) => {
  const FLAG_TOTALS = {
    source:    { flagged: severe ? 192 : 47, dirty: 167 },
    threshold: { flagged: 31, dirty: 167 },
    ocr:       { flagged: 30, dirty: 167 },
  };
  const cur = FLAG_TOTALS[stage] || FLAG_TOTALS.source;
  return (
    <div className="pgd" data-theme={theme} style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: 'var(--bg-page)', overflow: 'hidden', position: 'relative',
    }}>
      <TopNav />
      <ConfigureHeader />
      <ConfigureTabs current="pages" />
      <StageContextStrip currentStage={stage} flaggedAtStage={cur.flagged} dirtyAtStage={cur.dirty} jumpOpen={showJumpPopover} />
      {showJumpPopover ? (
        <div style={{
          position: 'absolute', top: 246, left: 152, zIndex: 30,
        }}>
          <StageJumpPopover currentStage={stage} />
        </div>
      ) : null}
      {filterMode === 'all' ? (
        <QualityBanner flagged={cur.flagged} total={232} severe={severe} stage={stage} />
      ) : null}
      <FilterToolbar
        active={filterMode === 'flagged' ? 'flagged' : 'all'}
        viewMode={viewMode}
        thumbSize={thumbSize}
      />
      <div style={{ marginTop: 14, flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {viewMode === 'list' ? (
          <>
            <TableHeader />
            <div style={{ flex: 1, overflow: 'auto', background: 'var(--bg-surface)' }}>
              {(filterMode === 'flagged' ? buildRowsForStage(stage).filter(r => r.flags.length) : buildRowsForStage(stage))
                .map((r, i, arr) => (
                  <PageRow key={r.idx} row={{ ...r, selected: selected.includes(r.idx) }} last={i === arr.length - 1} />
                ))}
            </div>
            {selected.length > 0 ? (
              <BulkActionBar count={selected.length} stage={stage} />
            ) : (
              <TableFooter
                total={filterMode === 'flagged' ? `9 of ${cur.flagged} flagged · ${cur.flagged} of 232 pages` : '21 of 232 · scroll for more'}
                selected={0}
              />
            )}
          </>
        ) : (
          <>
            <ThumbGrid stage={stage} selectedIdx={selected} filterMode={filterMode} size={thumbSize} />
            {selected.length > 0 ? (
              <BulkActionBar count={selected.length} stage={stage} />
            ) : null}
          </>
        )}
      </div>
      <ServerFooter />
    </div>
  );
};

/* Provide rows generated for a stage's flag taxonomy for the LIST view too */
const buildRowsForStage = (stage) => buildThumbRows(stage);

const VariationB = ({ severe, activeFlag, theme = 'light' }) => (
  <div className="pgd" data-theme={theme} style={{
    height: '100%', display: 'flex', flexDirection: 'column',
    background: 'var(--bg-page)', overflow: 'hidden',
  }}>
    <TopNav />
    <ConfigureHeader />
    <ConfigureTabs current="pages" />
    <SummaryStrip severe={severe} activeFlag={activeFlag} />
    <FilterToolbar active="all" variant="dashboard" />
    <div style={{ marginTop: 14, flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <TableHeader />
      <div style={{ flex: 1, overflow: 'auto', background: 'var(--bg-surface)' }}>
        {ROWS_BASE.map((r, i, arr) => (
          <PageRow key={r.idx} row={r} last={i === arr.length - 1}
            dimUnless={activeFlag} />
        ))}
      </div>
      <TableFooter
        total={
          activeFlag === 'blurry' ? `${ROWS_BLURRY_ONLY.length} highlighted · ${severe ? 96 : 22} total blurry` :
          activeFlag ? `flag: ${activeFlag} · highlighting matches` :
          '15 of 232 · scroll for more'
        }
        selected={0}
      />
    </div>
    <ServerFooter />
  </div>
);

const ThemedFrame = ({ theme, children }) => (
  <div className="pgd" data-theme={theme} style={{ width: '100%', height: '100%' }}>
    {children}
  </div>
);

Object.assign(window, {
  VariationA, VariationB, ThemedFrame,
  QualityBanner, SummaryStrip, FilterToolbar, PageRow, RowFlagBadge, FlagChip,
  ConfigureHeader, ConfigureTabs,
});
