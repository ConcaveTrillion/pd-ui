// variations.jsx — composes the validation panel into full Project Configure shots.
// Each variation = a full 1440×900 artboard of the Pipeline tab, stage = validation,
// with the panel in a particular state. The stage strip up top mirrors WF-03.

const VariationFrame = ({ theme, state, expandedCheck, fixing }) => {
  // Counts shown in the strip's right edge — match the panel's state.
  const stripCounts =
    state === 'pass'    ? { flagged: null, dirty: null } :
    state === 'warn'    ? { flagged: null, dirty: 2 } :
    state === 'error'   ? { flagged: 2, dirty: 0 } :
    /* running */        { flagged: null, dirty: null };

  return (
    <ProjectConfigureFrame
      theme={theme}
      stripNode={
        <StageContextStrip
          currentStage="validation"
          running={state === 'running'}
          flagged={stripCounts.flagged}
          dirty={stripCounts.dirty}
        />
      }
    >
      <ValidationPanel state={state} expandedCheck={expandedCheck} fixing={fixing} />

      {/* Next-step helper card — keeps the area below the panel from being empty */}
      {state === 'pass' ? (
        <div style={{
          background: 'var(--bg-surface)', border: '1px solid var(--border-1)',
          borderRadius: 10, padding: 14, display: 'flex', gap: 14, alignItems: 'center',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 7, background: 'var(--bg-raised)',
            display: 'grid', placeItems: 'center', color: 'var(--ink-2)',
          }}>
            <Icon name="info" size={16} />
          </div>
          <div style={{ flex: 1, fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.5 }}>
            Next stage → <span className="mono" style={{ color: 'var(--ink-1)', fontWeight: 600 }}>submit_check</span>.
            Or upload <span className="mono" style={{ color: 'var(--ink-1)' }}>belloc-survivals_pgdp.zip</span> to{' '}
            distributedproofreaders.org → <strong>Manage → New project</strong>.
          </div>
          <Button variant="ghost" size="sm" iconRight="arrowR">PGDP guide</Button>
        </div>
      ) : null}
    </ProjectConfigureFrame>
  );
};

Object.assign(window, { VariationFrame });
