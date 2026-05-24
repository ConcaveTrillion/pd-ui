// pages-tab.jsx — Pages tab backdrop + drag-reorder PageRow + drag affordances.
// Designed to be composed under ProjectConfigureFrame; flip the active tab to "Pages".

/* ---------------------- Page row data ---------------------- */
// Realistic mid-book sample so drag scenarios have context.
// section: front / body / back  · type: cover/title/toc/body/plate/catalog
const SAMPLE_ROWS = [
  { idx: 14, prefix: 'p016', stem: 'belloc_survivals_0026.jpg', type: 'body',  align: 'left',  stage: 'clean' },
  { idx: 15, prefix: 'p017', stem: 'belloc_survivals_0027.jpg', type: 'body',  align: 'right', stage: 'clean' },
  { idx: 16, prefix: 'p018', stem: 'belloc_survivals_0028.jpg', type: 'body',  align: 'left',  stage: 'clean' },
  { idx: 17, prefix: 'p019', stem: 'belloc_survivals_0029.jpg', type: 'body',  align: 'right', stage: 'clean' },
  { idx: 18, prefix: 'p020', stem: 'belloc_survivals_0031.jpg', type: 'body',  align: 'left',  stage: 'clean', note: 'out-of-order scan' },
  { idx: 19, prefix: 'p021', stem: 'belloc_survivals_0030.jpg', type: 'body',  align: 'right', stage: 'clean', note: 'out-of-order scan' },
  { idx: 20, prefix: 'p022', stem: 'belloc_survivals_0032.jpg', type: 'body',  align: 'left',  stage: 'clean' },
  { idx: 21, prefix: 'p023', stem: 'belloc_survivals_0033.jpg', type: 'body',  align: 'right', stage: 'clean' },
  { idx: 22, prefix: 'p024', stem: 'belloc_survivals_0034.jpg', type: 'body',  align: 'left',  stage: 'clean' },
  { idx: 23, prefix: 'p025', stem: 'belloc_survivals_0035.jpg', type: 'body',  align: 'right', stage: 'clean' },
  { idx: 24, prefix: 'plate-iv', stem: 'belloc_survivals_0036.jpg', type: 'plate', align: '—',  stage: 'clean', marker: 'unnumbered insert' },
  { idx: 25, prefix: 'p026', stem: 'belloc_survivals_0037.jpg', type: 'body',  align: 'left',  stage: 'clean' },
  { idx: 26, prefix: 'p027', stem: 'belloc_survivals_0038.jpg', type: 'body',  align: 'right', stage: 'clean' },
  { idx: 27, prefix: 'p028', stem: 'belloc_survivals_0039.jpg', type: 'body',  align: 'left',  stage: 'clean' },
];

const TYPE_TONE = {
  body: 'neutral',
  plate: 'brand',
  catalog: 'neutral',
  title: 'neutral',
  toc: 'neutral',
};

