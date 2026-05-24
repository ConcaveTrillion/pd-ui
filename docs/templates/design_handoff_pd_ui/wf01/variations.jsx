// variations.jsx — Four WF-01 (Folder Upload) variations as full-app artboards.
// Each variation exports one or more Artboard components; the Canvas wires
// them into <DCArtboard>s.

const { useState: useS } = React;

/* ============================ Variation A ============================
   Two-up cards (matches brief spec verbatim). Comfortable density,
   classic two-step Radix modal centered at 560px wide.
==================================================================== */

const SourceCard = ({ icon, title, sub, hint, selected, disabled }) => (
  <div style={{
    flex: 1, padding: '20px 18px',
    border: `1.5px ${selected ? 'solid' : 'dashed'} ${selected ? 'var(--accent)' : 'var(--border-2)'}`,
    background: selected ? 'color-mix(in oklab, var(--accent) 6%, var(--bg-surface))' : 'var(--bg-surface)',
    borderRadius: 10, position: 'relative',
    display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
    gap: 10, minHeight: 152, cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 0.6 : 1,
  }}>
    {selected ? (
      <div style={{
        position: 'absolute', top: 12, right: 12, width: 20, height: 20, borderRadius: 99,
        background: 'var(--accent)', color: 'var(--accent-ink)',
        display: 'grid', placeItems: 'center',
      }}>
        <Icon name="check" size={13} stroke={3} />
      </div>
    ) : null}
    <div style={{
      width: 36, height: 36, borderRadius: 8, background: 'var(--bg-raised)',
      display: 'grid', placeItems: 'center', color: 'var(--ink-2)',
    }}>
      <Icon name={icon} size={20} />
    </div>
    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-1)' }}>{title}</div>
    <div style={{ fontSize: 12.5, color: 'var(--ink-3)', lineHeight: 1.45 }}>{sub}</div>
    <div className="mono" style={{ marginTop: 'auto', fontSize: 11, color: 'var(--ink-4)' }}>{hint}</div>
  </div>
);

