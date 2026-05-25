import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ColorField } from './ColorField.js';

const meta: Meta<typeof ColorField> = {
  title: 'Primitives/ColorField',
  component: ColorField,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    value: { control: 'color' },
    defaultValue: { control: 'color' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function DefaultDemo() {
  const [value, setValue] = React.useState('#3b82f6');
  return <ColorField id="accent-color" label="Accent color" value={value} onChange={setValue} />;
}

export const Default: Story = {
  render: () => <DefaultDemo />,
};

function WithResetDemo() {
  const [value, setValue] = React.useState('#ff6600');
  return (
    <ColorField
      id="accent-override"
      label="Accent override"
      value={value}
      onChange={setValue}
      defaultValue="#3b82f6"
    />
  );
}

export const WithReset: Story = {
  render: () => <WithResetDemo />,
};

function AtDefaultDemo() {
  const [value, setValue] = React.useState('#3b82f6');
  return (
    <ColorField
      id="accent-at-default"
      label="Accent (at default — no reset shown)"
      value={value}
      onChange={setValue}
      defaultValue="#3b82f6"
    />
  );
}

export const AtDefault: Story = {
  render: () => <AtDefaultDemo />,
};

function LayerColorsDemo() {
  const [block, setBlock] = React.useState('#6366f1');
  const [para, setPara] = React.useState('#22c55e');
  const [line, setLine] = React.useState('#f59e0b');
  const [word, setWord] = React.useState('#ec4899');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '280px' }}>
      <ColorField
        id="block"
        label="Block layer"
        value={block}
        onChange={setBlock}
        defaultValue="#6366f1"
      />
      <ColorField
        id="para"
        label="Paragraph layer"
        value={para}
        onChange={setPara}
        defaultValue="#22c55e"
      />
      <ColorField
        id="line"
        label="Line layer"
        value={line}
        onChange={setLine}
        defaultValue="#f59e0b"
      />
      <ColorField
        id="word"
        label="Word layer"
        value={word}
        onChange={setWord}
        defaultValue="#ec4899"
      />
    </div>
  );
}

export const LayerColors: Story = {
  render: () => <LayerColorsDemo />,
};
