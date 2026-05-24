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
