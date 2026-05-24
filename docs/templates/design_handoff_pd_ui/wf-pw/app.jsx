// app.jsx — Page Workbench canvas (existing-ui screen 04 redesign).
// 3-column layout: stage controls (left) · artifact viewer (center) · context drawer (right).

const { useState: useStP, useEffect: useEfP } = React;

function App() {
  const [theme, setTheme] = useStP(() => localStorage.getItem('pgd-theme') || 'dark');
  useEfP(() => localStorage.setItem('pgd-theme', theme), [theme]);

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

  const bodyAttrs = {
    type: 'body', typeName: 'Body',
    numbered: true, numberStyle: 'arabic', numberValue: 12,
    section: 'body', align: 'left', marker: null,
    pagePrefix: 'p012',
  };
  const plateAttrs = {
    type: 'plate', typeName: 'Plate · illustration',
    numbered: false, numberStyle: '—', numberValue: '—',
    section: 'body', align: '—', marker: 'unnumbered insert',
    pagePrefix: 'plate-iv',
  };
  const startBodyAttrs = {
    type: 'body', typeName: 'Body',
    numbered: true, numberStyle: 'arabic', numberValue: 1,
    section: 'body', align: 'right', marker: 'Start of body content',
    pagePrefix: 'p001',
  };
  const catalogAttrs = {
    type: 'catalog', typeName: 'Publisher catalog',
    numbered: false, numberStyle: '—', numberValue: '—',
    section: 'backmatter', align: 'left', marker: 'Start of post-book material',
    pagePrefix: 'b001',
  };

  return (
    <>
      {themeToggle}
      <DesignCanvas
        title="pgdp-prep · Page Workbench"
        subtitle="3-column layout: stage controls (left drawer) · artifact viewer (center) · context drawer (right — Page attributes by default, swaps to Hierarchy or Block on text_zones). Stage strip up top reuses the WF-03 pattern. Below 1280px both drawers collapse to a left tab strip."
        sectionGap={56}
      >
        <DCSection
          id="PW"
          title="PW · Single-page deep-dive"
          subtitle="Each stage swaps in its own special tools on the left and its own artifact viewer in the middle. Initial-crop and downstream stages can compare against the original. Text-zones stage swaps the right drawer into a hierarchy + block-type labeler."
        >
          <DCArtboard id="PW1" label="threshold · standard 3-col" width={W} height={H}>
            <VariationPW theme={theme} stage="threshold" mode="view" attrs={bodyAttrs} editMode="view" />
          </DCArtboard>

          <DCArtboard id="PW1b" label="threshold · page-attrs drawer collapsed" width={W} height={H}>
            <VariationPW theme={theme} stage="threshold" mode="view" attrs={bodyAttrs} editMode="view"
              rightCollapsed={true} />
          </DCArtboard>

          <DCArtboard id="PW1c" label="threshold · both drawers collapsed" width={W} height={H}>
            <VariationPW theme={theme} stage="threshold" mode="view" attrs={bodyAttrs} editMode="view"
              leftCollapsed={true} rightCollapsed={true} />
          </DCArtboard>

          <DCArtboard id="PW2" label="threshold ↔ grayscale · compare" width={W} height={H}>
            <VariationPW theme={theme} stage="threshold" mode="view" compareWith="grayscale"
              attrs={bodyAttrs} editMode="view" />
          </DCArtboard>

          <DCArtboard id="PW3" label="initial_crop vs source · side-by-side" width={W} height={H}>
            <VariationPW theme={theme} stage="initial_crop" attrs={bodyAttrs} editMode="view"
              centerPane={<CropCompareViewer stage="initial_crop" original="source" mode="side-by-side" />} />
          </DCArtboard>

          <DCArtboard id="PW4" label="canvas_map · overlay on original" width={W} height={H}>
            <VariationPW theme={theme} stage="canvas_map" attrs={bodyAttrs} editMode="view"
              centerPane={<CropCompareViewer stage="canvas_map" original="source" mode="overlay" />} />
          </DCArtboard>

          <DCArtboard id="PW5" label="canvas_map · split mode" width={W} height={H}>
            <VariationPW theme={theme} stage="canvas_map" mode="split"
              attrs={bodyAttrs} editMode="split" />
          </DCArtboard>

          <DCArtboard id="PW6" label="text_zones · labeler + hierarchy tree" width={W} height={H}>
            <VariationPW theme={theme} stage="text_zones" attrs={bodyAttrs} editMode="view"
              rightView="hierarchy"
              centerPane={<LabelerCanvas activeLayers={['blocks', 'paragraph']} selectedId="B2.2.2" />} />
          </DCArtboard>

          <DCArtboard id="PW7" label="text_zones · block selected · type picker" width={W} height={H}>
            <VariationPW theme={theme} stage="text_zones" attrs={bodyAttrs} editMode="view"
              rightView="block" selectedBlockId="B2.2.2"
              centerPane={<LabelerCanvas activeLayers={['blocks', 'paragraph', 'lines']} selectedId="B2.2.2" />} />
          </DCArtboard>

          <DCArtboard id="PW8" label="ocr · 2-col · words · Cards" width={W} height={H}>
            <VariationPW theme={theme} stage="ocr" mode="ocr-words" attrs={bodyAttrs} editMode="view"
              layout="2col" rightView="words" wordsDensity="cards" />
          </DCArtboard>

          <DCArtboard id="PW8b" label="ocr · 2-col · words · Rows" width={W} height={H}>
            <VariationPW theme={theme} stage="ocr" mode="ocr-words" attrs={bodyAttrs} editMode="view"
              layout="2col" rightView="words" wordsDensity="rows" />
          </DCArtboard>

          <DCArtboard id="PW9" label="grayscale · GEGL · start-of-body marker" width={W} height={H}>
            <VariationPW theme={theme} stage="grayscale" attrs={startBodyAttrs} editMode="view" />
          </DCArtboard>

          <DCArtboard id="PW10" label="plate · unnumbered · illustration mode" width={W} height={H}>
            <VariationPW theme={theme} stage="canvas_map" mode="illust"
              attrs={plateAttrs} editMode="illust" />
          </DCArtboard>

          <DCArtboard id="PW11" label="catalog · post-book material attrs" width={W} height={H}>
            <VariationPW theme={theme} stage="initial_crop" attrs={catalogAttrs} editMode="view" />
          </DCArtboard>
        </DCSection>
      </DesignCanvas>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
