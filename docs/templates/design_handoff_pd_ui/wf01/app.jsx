// app.jsx — design canvas wrapper for WF-01 (Folder Upload) variations.
// F is the chosen direction; A–D remain below as earlier exploration.

const { useState: useSt, useEffect: useEf } = React;

function App() {
  const [theme, setTheme] = useSt(() => localStorage.getItem('pgd-theme') || 'dark');
  useEf(() => localStorage.setItem('pgd-theme', theme), [theme]);

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
        title="pgdp-prep · Folder Upload"
        subtitle="WF-01 P0.3 · chosen direction = F · right-hand sheet with universal droplet + Internet Archive URL detection. HathiTrust marked coming-soon (no remote fetch — local files needed). Earlier explorations kept below for context."
        sectionGap={56}
      >
        <DCSection
          id="F"
          title="F · Final direction — Droplet + IA URL detection + right-hand review sheet"
          subtitle="Three steps · Source → Review → Upload. Local folders zip in the browser, Internet Archive URLs fetch server-side, HathiTrust + Google Books appear in the recognised list as 'soon'. Page-range slider trims covers before ingest."
        >
          <DCArtboard id="F1" label="1 · Source · idle" width={W} height={H}>
            <AppFrame theme={theme} sheetNode={<ModalF step={0} />} />
          </DCArtboard>
          <DCArtboard id="F2" label="2 · Review · local folder" width={W} height={H}>
            <AppFrame theme={theme} sheetNode={<ModalF step={1} source="localFolder" />} />
          </DCArtboard>
          <DCArtboard id="F3" label="2 · Review · Internet Archive" width={W} height={H}>
            <AppFrame theme={theme} sheetNode={<ModalF step={1} source="ia" />} />
          </DCArtboard>
          <DCArtboard id="F4" label="1 · Source · HathiTrust pasted · coming soon" width={W} height={H}>
            <AppFrame theme={theme} sheetNode={<ModalF step={0} source="hathiSoon" />} />
          </DCArtboard>
          <DCArtboard id="F5" label="3 · Upload · fetching from IA" width={W} height={H}>
            <AppFrame theme={theme} sheetNode={<ModalF step={2} source="ia" />} />
          </DCArtboard>
          <DCArtboard id="F6" label="3 · Upload · local folder" width={W} height={H}>
            <AppFrame theme={theme} sheetNode={<ModalF step={2} source="localFolder" />} />
          </DCArtboard>
        </DCSection>

        <DCSection
          id="explorations"
          title="Earlier explorations · A B C D"
          subtitle="Where F came from. A — spec, B — universal droplet, C — right-hand review sheet, D — segmented sources. Kept here for reference; the live build is F above."
        >
          <DCArtboard id="A3" label="A · Two-up cards · folder selected" width={W} height={H}>
            <AppFrame theme={theme} modalNode={<ModalA step={2} state="selected" />} dialogPos="top" />
          </DCArtboard>
          <DCArtboard id="B2" label="B · Universal drop · folder dropped" width={W} height={H}>
            <AppFrame theme={theme} modalNode={<ModalB state="selected" />} dialogPos="top" />
          </DCArtboard>
          <DCArtboard id="C1" label="C · Side-rail review sheet" width={W} height={H}>
            <AppFrame theme={theme} sheetNode={<ModalC state="review" />} />
          </DCArtboard>
          <DCArtboard id="D3" label="D · Segmented · IA URL matched" width={W} height={H}>
            <AppFrame theme={theme} modalNode={<ModalD tab="url" />} dialogPos="top" />
          </DCArtboard>
        </DCSection>
      </DesignCanvas>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
