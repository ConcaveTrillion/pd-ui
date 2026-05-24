// app.jsx — WF-05b Scannos Workbench canvas.
// Three surfaces:
//   C1 · Capture   — Page Workbench with suspicion overlay + inline mark gesture
//   C2 · Promote   — Per-book scanno candidate panel (Project Configure → Settings)
//   C3 · Configure — Global Library with Scannos category

const { useState: useS5bApp, useEffect: useE5bApp } = React;

function App() {
  const [theme, setTheme] = useS5bApp(() => localStorage.getItem('pgd-theme') || 'dark');
  useE5bApp(() => localStorage.setItem('pgd-theme', theme), [theme]);

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

  const W = 1440, H = 1100;

  return (
    <>
      {themeToggle}
      <DesignCanvas
        title="WF-05b · Scannos Workbench"
        subtitle={
          'Four surfaces wired to the model-2-primary lean. ' +
          '(P) Pipeline: a new optional `scannos` stage inserted after `spellcheck` — the producer of the annotation sidecar. ' +
          '(C1) Capture: the Page Workbench drill-down where annotations land and the user marks new candidates. ' +
          '(C2) Promote: the per-book triage panel for book-local candidates. ' +
          '(C3) Configure: the WF-05a Library shell with the new Scannos category.'
        }
        sectionGap={56}
      >
        <DCSection
          id="Pipeline"
          title="P · Pipeline stage"
          subtitle="Where scannos lives in the project pipeline. Optional stage after `spellcheck` — emits the suspicion sidecar that C1 surfaces in the Page Workbench. Annotation only; never mutates text."
        >
          <DCArtboard id="P" label="P · Project Configure → Pipeline · scannos stage selected" width={W} height={H}>
            <ScannoPipeline theme={theme} />
          </DCArtboard>
        </DCSection>

        <DCSection
          id="Capture"
          title="C1 · Capture (page detail)"
          subtitle="The Page Workbench drill-down. Reached from the Pipeline cockpit's Open-page action, the Pages tab, or per-page navigation. Pipeline-produced suspicions render as token underlines, sorted by confidence in a side panel. The inline mark gesture turns any selected token into a book-local candidate without leaving the page."
        >
          <DCArtboard id="C1" label="C1 · Page Workbench · suspicion overlay + mark gesture" width={W} height={H}>
            <ScannoCapture theme={theme} />
          </DCArtboard>
        </DCSection>

        <DCSection
          id="Promote"
          title="C2 · Promote"
          subtitle="Per-book triage. The bridge between the book-local candidate pool and the global library. Every candidate has evidence (source, hits, sample contexts) and three terminal actions: dismiss, accept-locally, or promote-to-global."
        >
          <DCArtboard id="C2" label="C2 · Project Configure → Scannos · candidate triage" width={W} height={H}>
            <ScannoPromote theme={theme} />
          </DCArtboard>
        </DCSection>

        <DCSection
          id="Configure"
          title="C3 · Configure"
          subtitle="Library shell from WF-05a L3 with a new Scannos category. Each rule: pattern, optional suggestion, opt-in auto-apply, scope, and an evidence trail showing which books contributed and how many hits the rule has resolved."
        >
          <DCArtboard id="C3" label="C3 · Global Library · Scannos category" width={W} height={H}>
            <ScannoConfigure theme={theme} />
          </DCArtboard>
        </DCSection>
      </DesignCanvas>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