/* ---------------------- Single page row ---------------------- */
const PageRow = ({
  row, selected, hover, dragging, flash, ghost,
  prefixChanged, // row was renumbered (label-only, not pixel-dirty)
  outOfRange, // edge-case red marker
  showGripHover, // explicit "hover the grip" visual
  zebra,
}) => {
  // Tint backgrounds
  const bg = ghost ? 'transparent' :
    flash ? 'color-mix(in srgb, var(--accent) 18%, var(--bg-surface))' :
    selected ? 'color-mix(in srgb, var(--accent) 7%, var(--bg-surface))' :
    hover ? 'var(--bg-raised)' :
    'var(--bg-surface)';

  return (
    <div style={{
      display: 'grid', alignItems: 'center',
      gridTemplateColumns: '20px 16px 44px 76px 1fr 92px 60px 12px 12px',
      gap: 10, padding: '0 12px', height: 30,
      borderBottom: '1px solid var(--border-1)',
      background: bg,
      opacity: dragging ? 0.4 : 1,
      position: 'relative',
      transition: flash ? 'background 0.4s ease-out' : 'none',
      fontSize: 11.5,
    }}>
      {/* Grip */}
      <div style={{
        display: 'grid', placeItems: 'center',
        width: 20, height: 22, borderRadius: 4,
        background: showGripHover ? 'var(--bg-sunk)' : 'transparent',
        color: showGripHover ? 'var(--ink-1)' : 'var(--ink-4)',
        cursor: 'grab',
      }}>
        <Icon name="grip" size={12} />
      </div>
      {/* Checkbox */}
      <span style={{
        width: 14, height: 14, borderRadius: 3,
        background: selected ? 'var(--accent)' : 'var(--bg-sunk)',
        border: selected ? 'none' : '1px solid var(--border-2)',
        display: 'grid', placeItems: 'center', color: 'var(--accent-ink)',
      }}>
        {selected ? <Icon name="check" size={9} stroke={3} /> : null}
      </span>
      {/* idx */}
      <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-4)', textAlign: 'right' }}>
        {String(row.idx).padStart(3, '0')}
      </span>
      {/* prefix */}
      <span className="mono" style={{
        fontSize: 11.5, fontWeight: 600,
        color: prefixChanged ? 'var(--accent)' : 'var(--ink-1)',
      }}>
        {row.prefix}
        {prefixChanged && row.prevPrefix ? (
          <span className="mono" style={{
            marginLeft: 5, fontSize: 10, fontWeight: 500,
            color: 'var(--ink-4)', textDecoration: 'line-through',
          }}>{row.prevPrefix}</span>
        ) : null}
      </span>
      {/* stem */}
      <span className="mono" style={{
        fontSize: 10.5, color: 'var(--ink-3)', overflow: 'hidden',
        textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {row.stem}
        {row.note ? (
          <span style={{
            marginLeft: 6, fontSize: 10, color: 'var(--fuzzy)',
            fontFamily: 'var(--ui-font)',
          }}>· {row.note}</span>
        ) : null}
      </span>
      {/* type */}
      <Badge tone={row.type === 'plate' ? 'brand' : 'neutral'}>
        {row.type}{row.marker ? ' · ins' : ''}
      </Badge>
      {/* alignment */}
      <span style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>{row.align}</span>
      {/* stage dot */}
      <span style={{
        width: 6, height: 6, borderRadius: 99,
        background:
          row.stage === 'clean' ? 'var(--exact)' :
          row.stage === 'dirty' ? 'var(--fuzzy)' :
          row.stage === 'failed' ? 'var(--mismatch)' :
          'var(--ink-4)',
      }} />
      {/* chevron / quick-actions trigger */}
      <div style={{
        display: 'grid', placeItems: 'center', width: 14, height: 22, borderRadius: 3,
        background: row.actionsOpen ? 'var(--bg-sunk)' : 'transparent',
        color: row.actionsOpen ? 'var(--ink-1)' : 'var(--ink-4)',
        cursor: 'pointer',
        transform: row.actionsOpen ? 'rotate(90deg)' : 'rotate(0deg)',
        transition: 'transform 0.12s ease, background 0.12s ease',
      }}>
        <Icon name="chevR" size={11} />
      </div>

      {/* Out-of-range pill, rendered absolute over the stem cell */}
      {outOfRange ? (
        <div style={{
          position: 'absolute', left: 200, top: 7,
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '1px 6px', borderRadius: 9,
          background: 'color-mix(in srgb, var(--mismatch) 10%, transparent)',
          color: 'var(--mismatch)',
          border: '1px solid color-mix(in srgb, var(--mismatch) 33%, transparent)',
          fontSize: 9.5, fontWeight: 600, letterSpacing: '0.02em',
        }}>
          <Icon name="alert" size={9} stroke={2.5} />
          outside proof range
        </div>
      ) : null}
    </div>
  );
};

/* ---------------------- Drop indicator (between rows) ---------------------- */
const DropIndicator = ({ label }) => (
  <div style={{
    position: 'relative', height: 0,
    borderTop: '2px solid var(--accent)',
    marginLeft: 0, marginRight: 0,
  }}>
    <div style={{
      position: 'absolute', left: -6, top: -6, width: 10, height: 10, borderRadius: 99,
      background: 'var(--accent)', border: '2px solid var(--bg-surface)',
    }} />
    {label ? (
      <div style={{
        position: 'absolute', right: 16, top: -11,
        background: 'var(--accent)', color: 'var(--accent-ink)',
        fontSize: 10.5, fontWeight: 600, padding: '2px 8px', borderRadius: 99,
        fontFamily: 'var(--mono-font)',
      }}>{label}</div>
    ) : null}
  </div>
);

/* ---------------------- Floating drag ghost ---------------------- */
const DragGhost = ({ rows, top, left }) => (
  <div style={{
    position: 'absolute', top, left, width: 760, pointerEvents: 'none',
    zIndex: 30, transform: 'rotate(-0.4deg)',
    filter: 'drop-shadow(0 12px 24px rgba(15,23,42,.18))',
  }}>
    {rows.map((r, i) => (
      <div key={r.prefix} style={{
        position: 'relative',
        marginTop: i === 0 ? 0 : -36, // stacked, slightly offset
        background: 'var(--bg-surface)',
        border: '1px solid var(--accent)',
        borderRadius: 8,
        boxShadow: i === 0 ? '0 6px 12px rgba(15,23,42,.10)' : 'none',
        transform: `translateY(${i * 4}px) translateX(${i * 3}px)`,
        opacity: i === 0 ? 1 : 0.92 - i * 0.08,
      }}>
        <PageRow row={r} />
      </div>
    ))}
    {rows.length > 1 ? (
      <div style={{
        position: 'absolute', top: -10, right: -10,
        background: 'var(--accent)', color: 'var(--accent-ink)',
        fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 99,
        boxShadow: '0 2px 4px rgba(15,23,42,.18)',
      }}>{rows.length} pages</div>
    ) : null}
  </div>
);

/* ---------------------- Pages tab toolbar ---------------------- */
const PagesToolbar = ({ selectedCount = 0, total = 387 }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '8px 12px', borderBottom: '1px solid var(--border-1)',
    background: 'var(--bg-page)', borderTopLeftRadius: 8, borderTopRightRadius: 8,
  }}>
    {selectedCount > 0 ? (
      <>
        <Badge tone="brand">{selectedCount} selected</Badge>
        <Divider vertical style={{ height: 16 }} />
        <Button variant="ghost" size="sm">Set type…</Button>
        <Button variant="ghost" size="sm">Set alignment…</Button>
        <Button variant="ghost" size="sm" icon="grip">Drag together</Button>
      </>
    ) : (
      <>
        <span style={{ fontSize: 11.5, color: 'var(--ink-2)' }}>
          <span className="mono" style={{ color: 'var(--ink-1)', fontWeight: 600 }}>{total}</span> pages
        </span>
        <Divider vertical style={{ height: 16 }} />
        <Button variant="ghost" size="sm" icon="search">Filter…</Button>
        <span style={{ fontSize: 11.5, color: 'var(--ink-3)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            width: 24, height: 14, borderRadius: 99, background: 'var(--bg-sunk)',
            border: '1px solid var(--border-2)',
            display: 'inline-flex', alignItems: 'center', padding: 1,
          }}>
            <span style={{ width: 10, height: 10, borderRadius: 99, background: 'var(--ink-4)' }} />
          </span>
          Show split parents
        </span>
      </>
    )}
    <div style={{ flex: 1 }} />
    <Button variant="default" size="sm" iconRight="chevD">Auto-sort…</Button>
    <Button variant="default" size="sm" icon="plus">Add page</Button>
  </div>
);

