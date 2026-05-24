// validation-panel.jsx — core surface for WF-02.
// Renders the package-validation report card with PASS / WARNINGS / ERRORS
// states, per-check rows that can expand to show affected page chips,
// and the Download package CTA in its three forms.

/* ---------- Status icon (✓ / ⚠ / ✗) in a colored square ---------- */
const CheckIcon = ({ status, size = 22 }) => {
  const cfg = {
    pass:    { bg: 'color-mix(in oklab, var(--exact) 16%, transparent)', fg: 'var(--exact)', name: 'check' },
    warn:    { bg: 'color-mix(in oklab, var(--fuzzy) 20%, transparent)', fg: 'var(--fuzzy)', name: 'alert' },
    error:   { bg: 'color-mix(in oklab, var(--mismatch) 18%, transparent)', fg: 'var(--mismatch)', name: 'x' },
    running: { bg: 'color-mix(in oklab, var(--ocr) 16%, transparent)', fg: 'var(--ocr)', name: 'loader' },
    skip:    { bg: 'var(--bg-raised)', fg: 'var(--ink-4)', name: 'check' },
  }[status];
  const isLoader = status === 'running';
  return (
    <span style={{
      width: size, height: size, borderRadius: 6, background: cfg.bg, color: cfg.fg,
      display: 'inline-grid', placeItems: 'center', flex: '0 0 auto',
      animation: isLoader ? 'pgd-spin 1.1s linear infinite' : 'none',
    }}>
      <Icon name={cfg.name} size={size - 8} stroke={2.4} />
    </span>
  );
};

/* ---------- Page-prefix mono chip (clickable target) ---------- */
const PageChip = ({ prefix, detail }) => (
  <a href="#" onClick={e => e.preventDefault()} style={{
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '3px 8px', borderRadius: 5,
    background: 'var(--bg-raised)', border: '1px solid var(--border-1)',
    fontFamily: 'var(--mono-font)', fontSize: 11.5, color: 'var(--ink-1)',
    textDecoration: 'none', whiteSpace: 'nowrap',
  }}>
    <span style={{ fontWeight: 600 }}>{prefix}</span>
    {detail ? <span style={{ color: 'var(--ink-3)', fontWeight: 400 }}>{detail}</span> : null}
    <Icon name="arrowR" size={11} style={{ color: 'var(--ink-4)' }} />
  </a>
);

