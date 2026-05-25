/**
 * LauncherTile — renders a single suite sibling as a clickable launch button.
 *
 * On click calls `useSuiteSiblingsContext().launch(sibling.id)`:
 * - `{ kind: 'opened', url }` → opens url in a new tab.
 * - `{ kind: 'requires-host-config' }` → shows an inline notice.
 */
import * as React from 'react';
import { useSuiteSiblingsContext } from './SuiteSiblingsContext.js';
import type { InstalledApp } from './types.js';

export interface LauncherTileProps {
  sibling: InstalledApp;
}

export function LauncherTile({ sibling }: LauncherTileProps) {
  const ctx = useSuiteSiblingsContext();
  const [requiresConfig, setRequiresConfig] = React.useState(false);

  async function handleClick() {
    if (!ctx) return;
    const result = await ctx.launch(sibling.id);
    if (result.kind === 'opened') {
      window.open(result.url, '_blank', 'noopener,noreferrer');
    } else {
      setRequiresConfig(true);
    }
  }

  return (
    <div data-testid={`launcher-tile-${sibling.id}`} className="launcher-tile">
      <button
        type="button"
        aria-label={`Launch ${sibling.displayName}`}
        title={sibling.displayName}
        onClick={() => {
          void handleClick();
        }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          padding: '6px 8px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--ink-2)',
        }}
      >
        {sibling.iconUrl !== undefined && (
          <img src={sibling.iconUrl} alt="" aria-hidden="true" width={20} height={20} />
        )}
        <span style={{ fontSize: '10px', lineHeight: 1 }}>{sibling.displayName}</span>
      </button>
      {requiresConfig && (
        <div
          data-testid="launcher-tile-requires-config"
          role="status"
          style={{ fontSize: '10px', color: 'var(--fuzzy)', padding: '2px 4px' }}
        >
          Host config required
        </div>
      )}
    </div>
  );
}

LauncherTile.displayName = 'LauncherTile';