/* ---------------------- Column headers ---------------------- */
const PagesHeader = () => (
  <div className="label" style={{
    display: 'grid', alignItems: 'center',
    gridTemplateColumns: '20px 16px 44px 76px 1fr 92px 60px 12px 12px',
    gap: 10, padding: '0 12px', height: 24,
    borderBottom: '1px solid var(--border-1)',
    background: 'var(--bg-page)',
  }}>
    <span />
    <span />
    <span style={{ textAlign: 'right' }}>idx</span>
    <span>prefix</span>
    <span>source stem</span>
    <span>type</span>
    <span>align</span>
    <span />
    <span />
  </div>
);

/* ---------------------- Inline undo strip (after drop) ---------------------- */
const UndoStrip = ({ message, packageDirty }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '10px 14px',
    background: 'color-mix(in srgb, var(--accent) 10%, var(--bg-surface))',
    border: '1px solid color-mix(in srgb, var(--accent) 40%, var(--border-1))',
    borderRadius: 8, margin: '0 0 12px',
  }}>
    <Icon name="checkCircle" size={16} style={{ color: 'var(--accent)', flex: '0 0 auto' }} />
    <div style={{ flex: 1, fontSize: 12, color: 'var(--ink-1)' }}>
      {message}
      {packageDirty ? (
        <span style={{ marginLeft: 8, color: 'var(--ink-3)' }}>
          · <span className="mono" style={{ color: 'var(--fuzzy)', fontWeight: 600 }}>hyphen_join</span> and <span className="mono" style={{ color: 'var(--fuzzy)', fontWeight: 600 }}>build_package</span> need to re-run
        </span>
      ) : null}
    </div>
    <Button variant="ghost" size="sm">Undo</Button>
    <Button variant="ghost" size="sm" icon="x" style={{ padding: '0 6px' }}> </Button>
  </div>
);

