// wf11-variations.jsx — Perceptual Grayscale Stage Controls
// Each variation replaces the Page Workbench's left StageControlsPanel
// when the grayscale stage is selected. Variants explore *how* to surface
// the Standard / Perceptual choice from the WF-11 brief.

const { useState: useS11 } = React;

/* ====================================================================
   Shared chrome — mimics StageControlsPanel from wf-pw-variations.jsx
   but lets us drop in a custom body per variation, and lets us add a
   variation tag in the header so each artboard is self-labeling.
==================================================================== */

const WF11Panel = ({ variantId, variantName, body, dirty = true }) => (
  <div style={{
    flex: 1, minHeight: 0,
    display: 'flex', flexDirection: 'column', height: '100%',
  }}>
    {/* Header */}
    <div style={{
      padding: '12px 16px', borderBottom: '1px solid var(--border-1)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
    }}>
      <div>
        <div style={{
          fontSize: 11, fontWeight: 600, letterSpacing: '.06em',
          textTransform: 'uppercase', color: 'var(--ink-4)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span>Stage controls</span>
          <span style={{
            padding: '1px 6px', borderRadius: 4,
            background: 'color-mix(in oklab, var(--accent) 14%, transparent)',
            color: 'var(--accent)',
            fontFamily: 'var(--mono-font)', letterSpacing: 0, fontSize: 10,
          }}>WF-11 · {variantId}</span>
        </div>
        <div style={{ marginTop: 3, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="mono" style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-1)' }}>grayscale</span>
          {dirty ? <Badge tone="dirty">dirty</Badge> : <Badge tone="clean">clean</Badge>}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Button variant="outline" size="sm">Apply &amp; Run</Button>
        <button title="Collapse drawer" style={{
          width: 24, height: 24, borderRadius: 5,
          border: '1px solid var(--border-1)', background: 'transparent',
          color: 'var(--ink-3)', cursor: 'pointer',
          display: 'grid', placeItems: 'center',
        }}>
          <Icon name="chevL" size={12} />
        </button>
      </div>
    </div>

    {/* Variant name strip */}
    <div style={{
      padding: '8px 16px', borderBottom: '1px solid var(--border-1)',
      background: 'var(--bg-page)',
      fontSize: 11, color: 'var(--ink-3)', display: 'flex', alignItems: 'center', gap: 8,
    }}>
      <span style={{
        fontSize: 9.5, fontWeight: 700, letterSpacing: '.1em',
        textTransform: 'uppercase', color: 'var(--ink-4)',
      }}>Variant</span>
      <span style={{ color: 'var(--ink-2)', fontWeight: 500 }}>{variantName}</span>
    </div>

    {/* Body */}
    <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
      {body}
    </div>

    {/* Footer */}
    <div style={{
      padding: '10px 16px', borderTop: '1px solid var(--border-1)',
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <Button variant="primary" size="md" icon="arrowR" full>Apply &amp; Run from here</Button>
      <div style={{ fontSize: 11, color: 'var(--ink-4)', textAlign: 'center' }}>
        will re-run grayscale + 17 downstream stages
      </div>
    </div>
  </div>
);

/* ====================================================================
   Reusable building blocks for WF-11 bodies
==================================================================== */

const WF11Field = ({ label, hint, children, mono }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: 6,
    }}>
      <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ink-2)' }}>{label}</div>
      {hint ? <span className={mono ? 'mono' : ''} style={{ fontSize: 10.5, color: 'var(--ink-4)' }}>{hint}</span> : null}
    </div>
    {children}
  </div>
);

/* Amber info callout — shows when Perceptual is active.
   Timing reflects the GPU (CuPy) path with a CPU fallback note. */
const PerceptualCallout = ({ compact = false }) => (
  <div style={{
    display: 'flex', alignItems: 'flex-start', gap: 10,
    padding: compact ? '8px 10px' : '10px 12px',
    borderRadius: 7,
    background: 'color-mix(in oklab, var(--fuzzy) 12%, var(--bg-surface))',
    border: '1px solid color-mix(in oklab, var(--fuzzy) 35%, var(--border-1))',
    color: 'var(--ink-2)',
  }}>
    <Icon name="info" size={13} style={{ color: 'var(--fuzzy)', marginTop: 1, flex: '0 0 auto' }} />
    <div style={{ fontSize: compact ? 11 : 11.5, lineHeight: 1.5 }}>
      <span style={{ color: 'var(--ink-1)', fontWeight: 600 }}>∼1–2s / page on GPU</span>
      <span style={{ color: 'var(--ink-3)' }}> · <span className="mono">~10–30s</span> CPU fallback.</span>{' '}
      Recommended for color or yellowed scans — preserves local contrast around stains.
    </div>
  </div>
);

/* ---------------------- Backend (GPU / CPU) ---------------------- */

/* Per-page time estimator. Calibrated against a representative 8MP page:
   GPU ≈ 0.18 s/MP (CuPy on a mid-range CUDA card)
   CPU ≈ 2.5 s/MP (numpy fallback, single-threaded)
   Standard is luminosity-only, dominated by I/O — always sub-second. */
const estimatePerceptualSec = ({ w, h, backend }) => {
  const mp = (w * h) / 1_000_000;
  const rate = backend === 'gpu' ? 0.18 : 2.5;
  return Math.max(0.3, mp * rate);
};

const fmtSec = (s) => {
  if (s < 10) return `~${s.toFixed(1)}s`;
  if (s < 60) return `~${Math.round(s)}s`;
  return `~${Math.round(s / 60)}m${Math.round(s % 60)}s`;
};

const fmtMP = (w, h) => `${((w * h) / 1_000_000).toFixed(1)} MP`;

const STANDARD_TIME = '<1s';

/* Representative page used by the wireframe — same numbers as the
   Page Workbench's "detected text bbox" readout (canvas_map controls). */
const SAMPLE_PAGE = { w: 2364, h: 3568 };

/* Project-level estimate: total time across N pages. */
const fmtProjectTotal = (perPageSec, n) => {
  const total = perPageSec * n;
  if (total < 90) return `${Math.round(total)}s`;
  if (total < 3600) return `${Math.round(total / 60)} min`;
  return `${(total / 3600).toFixed(1)} hr`;
};

/* Auto-detected backend chip. Goes wherever the user expects to read
   "this is what's running underneath". Mono, dot + label, with a hover
   tooltip in production. Compact form for inline use. */
const BackendChip = ({ backend = 'gpu', compact = false, withLabel = true }) => {
  const isGpu = backend === 'gpu';
  const color = isGpu ? 'var(--exact)' : 'var(--fuzzy)';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: compact ? '1px 6px' : '2px 8px',
      borderRadius: 99,
      fontFamily: 'var(--mono-font)',
      fontSize: compact ? 9.5 : 10.5, fontWeight: 600, letterSpacing: '.02em',
      color,
      background: `color-mix(in oklab, ${color} 14%, transparent)`,
      border: `1px solid color-mix(in oklab, ${color} 35%, transparent)`,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 99, background: color }} />
      {isGpu ? 'GPU' : 'CPU'}
      {withLabel ? (
        <span style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          fontWeight: 500, color: 'var(--ink-3)', letterSpacing: 0,
        }}>{isGpu ? 'CUDA · auto' : 'fallback'}</span>
      ) : null}
    </span>
  );
};

