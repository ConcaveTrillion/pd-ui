// app.jsx — design canvas for WF-09 Page Reorder.

const { useState: useStR, useEffect: useEfR } = React;

function App() {
  const [theme, setTheme] = useStR(() => localStorage.getItem('pgd-theme') || 'dark');
  useEfR(() => localStorage.setItem('pgd-theme', theme), [theme]);

  const themeToggle = (
    <div style={{
      position: 'fixed', top: 12, right: 16, zIndex: 50,
      display: 'flex', alignItems: 'center', gap: 8,
      background: 'rgba(21,21,27,0.85)', backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255,255,255,0.08)', borderRadius: 999,
      padding: '3px 4px', boxShadow: '0 3px 10px rgba(0,0,0,0.35)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif', fontSize: 12.5,
    }}>
      {['light', 'dark'].map(t => (
        <button key={t} onClick={() => setTheme(t)} style={{
          border: 0, cursor: 'pointer',
          background: theme === t ? '#d6925a' : 'transparent',
          color: theme === t ? '#1a0f08' : '#b0b0b8',
          padding: '5px 12px', borderRadius: 999, fontWeight: 500,
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>
          <Icon name={t === 'dark' ? 'moon' : 'sun'} size={13} />
          {t === 'dark' ? 'Dark' : 'Light'}
        </button>
      ))}
    </div>
  );

  const W = 1440, H = 900;

  // Pages tab reorder is available anytime, but most useful AFTER OCR has
  // tagged page numbers (so users can spot mis-orderings). Strip pinned to
  // text_review reflects that — user has reviewed OCR and is now cleaning
  // up sequence before packaging.
  const earlyStrip = <StageContextStrip currentStage="text_review" running={false} />;

  // Wrap a child Page-tab body in the Project Configure frame, active = Pages.
  const InPagesTab = ({ children }) => (
    <ProjectConfigureFrame theme={theme} activeTab="pages" stripNode={earlyStrip}>
      {children}
    </ProjectConfigureFrame>
  );

  return (
    <>
      {themeToggle}
      <DesignCanvas
        title="pgdp-prep · WF-09 Page Reorder"
        subtitle="Drag-to-reorder lives in the Pages tab. The stage strip up top pins context — reorder happens early, at the source stage. Reorder is label-only: it renames prefixes and invalidates build_package, but page content stages (crop, threshold, OCR…) stay clean because they don't care about order."
        sectionGap={56}
      >
        {/* ============== Idle + hover ============== */}
        <DCSection
          id="R"
          title="R · Pages tab — drag-to-reorder affordance"
          subtitle="Grip handle on the left of every row, surfacing on hover. Toolbar above the table; column headers; one footer hint line."
        >
          <DCArtboard id="R1" label="1 · idle · grip handles visible" width={W} height={H}>
            <InPagesTab><PagesIdle /></InPagesTab>
          </DCArtboard>

          <DCArtboard id="R2" label="2 · hover the grip · cursor: grab" width={W} height={H}>
            <InPagesTab><PagesHoverGrip /></InPagesTab>
          </DCArtboard>
        </DCSection>

        {/* ============== Drag in progress ============== */}
        <DCSection
          id="D"
          title="D · Drag in progress — single and multi-row"
          subtitle="Source row goes ghosted (40% opacity). A floating ghost follows the cursor. A brand drop-indicator line marks the target slot and shows the resulting prefix. Multi-select drags carry a stacked ghost with a count badge."
        >
          <DCArtboard id="D1" label="3 · single-row drag · p020 → after p018" width={W} height={H}>
            <InPagesTab><PagesDragSingle /></InPagesTab>
          </DCArtboard>

          <DCArtboard id="D2" label="4 · multi-select drag · 3 rows · stacked ghost" width={W} height={H}>
            <InPagesTab><PagesDragMulti /></InPagesTab>
          </DCArtboard>
        </DCSection>

        {/* ============== Post-drop ============== */}
        <DCSection
          id="P"
          title="P · After the drop — flash, prefix swap, undo"
          subtitle="Moved row flashes amber for ~1s. Rows whose prefix changed show the new label in brand color with the previous label struck through. Stage dots stay green — reorder doesn't touch page content. Only build_package is marked dirty."
        >
          <DCArtboard id="P1" label="5 · just-dropped · 2 prefixes swapped · build_package dirty" width={W} height={H}>
            <InPagesTab><PagesDropped /></InPagesTab>
          </DCArtboard>
        </DCSection>

        {/* ============== Edge cases ============== */}
        <DCSection
          id="E"
          title="E · Edge cases"
          subtitle="Two warnings called out by the brief: (a) dropping into / past the proof range, and (b) reordering while the pipeline has stages mid-run."
        >
          <DCArtboard id="E1" label="6 · drop crosses proof range · inline warning" width={W} height={H}>
            <InPagesTab><PagesEdgeOutOfRange /></InPagesTab>
          </DCArtboard>

          <DCArtboard id="E2" label="7 · package building · confirmation dialog" width={W} height={H}>
            <div style={{ position: 'relative', height: '100%' }}>
              <InPagesTab><PagesIdle /></InPagesTab>
              <PipelineRunningDialog />
            </div>
          </DCArtboard>
        </DCSection>
        {/* ============== Quick actions ============== */}
        <DCSection
          id="Q"
          title="Q · Quick actions — keyboard / accessibility path"
          subtitle="A per-row ⋯ trigger (replaces the chevron on hover) opens an actions menu. Reorder section up top covers the common moves: top, bottom, slot…, before…, after…. Sub-popover handles numeric slot input and shows the resulting prefix."
        >
          <DCArtboard id="Q1" label="8 · row actions menu open on p020" width={W} height={H}>
            <InPagesTab><PagesActionsMenu /></InPagesTab>
          </DCArtboard>

          <DCArtboard id="Q2" label="9 · Move to slot · sub-popover" width={W} height={H}>
            <InPagesTab><PagesActionsMenu mode="move-to-slot" /></InPagesTab>
          </DCArtboard>
        </DCSection>

        {/* ============== Reorder stage ============== */}
        <DCSection
          id="S"
          title="S · `reorder` stage — auto-detect out-of-order scans"
          subtitle="Runs after OCR (it needs the OCR'd page numbers to compare against filename sequence). Surfaces high-/medium-confidence swap proposals with side-by-side thumbnails. Auto-apply takes all high-confidence swaps at once; individual swaps can be accepted, skipped, or inspected."
        >
          <DCArtboard id="S1" label="10 · stage open · 3 swap proposals" width={W} height={H}>
            <ProjectConfigureFrame theme={theme} activeTab="pipeline"
              stripNode={<StageContextStrip currentStage="reorder" />}>
              <ReorderScansStage state="detected" />
            </ProjectConfigureFrame>
          </DCArtboard>

          <DCArtboard id="S2" label="11 · after Auto-apply · 2 accepted, 1 pending" width={W} height={H}>
            <ProjectConfigureFrame theme={theme} activeTab="pipeline"
              stripNode={<StageContextStrip currentStage="reorder" />}>
              <ReorderScansStage state="after-apply" />
            </ProjectConfigureFrame>
          </DCArtboard>

          <DCArtboard id="S3" label="12 · stage clean · no swaps needed" width={W} height={H}>
            <ProjectConfigureFrame theme={theme} activeTab="pipeline"
              stripNode={<StageContextStrip currentStage="reorder" />}>
              <ReorderScansStage state="clean" />
            </ProjectConfigureFrame>
          </DCArtboard>
        </DCSection>
      </DesignCanvas>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
