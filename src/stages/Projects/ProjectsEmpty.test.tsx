/**
 * ProjectsEmpty — Vitest tests (TDD).
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ProjectsEmpty } from './ProjectsEmpty.js';
import {
  PROJECTS_EMPTY,
  PROJECTS_EMPTY_PRIMARY_CTA,
  PROJECTS_EMPTY_SECONDARY_CTA,
} from '../../testids/index.js';

describe('ProjectsEmpty', () => {
  it('renders default copy without props', () => {
    render(<ProjectsEmpty />);
    expect(screen.getByText('No projects yet')).toBeInTheDocument();
    expect(
      screen.getByText(/A project bundles a book/),
    ).toBeInTheDocument();
  });

  it('renders with custom title and description', () => {
    render(
      <ProjectsEmpty
        title="Hello world"
        description="Custom description text"
      />,
    );
    expect(screen.getByText('Hello world')).toBeInTheDocument();
    expect(screen.getByText('Custom description text')).toBeInTheDocument();
  });

  it('renders primary CTA with default label', () => {
    render(<ProjectsEmpty />);
    const primary = screen.getByTestId(PROJECTS_EMPTY_PRIMARY_CTA);
    expect(primary).toBeInTheDocument();
    expect(primary).toHaveTextContent('Create new project');
  });

  it('fires primary CTA callback on click', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <ProjectsEmpty
        primaryAction={{ label: 'Create new project', onClick }}
      />,
    );
    await user.click(screen.getByTestId(PROJECTS_EMPTY_PRIMARY_CTA));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('hides secondary CTA when secondaryAction is not provided', () => {
    render(<ProjectsEmpty />);
    expect(
      screen.queryByTestId(PROJECTS_EMPTY_SECONDARY_CTA),
    ).not.toBeInTheDocument();
  });

  it('renders secondary CTA when provided', async () => {
    const user = userEvent.setup();
    const onSecondary = vi.fn();
    render(
      <ProjectsEmpty
        secondaryAction={{ label: 'Paste source URL', onClick: onSecondary }}
      />,
    );
    const secondary = screen.getByTestId(PROJECTS_EMPTY_SECONDARY_CTA);
    expect(secondary).toBeInTheDocument();
    await user.click(secondary);
    expect(onSecondary).toHaveBeenCalledTimes(1);
  });

  it('has correct testids on root and primary CTA', () => {
    render(<ProjectsEmpty />);
    expect(screen.getByTestId(PROJECTS_EMPTY)).toBeInTheDocument();
    expect(screen.getByTestId(PROJECTS_EMPTY_PRIMARY_CTA)).toBeInTheDocument();
  });
});