/* ---------- A single check row (collapsed or expanded) ---------- */
const CheckRow = ({ status, name, count, message, expanded, pages, action, lastRow }) => {
  const tint = {
    pass: 'var(--exact)', warn: 'var(--fuzzy)',
    error: 'var(--mismatch)', running: 'var(--ocr)', skip: 'var(--ink-4)',
  }[status];
  return (
    <div style={{
      borderBottom: lastRow ? 'none' : '1px solid var(--border-1)',
      background: expanded ? 'var(--bg-raised)' : 'transparent',
    }}>
      {/* Row header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px', cursor: 'pointer',
      }}>
        <CheckIcon status={status} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-1)' }}>{name}</span>
            {count != null ? (
              <span className="mono" style={{
                fontSize: 11, padding: '1px 7px', borderRadius: 99,
                background: 'color-mix(in oklab, ' + tint + ' 14%, transparent)',
                color: tint, fontWeight: 600,
              }}>{count}</span>
            ) : null}
          </div>
          {message ? (
            <div style={{ marginTop: 3, fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.45 }}>{message}</div>
          ) : null}
        </div>
        {action ? <div style={{ display: 'flex', gap: 6 }}>{action}</div> : null}
        {status !== 'pass' && status !== 'running' ? (
          <Icon name={expanded ? 'chevD' : 'chevR'} size={14} style={{ color: 'var(--ink-4)' }} />
        ) : null}
      </div>
      {/* Expanded affected-pages region */}
      {expanded && pages ? (
        <div style={{
          padding: '0 16px 14px 50px',
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          <div style={{
            fontSize: 11.5, color: 'var(--ink-3)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span>Affected pages</span>
            <Divider style={{ flex: 1 }} />
            <span className="mono">{pages.length} of {pages.length}</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {pages.map(p => <PageChip key={p.prefix} prefix={p.prefix} detail={p.detail} />)}
          </div>
        </div>
      ) : null}
    </div>
  );
};

/* ---------- Summary header (top of the panel) ---------- */
const SummaryHeader = ({ status, count, total, durationMs, running }) => {
  const tone = {
    pass: { bg: 'color-mix(in oklab, var(--exact) 10%, var(--bg-surface))',
            bd: 'color-mix(in oklab, var(--exact) 30%, var(--border-1))',
            fg: 'var(--exact)', title: 'Package validation passed', icon: 'pass' },
    warn: { bg: 'color-mix(in oklab, var(--fuzzy) 10%, var(--bg-surface))',
            bd: 'color-mix(in oklab, var(--fuzzy) 35%, var(--border-1))',
            fg: 'var(--fuzzy)', title: 'Package ready with warnings', icon: 'warn' },
    error:{ bg: 'color-mix(in oklab, var(--mismatch) 9%, var(--bg-surface))',
            bd: 'color-mix(in oklab, var(--mismatch) 35%, var(--border-1))',
            fg: 'var(--mismatch)', title: 'Package has errors', icon: 'error' },
    running: { bg: 'var(--bg-surface)', bd: 'var(--border-1)', fg: 'var(--ocr)',
            title: 'Validating package…', icon: 'running' },
  }[status];

  const subtitle = {
    pass: `${total} pages — all 8 checks green.`,
    warn: `${count} of 8 checks raised warnings — review before uploading.`,
    error: `${count} of 8 checks failed — fix before uploading to PGDP.`,
    running: 'Checking PNG bit-depth, page sequence, file sizes…',
  }[status];

  return (
    <div style={{
      padding: '12px 14px', borderRadius: 8,
      background: tone.bg, border: '1px solid ' + tone.bd,
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <CheckIcon status={tone.icon} size={36} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-1)', letterSpacing: '-0.01em' }}>
          {tone.title}
        </div>
        <div style={{ marginTop: 2, fontSize: 12.5, color: 'var(--ink-2)' }}>{subtitle}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>
          {running ? 'running…' : `${(durationMs / 1000).toFixed(1)}s`}
        </div>
        <div className="mono" style={{ fontSize: 10.5, color: 'var(--ink-4)', marginTop: 2 }}>
          v2.4 · 8 rules
        </div>
      </div>
    </div>
  );
};

/* ---------- Re-validate / View log toolbar ---------- */
const PanelToolbar = ({ running }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '10px 16px', borderTop: '1px solid var(--border-1)',
    borderBottom: '1px solid var(--border-1)', background: 'var(--bg-page)',
  }}>
    <span style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>Last run a moment ago</span>
    <span style={{ color: 'var(--ink-4)' }}>·</span>
    <span style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>
      Auto re-runs after fixes
    </span>
    <div style={{ flex: 1 }} />
    <Button variant="ghost" size="sm" icon="eye">View log</Button>
    <Button variant="outline" size="sm" icon="refresh" disabled={running}>
      {running ? 'Validating…' : 'Re-validate'}
    </Button>
  </div>
);

/* ---------- Footer with the Download CTA(s) ---------- */
const DownloadFooter = ({ status, filename = 'belloc-survivals_pgdp.zip', size = '28.4 MB' }) => {
  if (status === 'pass') {
    return (
      <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ flex: 1 }}>
          <div className="mono" style={{ fontSize: 12.5, color: 'var(--ink-1)', fontWeight: 600 }}>{filename}</div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>{size} · ready for upload to PGDP</div>
        </div>
        <Button variant="primary" size="lg" icon="download">Download package</Button>
      </div>
    );
  }
  if (status === 'warn') {
    return (
      <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div className="mono" style={{ fontSize: 12.5, color: 'var(--ink-1)', fontWeight: 600 }}>{filename}</div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>{size} · 14 pages exceed 100&nbsp;KB</div>
        </div>
        <Button variant="outline" size="lg">Download anyway</Button>
        <Button variant="primary" size="lg" icon="download">Fix &amp; rebuild</Button>
      </div>
    );
  }
  // error
  return (
    <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12.5, color: 'var(--ink-2)' }}>Download disabled until errors resolved.</div>
        <div style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 2 }}>Fix automatically rebuilds the package after each repair.</div>
      </div>
      <Button variant="outline" size="lg" icon="download" disabled>Download package</Button>
      <Button variant="brand" size="lg" icon="wrench">Fix all (3)</Button>
    </div>
  );
};

