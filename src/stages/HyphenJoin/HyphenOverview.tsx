import * as React from 'react';
import { StatTile } from '../../primitives/StatTile.js';
import { HYPHEN_OVERVIEW } from '../../testids/index.js';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface HyphenOverviewStats {
  /** Cross-line cases the rule library could not auto-resolve. */
  undecided: number;
  /** Cases the rule library auto-joined. */
  autoJoined: number;
  /** Unique words appearing both joined and hyphenated. */
  mismatch: number;
  /** Cases flagged for post-book review. */
  flagged: number;
}

export interface HyphenOverviewProps {
  stats: HyphenOverviewStats;
  /**
   * Optional post-book notes preview — rendered in a small card section
   * below the stat tiles. Omit to hide the notes card entirely.
   */
  notesPreview?: string | React.ReactNode;
  'data-testid'?: string;
}

// ── PostBookNotesPreview (inlined — no separate export) ───────────────────────

function PostBookNotesPreview({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <div className="hyphen-overview__notes-card">
      <div className="hyphen-overview__notes-label">Post-book notes</div>
      <div className="hyphen-overview__notes-body">{children}</div>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * HyphenOverview — landing panel for the HyphenJoin pipeline stage.
 *
 * Renders four stat tiles (Undecided / Auto-joined / Mismatch / Flagged)
 * and an optional post-book notes preview card below.
 *
 * Design source: `docs/templates/design_handoff_pdomain_ui/final/hyphen_join/hyphen.jsx`
 * (Overview tab — stat tiles + PostBookNotesPreview section).
 */
export function HyphenOverview({
  stats,
  'data-testid': testId = HYPHEN_OVERVIEW,
  ...rest
}: HyphenOverviewProps): React.ReactElement {
  const { undecided, autoJoined, mismatch, flagged } = stats;

  // exactOptionalPropertyTypes — only destructure notesPreview when present
  const notesPreview: string | React.ReactNode | undefined =
    'notesPreview' in rest ? rest.notesPreview : undefined;

  return (
    <section className="hyphen-overview" data-testid={testId}>
      {/* ── Stat tile row ─────────────────────────────────────────────── */}
      <div className="hyphen-overview__stat-row">
        <StatTile
          label="Undecided"
          value={String(undecided)}
          tone={undecided > 0 ? 'dirty' : 'neutral'}
        />
        <StatTile
          label="Auto-joined"
          value={String(autoJoined)}
          tone={autoJoined > 0 ? 'clean' : 'neutral'}
        />
        <StatTile
          label="Mismatch"
          value={String(mismatch)}
          tone={mismatch > 0 ? 'dirty' : 'neutral'}
        />
        <StatTile
          label="Flagged"
          value={String(flagged)}
          tone={flagged > 0 ? 'dirty' : 'neutral'}
        />
      </div>

      {/* ── Post-book notes preview (conditional) ─────────────────────── */}
      {notesPreview != null ? <PostBookNotesPreview>{notesPreview}</PostBookNotesPreview> : null}
    </section>
  );
}

HyphenOverview.displayName = 'HyphenOverview';
