import * as React from 'react';

export interface PageSplitViewProps {
  toolbar: React.ReactNode;
  canvas: React.ReactNode;
  editor: React.ReactNode;
}

export function PageSplitView({ toolbar, canvas, editor }: PageSplitViewProps) {
  return (
    <div data-testid="page-split-view" className="page-split-view">
      <div className="page-split-view__toolbar" role="toolbar">
        {toolbar}
      </div>
      <div className="page-split-view__panels">
        <div className="page-split-view__canvas-panel">{canvas}</div>
        <div className="page-split-view__editor-panel">{editor}</div>
      </div>
    </div>
  );
}

PageSplitView.displayName = 'PageSplitView';
