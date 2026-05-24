// variations.jsx — WF-09 Page Reorder · full-frame artboards.

const { useState: useStV9 } = React;

/* ------------------------------------------------------------------
   Helpers — pick a window of rows around the drag interaction.
   We render about 9 rows visible at once (1440×900 frame ≈ 14 rows
   after toolbar + header chrome but we cap so a single ghost reads).
------------------------------------------------------------------- */
const ROW_WINDOW = SAMPLE_ROWS;

/* ---------------------- Variation: idle ---------------------- */
const PagesIdle = ({ note }) => (
  <div style={{
    background: 'var(--bg-surface)', border: '1px solid var(--border-1)',
    borderRadius: 8, boxShadow: 'none', overflow: 'hidden',
  }}>
    <PagesToolbar />
    <PagesHeader />
    {ROW_WINDOW.map(r => <PageRow key={r.prefix} row={r} />)}
    {note ? (
      <div style={{
        padding: '8px 16px', fontSize: 11.5, color: 'var(--ink-4)',
        background: 'var(--bg-page)', borderTop: '1px solid var(--border-1)',
      }}>{note}</div>
    ) : null}
  </div>
);

/* ---------------------- Variation: grip hover ---------------------- */
const PagesHoverGrip = () => (
  <div style={{
    background: 'var(--bg-surface)', border: '1px solid var(--border-1)',
    borderRadius: 8, boxShadow: 'none', overflow: 'hidden',
  }}>
    <PagesToolbar />
    <PagesHeader />
    {ROW_WINDOW.map(r => (
      <PageRow key={r.prefix} row={r}
        showGripHover={r.prefix === 'p020'}
        hover={r.prefix === 'p020'} />
    ))}
    <div style={{
      padding: '8px 16px', fontSize: 11.5, color: 'var(--ink-3)',
      background: 'var(--bg-page)', borderTop: '1px solid var(--border-1)',
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      <Icon name="grip" size={12} />
      <span>Drag handle hover · cursor: grab · click + drag to reorder</span>
    </div>
  </div>
);

/* ---------------------- Variation: single-row drag in progress ----------------------
   p020 is being dragged up toward the p018/p019 boundary. The original row
   appears at 40% opacity in place; a floating ghost shows at the cursor;
   a brand drop-indicator line marks the target slot.
-------------------------------------------------------------------------------- */
const PagesDragSingle = () => {
  const targetAfter = 'p018'; // drop indicator appears after this row
  return (
    <div style={{
      position: 'relative',
      background: 'var(--bg-surface)', border: '1px solid var(--border-1)',
      borderRadius: 8, boxShadow: 'none', overflow: 'hidden',
    }}>
      <PagesToolbar />
      <PagesHeader />
      {ROW_WINDOW.map(r => (
        <React.Fragment key={r.prefix}>
          <PageRow row={r}
            dragging={r.prefix === 'p020'}
            ghost={r.prefix === 'p020' && false}
          />
          {r.prefix === targetAfter ? <DropIndicator label="drop here → p019" /> : null}
        </React.Fragment>
      ))}
      {/* Floating ghost — positioned over the drop indicator zone */}
      <DragGhost
        rows={[SAMPLE_ROWS.find(r => r.prefix === 'p020')]}
        top={158}
        left={130}
      />
      <div style={{
        padding: '8px 16px', fontSize: 11.5, color: 'var(--ink-3)',
        background: 'var(--bg-page)', borderTop: '1px solid var(--border-1)',
      }}>
        Hold <KeyCap>esc</KeyCap> to cancel · release to drop · prefixes rebuild on drop
      </div>
    </div>
  );
};

/* ---------------------- Variation: just-dropped (amber flash + undo) ----------------------
   Reorder is label-only — page content stages stay clean. The moved row
   flashes; rows whose prefix changed get an amber prefix + struck-through
   old label. Only build_package becomes dirty.
-------------------------------------------------------------------------------- */
const PagesDropped = () => {
  const reorderedRows = [
    SAMPLE_ROWS.find(r => r.prefix === 'p016'),
    SAMPLE_ROWS.find(r => r.prefix === 'p017'),
    SAMPLE_ROWS.find(r => r.prefix === 'p018'),
    { ...SAMPLE_ROWS.find(r => r.prefix === 'p020'), idx: 17, prefix: 'p019', prevPrefix: 'p020', note: null, flashed: true, prefixChanged: true },
    { ...SAMPLE_ROWS.find(r => r.prefix === 'p019'), idx: 18, prefix: 'p020', prevPrefix: 'p019', note: null, prefixChanged: true },
    SAMPLE_ROWS.find(r => r.prefix === 'p021'),
    SAMPLE_ROWS.find(r => r.prefix === 'p022'),
    SAMPLE_ROWS.find(r => r.prefix === 'p023'),
    SAMPLE_ROWS.find(r => r.prefix === 'p024'),
    SAMPLE_ROWS.find(r => r.prefix === 'p025'),
    SAMPLE_ROWS.find(r => r.prefix === 'plate-iv'),
    SAMPLE_ROWS.find(r => r.prefix === 'p026'),
    SAMPLE_ROWS.find(r => r.prefix === 'p027'),
    SAMPLE_ROWS.find(r => r.prefix === 'p028'),
  ];
  return (
    <div>
      <UndoStrip
        message={<>Moved <span className="mono" style={{ fontWeight: 600 }}>p020</span> → slot 17 · renamed to <span className="mono" style={{ fontWeight: 600 }}>p019</span> · 2 prefixes swapped</>}
        packageDirty
      />
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border-1)',
        borderRadius: 8, boxShadow: 'none', overflow: 'hidden',
      }}>
        <PagesToolbar />
        <PagesHeader />
        {reorderedRows.map((r, i) => (
          <PageRow key={i + r.prefix} row={r}
            flash={r.flashed}
            prefixChanged={r.prefixChanged} />
        ))}
        <div style={{
          padding: '8px 16px', fontSize: 11.5, color: 'var(--ink-3)',
          background: 'var(--bg-page)', borderTop: '1px solid var(--border-1)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Icon name="info" size={12} />
          <span>Reorder is label-only — page content stages stay clean. Only <span className="mono" style={{ color: 'var(--fuzzy)', fontWeight: 600 }}>build_package</span> needs to re-run before download.</span>
        </div>
      </div>
    </div>
  );
};

/* ---------------------- Variation: multi-select range drag ---------------------- */
const PagesDragMulti = () => {
  const sel = ['p020', 'p021', 'p022'];
  const targetAfter = 'p025';
  return (
    <div style={{
      position: 'relative',
      background: 'var(--bg-surface)', border: '1px solid var(--border-1)',
      borderRadius: 8, boxShadow: 'none', overflow: 'hidden',
    }}>
      <PagesToolbar selectedCount={3} />
      <PagesHeader />
      {ROW_WINDOW.map(r => (
        <React.Fragment key={r.prefix}>
          <PageRow row={r}
            selected={sel.includes(r.prefix)}
            dragging={sel.includes(r.prefix)}
          />
          {r.prefix === targetAfter ? <DropIndicator label="drop here → after p025" /> : null}
        </React.Fragment>
      ))}
      <DragGhost
        rows={sel.map(p => SAMPLE_ROWS.find(r => r.prefix === p))}
        top={400}
        left={130}
      />
      <div style={{
        padding: '8px 16px', fontSize: 11.5, color: 'var(--ink-3)',
        background: 'var(--bg-page)', borderTop: '1px solid var(--border-1)',
      }}>
        <KeyCap>Shift</KeyCap>+click selected the range · they move together · release to drop
      </div>
    </div>
  );
};

/* ---------------------- Edge: out-of-proof-range warning on drop target ---------------------- */
const PagesEdgeOutOfRange = () => {
  // Hovering the drop target in front-matter region — show the warning chip
  const targetAfter = 'p016';
  return (
    <div style={{
      position: 'relative',
      background: 'var(--bg-surface)', border: '1px solid var(--border-1)',
      borderRadius: 8, boxShadow: 'none', overflow: 'hidden',
    }}>
      <PagesToolbar />
      <PagesHeader />
      {/* Insert two pretend front-matter rows up top */}
      {[
        { idx: 9,  prefix: 'f009',  stem: 'belloc_survivals_0021.jpg', type: 'toc',  align: 'left',  stage: 'clean' },
        { idx: 10, prefix: 'f010',  stem: 'belloc_survivals_0022.jpg', type: 'toc',  align: 'right', stage: 'clean' },
        { idx: 11, prefix: 'f011',  stem: 'belloc_survivals_0023.jpg', type: 'toc',  align: 'left',  stage: 'clean' },
        { idx: 12, prefix: 'p001',  stem: 'belloc_survivals_0024.jpg', type: 'body', align: 'right', stage: 'clean', marker: 'Start of body content' },
      ].map(r => <PageRow key={r.prefix} row={r} />)}
      {ROW_WINDOW.slice(0, 9).map(r => (
        <React.Fragment key={r.prefix}>
          <PageRow row={r}
            dragging={r.prefix === 'p024'}
            outOfRange={r.prefix === 'f010'} />
          {r.prefix === targetAfter ? (
            <div style={{ position: 'relative' }}>
              <DropIndicator label="warning · enters frontmatter" />
            </div>
          ) : null}
        </React.Fragment>
      ))}
      <DragGhost
        rows={[SAMPLE_ROWS.find(r => r.prefix === 'p024')]}
        top={240}
        left={130}
      />
      <div style={{
        padding: '10px 14px', fontSize: 12, color: 'var(--ink-1)',
        background: 'color-mix(in oklab, var(--mismatch) 9%, var(--bg-surface))',
        borderTop: '1px solid color-mix(in oklab, var(--mismatch) 35%, var(--border-1))',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <Icon name="alert" size={15} style={{ color: 'var(--mismatch)' }} />
        <span>This page would land at idx <span className="mono" style={{ fontWeight: 600 }}>10</span> — outside the current proof range
        (<span className="mono">p001–p387</span>). It will be marked frontmatter on drop.</span>
        <div style={{ flex: 1 }} />
        <Button variant="ghost" size="sm">Adjust range</Button>
      </div>
    </div>
  );
};

/* ---------------------- Edge: package-building warning dialog ----------------------
   Reorder doesn't affect page content stages — they're indifferent to order.
   Only build_package (which writes prefix-named files into the zip) depends on
   order. If a package build is in flight, reordering invalidates its output.
--------------------------------------------------------------------------------- */
const PipelineRunningDialog = () => (
  <div style={{
    position: 'absolute', inset: 0, display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)',
  }}>
    <div style={{
      width: 460, background: 'var(--bg-surface)', borderRadius: 12,
      boxShadow: 'var(--shadow-floating)', border: '1px solid var(--border-1)',
      overflow: 'hidden',
    }}>
      <div style={{ padding: '18px 22px 4px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: 'color-mix(in oklab, var(--fuzzy) 18%, transparent)',
          color: 'var(--fuzzy)',
          display: 'grid', placeItems: 'center', flex: '0 0 auto',
        }}>
          <Icon name="alert" size={18} stroke={2.2} />
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-1)', letterSpacing: '-0.01em' }}>
            Reorder while package is building?
          </div>
          <div style={{ marginTop: 6, fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.55 }}>
            Stage <span className="mono">build_package</span> is running. Reorder will:
          </div>
        </div>
      </div>
      <div style={{ padding: '10px 22px 18px 72px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          ['Leave page content stages clean', 'check'],
          ['Cancel the in-flight package build', 'pause'],
          ['Mark build_package dirty — rebuild after reorder', 'alert'],
        ].map(([text, icon]) => (
          <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--ink-2)' }}>
            <Icon name={icon} size={12} style={{ color: 'var(--ink-3)' }} />
            <span>{text}</span>
          </div>
        ))}
      </div>
      <div style={{
        padding: '12px 22px', borderTop: '1px solid var(--border-1)',
        background: 'var(--bg-page)', display: 'flex', justifyContent: 'flex-end', gap: 8,
      }}>
        <Button variant="ghost" size="md">Cancel</Button>
        <Button variant="primary" size="md">Continue reorder</Button>
      </div>
    </div>
  </div>
);

