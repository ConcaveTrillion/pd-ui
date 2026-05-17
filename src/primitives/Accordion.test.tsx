import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './Accordion.js';

describe('Accordion', () => {
  function renderAccordion() {
    return render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item2">
          <AccordionTrigger>Section 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
  }

  it('renders accordion items with .acc class', () => {
    renderAccordion();
    const items = document.querySelectorAll('.acc');
    expect(items.length).toBeGreaterThan(0);
  });

  it('content is hidden initially', () => {
    renderAccordion();
    // Radix accordion content has data-state=closed when not open
    expect(screen.queryByText('Content 1')).toBeNull();
  });

  it('clicking trigger opens content (Radix behavior)', async () => {
    const user = userEvent.setup();
    renderAccordion();
    await user.click(screen.getByText('Section 1'));
    expect(screen.getByText('Content 1')).toBeTruthy();
  });

  it('clicking open trigger closes content (collapsible)', async () => {
    const user = userEvent.setup();
    renderAccordion();
    await user.click(screen.getByText('Section 1'));
    await user.click(screen.getByText('Section 1'));
    // After second click content should be gone
    expect(screen.queryByText('Content 1')).toBeNull();
  });

  it('AccordionItem has the .acc class', () => {
    renderAccordion();
    // Radix Accordion items render with data-orientation attribute
    const items = document.querySelectorAll('.acc');
    expect(items.length).toBeGreaterThan(0);
    items.forEach(item => {
      expect(item.classList.contains('acc')).toBe(true);
    });
  });
});