Object.assign(window, {
  SAMPLE_ROWS, PageRow, DropIndicator, DragGhost,
  PagesToolbar, PagesHeader, UndoStrip,
});

/* ====================================================================
   Row Actions Menu — per-row "..." dropdown.
   Anchored to a row's right edge; the user reaches it via keyboard or
   by clicking the ⋯ trigger that replaces the chevron when hovered.
==================================================================== */
const MenuRow = ({ icon, label, kbd, sub, dim, danger, divider }) => {
  if (divider) return <div style={{ height: 1, background: 'var(--border-1)', margin: '4px 0' }} />;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '7px 10px', borderRadius: 6, cursor: 'pointer',
      color: danger ? 'var(--mismatch)' : dim ? 'var(--ink-4)' : 'var(--ink-1)',
      fontSize: 12.5,
    }}>
      <Icon name={icon} size={13} style={{ color: 'currentColor', opacity: 0.85 }} />
      <span style={{ flex: 1 }}>{label}</span>
      {sub ? <Icon name="chevR" size={11} style={{ color: 'var(--ink-4)' }} /> : null}
      {kbd ? <KeyCap>{kbd}</KeyCap> : null}
    </div>
  );
};

const RowActionsMenu = ({ top, left, mode = 'list', prefix = 'p020' }) => {
  if (mode === 'move-to-slot') {
    // Sub-popover after clicking "Move to slot…"
    return (
      <div style={{
        position: 'absolute', top, left, width: 280, zIndex: 40,
        background: 'var(--bg-surface)', borderRadius: 10,
        boxShadow: 'var(--shadow-floating)', border: '1px solid var(--border-1)',
        padding: 12,
      }}>
        <div style={{ fontSize: 12.5, color: 'var(--ink-2)', marginBottom: 6 }}>
          Move <span className="mono" style={{ color: 'var(--ink-1)', fontWeight: 600 }}>{prefix}</span> to slot
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Input value="17" style={{ flex: 1, height: 32 }} mono autoFocus />
          <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>of 387</span>
        </div>
        <div style={{ marginTop: 8, fontSize: 11.5, color: 'var(--ink-3)' }}>
          Will renumber to <span className="mono" style={{ color: 'var(--accent)', fontWeight: 600 }}>p019</span>
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
          <Button variant="ghost" size="sm">Cancel</Button>
          <Button variant="primary" size="sm">Move</Button>
        </div>
      </div>
    );
  }
  return (
    <div style={{
      position: 'absolute', top, left, width: 224, zIndex: 40,
      background: 'var(--bg-surface)', borderRadius: 10,
      boxShadow: 'var(--shadow-floating)', border: '1px solid var(--border-1)',
      padding: 4,
    }}>
      <div style={{
        padding: '6px 10px 4px', fontSize: 10.5, fontWeight: 600,
        letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-4)',
      }}>Reorder</div>
      <MenuRow icon="arrowUp"     label="Move to top" />
      <MenuRow icon="arrowDown"   label="Move to bottom" />
      <MenuRow icon="arrowUpDown" label="Move to slot…" kbd="M" sub />
      <MenuRow icon="chevR"       label="Move before…" sub />
      <MenuRow icon="chevR"       label="Move after…" sub />
      <MenuRow divider />
      <div style={{
        padding: '4px 10px 4px', fontSize: 10.5, fontWeight: 600,
        letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-4)',
      }}>Page</div>
      <MenuRow icon="folder"   label="Set type…"      sub />
      <MenuRow icon="link"     label="Set alignment…" sub />
      <MenuRow icon="scissors" label="Split parent" />
      <MenuRow divider />
      <MenuRow icon="trash"    label="Delete page" danger />
    </div>
  );
};