/* Tiny page-thumbnail renderers used in chooser variants.
   These are stylistic stand-ins for the real scan; the point is to convey
   the *difference* between the two modes at a glance. */
const Thumb = ({ mode, w = 92, h = 124, focused }) => {
  // Color: warm-tinted parchment with stains.
  // Standard (luma): muddy, low local contrast — stains turn dark grey.
  // Perceptual: stains stay light, text contrast preserved.
  let bg, ink, stain;
  if (mode === 'color') {
    bg = 'linear-gradient(160deg, #efe1c2 0%, #e1ce9c 60%, #c9af74 100%)';
    ink = '#3a2c1c'; stain = 'rgba(120, 60, 20, 0.35)';
  } else if (mode === 'standard') {
    bg = 'linear-gradient(160deg, #c6c2b8 0%, #b5b0a3 60%, #8e8978 100%)';
    ink = '#1a1a1a'; stain = 'rgba(40, 30, 20, 0.42)';
  } else { // perceptual
    bg = 'linear-gradient(160deg, #f1efe9 0%, #e6e3da 60%, #d3cfc1 100%)';
    ink = '#0e0e0e'; stain = 'rgba(60, 50, 40, 0.06)';
  }
  return (
    <div style={{
      width: w, height: h, position: 'relative', flex: '0 0 auto',
      borderRadius: 5, overflow: 'hidden',
      background: bg, border: '1px solid var(--border-2)',
      boxShadow: focused ? '0 0 0 2px var(--accent)' : 'none',
    }}>
      {/* age stain blob */}
      <div style={{
        position: 'absolute', left: '-10%', top: '40%',
        width: '80%', height: '60%', borderRadius: '50%',
        background: stain, filter: 'blur(6px)',
      }} />
      {/* text lines */}
      {[0,1,2,3,4,5,6,7,8].map(i => (
        <div key={i} style={{
          position: 'absolute',
          left: '14%', right: i % 4 === 3 ? '32%' : '14%',
          top: 12 + i * 12, height: 2,
          background: ink, opacity: mode === 'standard' ? 0.55 : 0.85,
        }} />
      ))}
      {/* page number */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 4,
        textAlign: 'center', fontFamily: 'var(--mono-font)',
        fontSize: 8, color: ink, opacity: 0.7,
      }}>12</div>
    </div>
  );
};

