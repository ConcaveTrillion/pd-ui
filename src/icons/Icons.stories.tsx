import type { Meta, StoryObj } from '@storybook/react';
import {
  Check,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Search,
  Settings,
  Menu,
  MoreHorizontal,
  MoreVertical,
  Plus,
  Minus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Info,
  LayerBlock,
  LayerPara,
  LayerLine,
  LayerWord,
  ModeSelect,
  ModeRebox,
  ModeErase,
  ModeCharFixer,
  MatchStatusExact,
  MatchStatusFuzzy,
  MatchStatusMismatch,
} from './index.js';

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Icons/Catalogue',
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ── Icon grid helper ──────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyIconComponent = React.ComponentType<any>;

function IconGrid({ title, icons }: {
  title: string;
  icons: { name: string; Icon: AnyIconComponent }[];
}) {
  return (
    <div style={{ marginBottom: '32px' }}>
      <h3 style={{ color: 'var(--ink-1)', fontSize: 'var(--text-sm)', marginBottom: '12px' }}>
        {title}
      </h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
          gap: '12px',
        }}
      >
        {icons.map(({ name, Icon }) => (
          <div
            key={name}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              padding: '12px 8px',
              background: 'var(--bg-raised)',
              borderRadius: '6px',
            }}
          >
            <Icon size={24} color="var(--ink-1)" />
            <span style={{ fontSize: '10px', color: 'var(--ink-3)', textAlign: 'center' }}>
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Stories ───────────────────────────────────────────────────────────────────

const LUCIDE_ICONS = [
  { name: 'Check', Icon: Check },
  { name: 'X', Icon: X },
  { name: 'ChevronDown', Icon: ChevronDown },
  { name: 'ChevronUp', Icon: ChevronUp },
  { name: 'ChevronLeft', Icon: ChevronLeft },
  { name: 'ChevronRight', Icon: ChevronRight },
  { name: 'Search', Icon: Search },
  { name: 'Settings', Icon: Settings },
  { name: 'Menu', Icon: Menu },
  { name: 'MoreHorizontal', Icon: MoreHorizontal },
  { name: 'MoreVertical', Icon: MoreVertical },
  { name: 'Plus', Icon: Plus },
  { name: 'Minus', Icon: Minus },
  { name: 'Edit', Icon: Edit },
  { name: 'Trash2', Icon: Trash2 },
  { name: 'Eye', Icon: Eye },
  { name: 'EyeOff', Icon: EyeOff },
  { name: 'Loader2', Icon: Loader2 },
  { name: 'AlertCircle', Icon: AlertCircle },
  { name: 'Info', Icon: Info },
];

const BESPOKE_ICONS = [
  { name: 'LayerBlock', Icon: LayerBlock },
  { name: 'LayerPara', Icon: LayerPara },
  { name: 'LayerLine', Icon: LayerLine },
  { name: 'LayerWord', Icon: LayerWord },
  { name: 'ModeSelect', Icon: ModeSelect },
  { name: 'ModeRebox', Icon: ModeRebox },
  { name: 'ModeErase', Icon: ModeErase },
  { name: 'ModeCharFixer', Icon: ModeCharFixer },
  { name: 'MatchStatusExact', Icon: MatchStatusExact },
  { name: 'MatchStatusFuzzy', Icon: MatchStatusFuzzy },
  { name: 'MatchStatusMismatch', Icon: MatchStatusMismatch },
];

/** Full catalogue of all curated lucide icons and bespoke OCR-domain icons. */
export const AllIcons: Story = {
  render: () => (
    <div>
      <IconGrid title="Lucide icons (curated subset)" icons={LUCIDE_ICONS} />
      <IconGrid title="Bespoke OCR-domain icons (stubs)" icons={BESPOKE_ICONS} />
    </div>
  ),
};

/** Size variations for a sample icon. */
export const SizeVariations: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
      <div style={{ textAlign: 'center' }}>
        <Settings size={16} color="var(--ink-1)" />
        <div style={{ fontSize: '11px', color: 'var(--ink-3)', marginTop: '4px' }}>16px</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Settings size={24} color="var(--ink-1)" />
        <div style={{ fontSize: '11px', color: 'var(--ink-3)', marginTop: '4px' }}>24px</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Settings size={32} color="var(--ink-1)" />
        <div style={{ fontSize: '11px', color: 'var(--ink-3)', marginTop: '4px' }}>32px</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Settings size={48} color="var(--ink-1)" />
        <div style={{ fontSize: '11px', color: 'var(--ink-3)', marginTop: '4px' }}>48px</div>
      </div>
    </div>
  ),
};