/* ====================================================================
   Reorder Scans stage — auto-detect + swap list.
==================================================================== */
const PageThumb = ({ idx, prefix, stem, highlight, faded, label }) => (
  <div style={{
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
  }}>
    <div style={{
      width: 96, height: 130, borderRadius: 6, position: 'relative',
      background: 'var(--bg-surface)',
      border: `2px solid ${highlight ? 'var(--accent)' : 'var(--border-1)'}`,
      boxShadow: highlight ? '0 0 0 4px color-mix(in oklab, var(--accent) 22%, transparent)' : 'var(--shadow-floating)',
      opacity: faded ? 0.5 : 1,
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 8,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent 0 4px, color-mix(in oklab, var(--ink-3) 22%, transparent) 4px 5px)',
        borderTop: '1px solid color-mix(in oklab, var(--ink-3) 14%, transparent)',
        borderBottom: '1px solid color-mix(in oklab, var(--ink-3) 14%, transparent)',
      }} />
      {/* OCR'd page number bottom */}
      <div style={{
        position: 'absolute', bottom: 6, left: 0, right: 0,
        textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'var(--ink-1)',
        fontFamily: 'var(--mono-font)',
        background: 'color-mix(in oklab, var(--bg-surface) 80%, transparent)',
        padding: '2px 0',
      }}>{label}</div>
    </div>
    <div className="mono" style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>{stem}</div>
    <div className="mono" style={{
      fontSize: 11, fontWeight: 600,
      color: highlight ? 'var(--accent)' : 'var(--ink-2)',
    }}>idx {idx} · {prefix}</div>
  </div>
);