/* Radio dot used in V3 list-style picker */
const RadioDot = ({ on, accent = 'var(--accent)' }) => (
  <span style={{
    width: 14, height: 14, borderRadius: 99,
    border: `1.5px solid ${on ? accent : 'var(--border-3)'}`,
    background: on ? 'var(--bg-surface)' : 'transparent',
    display: 'inline-grid', placeItems: 'center', flex: '0 0 auto',
  }}>
    {on ? <span style={{
      width: 7, height: 7, borderRadius: 99, background: accent,
    }} /> : null}
  </span>
);

/* ====================================================================
   Variation A — Segmented + callout (literal brief interpretation)
==================================================================== */

const BodyA = () => (
  <>
    <WF11Field label="Grayscale mode" hint="auto · luma-weighted">
      <Seg2 opts={['Standard', 'Perceptual']} active="Perceptual" />
      <div className="mono" style={{ fontSize: 10.5, color: 'var(--ink-4)', marginTop: 6 }}>
        np_uint8_color_to_gray · pd-book-tools
      </div>
    </WF11Field>
    <PerceptualCallout />
    <div style={{ height: 14 }} />
    <WF11Field label="Source profile" hint="auto-detected">
      <div style={{
        padding: '10px 12px', background: 'var(--bg-raised)',
        border: '1px solid var(--border-1)', borderRadius: 6,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{
          width: 22, height: 22, borderRadius: 5,
          background: 'linear-gradient(135deg, #d4a36b 0%, #9c6a3a 100%)',
          flex: '0 0 auto',
        }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="mono" style={{ fontSize: 11.5, color: 'var(--ink-1)', fontWeight: 600 }}>color · tinted</div>
          <div className="mono" style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>3-ch RGB · ΔE 14.2</div>
        </div>
      </div>
    </WF11Field>
    <WF11Field label="Output">
      <CheckRow label="Write 16-bit (preserve dynamic range)" on />
      <CheckRow label="Apply to all pages with similar profile" />
    </WF11Field>
  </>
);

/* ====================================================================
   Variation B — Two-card visual chooser (shows the difference)
==================================================================== */

const ModeCard = ({ kind, title, subtitle, badge, badgeTone, selected }) => (
  <div style={{
    flex: 1, padding: 10, borderRadius: 8,
    background: selected
      ? 'color-mix(in oklab, var(--accent) 8%, var(--bg-surface))'
      : 'var(--bg-surface)',
    border: `1.5px ${selected ? 'solid' : 'solid'} ${selected ? 'var(--accent)' : 'var(--border-1)'}`,
    cursor: 'pointer', position: 'relative',
    display: 'flex', flexDirection: 'column', gap: 8,
  }}>
    {selected ? (
      <div style={{
        position: 'absolute', top: -7, right: -7,
        width: 18, height: 18, borderRadius: 99,
        background: 'var(--accent)', color: 'var(--accent-ink)',
        display: 'grid', placeItems: 'center',
      }}>
        <Icon name="check" size={11} stroke={3} />
      </div>
    ) : null}
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Thumb mode={kind} w={104} h={140} />
    </div>
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-1)' }}>{title}</span>
        {badge ? (
          <span className="mono" style={{
            fontSize: 9.5, padding: '1px 6px', borderRadius: 99,
            background: badgeTone === 'fuzzy'
              ? 'color-mix(in oklab, var(--fuzzy) 14%, transparent)'
              : 'color-mix(in oklab, var(--exact) 14%, transparent)',
            color: badgeTone === 'fuzzy' ? 'var(--fuzzy)' : 'var(--exact)',
            border: `1px solid color-mix(in oklab, ${badgeTone === 'fuzzy' ? 'var(--fuzzy)' : 'var(--exact)'} 35%, transparent)`,
          }}>{badge}</span>
        ) : null}
      </div>
      <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 4, lineHeight: 1.45 }}>{subtitle}</div>
    </div>
  </div>
);

