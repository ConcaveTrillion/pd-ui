import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from './Button.js';
import { BaseJobConfigDialog } from './BaseJobConfigDialog.js';
import type { BaseJobConfig } from './BaseJobConfigDialog.js';

const meta: Meta<typeof BaseJobConfigDialog> = {
  title: 'Primitives/BaseJobConfigDialog',
  component: BaseJobConfigDialog,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

function DefaultDemo() {
  const [open, setOpen] = useState(false);

  async function handleSubmit(config: BaseJobConfig) {
    await new Promise<void>((resolve) => setTimeout(resolve, 1000));
    alert(`Submitted: ${JSON.stringify(config)}`);
    setOpen(false);
  }

  return (
    <>
      <Button variant="primary" onClick={() => { setOpen(true); }}>
        Open Job Config
      </Button>
      <BaseJobConfigDialog
        open={open}
        title="Start OCR Job"
        description="Configure output settings before running."
        sourcePath="/books/my-scanned-book.pdf"
        onClose={() => { setOpen(false); }}
        onSubmit={handleSubmit}
      />
    </>
  );
}

export const Default: Story = {
  render: () => <DefaultDemo />,
};

function WithErrorDemo() {
  const [open, setOpen] = useState(true);

  async function handleSubmit(): Promise<void> {
    await new Promise<void>((_, reject) =>
      setTimeout(() => { reject(new Error('Backend unreachable — check pd-ocr-ops.')); }, 600),
    );
  }

  return (
    <BaseJobConfigDialog
      open={open}
      title="Start OCR Job"
      sourcePath="/books/war-and-peace.pdf"
      onClose={() => { setOpen(false); }}
      onSubmit={handleSubmit}
      submitLabel="Process"
    />
  );
}

export const WithError: Story = {
  render: () => <WithErrorDemo />,
};

function WithExtraFieldsDemo() {
  const [open, setOpen] = useState(true);

  async function handleSubmit(config: BaseJobConfig) {
    await new Promise<void>((resolve) => setTimeout(resolve, 400));
    alert(JSON.stringify(config));
    setOpen(false);
  }

  return (
    <BaseJobConfigDialog
      open={open}
      title="Advanced OCR Config"
      description="Fill in all fields."
      sourcePath="/books/sample.pdf"
      onClose={() => { setOpen(false); }}
      onSubmit={handleSubmit}
    >
      <div style={{ color: 'var(--ink-3)', fontSize: '11px', fontStyle: 'italic' }}>
        App-specific fields slot (e.g. language selector)
      </div>
    </BaseJobConfigDialog>
  );
}

export const WithExtraFields: Story = {
  render: () => <WithExtraFieldsDemo />,
};
