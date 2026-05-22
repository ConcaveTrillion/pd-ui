/**
 * @concavetrillion/pd-ui — root barrel
 *
 * Re-exports all subpath APIs at a single ambient surface.
 * Apps may import from subpaths for tree-shaking, or from the root for convenience.
 *
 * Subpaths:
 *   ./canvas      — PageImageCanvas + slot helpers + canvas hooks
 *   ./worklist    — WordList / LineList / PageList + hooks
 *   ./shell       — AppShell + sub-shells + launcher + context hooks
 *   ./primitives  — design-system primitive wrappers
 *   ./icons       — curated lucide-react re-exports + bespoke SVGs
 *   ./types       — generated TS types + *Like reductions
 *   ./stores      — Zustand store factories + context-bound hooks
 *   ./testids     — data-testid constants catalog
 *   ./theme/tokens.css      — dark/light CSS custom properties
 *   ./theme/primitives.css  — component-level CSS classes
 */

// ─── Canvas ───────────────────────────────────────────────────────────────────
export {
  PageImageCanvas,
  BBoxLayer,
  WordHitLayer,
  MarqueeSelectLayer,
  useCanvasCoords,
  useCanvasSelection,
  bboxToRect,
} from './canvas/index.js';
export type {
  CanvasProps,
  CanvasWord,
  CanvasPage,
  CanvasRect,
  CoordContext,
  SelectionState as CanvasSelectionState,
  ViewportState as CanvasViewportState,
  SlotRenderProps,
  WordSlotProps,
  PageBBox,
  PagePoint,
} from './canvas/index.js';

// ─── Worklist ─────────────────────────────────────────────────────────────────
export {
  WordList,
  LineList,
  PageList,
  StatusPip,
  ConfidenceBar,
  MatchStatusChip,
  useWorklistFilter,
  useWorklistSort,
} from './worklist/index.js';
export type {
  WordListProps,
  LineListProps,
  PageListProps,
  WorklistFilterOptions,
  WorklistSortKey,
} from './worklist/index.js';

// ─── Shell ────────────────────────────────────────────────────────────────────
export {
  AppShell,
  useAppShell,
  LauncherSlot,
  LauncherTile,
  SuiteSiblingsContext,
  Breadcrumb,
  TopNav,
  Drawer,
  Rail,
  RightPanel,
  createApiUIPrefsConfig,
  createApiSuiteSiblingsConfig,
} from './shell/index.js';
export type {
  AppShellProps,
  AppShellContextValue,
  NavItem,
  UIPrefsConfig,
  UIPrefs,
  SuiteApp,
  InstalledApp,
  LaunchResult,
  LauncherTileProps,
  BreadcrumbProps,
  TopNavProps,
  DrawerProps,
  RailProps,
  RightPanelProps,
  SuiteSiblingsContextValue,
  ApiSuiteSiblingsOptions,
} from './shell/index.js';

// ─── Stores ───────────────────────────────────────────────────────────────────
export {
  createSelectionStore,
  createViewportStore,
  createWorklistStore,
  createUIPrefsStore,
  SelectionStoreProvider,
  ViewportStoreProvider,
  WorklistStoreProvider,
  UIPrefsStoreProvider,
  useSelection,
  useViewport,
  useWorklist,
  useUIPrefs,
  useTheme,
  useDensity,
  useLayerColor,
  useStatusColor,
  useAccentColor,
  useSuiteSiblings,
  useStageCall,
  useLongJob,
} from './stores/index.js';
export type {
  SelectionState,
  SelectionStore,
  ViewportState,
  ViewportStore,
  WorklistStoreState,
  WorklistStore,
  UIPrefsStoreState,
  UIPrefsStore,
  StageCallState,
  StageCallStatus,
  UseStageCallOptions,
  LongJobState,
  LongJobStatus,
  LongJobEvent,
  UseLongJobOptions,
} from './stores/index.js';

// ─── Primitives ───────────────────────────────────────────────────────────────
export {
  Button,
  Input,
  Textarea,
  Badge,
  Chip,
  StatusPip as PrimitivesStatusPip,
  KeyCap,
  Card,
  Separator,
  Progress,
  Accordion,
  FieldRow,
  cn,
  Dialog,
  AlertDialog,
  Popover,
  Tooltip,
  DropdownMenu,
  Select,
  Tabs,
  ToggleGroup,
} from './primitives/index.js';

// ─── Icons ────────────────────────────────────────────────────────────────────
export * from './icons/index.js';

// ─── Types ────────────────────────────────────────────────────────────────────
export * from './types/index.js';