const BodyB = ({ backend = 'gpu' }) => {
  const sec = estimatePerceptualSec({ ...SAMPLE_PAGE, backend });
  const timeStr = fmtSec(sec);
  return (
  <>
    <WF11Field label="Compare on this page" hint={<BackendChip backend={backend} compact />}>
      <div style={{ display: 'flex', gap: 10 }}>
        <ModeCard kind="standard"
          title="Standard"
          subtitle="Luma-weighted. Fast. Best for B&W or evenly-lit scans."
          badge={STANDARD_TIME}
          badgeTone="exact"
        />
        <ModeCard kind="perceptual"
          title="Perceptual"
          subtitle="Neighbourhood-sampled (pd-book-tools). Preserves local contrast on color or stained pages."
          badge={timeStr}
          badgeTone={backend === 'gpu' ? 'fuzzy' : 'mismatch'}
          selected
        />
      </div>
    </WF11Field>
    <PerceptualCallout compact />
    <div style={{ height: 12 }} />
    <WF11Field label="Source preview · before grayscale">
      <div style={{
        padding: 12, background: 'var(--bg-raised)',
        border: '1px solid var(--border-1)', borderRadius: 7,
        display: 'flex', gap: 12, alignItems: 'center',
      }}>
        <Thumb mode="color" w={68} h={92} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="mono" style={{ fontSize: 11.5, color: 'var(--ink-1)', fontWeight: 600 }}>p012 · color</div>
          <div className="mono" style={{ fontSize: 10.5, color: 'var(--ink-3)', marginTop: 3 }}>
            3-ch RGB · 2364 × 3568
          </div>
          <div className="mono" style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>tint ΔE 14.2 (yellowed)</div>
        </div>
      </div>
    </WF11Field>
  </>
  );
};

/* ====================================================================
   Variation C — Auto-detect (answers the open design Q)
==================================================================== */

const AutoBanner = ({ backend = 'gpu' }) => {
  const sec = estimatePerceptualSec({ ...SAMPLE_PAGE, backend });
  return (
  <div style={{
    padding: '12px 14px', borderRadius: 8,
    background: 'color-mix(in oklab, var(--accent) 10%, var(--bg-surface))',
    border: '1px solid color-mix(in oklab, var(--accent) 40%, var(--border-1))',
    display: 'flex', gap: 12, alignItems: 'flex-start',
  }}>
    <div style={{
      width: 28, height: 28, borderRadius: 7, flex: '0 0 auto',
      background: 'var(--accent)', color: 'var(--accent-ink)',
      display: 'grid', placeItems: 'center',
    }}>
      <Icon name="check" size={15} stroke={2.5} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        fontSize: 12, color: 'var(--ink-1)', fontWeight: 600,
      }}>
        <span>Source detected as <span className="mono">color · tinted</span></span>
        <span style={{ marginLeft: 'auto' }}><BackendChip backend={backend} compact /></span>
      </div>
      <div style={{ fontSize: 11.5, color: 'var(--ink-2)', marginTop: 3, lineHeight: 1.5 }}>
        Using <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Perceptual</span> grayscale ·{' '}
        <span className="mono" style={{ color: backend === 'gpu' ? 'var(--exact)' : 'var(--mismatch)' }}>{fmtSec(sec)}</span>
        <span className="mono" style={{ color: 'var(--ink-4)' }}> · {fmtMP(SAMPLE_PAGE.w, SAMPLE_PAGE.h)} · {SAMPLE_PAGE.w}×{SAMPLE_PAGE.h}</span>.
        Override below to force a mode.
      </div>
    </div>
  </div>
  );
};

