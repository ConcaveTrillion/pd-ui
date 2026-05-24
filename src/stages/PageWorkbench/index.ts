/**
 * PageWorkbench stage barrel.
 *
 * Public exports from this subpath:
 *   - ArtifactViewer (composition molecule + types)
 *   - SplitOverlay, SplitHandle (tool slot + DOM sidecar)
 *   - IllustOverlay
 *   - WordBboxOverlay
 *   - RotateHandle
 *   - Types: OverlayMode, SplitProposal, IllustBbox, WordBbox, ArtifactViewerProps
 *
 * Internal sub-components (ArtifactPlate, PaperRender) are NOT exported.
 */

export { ArtifactViewer } from './ArtifactViewer.js'
export type {
  ArtifactViewerProps,
  OverlayMode,
  SplitProposal,
  IllustBbox,
  WordBbox,
} from './ArtifactViewer.js'

export { SplitOverlay, SplitHandle } from './SplitOverlay.js'
export type { SplitOverlayProps, SplitHandleProps } from './SplitOverlay.js'

export { IllustOverlay } from './IllustOverlay.js'
export type { IllustOverlayProps } from './IllustOverlay.js'

export { WordBboxOverlay } from './WordBboxOverlay.js'
export type { WordBboxOverlayProps } from './WordBboxOverlay.js'

export { RotateHandle } from './RotateHandle.js'
export type { RotateHandleProps } from './RotateHandle.js'

export { EditModeSelector } from './EditModeSelector.js'
export type { EditModeSelectorProps, EditMode } from './EditModeSelector.js'
export { StageControlsPanel } from './StageControlsPanel.js'
export type { StageControlsPanelProps, Inheritance } from './StageControlsPanel.js'
export { TextReviewPane } from './TextReviewPane.js'
export type { TextReviewPaneProps } from './TextReviewPane.js'
export { PageAttributesBar } from './PageAttributesBar.js'
export type { PageAttributesBarProps, PageAttribute } from './PageAttributesBar.js'
// AttrEditorPopover is intentionally NOT exported — internal sub-component.
export { PWHeader } from './PWHeader.js'
export type { PWHeaderProps } from './PWHeader.js'

export { HierarchyTreePanel } from './HierarchyTreePanel.js'
export type {
  HierarchyTreePanelProps,
  TreeNode,
  TreeNodeType,
} from './HierarchyTreePanel.js'
// TreeRow is intentionally NOT exported — internal sub-component of HierarchyTreePanel.

export { BlockTypePickerPanel } from './BlockTypePickerPanel.js'
export type { BlockTypePickerPanelProps, BlockTypeOption } from './BlockTypePickerPanel.js'
// TypeGrid is intentionally NOT exported — internal sub-component.
