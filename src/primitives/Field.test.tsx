import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { Field } from './Field.js';
import { FieldRow } from './FieldRow.js';
import { Input } from './Input.js';

describe('Field', () => {
  it('renders a div with .field class', () => {
    render(<Field data-testid="f" />);
    const el = screen.getByTestId('f');
    expect(el.tagName).toBe('DIV');
    expect(el.classList.contains('field')).toBe(true);
  });

  it('renders label element when label prop is set', () => {
    render(
      <Field label="Name" htmlFor="name-input">
        <Input id="name-input" data-testid="inp" />
      </Field>,
    );
    const label = screen.getByText('Name');
    expect(label.tagName).toBe('LABEL');
  });

  it('associates label with input via htmlFor/id', () => {
    render(
      <Field label="Email" htmlFor="email">
        <Input id="email" data-testid="inp" />
      </Field>,
    );
    const label = screen.getByText('Email');
    expect(label.getAttribute('for')).toBe('email');
    // @testing-library: getByLabelText should find the input
    const input = screen.getByLabelText('Email');
    expect(input.id).toBe('email');
  });

  it('renders error slot with role=alert when error prop is set', () => {
    render(<Field label="Age" htmlFor="age" error="Age is required" data-testid="f" />);
    const error = screen.getByRole('alert');
    expect(error.textContent).toBe('Age is required');
    expect(error.classList.contains('field-error')).toBe(true);
  });

  it('does NOT render error slot when error prop is not set', () => {
    render(<Field label="Name" htmlFor="name" data-testid="f" />);
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('does NOT render error slot when error is empty string', () => {
    render(<Field label="Name" htmlFor="name" error="" data-testid="f" />);
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('does NOT render label when label prop not provided', () => {
    render(<Field data-testid="f"><Input id="x" /></Field>);
    // The only element in the field should be the input, no label element
    const field = screen.getByTestId('f');
    expect(field.querySelector('label')).toBeNull();
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Field ref={ref} />);
    expect(ref.current?.classList.contains('field')).toBe(true);
  });

  it('merges custom className', () => {
    render(<Field className="extra" data-testid="f" />);
    const el = screen.getByTestId('f');
    expect(el.classList.contains('field')).toBe(true);
    expect(el.classList.contains('extra')).toBe(true);
  });
});

describe('FieldRow', () => {
  it('renders a div with .field-row class', () => {
    render(<FieldRow data-testid="fr" />);
    const el = screen.getByTestId('fr');
    expect(el.tagName).toBe('DIV');
    expect(el.classList.contains('field-row')).toBe(true);
  });

  it('renders children', () => {
    render(
      <FieldRow>
        <Field label="First" htmlFor="first" />
        <Field label="Last" htmlFor="last" />
      </FieldRow>,
    );
    expect(screen.getByText('First')).toBeTruthy();
    expect(screen.getByText('Last')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<FieldRow ref={ref} />);
    expect(ref.current?.classList.contains('field-row')).toBe(true);
  });
});