const ModeRow = ({ on, name, sub, tag, tagTone, recommended }) => (
  <div style={{
    padding: '10px 12px', borderRadius: 7,
    background: on
      ? 'color-mix(in oklab, var(--accent) 8%, var(--bg-surface))'
      : 'var(--bg-raised)',
    border: `1px solid ${on ? 'color-mix(in oklab, var(--accent) 50%, var(--border-1))' : 'var(--border-1)'}`,
    display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer',
  }}>
    <div style={{ marginTop: 2 }}>
      <RadioDot on={on} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-1)' }}>{name}</span>
        {recommended ? (
          <span className="mono" style={{
            fontSize: 9.5, padding: '1px 6px', borderRadius: 99,
            background: 'color-mix(in oklab, var(--accent) 14%, transparent)',
            color: 'var(--accent)',
            border: '1px solid color-mix(in oklab, var(--accent) 35%, transparent)',
          }}>recommended</span>
        ) : null}
        {tag ? (
          <span className="mono" style={{
            marginLeft: 'auto',
            fontSize: 10, padding: '1px 6px', borderRadius: 99,
            background: tagTone === 'fuzzy'
              ? 'color-mix(in oklab, var(--fuzzy) 14%, transparent)'
              : 'color-mix(in oklab, var(--exact) 14%, transparent)',
            color: tagTone === 'fuzzy' ? 'var(--fuzzy)' : 'var(--exact)',
          }}>{tag}</span>
        ) : null}
      </div>
      <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 3, lineHeight: 1.5 }}>{sub}</div>
    </div>
  </div>
);

const BodyC = ({ backend = 'gpu' }) => {
  const sec = estimatePerceptualSec({ ...SAMPLE_PAGE, backend });
  const timeStr = fmtSec(sec);
  return (
  <>
    <AutoBanner backend={backend} />
    <div style={{ height: 16 }} />
    <WF11Field label="Manual override">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <ModeRow
          on
          name="Auto"
          sub="Detect source profile per page · Perceptual for color/tinted, Standard for B&W."
          recommended
        />
        <ModeRow
          on={false}
          name="Standard"
          sub="Luminosity-weighted. Fast. Best on B&W or evenly-lit scans."
          tag={STANDARD_TIME}
          tagTone="exact"
        />
        <ModeRow
          on={false}
          name="Perceptual"
          sub="pd-book-tools np_uint8_color_to_gray — GPU-accelerated, preserves local contrast."
          tag={timeStr}
          tagTone={backend === 'gpu' ? 'fuzzy' : 'mismatch'}
        />
      </div>
    </WF11Field>
    <WF11Field label="Scope">
      <CheckRow label="Apply override to all pages with matching profile" on />
    </WF11Field>
  </>
  );
};

/* ====================================================================
   Variation D — Inline before/after split preview
==================================================================== */

const SplitPreview = () => (
  <div style={{
    position: 'relative',
    width: '100%', height: 168, borderRadius: 7, overflow: 'hidden',
    border: '1px solid var(--border-1)',
    background: 'var(--bg-sunk)',
    display: 'flex',
  }}>
    {/* left: standard */}
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
      <Thumb mode="standard" w={340} h={168} />
      <span style={{
        position: 'absolute', top: 6, left: 6,
        fontFamily: 'var(--mono-font)', fontSize: 9.5,
        padding: '2px 6px', borderRadius: 4,
        background: 'rgba(0,0,0,0.55)', color: '#fff',
        letterSpacing: '.04em',
      }}>STANDARD</span>
    </div>
    {/* divider */}
    <div style={{
      width: 2, background: 'var(--accent)', position: 'relative',
    }}>
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 20, height: 20, borderRadius: 99,
        background: 'var(--accent)', color: 'var(--accent-ink)',
        display: 'grid', placeItems: 'center', cursor: 'ew-resize',
      }}>
        <Icon name="grip" size={11} />
      </div>
    </div>
    {/* right: perceptual */}
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
      <Thumb mode="perceptual" w={340} h={168} />
      <span style={{
        position: 'absolute', top: 6, right: 6,
        fontFamily: 'var(--mono-font)', fontSize: 9.5,
        padding: '2px 6px', borderRadius: 4,
        background: 'color-mix(in oklab, var(--accent) 80%, transparent)',
        color: 'var(--accent-ink)', letterSpacing: '.04em',
      }}>PERCEPTUAL</span>
    </div>
  </div>
);

