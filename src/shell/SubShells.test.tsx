/**
 * Sub-shell tests — covering #160 (Breadcrumb, TopNav, Drawer, Rail, RightPanel).
 */
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Breadcrumb } from './Breadcrumb.js';
import { TopNav } from './TopNav.js';
import { Drawer } from './Drawer.js';
import { Rail } from './Rail.js';
import { RightPanel } from './RightPanel.js';

describe('Breadcrumb (#160)', () => {
  it('renders children', () => {
    render(<Breadcrumb><span data-testid="crumb">Home</span></Breadcrumb>);
    expect(screen.getByTestId('crumb')).toBeTruthy();
  });

  it('has data-testid="breadcrumb"', () => {
    render(<Breadcrumb><span>crumb</span></Breadcrumb>);
    expect(screen.getByTestId('breadcrumb')).toBeTruthy();
  });
});

describe('TopNav (#160)', () => {
  it('renders children', () => {
    render(<TopNav><span data-testid="nav-item">Nav</span></TopNav>);
    expect(screen.getByTestId('nav-item')).toBeTruthy();
  });

  it('has data-testid="top-nav"', () => {
    render(<TopNav><span>nav</span></TopNav>);
    expect(screen.getByTestId('top-nav')).toBeTruthy();
  });
});

describe('Drawer (#160)', () => {
  it('renders children when open', () => {
    render(<Drawer open><span data-testid="drawer-content">content</span></Drawer>);
    expect(screen.getByTestId('drawer-content')).toBeTruthy();
  });

  it('has data-testid="drawer"', () => {
    render(<Drawer open><span>x</span></Drawer>);
    expect(screen.getByTestId('drawer')).toBeTruthy();
  });

  it('hides children when closed (data-open=false)', () => {
    render(<Drawer open={false}><span data-testid="hidden">hidden</span></Drawer>);
    const drawerEl = screen.getByTestId('drawer');
    expect(drawerEl.getAttribute('data-open')).toBe('false');
    expect(screen.queryByTestId('hidden')).toBeNull();
  });

  it('reflects open state via data-open attribute', () => {
    render(<Drawer open><span>x</span></Drawer>);
    expect(screen.getByTestId('drawer').getAttribute('data-open')).toBe('true');
  });
});

describe('Rail (#160)', () => {
  it('renders children', () => {
    render(<Rail><span data-testid="rail-item">item</span></Rail>);
    expect(screen.getByTestId('rail-item')).toBeTruthy();
  });

  it('has data-testid="rail"', () => {
    render(<Rail><span>x</span></Rail>);
    expect(screen.getByTestId('rail')).toBeTruthy();
  });
});

describe('RightPanel (#160)', () => {
  it('renders children', () => {
    render(<RightPanel><span data-testid="rp-content">rp</span></RightPanel>);
    expect(screen.getByTestId('rp-content')).toBeTruthy();
  });

  it('has data-testid="right-panel"', () => {
    render(<RightPanel><span>x</span></RightPanel>);
    expect(screen.getByTestId('right-panel')).toBeTruthy();
  });
});