const ModalA = ({ step, state }) => {
  const showStep1 = step === 1;
  return (
    <div style={{
      width: 560, background: 'var(--bg-surface)', borderRadius: 14,
      boxShadow: 'var(--shadow-floating)', border: '1px solid var(--border-1)',
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
    }}>
      {/* Title bar */}
      <div style={{
        padding: '18px 24px 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink-1)', letterSpacing: '-0.01em' }}>New project</div>
          <div style={{ marginTop: 2, fontSize: 12.5, color: 'var(--ink-3)' }}>Create a project and upload its source pages.</div>
        </div>
        <button style={{
          width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border-1)',
          background: 'transparent', color: 'var(--ink-3)', cursor: 'pointer',
          display: 'grid', placeItems: 'center',
        }}><Icon name="x" size={14} /></button>
      </div>

      {/* Step indicator */}
      <div style={{ padding: '0 24px 18px' }}>
        <StepDots steps={['Name', 'Source']} current={step - 1} />
      </div>

      <Divider />

      {/* Body */}
      <div style={{ padding: '22px 24px 6px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {showStep1 ? (
          <>
            <div>
              <label style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--ink-2)' }}>Book name</label>
              <div style={{ marginTop: 6 }}>
                <Input value="Belloc — Survivals & New Arrivals" autoFocus />
              </div>
              <div style={{ marginTop: 6, fontSize: 11.5, color: 'var(--ink-4)' }}>Author — Title is the convention. You can rename later.</div>
            </div>
            <div>
              <label style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--ink-2)' }}>Project slug</label>
              <div style={{ marginTop: 6 }}>
                <Input value="belloc-survivals" mono suffix="auto" />
              </div>
            </div>
          </>
        ) : null}

        {!showStep1 && state === 'idle' ? (
          <>
            <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--ink-2)' }}>Choose a source</div>
            <div style={{ display: 'flex', gap: 12 }}>
              <SourceCard icon="archive" title="Zip archive"
                sub="Drag a .zip here, or click to browse."
                hint="Up to 200 MB" />
              <SourceCard icon="folder" title="Folder of images"
                sub="Select a folder of JP2 / PNG / JPG files."
                hint="JP2, PNG, JPG · 5 GB max" />
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-3)', display: 'flex', gap: 6, alignItems: 'center' }}>
              <Icon name="info" size={12} /> Folder uploads are zipped in your browser before transfer.
            </div>
          </>
        ) : null}

        {!showStep1 && state === 'selected' ? (
          <>
            <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--ink-2)' }}>Choose a source</div>
            <div style={{ display: 'flex', gap: 12 }}>
              <SourceCard icon="archive" title="Zip archive"
                sub="Drag a .zip here, or click to browse."
                hint="Up to 200 MB" />
              <SourceCard icon="folder" title="Folder of images" selected
                sub="ia-bellocsurvivials/jp2/"
                hint="JP2, PNG, JPG · 5 GB max" />
            </div>

            <div style={{
              borderRadius: 10, border: '1px solid var(--border-1)',
              background: 'var(--bg-raised)', padding: '14px 16px',
              display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon name="folder" size={15} style={{ color: 'var(--ink-2)' }} />
                  <span className="mono" style={{ fontSize: 12, color: 'var(--ink-1)' }}>ia-bellocsurvivials/jp2/</span>
                </div>
                <button style={{ background: 'transparent', border: 0, color: 'var(--ink-3)', fontSize: 12, cursor: 'pointer' }}>Change</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
                <Stat label="Files" value="387" />
                <Stat label="Size"  value="2.1 GB" />
                <Stat label="Types" value="JP2 · 380" sub="PNG · 7" />
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Badge tone="dirty">3 files will be skipped (.txt, .xml)</Badge>
                <Badge tone="neutral">Will produce 1 zip · ~210 MB</Badge>
              </div>
            </div>
          </>
        ) : null}

        {!showStep1 && state === 'uploading' ? (
          <>
            <div style={{
              borderRadius: 10, border: '1px solid var(--border-1)',
              background: 'var(--bg-surface)', padding: '20px 18px',
              display: 'flex', flexDirection: 'column', gap: 14,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg-raised)', display: 'grid', placeItems: 'center', color: 'var(--ink-2)' }}>
                    <Icon name="folder" size={17} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>Preparing files…</div>
                    <div style={{ marginTop: 2, fontSize: 11.5, color: 'var(--ink-3)' }}>Zipping 387 files for transfer</div>
                  </div>
                </div>
                <span className="mono" style={{ fontSize: 13, fontWeight: 600 }}>43%</span>
              </div>
              <ProgressBar pct={43} />
              <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', display: 'flex', justifyContent: 'space-between' }}>
                <span>166 / 387 files</span>
                <span>904 MB / 2.1 GB</span>
              </div>
            </div>
            <Stage names={['Zip', 'Upload', 'Ingest']} current={0} />
          </>
        ) : null}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: 18, padding: '14px 24px', borderTop: '1px solid var(--border-1)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'var(--bg-raised)',
      }}>
        <div style={{ fontSize: 11.5, color: 'var(--ink-4)' }}>
          {showStep1 ? 'Step 1 of 2' : state === 'uploading' ? 'Do not close this tab.' : 'Step 2 of 2'}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {state === 'uploading' ? (
            <Button variant="outline" size="md">Cancel</Button>
          ) : (
            <>
              <Button variant="ghost" size="md">Cancel</Button>
              {showStep1 ? (
                <Button variant="primary" size="md" iconRight="arrowR">Next</Button>
              ) : (
                <Button variant="primary" size="md" icon="upload" disabled={state === 'idle'}
                  style={{ opacity: state === 'idle' ? 0.5 : 1, cursor: state === 'idle' ? 'not-allowed' : 'pointer' }}>
                  Start upload
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const Stat = ({ label, value, sub }) => (
  <div>
    <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>{label}</div>
    <div className="mono" style={{ marginTop: 4, fontSize: 16, fontWeight: 600, color: 'var(--ink-1)' }}>{value}</div>
    {sub ? <div className="mono" style={{ marginTop: 2, fontSize: 11, color: 'var(--ink-3)' }}>{sub}</div> : null}
  </div>
);

const ProgressBar = ({ pct, tone = 'accent' }) => (
  <div style={{ height: 8, borderRadius: 99, background: 'var(--bg-sunk)', overflow: 'hidden' }}>
    <div style={{
      width: `${pct}%`, height: '100%', borderRadius: 99,
      background: tone === 'brand' ? 'var(--accent)' : 'var(--accent)',
    }} />
  </div>
);

const Stage = ({ names, current }) => (
  <div style={{ display: 'flex', gap: 8 }}>
    {names.map((n, i) => {
      const active = i === current; const done = i < current;
      return (
        <div key={i} style={{
          flex: 1, padding: '8px 10px', borderRadius: 8,
          background: active ? 'var(--bg-raised)' : 'transparent',
          border: '1px solid var(--border-1)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: 99,
            background: done ? 'var(--exact)' : active ? 'var(--ocr)' : 'var(--ink-4)',
          }} />
          <span style={{ fontSize: 11.5, fontWeight: active ? 600 : 500, color: active ? 'var(--ink-1)' : 'var(--ink-3)' }}>{n}</span>
        </div>
      );
    })}
  </div>
);

/* ============================ Variation B ============================
   Universal drop target — single compact modal (480 wide). Drop a zip OR
   a folder; auto-detected. Manifest renders inline. No two-step wizard.
==================================================================== */

const ModalB = ({ state }) => (
  <div style={{
    width: 480, background: 'var(--bg-surface)', borderRadius: 14,
    boxShadow: 'var(--shadow-floating)', border: '1px solid var(--border-1)',
    display: 'flex', flexDirection: 'column', overflow: 'hidden',
  }}>
    <div style={{ padding: '16px 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>New project</div>
      <button style={{ width: 24, height: 24, borderRadius: 5, border: 0, background: 'transparent', color: 'var(--ink-3)', cursor: 'pointer' }}>
        <Icon name="x" size={14} />
      </button>
    </div>
    <Divider />
    <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Inline name */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '0 12px', height: 36, borderRadius: 8,
        background: 'var(--bg-raised)', border: '1px solid var(--border-1)',
      }}>
        <span style={{ fontSize: 12, color: 'var(--ink-3)', minWidth: 78 }}>Book name</span>
        <input
          defaultValue="Belloc — Survivals & New Arrivals"
          style={{ flex: 1, background: 'transparent', border: 0, outline: 0, fontSize: 13, fontWeight: 500, color: 'var(--ink-1)' }} />
      </div>

      {/* Drop target */}
      {state === 'idle' ? (
        <div style={{
          padding: '28px 18px', borderRadius: 10,
          border: '1.5px dashed var(--border-2)', background: 'var(--bg-raised)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 10,
        }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <CornerIcon name="archive" />
            <CornerIcon name="folder" tone="brand" />
            <CornerIcon name="image" />
          </div>
          <div style={{ marginTop: 4, fontSize: 14, fontWeight: 600 }}>Drop a zip or folder here</div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', maxWidth: 320, lineHeight: 1.5 }}>
            Or <u>browse a zip</u> · <u>select a folder</u>. We detect what you give us — folders are zipped in your browser before upload.
          </div>
          <div className="mono" style={{ marginTop: 6, fontSize: 10.5, color: 'var(--ink-4)' }}>JP2 · PNG · JPG · TIFF · ZIP &middot; max 5 GB</div>
        </div>
      ) : null}

      {state !== 'idle' ? (
        <div style={{
          borderRadius: 10, border: '1px solid var(--border-1)',
          background: 'var(--bg-page)', padding: 14,
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="folder" size={15} style={{ color: 'var(--accent)' }} />
              <div className="mono" style={{ fontSize: 12, fontWeight: 600 }}>ia-bellocsurvivials/jp2/</div>
              <Badge tone="brand">FOLDER</Badge>
            </div>
            <button style={{ background: 'transparent', border: 0, color: 'var(--ink-3)', fontSize: 11.5, cursor: 'pointer' }}>Swap</button>
          </div>

          {/* Compact inline counts */}
          <div className="mono" style={{ fontSize: 11.5, color: 'var(--ink-2)', display: 'flex', flexWrap: 'wrap', gap: 14 }}>
            <span><b style={{ color: 'var(--ink-1)' }}>387</b> files</span>
            <span><b style={{ color: 'var(--ink-1)' }}>2.1 GB</b> total</span>
            <span style={{ color: 'var(--ink-3)' }}>JP2 · 380</span>
            <span style={{ color: 'var(--ink-3)' }}>PNG · 7</span>
            <span style={{ color: 'var(--fuzzy)' }}>skipped · 3</span>
          </div>

          {state === 'uploading' ? (
            <>
              <ProgressBar pct={71} />
              <div className="mono" style={{ fontSize: 10.5, color: 'var(--ink-3)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Uploading… 71%</span>
                <span>1.49 / 2.1 GB · 12.4 MB/s · 49s</span>
              </div>
            </>
          ) : (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 10px', borderRadius: 7,
              background: 'color-mix(in oklab, var(--fuzzy) 12%, transparent)',
              color: 'var(--ink-1)', fontSize: 11.5,
            }}>
              <Icon name="alert" size={12} style={{ color: 'var(--fuzzy)' }} />
              3 files with unsupported extensions will be skipped during zip.
            </div>
          )}
        </div>
      ) : null}
    </div>
    <div style={{ padding: '12px 18px', borderTop: '1px solid var(--border-1)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
      <Button variant="ghost" size="md">Cancel</Button>
      <Button variant="primary" size="md" icon={state === 'uploading' ? 'pause' : 'upload'}>
        {state === 'uploading' ? 'Cancel upload' : state === 'idle' ? 'Waiting for source…' : 'Create + upload'}
      </Button>
    </div>
  </div>
);

const CornerIcon = ({ name, tone }) => (
  <div style={{
    width: 36, height: 36, borderRadius: 8,
    background: tone === 'brand' ? 'color-mix(in oklab, var(--accent) 14%, var(--bg-surface))' : 'var(--bg-surface)',
    border: tone === 'brand' ? '1px solid var(--accent)' : '1px solid var(--border-1)',
    color: tone === 'brand' ? 'var(--accent-ink)' : 'var(--ink-2)',
    display: 'grid', placeItems: 'center',
  }}>
    <Icon name={name} size={18} />
  </div>
);

/* ============================ Variation C ============================
   Roomy: a slide-in right-side SHEET (560 wide) replaces the modal.
   Big preview + steps. Step indicator on the left as a rail.
   Two sub-states: review (with thumbnail manifest) and uploading.
==================================================================== */

const ModalC = ({ state }) => {
  return (
    <div style={{
      width: 720, height: '100%', background: 'var(--bg-surface)',
      borderLeft: '1px solid var(--border-1)',
      boxShadow: '-24px 0 48px -12px rgba(15,23,42,.18)',
      display: 'flex', flexDirection: 'row', overflow: 'hidden',
    }}>
      {/* Left rail */}
      <div style={{
        width: 200, background: 'var(--bg-raised)',
        borderRight: '1px solid var(--border-1)',
        padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 4,
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: 14 }}>New project</div>
        {[
          { n: 'Name', sub: 'belloc-survivals' },
          { n: 'Source', sub: 'Folder · 387 files' },
          { n: 'Review', sub: '3 warnings' },
          { n: 'Upload', sub: state === 'uploading' ? 'in progress' : 'pending' },
        ].map((s, i) => {
          const current = (state === 'uploading' && i === 3) || (state !== 'uploading' && i === 2);
          const done = (state === 'uploading' ? i < 3 : i < 2);
          return (
            <div key={i} style={{
              padding: '10px 12px', borderRadius: 8,
              background: current ? 'var(--bg-surface)' : 'transparent',
              border: current ? '1px solid var(--border-1)' : '1px solid transparent',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: 99,
                background: current ? 'var(--accent)' : done ? 'var(--exact)' : 'transparent',
                color: current || done ? 'var(--accent-ink)' : 'var(--ink-3)',
                border: current || done ? 'none' : '1px solid var(--border-2)',
                display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 600,
                fontFamily: 'var(--mono-font)',
              }}>{done ? <Icon name="check" size={11} stroke={3} /> : (i + 1)}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: current ? 600 : 500, color: current ? 'var(--ink-1)' : done ? 'var(--ink-2)' : 'var(--ink-3)' }}>{s.n}</div>
                <div className="mono" style={{ marginTop: 2, fontSize: 10.5, color: 'var(--ink-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.sub}</div>
              </div>
            </div>
          );
        })}
        <div style={{ marginTop: 'auto', fontSize: 10.5, color: 'var(--ink-4)' }}>Press <KeyCap>Esc</KeyCap> to discard</div>
      </div>

      {/* Right pane */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em' }}>{state === 'uploading' ? 'Uploading source' : 'Review source files'}</div>
            <div style={{ marginTop: 4, fontSize: 12.5, color: 'var(--ink-3)' }}>
              {state === 'uploading' ? 'Zipped 387 files · transferring to ingest worker' : 'We detected the following inside ia-bellocsurvivials/jp2/.'}
            </div>
          </div>
          <button style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border-1)', background: 'transparent', color: 'var(--ink-3)', cursor: 'pointer' }}>
            <Icon name="x" size={14} />
          </button>
        </div>

        <Divider />

        {/* Body */}
        <div style={{ flex: 1, padding: 24, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {state !== 'uploading' ? (
            <>
              {/* Stat tiles */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
                <StatTile label="Files"   value="387"     sub="ready" tone="clean" />
                <StatTile label="Size"    value="2.1 GB"  sub="raw / 210 MB zipped" />
                <StatTile label="JP2"     value="380"     sub="primary" />
                <StatTile label="Skipped" value="3"       sub=".txt · .xml" tone="dirty" />
              </div>

              {/* Warnings */}
              <div style={{
                borderRadius: 10, border: '1px solid color-mix(in oklab, var(--fuzzy) 35%, var(--border-1))',
                background: 'color-mix(in oklab, var(--fuzzy) 7%, var(--bg-surface))',
                padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: 10,
              }}>
                <Icon name="alert" size={16} style={{ color: 'var(--fuzzy)', marginTop: 2 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600 }}>Heads up — large source</div>
                  <div style={{ marginTop: 2, fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.55 }}>
                    Final zip is estimated at <b style={{ color: 'var(--ink-1)' }}>210 MB</b>, which exceeds PGDP's 200 MB limit by 10 MB.
                    We'll split into two zips automatically (1–193, 194–387). You can change this in Settings → Packaging.
                  </div>
                </div>
                <Button variant="outline" size="sm">Open Settings</Button>
              </div>

              {/* Thumbnails strip + table */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600 }}>First 12 files</div>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>sorted by name</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 6 }}>
                  {Array.from({ length: 12 }).map((_, i) => <Thumb key={i} idx={i} />)}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600 }}>File manifest</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Badge tone="neutral" mono>showing 6 / 387</Badge>
                    <Badge tone="outline">expand</Badge>
                  </div>
                </div>
                <ManifestTable />
              </div>
            </>
          ) : (
            <>
              <div style={{
                borderRadius: 10, border: '1px solid var(--border-1)',
                background: 'var(--bg-page)', padding: '18px 18px 22px',
                display: 'flex', flexDirection: 'column', gap: 14,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 99, background: 'var(--ocr)' }} />
                    <span style={{ fontSize: 13, fontWeight: 600 }}>Transferring…</span>
                  </div>
                  <span className="mono" style={{ fontSize: 13, fontWeight: 600 }}>71%</span>
                </div>
                <ProgressBar pct={71} />
                <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>1.49 GB / 2.10 GB</span>
                  <span>12.4 MB/s · 49s remaining</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                <PhaseCard name="Zip · client-side" state="done" detail="0:43 · 387 files · 2 zips · 393 MB" />
                <PhaseCard name="Upload · multipart" state="running" detail="71% · part 4 of 7 · 12.4 MB/s" />
                <PhaseCard name="Ingest · server" state="queued" detail="will start after upload" />
              </div>
              <div style={{ marginTop: 4, fontSize: 11.5, color: 'var(--ink-3)' }}>
                You can leave this tab — we'll resume from where it left off if you close it.
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <Divider />
        <div style={{ padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button variant="ghost" size="md" icon="chevL">Back to source</Button>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="outline" size="md">{state === 'uploading' ? 'Pause' : 'Save as draft'}</Button>
            <Button variant="primary" size="md" icon={state === 'uploading' ? 'pause' : 'upload'}>
              {state === 'uploading' ? 'Cancel upload' : 'Start upload · 2 zips'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatTile = ({ label, value, sub, tone }) => (
  <div style={{
    borderRadius: 10, border: '1px solid var(--border-1)', padding: '12px 14px',
    background: 'var(--bg-surface)',
  }}>
    <div style={{
      fontSize: 10.5, fontWeight: 600, letterSpacing: '0.06em',
      textTransform: 'uppercase', color: 'var(--ink-4)',
    }}>{label}</div>
    <div className="mono" style={{
      marginTop: 6, fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em',
      color: tone === 'dirty' ? 'var(--fuzzy)' : tone === 'clean' ? 'var(--ink-1)' : 'var(--ink-1)',
    }}>{value}</div>
    {sub ? <div style={{ marginTop: 2, fontSize: 11, color: 'var(--ink-3)' }}>{sub}</div> : null}
  </div>
);

const Thumb = ({ idx }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    <div style={{
      aspectRatio: '0.72', borderRadius: 4, background: 'var(--bg-raised)',
      border: '1px solid var(--border-1)', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent 0 4px, color-mix(in oklab, var(--ink-3) 18%, transparent) 4px 5px)' }} />
      <div style={{ position: 'absolute', left: 4, right: 4, bottom: 5, height: 6, background: 'color-mix(in oklab, var(--ink-3) 30%, transparent)', borderRadius: 2 }} />
    </div>
    <div className="mono" style={{ fontSize: 9, color: 'var(--ink-4)', textAlign: 'center' }}>{String(idx + 1).padStart(4, '0')}</div>
  </div>
);

const ManifestTable = () => {
  const rows = [
    { name: 'belloc_0001.jp2', size: '5.4 MB', dim: '3000×4140', ok: true },
    { name: 'belloc_0002.jp2', size: '5.7 MB', dim: '3000×4140', ok: true },
    { name: 'belloc_0003.jp2', size: '5.5 MB', dim: '3000×4140', ok: true },
    { name: 'belloc_meta.xml',  size: '24 KB',  dim: '—',          ok: false, why: 'skip · non-image' },
    { name: 'belloc_0004.jp2', size: '5.6 MB', dim: '3000×4140', ok: true },
    { name: 'belloc_chk.txt',   size: '11 KB',  dim: '—',          ok: false, why: 'skip · non-image' },
  ];
  return (
    <div style={{ border: '1px solid var(--border-1)', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '24px 1fr 80px 110px 110px',
        padding: '8px 12px', background: 'var(--bg-raised)',
        fontSize: 10.5, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase',
        color: 'var(--ink-4)', borderBottom: '1px solid var(--border-1)',
      }}>
        <span />
        <span>Filename</span>
        <span>Size</span>
        <span>Dimensions</span>
        <span style={{ textAlign: 'right' }}>Status</span>
      </div>
      {rows.map((r, i) => (
        <div key={i} style={{
          display: 'grid', gridTemplateColumns: '24px 1fr 80px 110px 110px',
          padding: '8px 12px', alignItems: 'center',
          borderTop: i ? '1px solid var(--border-1)' : 'none',
          fontSize: 12,
        }}>
          <span style={{ color: r.ok ? 'var(--ink-3)' : 'var(--fuzzy)' }}>
            <Icon name={r.ok ? 'file' : 'alert'} size={13} />
          </span>
          <span className="mono" style={{ fontSize: 11.5, color: 'var(--ink-1)' }}>{r.name}</span>
          <span className="mono" style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{r.size}</span>
          <span className="mono" style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{r.dim}</span>
          <span style={{ textAlign: 'right' }}>
            {r.ok ? <Badge tone="clean">queued</Badge> : <Badge tone="dirty">{r.why}</Badge>}
          </span>
        </div>
      ))}
    </div>
  );
};

const PhaseCard = ({ name, state, detail }) => {
  const tone = state === 'done' ? 'clean' : state === 'running' ? 'running' : 'neutral';
  const dot  = state === 'done' ? 'var(--exact)' : state === 'running' ? 'var(--ocr)' : 'var(--ink-4)';
  return (
    <div style={{
      padding: '12px 12px', borderRadius: 8, border: '1px solid var(--border-1)',
      background: state === 'running' ? 'color-mix(in oklab, var(--ocr) 8%, var(--bg-surface))' : 'var(--bg-surface)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 8, height: 8, borderRadius: 99, background: dot }} />
        <span style={{ fontSize: 12, fontWeight: 600 }}>{name}</span>
      </div>
      <div style={{ marginTop: 6, fontSize: 11, color: 'var(--ink-3)' }}>{detail}</div>
    </div>
  );
};

/* ============================ Variation D ============================
   Segmented source picker — 4 sources (Zip · Folder · Local path · URL).
   Density: dense, single 560-wide modal. Each tab swaps the picker body.
==================================================================== */

const ModalD = ({ tab = 'folder', state = 'selected' }) => {
  const tabs = [
    { id: 'zip',    name: 'Zip',          icon: 'archive' },
    { id: 'folder', name: 'Folder',       icon: 'folder' },
    { id: 'local',  name: 'Local path',   icon: 'hardDrive' },
    { id: 'url',    name: 'IA / URL',     icon: 'link' },
  ];
  return (
    <div style={{
      width: 600, background: 'var(--bg-surface)', borderRadius: 14,
      boxShadow: 'var(--shadow-floating)', border: '1px solid var(--border-1)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <div style={{
        padding: '16px 22px 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>New project</div>
          <div style={{ marginTop: 2, fontSize: 12, color: 'var(--ink-3)' }}>
            <span className="mono">belloc-survivals</span> · 232 pages expected
          </div>
        </div>
        <button style={{ width: 24, height: 24, borderRadius: 5, border: 0, background: 'transparent', color: 'var(--ink-3)', cursor: 'pointer' }}>
          <Icon name="x" size={14} />
        </button>
      </div>
      <Divider />

      {/* Segmented tabs */}
      <div style={{ padding: '14px 22px 0' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 4,
          padding: 4, background: 'var(--bg-raised)', borderRadius: 9,
          border: '1px solid var(--border-1)',
        }}>
          {tabs.map(t => {
            const active = tab === t.id;
            return (
              <div key={t.id} style={{
                padding: '7px 8px', borderRadius: 6,
                background: active ? 'var(--bg-surface)' : 'transparent',
                boxShadow: active ? '0 1px 2px rgba(15,23,42,.08), 0 0 0 1px var(--border-1)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                color: active ? 'var(--ink-1)' : 'var(--ink-3)', fontSize: 12.5,
                fontWeight: active ? 600 : 500, cursor: 'pointer',
              }}>
                <Icon name={t.icon} size={14} />
                {t.name}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '16px 22px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {tab === 'zip' ? <ZipPickerBody /> : null}
        {tab === 'folder' ? <FolderPickerBody state={state} /> : null}
        {tab === 'local' ? <LocalPathBody /> : null}
        {tab === 'url' ? <URLBody /> : null}
      </div>

      <div style={{ padding: '12px 22px', borderTop: '1px solid var(--border-1)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'var(--bg-raised)' }}>
        <div style={{ fontSize: 11, color: 'var(--ink-4)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="info" size={11}/> Settings → Defaults govern OCR engine and thresholds.
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="ghost" size="md">Cancel</Button>
          <Button variant="primary" size="md" icon={state === 'uploading' ? 'pause' : 'upload'}>
            {state === 'uploading' ? 'Cancel upload' : 'Start upload'}
          </Button>
        </div>
      </div>
    </div>
  );
};

const ZipPickerBody = () => (
  <div style={{
    padding: '24px 18px', textAlign: 'center', borderRadius: 9,
    border: '1.5px dashed var(--border-2)', background: 'var(--bg-raised)',
  }}>
    <div style={{ display: 'inline-grid', placeItems: 'center', width: 40, height: 40, borderRadius: 10, background: 'var(--bg-surface)', border: '1px solid var(--border-1)', color: 'var(--ink-2)' }}>
      <Icon name="upload" size={18} />
    </div>
    <div style={{ marginTop: 10, fontSize: 13, fontWeight: 600 }}>Drag a .zip here or click to browse</div>
    <div className="mono" style={{ marginTop: 4, fontSize: 10.5, color: 'var(--ink-4)' }}>Up to 200 MB · PGDP submission limit</div>
  </div>
);

const FolderPickerBody = ({ state }) => (
  <>
    <div style={{
      padding: '16px 14px', borderRadius: 9,
      border: '1px solid var(--border-1)', background: 'var(--bg-raised)',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{ width: 34, height: 34, borderRadius: 7, background: 'var(--bg-surface)', border: '1px solid var(--border-1)', display: 'grid', placeItems: 'center', color: 'var(--accent)' }}>
        <Icon name="folder" size={17} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="mono" style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          ~/Downloads/ia-bellocsurvivials/jp2/
        </div>
        <div style={{ marginTop: 4, fontSize: 11, color: 'var(--ink-3)' }}>387 files · 2.1 GB · readable</div>
      </div>
      <Button variant="outline" size="sm">Change…</Button>
    </div>

    {/* Compact manifest */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
      <MiniStat label="JP2" value="380" />
      <MiniStat label="PNG" value="7" />
      <MiniStat label="Skipped" value="3" tone="dirty" />
      <MiniStat label="Out zips" value="2" sub="200 MB each" />
    </div>

    <div style={{
      borderRadius: 8, padding: '10px 12px',
      background: 'color-mix(in oklab, var(--fuzzy) 9%, transparent)',
      border: '1px solid color-mix(in oklab, var(--fuzzy) 30%, var(--border-1))',
      display: 'flex', gap: 10, alignItems: 'flex-start',
    }}>
      <Icon name="alert" size={13} style={{ color: 'var(--fuzzy)', marginTop: 2 }} />
      <div style={{ fontSize: 11.5, color: 'var(--ink-2)', lineHeight: 1.5 }}>
        Final zip ~ 210 MB exceeds PGDP's 200 MB limit — splitting into 2 archives.
        <span style={{ color: 'var(--ink-3)' }}> Disable split in </span>
        <span style={{ color: 'var(--ink-1)', textDecoration: 'underline' }}>Settings → Packaging</span>.
      </div>
    </div>

    {state === 'uploading' ? (
      <div style={{ padding: '12px 14px', borderRadius: 9, border: '1px solid var(--border-1)', background: 'var(--bg-page)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600 }}>Preparing files…</span>
          <span className="mono" style={{ fontSize: 12, fontWeight: 600 }}>43% · 0:19 / 0:45</span>
        </div>
        <ProgressBar pct={43} />
      </div>
    ) : null}
  </>
);

const LocalPathBody = () => (
  <>
    <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>
      Local mode only — give the server a path it can read. No copy, no upload.
    </div>
    <div style={{ display: 'flex', gap: 8 }}>
      <div style={{ flex: 1 }}>
        <Input value="/Users/jess/scans/belloc/ia-bellocsurvivials/jp2" mono />
      </div>
      <Button variant="outline" size="md">Verify</Button>
    </div>
    <div style={{
      display: 'flex', gap: 10, padding: '10px 12px', borderRadius: 8,
      background: 'color-mix(in oklab, var(--exact) 9%, transparent)',
      border: '1px solid color-mix(in oklab, var(--exact) 30%, var(--border-1))',
    }}>
      <Icon name="checkCircle" size={14} style={{ color: 'var(--exact)', marginTop: 1 }}/>
      <div className="mono" style={{ fontSize: 11.5, color: 'var(--ink-2)' }}>
        387 files · 380 JP2, 7 PNG · 2.1 GB · readable as <span style={{ color: 'var(--ink-1)' }}>worker</span>
      </div>
    </div>
    <div style={{
      borderRadius: 8, padding: '8px 12px',
      background: 'var(--bg-raised)', border: '1px solid var(--border-1)',
      fontSize: 11, color: 'var(--ink-3)',
    }}>
      <span className="mono" style={{ color: 'var(--ink-2)' }}>~/scans/</span>
      <span> auto-completes from your project root.</span>
    </div>
  </>
);

const URLBody = () => (
  <>
    <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>
      Paste an Internet Archive item URL — we'll fetch its primary JP2 set.
    </div>
    <Input value="https://archive.org/details/bellocsurvivials00bell" mono />
    <div style={{
      borderRadius: 9, padding: '12px 14px', display: 'flex', gap: 12,
      background: 'var(--bg-raised)', border: '1px solid var(--border-1)',
    }}>
      <div style={{ width: 44, height: 56, borderRadius: 4, background: 'var(--bg-surface)', border: '1px solid var(--border-1)', flex: '0 0 auto' }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600 }}>Survivals and New Arrivals</div>
        <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>Hilaire Belloc, 1929 · Sheed and Ward</div>
        <div className="mono" style={{ marginTop: 6, fontSize: 11, color: 'var(--ink-2)' }}>
          jp2 · 232 pages · 2.0 GB · uploaded 2020
        </div>
      </div>
      <Badge tone="clean">match</Badge>
    </div>
  </>
);

const MiniStat = ({ label, value, sub, tone }) => (
  <div style={{
    padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border-1)',
    background: 'var(--bg-surface)',
  }}>
    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>{label}</div>
    <div className="mono" style={{ marginTop: 4, fontSize: 16, fontWeight: 600, color: tone === 'dirty' ? 'var(--fuzzy)' : 'var(--ink-1)' }}>{value}</div>
    {sub ? <div style={{ marginTop: 1, fontSize: 10, color: 'var(--ink-3)' }}>{sub}</div> : null}
  </div>
);

/* ============================ Variation E ============================
   Synthesis — universal droplet at the top + segmented external sources.
   One modal at 620 wide. Drop a zip/folder, OR paste a URL (IA, Google
   Books, HathiTrust). Source auto-detected from URL pattern. Single step.
==================================================================== */

const EXT_SOURCES = [
  { id: 'ia',     name: 'Internet Archive', short: 'IA',     match: 'archive.org/details/…',     icon: 'archive', tone: '#1B7A8D' },
  { id: 'google', name: 'Google Books',     short: 'Google', match: 'books.google.com/books?id=…', icon: 'file',    tone: '#4285F4', soon: true },
  { id: 'hathi',  name: 'HathiTrust',       short: 'Hathi',  match: 'local files only',              icon: 'file',    tone: '#7C2D12', soon: true },
];

const ModalE = ({ state = 'idle' }) => {
  const showLocal = state === 'localManifest';
  const showIA = state === 'ia';
  const showHathi = state === 'hathi';
  const uploading = state === 'uploading';

  return (
    <div style={{
      width: 620, background: 'var(--bg-surface)', borderRadius: 14,
      boxShadow: 'var(--shadow-floating)', border: '1px solid var(--border-1)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '18px 22px 14px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em' }}>New project</div>
          <div style={{ marginTop: 2, fontSize: 12.5, color: 'var(--ink-3)' }}>Drop a source, or paste a URL we recognise.</div>
        </div>
        <button style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border-1)', background: 'transparent', color: 'var(--ink-3)', cursor: 'pointer' }}>
          <Icon name="x" size={14} />
        </button>
      </div>

      {/* Inline book name */}
      <div style={{ padding: '0 22px 16px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px', height: 38,
          background: 'var(--bg-raised)', border: '1px solid var(--border-1)', borderRadius: 8,
        }}>
          <span style={{ fontSize: 12, color: 'var(--ink-3)', minWidth: 78, fontWeight: 500 }}>Book name</span>
          <input defaultValue="Belloc — Survivals & New Arrivals"
            style={{ flex: 1, background: 'transparent', border: 0, outline: 0, fontSize: 13, fontWeight: 500, color: 'var(--ink-1)' }} />
          <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-4)' }}>auto-slug · belloc-survivals</span>
        </div>
      </div>

      <Divider />

      {/* Body */}
      <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {state === 'idle' ? <DropletIdle /> : null}
        {showLocal ? <LocalDetectedCard /> : null}
        {showIA ? <IADetectedCard /> : null}
        {showHathi ? <HathiDetectedCard /> : null}
        {uploading ? <UploadingPhases /> : null}

        {/* URL bar always visible (acts as alt input) */}
        {!uploading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Icon name="link" size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-4)' }} />
              <input
                defaultValue={showIA ? 'https://archive.org/details/bellocsurvivials00bell' : showHathi ? 'https://babel.hathitrust.org/cgi/pt?id=mdp.39015014332571' : ''}
                placeholder="…or paste an archive URL (IA, Google Books, HathiTrust)"
                className="mono"
                style={{
                  width: '100%', height: 38, padding: '0 14px 0 32px', borderRadius: 8,
                  background: 'var(--bg-surface)', border: '1px solid var(--border-2)',
                  fontSize: 12, color: 'var(--ink-1)', outline: 0,
                }} />
            </div>
            <Button variant="outline" size="md">Detect</Button>
          </div>
        ) : null}

        {/* External sources chip row */}
        {!uploading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: 'var(--ink-4)', marginRight: 2 }}>recognised:</span>
            {EXT_SOURCES.map(s => {
              const active = (showIA && s.id === 'ia') || (showHathi && s.id === 'hathi');
              return <SourceChip key={s.id} src={s} active={active} />;
            })}
            <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>· more soon</span>
          </div>
        ) : null}
      </div>

      {/* Footer */}
      <div style={{
        padding: '12px 22px', borderTop: '1px solid var(--border-1)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'var(--bg-raised)',
      }}>
        <div style={{ fontSize: 11.5, color: 'var(--ink-4)', display: 'flex', alignItems: 'center', gap: 6 }}>
          {uploading ? (
            <><span style={{ width: 6, height: 6, borderRadius: 99, background: 'var(--ocr)' }} /> Don't close this tab.</>
          ) : state === 'idle' ? (
            <><Icon name="info" size={11} /> Folders are zipped in your browser before transfer.</>
          ) : (
            <><Icon name="checkCircle" size={11} style={{ color: 'var(--exact)' }}/> Ready to ingest 232 pages</>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="ghost" size="md">Cancel</Button>
          <Button variant="primary" size="md" icon={uploading ? 'pause' : showIA || showHathi ? 'download' : 'upload'}
            disabled={state === 'idle'}
            style={{ opacity: state === 'idle' ? 0.5 : 1, cursor: state === 'idle' ? 'not-allowed' : 'pointer' }}>
            {uploading ? 'Cancel upload' :
              showIA ? 'Fetch from IA' :
              showHathi ? 'Fetch from HathiTrust' :
              showLocal ? 'Create + upload' : 'Waiting for source…'}
          </Button>
        </div>
      </div>
    </div>
  );
};

const SourceChip = ({ src, active }) => {
  const soon = src.soon && !active;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      height: 22, padding: '0 9px', borderRadius: 99, fontSize: 11.5, fontWeight: 500,
      border: '1px solid',
      borderColor: active ? src.tone : 'var(--border-2)',
      background: active ? `color-mix(in oklab, ${src.tone} 14%, var(--bg-surface))` : 'var(--bg-surface)',
      color: active ? 'var(--ink-1)' : soon ? 'var(--ink-4)' : 'var(--ink-3)',
      opacity: soon ? 0.75 : 1,
    }}>
      <span style={{ width: 7, height: 7, borderRadius: 99, background: src.tone, opacity: active ? 1 : soon ? 0.4 : 0.5 }} />
      {src.name}
      {active ? <Icon name="check" size={11} stroke={3} /> : null}
      {soon ? <span style={{ marginLeft: 2, fontSize: 9.5, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>soon</span> : null}
    </span>
  );
};

const DropletIdle = () => (
  <div style={{
    padding: '38px 22px', borderRadius: 12,
    border: '1.5px dashed var(--border-2)', background: 'var(--bg-raised)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12,
  }}>
    <div style={{ display: 'flex', gap: 10 }}>
      <CornerIcon name="archive" />
      <CornerIcon name="folder" tone="brand" />
      <CornerIcon name="link" />
    </div>
    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-1)' }}>Drop a zip, folder, or paste a URL</div>
    <div style={{ fontSize: 12.5, color: 'var(--ink-3)', maxWidth: 380, lineHeight: 1.55 }}>
      Folders are zipped in your browser before transfer. Internet Archive URLs are fetched server-side — Google Books and HathiTrust are coming soon.
    </div>
  </div>
);

const LocalDetectedCard = () => (
  <div style={{
    borderRadius: 12, border: '1px solid var(--border-1)',
    background: 'var(--bg-page)', padding: '14px 16px',
    display: 'flex', flexDirection: 'column', gap: 12,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 7, background: 'var(--bg-surface)', border: '1px solid var(--border-1)', display: 'grid', placeItems: 'center', color: 'var(--accent)' }}>
          <Icon name="folder" size={16} />
        </div>
        <div>
          <div className="mono" style={{ fontSize: 12, fontWeight: 600 }}>ia-bellocsurvivials/jp2/</div>
          <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>local folder · readable</div>
        </div>
      </div>
      <Badge tone="brand">LOCAL</Badge>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
      <MiniStat label="Files"    value="387" />
      <MiniStat label="JP2"      value="380" />
      <MiniStat label="PNG"      value="7" />
      <MiniStat label="Skipped"  value="3" tone="dirty" sub=".txt · .xml" />
    </div>
  </div>
);

const IADetectedCard = () => (
  <div style={{
    borderRadius: 12, border: '1px solid var(--border-1)',
    background: 'var(--bg-page)', padding: 14,
    display: 'flex', flexDirection: 'column', gap: 12,
  }}>
    <div style={{ display: 'flex', gap: 14 }}>
      <div style={{
        width: 84, height: 110, borderRadius: 4, background: 'var(--bg-raised)',
        border: '1px solid var(--border-1)', flex: '0 0 auto', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent 0 5px, color-mix(in oklab, var(--ink-3) 20%, transparent) 5px 6px)' }} />
        <div style={{ position: 'absolute', left: 8, right: 8, bottom: 10, height: 8, background: 'color-mix(in oklab, var(--ink-3) 30%, transparent)', borderRadius: 2 }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <Badge tone="outline" style={{ borderColor: '#1B7A8D', color: '#1B7A8D' }} dot={false}>Internet Archive</Badge>
          <Badge tone="clean">match</Badge>
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em' }}>Survivals and New Arrivals</div>
        <div style={{ marginTop: 2, fontSize: 12, color: 'var(--ink-3)' }}>Hilaire Belloc · 1929 · Sheed and Ward</div>
        <div className="mono" style={{ marginTop: 8, fontSize: 11, color: 'var(--ink-2)' }}>
          bellocsurvivials00bell · english · public domain
        </div>
      </div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
      <MiniStat label="Pages" value="232" />
      <MiniStat label="JP2 set" value="2.0 GB" sub="primary" />
      <MiniStat label="Rights" value="PD · US" sub="public domain" />
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11.5, color: 'var(--ink-3)' }}>
      <span>Scan set:</span>
      <SegTiny opts={['JP2 (2.0 GB)', 'JPG (430 MB)', 'PDF (610 MB)']} active={0} />
    </div>
  </div>
);

const HathiDetectedCard = () => (
  <div style={{
    borderRadius: 12, border: '1px solid var(--border-1)',
    background: 'var(--bg-page)', padding: 14,
    display: 'flex', flexDirection: 'column', gap: 12,
  }}>
    <div style={{ display: 'flex', gap: 14 }}>
      <div style={{
        width: 84, height: 110, borderRadius: 4, background: 'var(--bg-raised)',
        border: '1px solid var(--border-1)', flex: '0 0 auto', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent 0 5px, color-mix(in oklab, var(--ink-3) 20%, transparent) 5px 6px)' }} />
        <div style={{ position: 'absolute', left: 8, right: 8, bottom: 10, height: 8, background: 'color-mix(in oklab, var(--ink-3) 30%, transparent)', borderRadius: 2 }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <Badge tone="outline" style={{ borderColor: '#7C2D12', color: '#7C2D12' }} dot={false}>HathiTrust</Badge>
          <Badge tone="clean">match</Badge>
          <Badge tone="dirty">full view · US</Badge>
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em' }}>Survivals and New Arrivals · Belloc</div>
        <div style={{ marginTop: 2, fontSize: 12, color: 'var(--ink-3)' }}>U Michigan · scanned by Google · 1929</div>
        <div className="mono" style={{ marginTop: 8, fontSize: 11, color: 'var(--ink-2)' }}>
          mdp.39015014332571 · english · 232 pp
        </div>
      </div>
    </div>
    <div style={{
      borderRadius: 7, padding: '8px 10px',
      background: 'color-mix(in oklab, var(--fuzzy) 9%, transparent)',
      border: '1px solid color-mix(in oklab, var(--fuzzy) 30%, var(--border-1))',
      display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 11.5, color: 'var(--ink-2)',
    }}>
      <Icon name="alert" size={12} style={{ color: 'var(--fuzzy)', marginTop: 2 }} />
      <span>
        HathiTrust full-view downloads require a partner-institution login.
        <span style={{ color: 'var(--ink-3)' }}> Configure credentials in </span>
        <span style={{ color: 'var(--ink-1)', textDecoration: 'underline' }}>Settings → Sources</span>.
      </span>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
      <MiniStat label="Pages" value="232" />
      <MiniStat label="Resolution" value="400 DPI" sub="grayscale" />
      <MiniStat label="OCR" value="ALTO XML" sub="per page" />
    </div>
  </div>
);

const SegTiny = ({ opts, active }) => (
  <div style={{ display: 'inline-flex', padding: 3, background: 'var(--bg-raised)', borderRadius: 7, border: '1px solid var(--border-1)' }}>
    {opts.map((o, i) => (
      <div key={i} className="mono" style={{
        padding: '4px 9px', borderRadius: 5,
        background: i === active ? 'var(--bg-surface)' : 'transparent',
        boxShadow: i === active ? '0 1px 1px rgba(15,23,42,.08)' : 'none',
        color: i === active ? 'var(--ink-1)' : 'var(--ink-3)',
        fontSize: 11, fontWeight: i === active ? 600 : 500,
      }}>{o}</div>
    ))}
  </div>
);

const UploadingPhases = () => (
  <div style={{
    borderRadius: 12, border: '1px solid var(--border-1)',
    background: 'var(--bg-page)', padding: '16px 16px', display: 'flex', flexDirection: 'column', gap: 14,
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 8, height: 8, borderRadius: 99, background: 'var(--ocr)' }} />
        <span style={{ fontSize: 13, fontWeight: 600 }}>Fetching from Internet Archive…</span>
      </div>
      <span className="mono" style={{ fontSize: 13, fontWeight: 600 }}>71%</span>
    </div>
    <ProgressBar pct={71} />
    <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', display: 'flex', justifyContent: 'space-between' }}>
      <span>165 / 232 pages · 1.42 GB / 2.0 GB</span>
      <span>14.2 MB/s · 41s remaining</span>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
      <PhaseCard name="Resolve" state="done" detail="0:02 · matched IA item · 232 pages" />
      <PhaseCard name="Fetch" state="running" detail="71% · jp2 set · server stream" />
      <PhaseCard name="Ingest" state="queued" detail="will start after fetch" />
    </div>
  </div>
);

Object.assign(window, { ModalA, ModalB, ModalC, ModalD, ModalE });

/* ============================ Variation F ============================
   Full synthesis: right-hand sheet (from C) + universal droplet (from B)
   + URL detection across recognised external sources (from D/E).
   Left rail = Source · Review · Upload. Right pane swaps by step.
==================================================================== */

const F_STEPS = ['Source', 'Review', 'Upload'];

const FRail = ({ step }) => (
  <div style={{
    width: 196, background: 'var(--bg-raised)',
    borderRight: '1px solid var(--border-1)',
    padding: '24px 14px', display: 'flex', flexDirection: 'column', gap: 4,
  }}>
    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: 14, paddingLeft: 6 }}>New project</div>
    <div style={{ paddingLeft: 6, paddingBottom: 12 }}>
      <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>belloc-survivals</div>
    </div>
    {F_STEPS.map((name, i) => {
      const current = i === step; const done = i < step;
      return (
        <div key={i} style={{
          padding: '10px 12px', borderRadius: 8,
          background: current ? 'var(--bg-surface)' : 'transparent',
          border: current ? '1px solid var(--border-1)' : '1px solid transparent',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 22, height: 22, borderRadius: 99,
            background: current ? 'var(--accent)' : done ? 'var(--exact)' : 'transparent',
            color: current || done ? 'var(--accent-ink)' : 'var(--ink-3)',
            border: current || done ? 'none' : '1px solid var(--border-2)',
            display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 600,
            fontFamily: 'var(--mono-font)',
          }}>{done ? <Icon name="check" size={11} stroke={3} /> : (i + 1)}</div>
          <div style={{ fontSize: 12.5, fontWeight: current ? 600 : 500, color: current ? 'var(--ink-1)' : done ? 'var(--ink-2)' : 'var(--ink-3)' }}>{name}</div>
        </div>
      );
    })}
    <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 6 }}>
      <div style={{ fontSize: 10.5, color: 'var(--ink-4)' }}>Press <KeyCap>Esc</KeyCap> to discard</div>
      <div style={{ fontSize: 10.5, color: 'var(--ink-4)' }}>Drafts auto-save on close.</div>
    </div>
  </div>
);

const FHeader = ({ title, sub }) => (
  <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
    <div>
      <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em' }}>{title}</div>
      <div style={{ marginTop: 4, fontSize: 12.5, color: 'var(--ink-3)' }}>{sub}</div>
    </div>
    <button style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border-1)', background: 'transparent', color: 'var(--ink-3)', cursor: 'pointer' }}>
      <Icon name="x" size={14} />
    </button>
  </div>
);

const FFooter = ({ step, source }) => (
  <>
    <Divider />
    <div style={{ padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Button variant="ghost" size="md" icon="chevL"
        style={{ opacity: step === 0 ? 0.35 : 1, cursor: step === 0 ? 'not-allowed' : 'pointer' }}>Back</Button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {step === 1 ? <span style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>232 pages · {source === 'localFolder' ? 'browser zip' : 'server fetch'}</span> : null}
        {step === 2 ? <span style={{ fontSize: 11.5, color: 'var(--ink-3)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: 99, background: 'var(--ocr)' }} /> Do not close this tab.
        </span> : null}
        <Button variant="outline" size="md">{step === 2 ? 'Pause' : 'Save as draft'}</Button>
        <Button variant="primary" size="md"
          icon={step === 0 ? 'arrowR' : step === 1 ? (source === 'ia' || source === 'hathi' ? 'download' : 'upload') : 'pause'}
          disabled={step === 0 && source === 'hathiSoon'}
          style={step === 0 && source === 'hathiSoon' ? { opacity: 0.5, cursor: 'not-allowed' } : null}>
          {step === 0 ? 'Continue to review' :
            step === 1 ? (source === 'ia' ? 'Fetch from IA · 2.0 GB' : source === 'hathi' ? 'Fetch from HathiTrust' : 'Start upload') :
            'Cancel upload'}
        </Button>
      </div>
    </div>
  </>
);

const FSourceBody = ({ pasted }) => (
  <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 16, overflow: 'auto' }}>
    <div>
      <label style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--ink-2)' }}>Book name</label>
      <div style={{ marginTop: 6 }}>
        <Input value="Belloc — Survivals & New Arrivals" autoFocus />
      </div>
    </div>
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <label style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--ink-2)' }}>Source</label>
        <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>any one of the below</span>
      </div>
      <DropletIdle />
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Divider style={{ flex: 1 }} />
      <span style={{ fontSize: 10.5, color: 'var(--ink-4)', letterSpacing: '.06em', textTransform: 'uppercase' }}>or</span>
      <Divider style={{ flex: 1 }} />
    </div>
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Icon name="link" size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-4)' }} />
          <input
            defaultValue={pasted === 'hathiSoon' ? 'https://babel.hathitrust.org/cgi/pt?id=mdp.39015014332571' : ''}
            placeholder="Paste an archive URL (Internet Archive supported)" className="mono"
            style={{ width: '100%', height: 38, padding: '0 14px 0 32px', borderRadius: 8,
              background: 'var(--bg-surface)', border: '1px solid var(--border-2)',
              fontSize: 12, color: 'var(--ink-1)', outline: 0 }} />
        </div>
        <Button variant="outline" size="md">Detect</Button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>recognised:</span>
        {EXT_SOURCES.map(s => <SourceChip key={s.id} src={s} active={false} />)}
      </div>
      {pasted === 'hathiSoon' ? (
        <div style={{
          marginTop: 14,
          borderRadius: 10,
          border: '1px dashed color-mix(in oklab, #7C2D12 50%, var(--border-2))',
          background: 'color-mix(in oklab, #7C2D12 6%, var(--bg-surface))',
          padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: 12,
        }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--bg-surface)', border: '1px solid var(--border-1)', display: 'grid', placeItems: 'center', color: '#7C2D12', flex: '0 0 auto' }}>
            <Icon name="info" size={15} />
          </div>
          <div style={{ flex: 1, fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.55 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-1)', marginBottom: 3 }}>
              HathiTrust remote fetch — coming soon
            </div>
            HathiTrust doesn't expose bulk downloads to most partners; pages are typically served one at a time.
            For now, download the JP2 set locally (or use the HathiTrust downloader for a partner login) and drop the
            folder into the droplet above — we'll still pull metadata from the URL.
            <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
              <Badge tone="outline" mono>local files only</Badge>
              <Badge tone="neutral" mono>metadata · we'll match</Badge>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  </div>
);

const FReviewBody = ({ source }) => (
  <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 16, overflow: 'auto' }}>
    {source === 'ia' ? <IADetectedCard /> :
     source === 'hathi' ? <HathiDetectedCard /> :
     <LocalDetectedCard />}

    <div style={{
      borderRadius: 10, border: '1px solid var(--border-1)', padding: '14px 16px',
      background: 'var(--bg-surface)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600 }}>Pages to include</div>
        <Badge tone="neutral" mono>1 — 232 · all</Badge>
      </div>
      <PageRangeBar />
      <div style={{ marginTop: 14, fontSize: 11, color: 'var(--ink-3)' }}>
        Drag the handles to exclude scanned covers or back-matter. <span style={{ color: 'var(--ink-2)' }}>You can edit page-by-page later.</span>
      </div>
    </div>

    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600 }}>{source === 'localFolder' ? 'First 14 files' : 'First 14 pages'}</div>
        <div style={{ display: 'flex', gap: 6 }}>
          <Badge tone="outline">grid</Badge>
          <Badge tone="neutral" mono>1 / 17</Badge>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(14, 1fr)', gap: 5 }}>
        {Array.from({ length: 14 }).map((_, i) => <Thumb key={i} idx={i} />)}
      </div>
    </div>

    {source === 'localFolder' ? (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600 }}>File manifest</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <Badge tone="neutral" mono>showing 6 / 387</Badge>
            <Badge tone="outline">expand</Badge>
          </div>
        </div>
        <ManifestTable />
      </div>
    ) : (
      <div>
        <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 8 }}>PGDP metadata · pre-filled from source</div>
        <MetadataGrid source={source} />
      </div>
    )}
  </div>
);

const PageRangeBar = () => (
  <div style={{ position: 'relative', height: 22 }}>
    <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 6, background: 'var(--bg-sunk)', borderRadius: 99, transform: 'translateY(-50%)' }} />
    <div style={{ position: 'absolute', left: '0%', right: '0%', top: '50%', height: 6, background: 'var(--accent)', borderRadius: 99, transform: 'translateY(-50%)' }} />
    <div style={{ position: 'absolute', left: 'calc(0% - 7px)', top: '50%', width: 14, height: 14, background: 'var(--bg-surface)', border: '2px solid var(--accent)', borderRadius: 99, transform: 'translateY(-50%)' }} />
    <div style={{ position: 'absolute', right: 'calc(0% - 7px)', top: '50%', width: 14, height: 14, background: 'var(--bg-surface)', border: '2px solid var(--accent)', borderRadius: 99, transform: 'translateY(-50%)' }} />
    <div className="mono" style={{ position: 'absolute', left: 0, top: -16, fontSize: 10, color: 'var(--ink-3)' }}>1</div>
    <div className="mono" style={{ position: 'absolute', right: 0, top: -16, fontSize: 10, color: 'var(--ink-3)' }}>232</div>
  </div>
);

const MetadataGrid = ({ source }) => {
  const rows = source === 'ia' ? [
    ['Title', 'Survivals and New Arrivals'],
    ['Author', 'Hilaire Belloc'],
    ['Year', '1929'],
    ['Publisher', 'Sheed and Ward'],
    ['Language', 'English'],
    ['Rights', 'Public domain · US'],
    ['IA ID',   'bellocsurvivials00bell'],
    ['Pages',   '232'],
  ] : [
    ['Title', 'Survivals and New Arrivals'],
    ['Author', 'Hilaire Belloc'],
    ['Year', '1929'],
    ['Source', 'University of Michigan'],
    ['Language', 'English'],
    ['Rights', 'Public domain · Full view'],
    ['Hathi ID', 'mdp.39015014332571'],
    ['Pages',   '232'],
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', border: '1px solid var(--border-1)', borderRadius: 10, overflow: 'hidden' }}>
      {rows.map(([k, v], i) => (
        <div key={i} style={{
          display: 'grid', gridTemplateColumns: '100px 1fr', alignItems: 'center', padding: '10px 12px',
          borderTop: i >= 2 ? '1px solid var(--border-1)' : 'none',
          borderLeft: i % 2 ? '1px solid var(--border-1)' : 'none',
          background: i % 2 ? 'var(--bg-surface)' : 'var(--bg-raised)',
        }}>
          <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>{k}</div>
          <div className="mono" style={{ fontSize: 11.5, color: 'var(--ink-1)' }}>{v}</div>
        </div>
      ))}
    </div>
  );
};

const FUploadBody = ({ source }) => (
  <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 16, overflow: 'auto' }}>
    <div style={{
      borderRadius: 10, border: '1px solid var(--border-1)',
      background: 'var(--bg-page)', padding: '18px 18px 22px',
      display: 'flex', flexDirection: 'column', gap: 14,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 8, height: 8, borderRadius: 99, background: 'var(--ocr)' }} />
          <span style={{ fontSize: 14, fontWeight: 600 }}>
            {source === 'ia' ? 'Fetching from Internet Archive…' :
             source === 'hathi' ? 'Fetching from HathiTrust…' :
             'Transferring local source…'}
          </span>
        </div>
        <span className="mono" style={{ fontSize: 14, fontWeight: 600 }}>71%</span>
      </div>
      <ProgressBar pct={71} />
      <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', display: 'flex', justifyContent: 'space-between' }}>
        <span>165 / 232 pages · 1.42 GB / 2.0 GB</span>
        <span>14.2 MB/s · 41s remaining</span>
      </div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
      <PhaseCard name="Resolve" state="done" detail={source === 'ia' ? '0:02 · matched IA item' : source === 'hathi' ? '0:03 · matched Hathi' : '0:01 · folder read'} />
      <PhaseCard name={source === 'localFolder' ? 'Zip · browser' : 'Fetch · server'} state="done" detail={source === 'localFolder' ? '0:43 · 210 MB' : '0:18 · jp2 set'} />
      <PhaseCard name={source === 'localFolder' ? 'Upload' : 'Transfer'} state="running" detail="71% · 14.2 MB/s · 0:41" />
      <PhaseCard name="Ingest" state="queued" detail="thumbnail · stems · stages" />
    </div>
    <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>
      Leave this tab open or close it — we'll keep going and notify you when ingest finishes.
    </div>
  </div>
);

const ModalF = ({ step = 0, source = 'localFolder' }) => (
  <div style={{
    width: 760, height: '100%', background: 'var(--bg-surface)',
    borderLeft: '1px solid var(--border-1)',
    boxShadow: '-24px 0 48px -12px rgba(15,23,42,.18)',
    display: 'flex', flexDirection: 'row', overflow: 'hidden',
  }}>
    <FRail step={step} />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <FHeader
        title={step === 0 ? 'Choose a source' : step === 1 ? 'Review · before upload' : 'Upload in progress'}
        sub={
          step === 0 ? (source === 'hathiSoon' ? 'HathiTrust URL detected — local files needed for now.' : 'Drop a file or folder, or paste a URL we recognise.') :
          step === 1 ? (source === 'ia' ? 'Matched Internet Archive · 232 pages · public domain' :
                       source === 'hathi' ? 'Matched HathiTrust · 232 pages · full view US' :
                       'Local folder · 387 files · 2.1 GB') :
          'Hold tight — phase-by-phase progress below.'
        } />
      <Divider />
      {step === 0 ? <FSourceBody pasted={source === 'hathiSoon' ? 'hathiSoon' : undefined} /> : step === 1 ? <FReviewBody source={source} /> : <FUploadBody source={source} />}
      <FFooter step={step} source={source} />
    </div>
  </div>
);

Object.assign(window, { ModalA, ModalB, ModalC, ModalD, ModalE, ModalF });
