import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ConfigureHeader } from './ConfigureHeader.js';

describe('ConfigureHeader', () => {
  it('renders the title', () => {
    render(<ConfigureHeader title="Configure Stage" />);
    expect(screen.getByText('Configure Stage')).toBeTruthy();
  });

  it('renders breadcrumb items', () => {
    render(
      <ConfigureHeader
        title="Configure Stage"
        trail={[{ label: 'Projects' }, { label: 'my-project', mono: true }]}
      />,
    );
    expect(screen.getByText('Projects')).toBeTruthy();
    expect(screen.getByText('my-project')).toBeTruthy();
  });

  it('renders close button when onClose provided', () => {
    render(<ConfigureHeader title="Configure" onClose={() => {}} />);
    expect(screen.getByRole('button', { name: /close/i })).toBeTruthy();
  });

  it('omits close button when onClose not provided', () => {
    render(<ConfigureHeader title="Configure" />);
    expect(screen.queryByRole('button', { name: /close/i })).toBeNull();
  });

  it('calls onClose when close button clicked', () => {
    const onClose = vi.fn();
    render(<ConfigureHeader title="Configure" onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders with configure-header class', () => {
    const { container } = render(<ConfigureHeader title="Configure" />);
    expect(container.querySelector('.configure-header')).toBeTruthy();
  });

  it('forwards className', () => {
    const { container } = render(<ConfigureHeader title="Configure" className="custom" />);
    expect(container.querySelector('.custom')).toBeTruthy();
  });

  it('renders children slot when provided', () => {
    render(
      <ConfigureHeader title="Configure">
        <button type="button">Action</button>
      </ConfigureHeader>,
    );
    expect(screen.getByRole('button', { name: 'Action' })).toBeTruthy();
  });
});