const BodyD = () => (
  <>
    <WF11Field label="Mode" hint="hover preview to compare">
      <Seg2 opts={['Standard', 'Perceptual']} active="Perceptual" />
    </WF11Field>
    <WF11Field label="Preview · p012" hint="drag splitter">
      <SplitPreview />
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        fontFamily: 'var(--mono-font)', fontSize: 10.5,
        color: 'var(--ink-3)', marginTop: 6,
      }}>
        <span>local contrast 0.41</span>
        <span style={{ color: 'var(--accent)' }}>local contrast 0.83 ↑</span>
      </div>
    </WF11Field>
    <PerceptualCallout compact />
    <div style={{ height: 12 }} />
    <WF11Field label="Re-preview">
      <div style={{ display: 'flex', gap: 6 }}>
        <Button variant="outline" size="sm" icon="refresh">Refresh preview</Button>
        <Button variant="ghost" size="sm">Pick another page…</Button>
      </div>
    </WF11Field>
  </>
);

/* ====================================================================
   Variation E — Mode + advanced params unlocked
==================================================================== */

const AdvancedAccordion = ({ open }) => (
  <div style={{
    borderRadius: 7, border: '1px solid var(--border-1)',
    background: 'var(--bg-sunk)', overflow: 'hidden',
  }}>
    <div style={{
      padding: '9px 12px', display: 'flex', alignItems: 'center', gap: 8,
      cursor: 'pointer',
      borderBottom: open ? '1px solid var(--border-1)' : 'none',
    }}>
      <Icon name={open ? 'chevD' : 'chevR'} size={11} style={{ color: 'var(--ink-3)' }} />
      <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ink-2)' }}>Advanced · perceptual params</span>
      <span className="mono" style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--ink-4)' }}>3</span>
    </div>
    {open ? (
      <div style={{ padding: 12 }}>
        <WF11Field label="Sample radius (px)" hint="default 64" mono>
          <Slider value={64} min={16} max={256} />
          <div className="mono" style={{ fontSize: 10.5, color: 'var(--ink-3)', marginTop: 4 }}>64</div>
        </WF11Field>
        <WF11Field label="Neighbourhood σ" hint="default 0.5" mono>
          <Slider value={0.5} min={0} max={1} />
          <div className="mono" style={{ fontSize: 10.5, color: 'var(--ink-3)', marginTop: 4 }}>0.50</div>
        </WF11Field>
        <WF11Field label="Iterations" hint="default 5" mono>
          <Input value="5" mono />
        </WF11Field>
        <div style={{
          padding: '8px 10px', borderRadius: 6,
          background: 'var(--bg-raised)', border: '1px solid var(--border-1)',
          fontSize: 10.5, color: 'var(--ink-3)', lineHeight: 1.5,
        }}>
          Defaults match pd-book-tools <span className="mono" style={{ color: 'var(--ink-2)' }}>np_uint8_color_to_gray</span> reference.
        </div>
      </div>
    ) : null}
  </div>
);

const BodyE = () => (
  <>
    <WF11Field label="Grayscale mode">
      <Seg2 opts={['Standard', 'Perceptual']} active="Perceptual" />
    </WF11Field>
    <PerceptualCallout compact />
    <div style={{ height: 14 }} />
    <AdvancedAccordion open />
    <div style={{ height: 14 }} />
    <WF11Field label="Output">
      <CheckRow label="Cache result for re-runs of downstream stages" on />
      <CheckRow label="16-bit output" on />
    </WF11Field>
  </>
);

