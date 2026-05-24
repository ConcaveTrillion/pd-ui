import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SettingsNav, PROJECT_SETTINGS_GROUPS } from './SettingsNav.js';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const CUSTOM_GROUPS = [
  { id: 'alpha', name: 'Alpha', icon: 'file' as const },
  { id: 'beta',  name: 'Beta',  icon: 'folder' as const },
  { id: 'gamma', name: 'Gamma', icon: 'trash' as const, danger: true },
];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('SettingsNav', () => {
  it('renders all group names from custom groups', () => {
    render(
      <SettingsNav
        groups={CUSTOM_GROUPS}
        currentGroup="alpha"
        onGroupChange={vi.fn()}
      />,
    );
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.getByText('Gamma')).toBeInTheDocument();
  });

  it('marks the current group with aria-current and active class', () => {
    render(
      <SettingsNav
        groups={CUSTOM_GROUPS}
        currentGroup="beta"
        onGroupChange={vi.fn()}
      />,
    );
    const betaBtn = screen.getByRole('button', { name: /beta/i });
    expect(betaBtn).toHaveAttribute('aria-current', 'page');
    expect(betaBtn).toHaveClass('settings-nav__item--active');
  });

  it('non-current items do not have active class', () => {
    render(
      <SettingsNav
        groups={CUSTOM_GROUPS}
        currentGroup="alpha"
        onGroupChange={vi.fn()}
      />,
    );
    const betaBtn = screen.getByRole('button', { name: /beta/i });
    expect(betaBtn).not.toHaveClass('settings-nav__item--active');
    expect(betaBtn).not.toHaveAttribute('aria-current');
  });

  it('calls onGroupChange with the clicked group id', async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    render(
      <SettingsNav
        groups={CUSTOM_GROUPS}
        currentGroup="alpha"
        onGroupChange={spy}
      />,
    );
    await user.click(screen.getByRole('button', { name: /beta/i }));
    expect(spy).toHaveBeenCalledWith('beta');
  });

  it('applies danger tone class to danger items', () => {
    render(
      <SettingsNav
        groups={CUSTOM_GROUPS}
        currentGroup="alpha"
        onGroupChange={vi.fn()}
      />,
    );
    const gammaBtn = screen.getByRole('button', { name: /gamma/i });
    expect(gammaBtn).toHaveClass('settings-nav__item--danger');
  });

  it('does not apply danger class to non-danger items', () => {
    render(
      <SettingsNav
        groups={CUSTOM_GROUPS}
        currentGroup="alpha"
        onGroupChange={vi.fn()}
      />,
    );
    const alphaBtn = screen.getByRole('button', { name: /alpha/i });
    expect(alphaBtn).not.toHaveClass('settings-nav__item--danger');
  });

  it('renders a nav landmark', () => {
    render(
      <SettingsNav
        groups={CUSTOM_GROUPS}
        currentGroup="alpha"
        onGroupChange={vi.fn()}
      />,
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders all 8 default PROJECT_SETTINGS_GROUPS', () => {
    const spy = vi.fn();
    render(
      <SettingsNav
        groups={PROJECT_SETTINGS_GROUPS}
        currentGroup="general"
        onGroupChange={spy}
      />,
    );
    expect(screen.getByRole('button', { name: /general/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /bibliographic/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /pgdp submission/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /format/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /stage defaults/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /members/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /storage/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /danger zone/i })).toBeInTheDocument();
  });

  it('danger zone group has danger class in default groups', () => {
    render(
      <SettingsNav
        groups={PROJECT_SETTINGS_GROUPS}
        currentGroup="general"
        onGroupChange={vi.fn()}
      />,
    );
    const dangerBtn = screen.getByRole('button', { name: /danger zone/i });
    expect(dangerBtn).toHaveClass('settings-nav__item--danger');
  });

  it('renders an optional label heading when label prop is provided', () => {
    render(
      <SettingsNav
        groups={CUSTOM_GROUPS}
        currentGroup="alpha"
        onGroupChange={vi.fn()}
        label="My settings"
      />,
    );
    expect(screen.getByText('My settings')).toBeInTheDocument();
  });

  it('does not render label element when label prop is absent', () => {
    const { container } = render(
      <SettingsNav
        groups={CUSTOM_GROUPS}
        currentGroup="alpha"
        onGroupChange={vi.fn()}
      />,
    );
    expect(container.querySelector('.settings-nav__label')).toBeNull();
  });
});
