/**
 * Testid constants catalog.
 *
 * These are the stable identifiers Playwright drivers depend on.
 * Renaming any id here is a breaking change to every consumer driver.
 */

// ─── AppShell ─────────────────────────────────────────────────────────────────

export const APP_SHELL = 'app-shell' as const;
export const APP_SHELL_HEADER = 'app-shell-header' as const;
export const APP_SHELL_RAIL = 'app-shell-rail' as const;
export const APP_SHELL_DRAWER = 'app-shell-drawer' as const;
export const APP_SHELL_MAIN = 'app-shell-main' as const;
export const APP_SHELL_RIGHT = 'app-shell-right' as const;
export const APP_SHELL_FOOTER = 'app-shell-footer' as const;

// ─── SettingsSlot / SettingsModal ─────────────────────────────────────────────

export const SETTINGS_SLOT_TRIGGER = 'settings-slot-trigger' as const;

export const SETTINGS_MODAL = 'settings-modal' as const;
export const SETTINGS_MODAL_CLOSE = 'settings-modal-close' as const;

/** Tab for a specific panel id: `settings-modal-tab-${id}` */
export const settingsModalTab = (id: string) => `settings-modal-tab-${id}` as const;
/** Panel content wrapper for a specific panel id: `settings-modal-panel-${id}` */
export const settingsModalPanel = (id: string) => `settings-modal-panel-${id}` as const;

// ─── AppearancePanel ──────────────────────────────────────────────────────────

export const SETTINGS_APPEARANCE_THEME_DARK = 'settings-appearance-theme-dark' as const;
export const SETTINGS_APPEARANCE_THEME_LIGHT = 'settings-appearance-theme-light' as const;
export const SETTINGS_APPEARANCE_DENSITY_COMPACT = 'settings-appearance-density-compact' as const;
export const SETTINGS_APPEARANCE_DENSITY_NORMAL = 'settings-appearance-density-normal' as const;
export const SETTINGS_APPEARANCE_DENSITY_COMFORTABLE = 'settings-appearance-density-comfortable' as const;
export const SETTINGS_APPEARANCE_FONT_SCALE_SLIDER = 'settings-appearance-font-scale-slider' as const;

/** Color input for a given key: `settings-appearance-color-${key}` */
export const settingsAppearanceColor = (key: string) => `settings-appearance-color-${key}` as const;
/** Reset button for a given color key: `settings-appearance-color-${key}-reset` */
export const settingsAppearanceColorReset = (key: string) => `settings-appearance-color-${key}-reset` as const;

// ─── JobRow ───────────────────────────────────────────────────────────────────

export const JOB_ROW = 'job-row' as const;
export const JOB_ROW_STATUS_FAILED = 'job-row-status-failed' as const;

// ─── PipelineTemplate (#345) ──────────────────────────────────────────────────

export const PIPELINE_TEMPLATE = 'pipeline-template' as const;
export const PIPELINE_BREADCRUMB = 'pipeline-breadcrumb' as const;
export const PIPELINE_CONTROLS = 'pipeline-controls' as const;
export const PIPELINE_PROJECT_INFO = 'pipeline-project-info' as const;
export const PIPELINE_STAGE_STRIP = 'pipeline-stage-strip' as const;
export const PIPELINE_TABS = 'pipeline-tabs' as const;
export const PIPELINE_BODY = 'pipeline-body' as const;
export const PIPELINE_EMPTY_SLOT = 'pipeline-empty-slot' as const;
export const COVER_PLACEHOLDER = 'cover-placeholder' as const;

// ─── ProjectInfoBand ──────────────────────────────────────────────────────────

export const PROJECT_INFO_BAND = 'project-info-band' as const;
export const PROJECT_INFO_BAND_TITLE = 'project-info-band-title' as const;
export const PROJECT_INFO_BAND_META = 'project-info-band-meta' as const;
export const PROJECT_INFO_BAND_SETTINGS_BTN = 'project-info-band-settings-btn' as const;