/* ====================================================================
   Variation F — Combined: auto-detect + two-card chooser + advanced
   ================================================================ */

/* Compact two-card chooser tuned to fit alongside the banner + accordion. */
const ModeCardCompact = ({ kind, title, subtitle, badge, badgeTone, selected }) => (
  <div style={{
    flex: 1, padding: 8, borderRadius: 7,
    background: selected
      ? 'color-mix(in oklab, var(--accent) 8%, var(--bg-surface))'
      : 'var(--bg-surface)',
    border: `1.5px solid ${selected ? 'var(--accent)' : 'var(--border-1)'}`,
    cursor: 'pointer', position: 'relative',
    display: 'flex', flexDirection: 'column', gap: 6,
  }}>
    {selected ? (
      <div style={{
        position: 'absolute', top: -6, right: -6,
        width: 16, height: 16, borderRadius: 99,
        background: 'var(--accent)', color: 'var(--accent-ink)',
        display: 'grid', placeItems: 'center',
      }}>
        <Icon name="check" size={10} stroke={3} />
      </div>
    ) : null}
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Thumb mode={kind} w={86} h={112} />
    </div>
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-1)' }}>{title}</span>
        {badge ? (
          <span className="mono" style={{
            fontSize: 9, padding: '1px 5px', borderRadius: 99,
            background: badgeTone === 'fuzzy'
              ? 'color-mix(in oklab, var(--fuzzy) 14%, transparent)'
              : 'color-mix(in oklab, var(--exact) 14%, transparent)',
            color: badgeTone === 'fuzzy' ? 'var(--fuzzy)' : 'var(--exact)',
          }}>{badge}</span>
        ) : null}
      </div>
      <div style={{ fontSize: 10.5, color: 'var(--ink-3)', marginTop: 2, lineHeight: 1.45 }}>{subtitle}</div>
    </div>
  </div>
);

/* Auto-detect banner showing the source profile + the auto-picked mode.
   Compact form for the combined variant. */
const AutoBannerF = ({ backend = 'gpu', onClick }) => {
  const sec = estimatePerceptualSec({ ...SAMPLE_PAGE, backend });
  return (
  <div style={{
    padding: '10px 12px', borderRadius: 8,
    background: 'color-mix(in oklab, var(--accent) 10%, var(--bg-surface))',
    border: '1px solid color-mix(in oklab, var(--accent) 40%, var(--border-1))',
    display: 'flex', gap: 10, alignItems: 'flex-start',
  }}>
    <div style={{
      width: 24, height: 24, borderRadius: 6, flex: '0 0 auto',
      background: 'var(--accent)', color: 'var(--accent-ink)',
      display: 'grid', placeItems: 'center',
    }}>
      <Icon name="check" size={13} stroke={2.5} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        fontSize: 11.5, color: 'var(--ink-1)', fontWeight: 600,
      }}>
        <span>Source <span className="mono">color · tinted</span> → using <span style={{ color: 'var(--accent)' }}>Perceptual</span></span>
        <span style={{ marginLeft: 'auto' }}><BackendChip backend={backend} compact withLabel={false} /></span>
      </div>
      <div style={{ fontSize: 10.5, color: 'var(--ink-3)', marginTop: 2, lineHeight: 1.5 }}>
        <span className="mono">{SAMPLE_PAGE.w}×{SAMPLE_PAGE.h} · {fmtMP(SAMPLE_PAGE.w, SAMPLE_PAGE.h)}</span>{' '}
        · <span className="mono" style={{ color: backend === 'gpu' ? 'var(--exact)' : 'var(--mismatch)' }}>{fmtSec(sec)}</span> per page
      </div>
    </div>
  </div>
  );
};

const CachedNote = () => (
  <div style={{
    padding: '7px 10px', borderRadius: 6,
    background: 'var(--bg-raised)', border: '1px solid var(--border-1)',
    fontSize: 10.5, color: 'var(--ink-3)', lineHeight: 1.5,
    display: 'flex', alignItems: 'center', gap: 8,
  }}>
    <Icon name="check" size={11} style={{ color: 'var(--exact)' }} />
    Result is cached — downstream re-runs reuse it.
  </div>
);