/* ---------------------- Variation: row actions menu open ---------------------- */
const PagesActionsMenu = ({ mode = 'list' }) => (
  <div style={{
    position: 'relative',
    background: 'var(--bg-surface)', border: '1px solid var(--border-1)',
    borderRadius: 8, boxShadow: 'none', overflow: 'hidden',
  }}>
    <PagesToolbar />
    <PagesHeader />
    {ROW_WINDOW.map(r => (
      <PageRow key={r.prefix} row={r.prefix === 'p020' ? { ...r, actionsOpen: true } : r}
        hover={r.prefix === 'p020'} />
    ))}
    {/* Position the menu just below/right of p020's actions trigger.
        Row p020 is the 5th row from top: toolbar (60) + header (32) + 4*44 + ~14 */}
    <RowActionsMenu top={282} left={1056} mode={mode} prefix="p020" />
    <div style={{
      padding: '8px 16px', fontSize: 11.5, color: 'var(--ink-3)',
      background: 'var(--bg-page)', borderTop: '1px solid var(--border-1)',
    }}>
      Keyboard alternative to drag · <KeyCap>⌃</KeyCap><KeyCap>↑</KeyCap> / <KeyCap>⌃</KeyCap><KeyCap>↓</KeyCap> nudge · <KeyCap>M</KeyCap> open Move to slot
    </div>
  </div>
);

Object.assign(window, {
  PagesIdle, PagesHoverGrip, PagesDragSingle, PagesDropped,
  PagesDragMulti, PagesEdgeOutOfRange, PipelineRunningDialog,
  PagesActionsMenu,
});
