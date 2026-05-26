// app.jsx — WF-11 Perceptual Grayscale Stage Controls.
// 5 variations for how to surface the Standard ↔ Perceptual choice
// inside the Page Workbench's StageControlsPanel (grayscale stage).

const { useState: useStP11, useEffect: useEfP11 } = React;

function App() {
  const [theme, setTheme] = useStP11(() => localStorage.getItem('pgd-theme') || 'dark');
  useEfP11(() => localStorage.setItem('pgd-theme', theme), [theme]);

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

  const W = 1440, H = 1024;

  return (
    <>
      {themeToggle}
      <DesignCanvas
        title="WF-11 · Perceptual Grayscale Stage Controls"
        subtitle="Adds a Grayscale mode selector (Standard vs Perceptual) to the Page Workbench's StageControlsPanel. Each artboard is the full Page Workbench with the grayscale stage selected — only the left drawer body differs between variants. Perceptual mode runs pdomain-book-tools np_uint8_color_to_gray, a GPU-accelerated neighbourhood-sampled algorithm."
        sectionGap={56}
      >
        <DCSection
          id="WF11"
          title="Mode-selector variations"
          subtitle="Same shell, same stage; left-pane treatments differ. F is the recommended composite — auto-detect banner + two-card chooser + advanced params accordion. A–E remain for comparison."
        >
          <DCArtboard id="F" label="F ★ · GPU detected · combined chooser + advanced" width={W} height={H}>
            <WF11_F theme={theme} backend="gpu" />
          </DCArtboard>

          <DCArtboard id="F-cpu" label="F ★ · CPU fallback · combined chooser + advanced" width={W} height={H}>
            <WF11_F theme={theme} backend="cpu" />
          </DCArtboard>

          <DCArtboard id="A" label="A · Segmented + amber callout" width={W} height={H}>
            <WF11_A theme={theme} />
          </DCArtboard>

          <DCArtboard id="B" label="B · Two-card visual chooser" width={W} height={H}>
            <WF11_B theme={theme} />
          </DCArtboard>

          <DCArtboard id="C" label="C · Auto-detect with manual override" width={W} height={H}>
            <WF11_C theme={theme} />
          </DCArtboard>

          <DCArtboard id="D" label="D · Inline before/after split preview" width={W} height={H}>
            <WF11_D theme={theme} />
          </DCArtboard>

          <DCArtboard id="E" label="E · Mode + advanced perceptual params" width={W} height={H}>
            <WF11_E theme={theme} />
          </DCArtboard>
        </DCSection>
      </DesignCanvas>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
