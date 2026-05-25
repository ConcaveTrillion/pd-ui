/**
 * ThumbCard Storybook stories.
 *
 * Covers:
 *   1. Default — medium density, page role, ok status
 *   2. Small — small density (no checkbox visible)
 *   3. Large — large density (with checkbox)
 *   4. Selected — card in selected state
 *   5. EachRole — one card per role variant
 *   6. EachStatus — one card per status variant
 */

import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ThumbCard } from './ThumbCard.js';
import type { SourcePage, SourcePageRole, SourcePageStatus, ThumbDensity } from './ThumbCard.js';

// ─── Fixture ──────────────────────────────────────────────────────────────────

// 1×1 grey PNG placeholder for thumbnail
const THUMB_PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQI12NgAAIABQAABjE+ibYAAAAASUVORK5CYII=';

const makePage = (
  overrides: Partial<SourcePage> = {},
): SourcePage => ({
  id: 'p1',
  pageNumber: 1,
  thumbnailUrl: THUMB_PNG,
  status: 'ok',
  role: 'page',
  ...overrides,
});

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof ThumbCard> = {
  title: 'Stages/Source/ThumbCard',
  component: ThumbCard,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof ThumbCard>;

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    page: makePage(),
    density: 'm',
    selected: false,
  },
};

export const Small: Story = {
  name: 'Small (no checkbox)',
  args: {
    page: makePage({ pageNumber: 3 }),
    density: 's',
    selected: false,
  },
};

export const Large: Story = {
  name: 'Large (with checkbox)',
  args: {
    page: makePage({ pageNumber: 5, role: 'cover' }),
    density: 'l',
    selected: false,
  },
};

export const Selected: Story = {
  args: {
    page: makePage({ pageNumber: 7, role: 'page' }),
    density: 'm',
    selected: true,
  },
};

const ALL_ROLES: SourcePageRole[] = [
  'page',
  'cover',
  'back',
  'blank',
  'duplicate',
  'removed',
];

export function EachRole() {
  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      {ALL_ROLES.map((role, i) => (
        <ThumbCard
          key={role}
          page={makePage({ id: `role-${role}`, pageNumber: i + 1, role })}
          density="m"
          selected={false}
        />
      ))}
    </div>
  );
}
EachRole.storyName = 'Each Role';

const ALL_STATUSES: SourcePageStatus[] = ['ok', 'warn', 'error', 'pending'];

export function EachStatus() {
  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      {ALL_STATUSES.map((status, i) => (
        <ThumbCard
          key={status}
          page={makePage({ id: `status-${status}`, pageNumber: i + 1, status })}
          density="m"
          selected={false}
        />
      ))}
    </div>
  );
}
EachStatus.storyName = 'Each Status';

export function Interactive() {
  const [selected, setSelected] = useState(false);
  const [role, setRole] = useState<SourcePageRole>('page');
  const [density, setDensity] = useState<ThumbDensity>('m');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {(['s', 'm', 'l'] as ThumbDensity[]).map((d) => (
          <button
            key={d}
            onClick={() => setDensity(d)}
            style={{ fontWeight: density === d ? 'bold' : 'normal' }}
          >
            {d.toUpperCase()}
          </button>
        ))}
      </div>
      <ThumbCard
        page={makePage({ id: 'interactive', role })}
        density={density}
        selected={selected}
        onSelect={() => setSelected((s) => !s)}
        onRoleChange={(_id, newRole) => setRole(newRole)}
      />
      <div style={{ fontSize: '0.8rem', color: 'var(--ink-2, #888)' }}>
        selected: {String(selected)} | role: {role} | density: {density}
      </div>
    </div>
  );
}
Interactive.storyName = 'Interactive';