// ─── ProjectSettingsTemplate ──────────────────────────────────────────────────

export const PROJECT_SETTINGS_TEMPLATE = 'project-settings-template' as const;
export const PROJECT_SETTINGS_NAV = 'project-settings-nav' as const;
export const PROJECT_SETTINGS_CONTENT = 'project-settings-content' as const;
/** Nav item for a given group id: `project-settings-nav-item-${id}` */
export const projectSettingsNavItem = (id: string) => `project-settings-nav-item-${id}` as const;

// ─── ProjectsLandingTemplate (#346) ──────────────────────────────────────────

export const PROJECTS_LANDING = 'projects-landing' as const;
export const PROJECTS_DETAIL = 'projects-detail' as const;
export const PROJECTS_OPEN_BTN = 'projects-open-btn' as const;
export const PROJECTS_STATS_GRID = 'projects-stats-grid' as const;
export const PROJECTS_PIPELINE = 'projects-pipeline' as const;
export const PROJECTS_TAB_STRIP = 'projects-tab-strip' as const;
export const PROJECTS_TAB_BODY = 'projects-tab-body' as const;
export const PROJECTS_EMPTY_HERO = 'projects-empty-hero' as const;
export const PROJECTS_CONTROLS = 'projects-controls' as const;

// ─── ConfigureHeader (#344 batch 3) ──────────────────────────────────────────

export const CONFIGURE_HEADER = 'configure-header' as const;

// ─── ProjectConfigureFrame (#344 batch 3) ────────────────────────────────────

export const PROJECT_CONFIGURE_FRAME = 'project-configure-frame' as const;

// ─── StageJumpPopover (#344 batch 3) ─────────────────────────────────────────

export const STAGE_JUMP_POPOVER = 'stage-jump-popover' as const;
export const STAGE_JUMP_POPOVER_TRIGGER = 'stage-jump-popover-trigger' as const;

// ─── ArtifactViewer / PageWorkbench (Phase 2 M1) ─────────────────────────────

/** Prefix for per-word bbox testids: `word-bbox-{id}`. */
export const WORD_BBOX_PREFIX = 'word-bbox-' as const;
/** Build a testid for a specific word bbox: `word-bbox-{id}`. */
export const wordBboxTestId = (id: string) => `${WORD_BBOX_PREFIX}${id}` as const;

/** Draggable split handle (overlayMode='split'). */
export const SPLIT_HANDLE = 'artifact-split-handle' as const;

/** Rotation drag handle (overlayMode='rotate'). */
export const ROTATE_HANDLE = 'artifact-rotate-handle' as const;

/** Outer plate wrapper (ArtifactPlate). */
export const ARTIFACT_PLATE = 'artifact-plate' as const;

/** Inner paper render surface (PaperRender). */
export const PAPER_RENDER = 'paper-render' as const;

// ─── BackendChip (Phase 2 M2 atom) ───────────────────────────────────────────

/** GPU / CPU / auto status chip. */
export const BACKEND_CHIP = 'backend-chip' as const;

// ─── CheckIcon (Phase 2 M2) ───────────────────────────────────────────────────

/** Outer span wrapper for CheckIcon. */
export const CHECK_ICON = 'check-icon' as const;
// ─── PageChip (Phase 2 M2 atom promotion) ────────────────────────────────────

/** Mono-font page-prefix navigation chip. */
export const PAGE_CHIP = 'page-chip' as const;
// ─── ToggleBadge (Phase 2 M2 atom) ───────────────────────────────────────────

export const TOGGLE_BADGE = 'toggle-badge' as const;

// ─── EditModeSelector (Phase 2 M2) ───────────────────────────────────────────

/** PageWorkbench segmented mode picker (View / Split / Illustration / Rotate). */
export const EDIT_MODE_SELECTOR = 'edit-mode-selector' as const;