const SwapRow = ({ swap, state = 'pending', confidence }) => {
  const tone =
    state === 'accepted' ? 'var(--exact)' :
    state === 'rejected' ? 'var(--ink-4)' :
    confidence === 'high' ? 'var(--accent)' :
    'var(--fuzzy)';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 18,
      padding: '14px 18px',
      borderBottom: '1px solid var(--border-1)',
      background: state === 'rejected' ? 'var(--bg-page)' : 'var(--bg-surface)',
      opacity: state === 'rejected' ? 0.55 : 1,
    }}>
      {/* Swap number */}
      <div style={{
        width: 28, height: 28, borderRadius: 7, flex: '0 0 auto',
        background: `color-mix(in oklab, ${tone} 16%, var(--bg-surface))`,
        color: tone,
        display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700,
      }}>{swap.n}</div>

      {/* Thumbs + arrow */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: '0 0 auto' }}>
        <PageThumb {...swap.before} faded={state === 'accepted'} />
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          color: tone,
        }}>
          <Icon name="swap" size={20} stroke={2.2} />
          <span className="mono" style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: '.04em' }}>
            {state === 'accepted' ? 'SWAPPED' : 'SWAP'}
          </span>
        </div>
        <PageThumb {...swap.after} highlight={state !== 'rejected'} />
      </div>

      {/* Reasoning */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-1)' }}>{swap.title}</span>
          <Badge tone={confidence === 'high' ? 'brand' : 'dirty'} dot>
            {confidence === 'high' ? 'high confidence' : 'medium confidence'}
          </Badge>
        </div>
        <div style={{ marginTop: 6, fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.5 }}>
          {swap.reason}
        </div>
        <div style={{ marginTop: 6, display: 'flex', gap: 14, fontSize: 11, color: 'var(--ink-4)' }}>
          {swap.signals.map(s => (
            <span key={s.k} className="mono">
              <span style={{ color: 'var(--ink-3)' }}>{s.k}:</span> {s.v}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 6, flex: '0 0 auto' }}>
        {state === 'accepted' ? (
          <Badge tone="clean">Accepted</Badge>
        ) : state === 'rejected' ? (
          <Badge tone="neutral">Skipped</Badge>
        ) : (
          <>
            <Button variant="ghost" size="sm">Skip</Button>
            <Button variant="outline" size="sm" icon="eye">Inspect</Button>
            <Button variant="primary" size="sm" icon="check">Accept</Button>
          </>
        )}
      </div>
    </div>
  );
};

const SWAPS = [
  {
    n: 1,
    title: 'Pages 30 and 31 are scanned out of order',
    reason: 'Scan filename 0030 contains OCR’d page number 31. Adjacent filename 0031 contains OCR’d page number 30. Swap restores ascending order.',
    signals: [
      { k: 'ocr page #', v: '31 → 30' },
      { k: 'filename seq', v: '0030 → 0031' },
      { k: 'similarity', v: '0.98' },
    ],
    confidence: 'high',
    before: { idx: 18, prefix: 'p020', stem: '..._0030.jpg', label: '31' },
    after:  { idx: 19, prefix: 'p021', stem: '..._0031.jpg', label: '30' },
  },
  {
    n: 2,
    title: 'Plate insert misplaced before its caption',
    reason: 'Detected plate page (no text) sits between numbered pages 84 and 85. Caption "Plate IV. The North Lakes." appears on page 85 — plate likely belongs after.',
    signals: [
      { k: 'page type', v: 'plate · body' },
      { k: 'caption match', v: '"Plate IV"' },
      { k: 'confidence', v: '0.91' },
    ],
    confidence: 'high',
    before: { idx: 72, prefix: 'plate-iii', stem: '..._0094.jpg', label: '—' },
    after:  { idx: 73, prefix: 'p085',     stem: '..._0095.jpg', label: '85' },
  },
  {
    n: 3,
    title: 'Possible reverse-order pair around p142',
    reason: 'Numbers detected on facing scans are not strictly increasing; OCR confidence on left page is 0.62.',
    signals: [
      { k: 'ocr page #', v: '143 → 142' },
      { k: 'confidence', v: '0.62 (low)' },
    ],
    confidence: 'medium',
    before: { idx: 129, prefix: 'p142', stem: '..._0151.jpg', label: '143' },
    after:  { idx: 130, prefix: 'p143', stem: '..._0152.jpg', label: '142' },
  },
];

