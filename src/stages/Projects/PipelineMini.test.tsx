import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PipelineMini } from './PipelineMini.js';
import {
  PROJECTS_PIPELINE_MINI,
  projectsPipelineMiniDotTestId,
} from '../../testids/index.js';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const make23Stages = () =>
  Array.from({ length: 23 }, (_, i) => ({
    id: `stage-${i}`,
    label: `Stage ${i + 1}`,
    status: 'pending' as const,
  }));

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('PipelineMini', () => {
  describe('dot count', () => {
    it('renders 23 dots for 23 stages', () => {
      render(<PipelineMini stages={make23Stages()} />);
      const dots = screen.getAllByRole('img');
      expect(dots).toHaveLength(23);
    });

    it('renders 0 dots for an empty stages array', () => {
      render(<PipelineMini stages={[]} />);
      expect(screen.queryAllByRole('img')).toHaveLength(0);
    });

    it('renders 5 dots for 5 stages', () => {
      const stages = Array.from({ length: 5 }, (_, i) => ({
        id: `s-${i}`,
        label: `S${i}`,
      }));
      render(<PipelineMini stages={stages} />);
      expect(screen.getAllByRole('img')).toHaveLength(5);
    });
  });

  describe('activeStageId', () => {
    it('marks the active dot with data-active', () => {
      const stages = make23Stages();
      render(<PipelineMini stages={stages} activeStageId="stage-5" />);
      const activeDot = screen.getByTestId(
        projectsPipelineMiniDotTestId('stage-5'),
      );
      expect(activeDot).toHaveAttribute('data-active', 'true');
    });

    it('marks status=active dot when activeStageId not provided', () => {
      const stages = make23Stages().map((s, i) =>
        i === 10 ? { ...s, status: 'active' as const } : s,
      );
      render(<PipelineMini stages={stages} />);
      const activeDot = screen.getByTestId(
        projectsPipelineMiniDotTestId('stage-10'),
      );
      expect(activeDot).toHaveAttribute('data-active', 'true');
    });

    it('activeStageId overrides status=active', () => {
      const stages = make23Stages().map((s, i) =>
        i === 3 ? { ...s, status: 'active' as const } : s,
      );
      // activeStageId overrides — stage-7 is active, not stage-3
      render(<PipelineMini stages={stages} activeStageId="stage-7" />);
      const overriddenDot = screen.getByTestId(
        projectsPipelineMiniDotTestId('stage-3'),
      );
      const activeDot = screen.getByTestId(
        projectsPipelineMiniDotTestId('stage-7'),
      );
      expect(overriddenDot).not.toHaveAttribute('data-active', 'true');
      expect(activeDot).toHaveAttribute('data-active', 'true');
    });
  });

  describe('aria-labels', () => {
    it('includes label and status in aria-label', () => {
      const stages = [{ id: 'ocr', label: 'OCR', status: 'done' as const }];
      render(<PipelineMini stages={stages} />);
      const dot = screen.getByRole('img', { name: /OCR.*done/i });
      expect(dot).toBeInTheDocument();
    });

    it('uses id as fallback label when label is absent', () => {
      const stages = [{ id: 'crop', status: 'pending' as const }];
      render(<PipelineMini stages={stages} />);
      const dot = screen.getByRole('img', { name: /crop.*pending/i });
      expect(dot).toBeInTheDocument();
    });

    it('labels the active dot as active', () => {
      const stages = [{ id: 'ocr', label: 'OCR' }];
      render(<PipelineMini stages={stages} activeStageId="ocr" />);
      const dot = screen.getByRole('img', { name: /OCR.*active/i });
      expect(dot).toBeInTheDocument();
    });
  });

  describe('testids', () => {
    it('renders container with PROJECTS_PIPELINE_MINI testid', () => {
      render(<PipelineMini stages={make23Stages()} />);
      expect(screen.getByTestId(PROJECTS_PIPELINE_MINI)).toBeInTheDocument();
    });

    it('each dot has projectsPipelineMiniDotTestId', () => {
      const stages = make23Stages();
      render(<PipelineMini stages={stages} />);
      for (const s of stages) {
        expect(
          screen.getByTestId(projectsPipelineMiniDotTestId(s.id)),
        ).toBeInTheDocument();
      }
    });

    it('accepts custom data-testid on container', () => {
      render(
        <PipelineMini stages={make23Stages()} data-testid="custom-mini" />,
      );
      expect(screen.getByTestId('custom-mini')).toBeInTheDocument();
    });
  });

  describe('status data attributes', () => {
    it('each dot carries data-status', () => {
      const stages = [
        { id: 'a', status: 'done' as const },
        { id: 'b', status: 'active' as const },
        { id: 'c', status: 'skipped' as const },
      ];
      render(<PipelineMini stages={stages} />);
      expect(screen.getByTestId(projectsPipelineMiniDotTestId('a'))).toHaveAttribute(
        'data-status',
        'done',
      );
      expect(screen.getByTestId(projectsPipelineMiniDotTestId('b'))).toHaveAttribute(
        'data-status',
        'active',
      );
      expect(screen.getByTestId(projectsPipelineMiniDotTestId('c'))).toHaveAttribute(
        'data-status',
        'skipped',
      );
    });
  });
});
