/**
 * ModalC stories — Upload stage desktop 4-step right-side sheet.
 *
 * Each story is interactive (controlled by useState) and opens with the sheet
 * already visible so the reviewer can inspect the rail + step content.
 */

import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { ModalC } from './ModalC.js';
import type { UploadStep } from './ModalC.js';

const meta: Meta<typeof ModalC> = {
  title: 'Stages/Upload/ModalC',
  component: ModalC,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ModalC>;

// ─── Shared step content ──────────────────────────────────────────────────────

const NameContent = () => (
  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div>
      <label
        htmlFor="project-name"
        style={{
          display: 'block',
          fontSize: 12.5,
          fontWeight: 500,
          color: 'var(--ink-2)',
          marginBottom: 6,
        }}
      >
        Project name
      </label>
      <input
        id="project-name"
        type="text"
        defaultValue="belloc-survivals"
        style={{
          width: '100%',
          padding: '8px 12px',
          fontSize: 13,
          fontFamily: 'var(--mono-font)',
          background: 'var(--bg-page)',
          border: '1px solid var(--border-1)',
          borderRadius: 6,
          color: 'var(--ink-1)',
          boxSizing: 'border-box',
        }}
      />
    </div>
    <p style={{ fontSize: 12, color: 'var(--ink-3)', margin: 0, lineHeight: 1.6 }}>
      Choose a short, unique slug for this project. It will be used as the folder name and project
      identifier throughout the pipeline.
    </p>
  </div>
);

const SourceContent = () => (
  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
    <p style={{ margin: 0, fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.6 }}>
      Choose a source for this project. You can upload a ZIP archive, a folder of images, or provide
      an Internet Archive URL.
    </p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {['Zip archive', 'Folder of images', 'Internet Archive URL'].map((label) => (
        <div
          key={label}
          style={{
            padding: '12px 14px',
            borderRadius: 8,
            border: '1px solid var(--border-1)',
            background: 'var(--bg-surface)',
            fontSize: 13,
            color: 'var(--ink-1)',
            cursor: 'pointer',
          }}
        >
          {label}
        </div>
      ))}
    </div>
  </div>
);

const ReviewContent = () => (
  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
      {[
        { label: 'Files', value: '387', sub: 'ready' },
        { label: 'Size', value: '2.1 GB', sub: 'raw / 210 MB zipped' },
        { label: 'JP2', value: '380', sub: 'primary' },
        { label: 'Skipped', value: '3', sub: '.txt · .xml' },
      ].map(({ label, value, sub }) => (
        <div
          key={label}
          style={{
            borderRadius: 10,
            border: '1px solid var(--border-1)',
            padding: '12px 14px',
            background: 'var(--bg-surface)',
          }}
        >
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--ink-4)',
            }}
          >
            {label}
          </div>
          <div
            style={{
              marginTop: 6,
              fontSize: 22,
              fontWeight: 600,
              fontFamily: 'var(--mono-font)',
              color: 'var(--ink-1)',
            }}
          >
            {value}
          </div>
          <div style={{ marginTop: 2, fontSize: 11, color: 'var(--ink-3)' }}>{sub}</div>
        </div>
      ))}
    </div>
    <div style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.6 }}>
      Review the detected files before starting the upload. 3 warnings found.
    </div>
  </div>
);

const UploadContent = () => (
  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
    <div
      style={{
        borderRadius: 10,
        border: '1px solid var(--border-1)',
        background: 'var(--bg-page)',
        padding: '18px 18px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 99,
              background: 'var(--ocr, var(--accent))',
            }}
          />
          <span style={{ fontSize: 13, fontWeight: 600 }}>Transferring…</span>
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--mono-font)' }}>71%</span>
      </div>
      <div
        style={{
          height: 6,
          borderRadius: 99,
          background: 'var(--bg-raised)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{ height: '100%', width: '71%', background: 'var(--accent)', borderRadius: 99 }}
        />
      </div>
      <div
        style={{
          fontSize: 11,
          color: 'var(--ink-3)',
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: 'var(--mono-font)',
        }}
      >
        <span>1.49 GB / 2.10 GB</span>
        <span>12.4 MB/s · 49s remaining</span>
      </div>
    </div>
    <p style={{ fontSize: 11.5, color: 'var(--ink-3)', margin: 0, lineHeight: 1.6 }}>
      You can leave this tab — we&apos;ll resume from where it left off if you close it.
    </p>
  </div>
);

// ─── Story factory ────────────────────────────────────────────────────────────

const STEP_CONTENT: Record<UploadStep, React.ReactNode> = {
  name: <NameContent />,
  source: <SourceContent />,
  review: <ReviewContent />,
  upload: <UploadContent />,
};

const InteractiveSheet = ({ initialStep }: { initialStep: UploadStep }) => {
  const [open, setOpen] = React.useState(true);
  const [step, setStep] = React.useState<UploadStep>(initialStep);

  return (
    <div style={{ position: 'relative', height: '100vh', background: 'var(--bg-page)' }}>
      {!open && (
        <button
          type="button"
          onClick={() => {
            setOpen(true);
          }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '10px 20px',
            background: 'var(--accent)',
            color: 'var(--accent-ink)',
            border: 'none',
            borderRadius: 6,
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          Open Upload Sheet
        </button>
      )}
      <ModalC
        open={open}
        onOpenChange={setOpen}
        step={step}
        onStepChange={setStep}
        stepContent={STEP_CONTENT}
      />
    </div>
  );
};

// ─── Named stories ────────────────────────────────────────────────────────────

export const NameStep: Story = {
  name: 'Name step — project naming',
  render: () => <InteractiveSheet initialStep="name" />,
};

export const SourceStep: Story = {
  name: 'Source step — choose source',
  render: () => <InteractiveSheet initialStep="source" />,
};

export const ReviewStep: Story = {
  name: 'Review step — review files (past: Name, Source)',
  render: () => <InteractiveSheet initialStep="review" />,
};

export const UploadStepStory: Story = {
  name: 'Upload step — upload in progress (past: all prior steps)',
  render: () => <InteractiveSheet initialStep="upload" />,
};