const BodyF = ({ backend = 'gpu' }) => {
  const sec = estimatePerceptualSec({ ...SAMPLE_PAGE, backend });
  const timeStr = fmtSec(sec);
  const PROJECT_PAGES = 232;
  return (
  <>
    <AutoBannerF backend={backend} />
    <div style={{ height: 12 }} />
    <WF11Field label="Mode · auto · click to override" hint={<BackendChip backend={backend} compact />}>
      <div style={{ display: 'flex', gap: 8 }}>
        <ModeCardCompact kind="standard"
          title="Standard"
          subtitle="Luma-weighted. Fast."
          badge={STANDARD_TIME}
          badgeTone="exact"
        />
        <ModeCardCompact kind="perceptual"
          title="Perceptual"
          subtitle="Neighbourhood-sampled. Preserves local contrast."
          badge={timeStr}
          badgeTone={backend === 'gpu' ? 'fuzzy' : 'mismatch'}
          selected
        />
      </div>
    </WF11Field>
    {backend === 'cpu' ? (
      <>
        <div style={{
          padding: '8px 10px', borderRadius: 7,
          background: 'color-mix(in oklab, var(--mismatch) 12%, var(--bg-surface))',
          border: '1px solid color-mix(in oklab, var(--mismatch) 35%, var(--border-1))',
          display: 'flex', alignItems: 'flex-start', gap: 10,
          marginBottom: 14,
        }}>
          <Icon name="alert" size={12} style={{ color: 'var(--mismatch)', marginTop: 2, flex: '0 0 auto' }} />
          <div style={{ fontSize: 11, color: 'var(--ink-2)', lineHeight: 1.5 }}>
            <span style={{ color: 'var(--ink-1)', fontWeight: 600 }}>No CUDA device detected.</span>{' '}
            Perceptual runs on CPU at <span className="mono">{timeStr}/page</span> — <span className="mono">~{fmtProjectTotal(sec, PROJECT_PAGES)}</span> for {PROJECT_PAGES} pages.
            <a style={{ color: 'var(--accent)', marginLeft: 4 }}>Switch to Standard</a>
          </div>
        </div>
      </>
    ) : null}
    <AdvancedAccordion open />
    <div style={{ height: 10 }} />
    <CachedNote />
  </>
  );
};

/* ====================================================================
   Wrappers — each renders the full Page Workbench frame with the
   variant panel slotted into the left drawer.
==================================================================== */

const grayAttrs = {
  type: 'body', typeName: 'Body',
  numbered: true, numberStyle: 'arabic', numberValue: 12,
  section: 'body', align: 'left', marker: null,
  pagePrefix: 'p012',
};

const VariationWF11 = ({ theme, variantId, variantName, body }) => (
  <VariationPW
    theme={theme}
    stage="grayscale"
    mode="view"
    attrs={grayAttrs}
    editMode="view"
    leftPane={<WF11Panel variantId={variantId} variantName={variantName} body={body} />}
  />
);

const WF11_A = ({ theme }) => (
  <VariationWF11 theme={theme} variantId="A" variantName="Segmented + amber callout" body={<BodyA />} />
);
const WF11_B = ({ theme, backend }) => (
  <VariationWF11 theme={theme} variantId="B" variantName="Two-card visual chooser" body={<BodyB backend={backend} />} />
);
const WF11_C = ({ theme, backend }) => (
  <VariationWF11 theme={theme} variantId="C" variantName="Auto-detect with manual override" body={<BodyC backend={backend} />} />
);
const WF11_D = ({ theme }) => (
  <VariationWF11 theme={theme} variantId="D" variantName="Inline before/after split preview" body={<BodyD />} />
);
const WF11_E = ({ theme }) => (
  <VariationWF11 theme={theme} variantId="E" variantName="Mode + advanced perceptual params" body={<BodyE />} />
);
const WF11_F = ({ theme, backend }) => (
  <VariationWF11 theme={theme} variantId={`F${backend === 'cpu' ? ' · CPU' : ''} ★`} variantName={`Combined · ${backend === 'cpu' ? 'CPU fallback ' : ''}auto-detect + chooser + advanced params`} body={<BodyF backend={backend} />} />
);
