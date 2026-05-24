// app.jsx — design canvas for WF-03 Source Quality.

const { useState: useStX, useEffect: useEfX } = React;

function App() {
  const [theme, setTheme] = useStX(() => localStorage.getItem('pgd-theme') || 'dark');
  useEfX(() => localStorage.setItem('pgd-theme', theme), [theme]);

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

  return (
    <>
      {themeToggle}
      <DesignCanvas
        title="pgdp-prep · WF-03 Source Quality"
        subtitle="Generalised to every pipeline step. Banner copy + flag taxonomy adapt to the current stage (source / threshold / ocr shown). Toolbar view-toggle flips list ↔ thumbnail. B is the alt summary-strip direction kept for reference."
        sectionGap={56}
      >
        <DCSection
          id="A"
          title="A · Stage-aware flagged pages — list + thumbnail view"
          subtitle="Same pattern works at every pipeline step. Stage strip up top (clickable dots + click-to-jump dropdown on the current stage with ⌘P shortcut). Banner copy adapts per stage. Toolbar exposes List ↔ Thumbnail and three pre-gen thumbnail sizes (S / M / L)."
        >
          <DCArtboard id="A1" label="source · banner · list" width={W} height={H}>
            <VariationA theme={theme} severe={false} filterMode="all" stage="source" viewMode="list" />
          </DCArtboard>
          <DCArtboard id="A2" label="source · Flagged filter · list" width={W} height={H}>
            <VariationA theme={theme} severe={false} filterMode="flagged" stage="source" viewMode="list" />
          </DCArtboard>
          <DCArtboard id="A3" label="source · severe 192/232" width={W} height={H}>
            <VariationA theme={theme} severe={true} filterMode="all" stage="source" viewMode="list" />
          </DCArtboard>
          <DCArtboard id="A4" label="source · thumbnail M" width={W} height={H}>
            <VariationA theme={theme} severe={false} filterMode="all" stage="source" viewMode="thumb" thumbSize="m" />
          </DCArtboard>
          <DCArtboard id="A4b" label="source · thumbnail S (dense)" width={W} height={H}>
            <VariationA theme={theme} severe={false} filterMode="all" stage="source" viewMode="thumb" thumbSize="s" />
          </DCArtboard>
          <DCArtboard id="A4c" label="source · thumbnail L (roomy)" width={W} height={H}>
            <VariationA theme={theme} severe={false} filterMode="all" stage="source" viewMode="thumb" thumbSize="l" />
          </DCArtboard>
          <DCArtboard id="A5" label="threshold · banner · list" width={W} height={H}>
            <VariationA theme={theme} severe={false} filterMode="all" stage="threshold" viewMode="list" />
          </DCArtboard>
          <DCArtboard id="A6" label="threshold · thumbnail M" width={W} height={H}>
            <VariationA theme={theme} severe={false} filterMode="all" stage="threshold" viewMode="thumb" thumbSize="m" />
          </DCArtboard>
          <DCArtboard id="A7" label="ocr · thumbnail + 5 selected" width={W} height={H}>
            <VariationA theme={theme} severe={false} filterMode="all" stage="ocr" viewMode="thumb" thumbSize="m"
              selected={['f003','f005','f007','p004','p012']} />
          </DCArtboard>
          <DCArtboard id="A8" label="threshold · stage jump popover open" width={W} height={H}>
            <VariationA theme={theme} severe={false} filterMode="all" stage="threshold" viewMode="list"
              showJumpPopover={true} />
          </DCArtboard>
        </DCSection>

        <DCSection
          id="B"
          title="B · Quality summary strip (dashboard style)"
          subtitle="Replaces the banner with a horizontal report strip: a single big total plus one cell per flag kind, each cell is a click-to-filter chip. Picking a cell dims non-matching rows so the user can scan and bulk-act. Severe variant adds a contextual 'pick a new source' callout."
        >
          <DCArtboard id="B1" label="Strip · default · no filter" width={W} height={H}>
            <VariationB theme={theme} severe={false} activeFlag={null} />
          </DCArtboard>
          <DCArtboard id="B2" label="Strip · blurry filter active" width={W} height={H}>
            <VariationB theme={theme} severe={false} activeFlag="blurry" />
          </DCArtboard>
          <DCArtboard id="B3" label="Severe · 192 / 232 + re-source CTA" width={W} height={H}>
            <VariationB theme={theme} severe={true} activeFlag={null} />
          </DCArtboard>
        </DCSection>
      </DesignCanvas>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