const ReorderScansBanner = ({ status = 'detected' }) => {
  if (status === 'clean') {
    return (
      <div style={{
        padding: '14px 18px', borderRadius: 10,
        background: 'color-mix(in oklab, var(--exact) 10%, var(--bg-surface))',
        border: '1px solid color-mix(in oklab, var(--exact) 30%, var(--border-1))',
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <CheckIconSquare status="pass" size={36} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-1)' }}>Scans look in order</div>
          <div style={{ marginTop: 2, fontSize: 12.5, color: 'var(--ink-2)' }}>
            Filename sequence matches OCR’d page numbers across 387 pages. No swaps needed.
          </div>
        </div>
        <Button variant="outline" size="md" icon="refresh">Re-detect</Button>
      </div>
    );
  }
  return (
    <div style={{
      padding: '14px 18px', borderRadius: 10,
      background: 'color-mix(in oklab, var(--accent) 10%, var(--bg-surface))',
      border: '1px solid color-mix(in oklab, var(--accent) 40%, var(--border-1))',
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 7,
        background: 'color-mix(in oklab, var(--accent) 25%, transparent)',
        color: 'var(--accent-ink)',
        display: 'grid', placeItems: 'center',
      }}>
        <Icon name="sparkles" size={18} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-1)' }}>
          Found 3 likely out-of-order scans
        </div>
        <div style={{ marginTop: 2, fontSize: 12.5, color: 'var(--ink-2)' }}>
          Detected by comparing filename sequence against OCR’d page numbers on each scan.
          Review and accept individually, or apply all high-confidence swaps at once.
        </div>
      </div>
      <Button variant="outline" size="md">Skip stage</Button>
      <Button variant="primary" size="md" icon="sparkles">Auto-apply (2 high)</Button>
    </div>
  );
};

/* Local copy of the validation panel's status icon — we don’t want to
   cross-import from wf02, so we redeclare it here under a different name. */
const CheckIconSquare = ({ status, size = 22 }) => {
  const cfg = {
    pass:  { bg: 'color-mix(in oklab, var(--exact) 16%, transparent)', fg: 'var(--exact)', name: 'check' },
    warn:  { bg: 'color-mix(in oklab, var(--fuzzy) 20%, transparent)', fg: 'var(--fuzzy)', name: 'alert' },
  }[status];
  return (
    <span style={{
      width: size, height: size, borderRadius: 6,
      background: cfg.bg, color: cfg.fg,
      display: 'inline-grid', placeItems: 'center', flex: '0 0 auto',
    }}>
      <Icon name={cfg.name} size={size - 10} stroke={2.4} />
    </span>
  );
};

const ReorderScansStage = ({ state = 'detected' }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <ReorderScansBanner status={state} />

    {state !== 'clean' ? (
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border-1)',
        borderRadius: 8, boxShadow: 'none', overflow: 'hidden',
      }}>
        {/* Section header */}
        <div style={{
          padding: '12px 18px', borderBottom: '1px solid var(--border-1)',
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'var(--bg-page)',
        }}>
          <Icon name="swap" size={14} style={{ color: 'var(--ink-3)' }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-1)' }}>Proposed swaps</span>
          <span style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>3 detected · 2 high · 1 medium</span>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>Sort</span>
          <Button variant="outline" size="sm" iconRight="chevD">Confidence</Button>
        </div>

        {SWAPS.map((s, i) => (
          <SwapRow key={s.n}
            swap={s}
            confidence={s.confidence}
            state={state === 'after-apply' ? (i < 2 ? 'accepted' : 'pending') : 'pending'} />
        ))}
      </div>
    ) : null}

    {state === 'after-apply' ? (
      <div style={{
        padding: '10px 14px',
        background: 'color-mix(in oklab, var(--exact) 10%, var(--bg-surface))',
        border: '1px solid color-mix(in oklab, var(--exact) 30%, var(--border-1))',
        borderRadius: 8,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <Icon name="checkCircle" size={15} style={{ color: 'var(--exact)' }} />
        <span style={{ fontSize: 12.5, color: 'var(--ink-1)' }}>
          Applied 2 high-confidence swaps · 4 prefixes renumbered · <span className="mono" style={{ color: 'var(--fuzzy)', fontWeight: 600 }}>build_package</span> needs to re-run
        </span>
        <div style={{ flex: 1 }} />
        <Button variant="ghost" size="sm">Undo</Button>
      </div>
    ) : null}
  </div>
);

Object.assign(window, {
  MenuRow, RowActionsMenu,
  PageThumb, SwapRow, SWAPS, ReorderScansBanner, ReorderScansStage, CheckIconSquare,
});