/* ---------- The full panel — the WF-02 deliverable ---------- */
const ValidationPanel = ({ state = 'pass', expandedCheck = null, fixing = null }) => {
  const running = state === 'running';

  // The 8 PGDP checks from the brief, in spec order (a → h).
  // Pass-state values are then overridden per state below.
  const passChecks = [
    { id: 'pairs',  name: 'Every proof page has PNG + TXT', status: 'pass' },
    { id: 'names',  name: 'PNG and TXT base names match',   status: 'pass' },
    { id: 'seq',    name: 'Page prefix sequence is contiguous', status: 'pass' },
    { id: 'depth',  name: 'PNGs are 1-bit black & white',   status: 'pass' },
    { id: 'pngsize',name: 'Page PNGs under 100 KB',         status: 'pass' },
    { id: 'illust', name: 'Illustrations within size limits',status: 'pass' },
    { id: 'zip',    name: 'Zip filename matches PGDP rules',status: 'pass' },
    { id: 'corrupt',name: 'No corrupt PNGs',                status: 'pass' },
  ];

  let checks = passChecks.map(c => ({ ...c, message: 'OK', count: null }));
  let summary = { status: 'pass', count: 0, total: 387, durationMs: 1840, running: false };

  if (state === 'warn') {
    checks = checks.map(c => {
      if (c.id === 'pngsize') return {
        ...c, status: 'warn', count: 14,
        message: '14 pages > 100 KB — may be slow for proofreaders on older connections.',
        pages: [
          { prefix: 'p012', detail: '118 KB' }, { prefix: 'p047', detail: '104 KB' },
          { prefix: 'p081', detail: '132 KB' }, { prefix: 'p082', detail: '127 KB' },
          { prefix: 'p104', detail: '112 KB' }, { prefix: 'p140', detail: '108 KB' },
          { prefix: 'p141', detail: '101 KB' }, { prefix: 'p202', detail: '139 KB' },
          { prefix: 'p238', detail: '115 KB' }, { prefix: 'p239', detail: '117 KB' },
          { prefix: 'p284', detail: '122 KB' }, { prefix: 'p309', detail: '104 KB' },
          { prefix: 'p344', detail: '111 KB' }, { prefix: 'p366', detail: '108 KB' },
        ],
      };
      if (c.id === 'illust') return {
        ...c, status: 'warn', count: 2,
        message: '2 inline illustrations near the 256 KB inline limit.',
        pages: [
          { prefix: 'i007', detail: '241 KB' },
          { prefix: 'i012', detail: '249 KB' },
        ],
      };
      return c;
    });
    summary = { status: 'warn', count: 2, total: 387, durationMs: 2210, running: false };
  }

  if (state === 'error') {
    checks = checks.map(c => {
      if (c.id === 'depth') return {
        ...c, status: 'error', count: 3,
        message: '3 pages have 8-bit grayscale PNG — PGDP requires 1-bit B&W.',
        pages: [
          { prefix: 'p087', detail: '8-bit' },
          { prefix: 'p162', detail: '8-bit' },
          { prefix: 'p231', detail: '8-bit' },
        ],
      };
      if (c.id === 'seq') return {
        ...c, status: 'error', count: 1,
        message: '1 gap in page prefix sequence between p119 and p121.',
        pages: [{ prefix: 'p120', detail: 'missing' }],
      };
      if (c.id === 'pngsize') return {
        ...c, status: 'warn', count: 14,
        message: '14 pages > 100 KB — see warnings.',
        pages: [{ prefix: 'p012', detail: '118 KB' }, { prefix: 'p047', detail: '104 KB' }],
      };
      return c;
    });
    summary = { status: 'error', count: 2, total: 387, durationMs: 2010, running: false };
  }

  if (running) {
    // 4 of 8 done, 1 running, 3 queued
    checks = checks.map((c, i) => {
      if (i < 4) return c; // done = pass
      if (i === 4) return { ...c, status: 'running', message: 'Reading 387 PNG headers…' };
      return { ...c, status: 'skip', message: 'Queued' };
    });
    summary = { status: 'running', count: 0, total: 387, durationMs: 0, running: true };
  }

  // Apply per-check overrides: expandedCheck + fixing
  if (fixing) {
    checks = checks.map(c => c.id === fixing
      ? { ...c, status: 'running', message: 'Re-running threshold on 3 pages…' }
      : c);
  }

  return (
    <div id="validation-panel" style={{
      background: 'var(--bg-surface)', border: '1px solid var(--border-1)',
      borderRadius: 8, overflow: 'hidden', boxShadow: 'none',
    }}>
      {/* Card header */}
      <div style={{
        padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10,
        borderBottom: '1px solid var(--border-1)',
      }}>
        <Icon name="fileText" size={15} style={{ color: 'var(--ink-2)' }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-1)' }}>Package validation</div>
          <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 1 }}>
            Local pre-flight against PGDP&apos;s Project Quick Check rules
          </div>
        </div>
        <Badge tone={summary.status === 'pass' ? 'clean'
          : summary.status === 'warn' ? 'dirty'
          : summary.status === 'error' ? 'failed' : 'running'}>
          {summary.status === 'pass' ? 'All checks passed'
           : summary.status === 'warn' ? `${summary.count} warning${summary.count===1?'':'s'}`
           : summary.status === 'error' ? `${summary.count} error${summary.count===1?'':'s'}`
           : `${4}/${8} checks done`}
        </Badge>
      </div>

      {/* Summary banner */}
      <div style={{ padding: 16 }}>
        <SummaryHeader {...summary} />
      </div>

      <PanelToolbar running={running} />

      {/* Check rows */}
      <div style={{ background: 'var(--bg-surface)' }}>
        {checks.map((c, i) => {
          const isExpanded = expandedCheck === c.id || (state === 'error' && c.status === 'error' && expandedCheck == null && i === checks.findIndex(x => x.status === 'error'));
          const action = c.status === 'error' && c.id === 'depth' ? (
            <>
              <Button variant="outline" size="sm" icon="eye">Show pages</Button>
              <Button variant="brand" size="sm" icon="wrench">Fix automatically</Button>
            </>
          ) : c.status === 'warn' && (c.id === 'pngsize' || c.id === 'illust') ? (
            <Button variant="ghost" size="sm">Show pages</Button>
          ) : c.status === 'error' && c.id === 'seq' ? (
            <Button variant="outline" size="sm">Open page list</Button>
          ) : null;

          return (
            <CheckRow key={c.id}
              status={c.status} name={c.name} count={c.count} message={c.message}
              expanded={isExpanded && c.pages} pages={c.pages} action={action}
              lastRow={i === checks.length - 1} />
          );
        })}
      </div>

      <div style={{ borderTop: '1px solid var(--border-1)', background: 'var(--bg-page)' }}>
        <DownloadFooter status={summary.status === 'running' ? 'error' : summary.status} />
      </div>
    </div>
  );
};

Object.assign(window, {
  CheckIcon, PageChip, CheckRow, SummaryHeader, PanelToolbar,
  DownloadFooter, ValidationPanel,
});
