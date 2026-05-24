/**
 * Icons subpath barrel (`@concavetrillion/pd-ui/icons`).
 *
 * Re-exports all curated lucide icons, all bespoke OCR-domain SVG icons,
 * and the <Icon name> dispatcher shim (OQ-1).
 *
 * This is the ONLY public import path for icons in pd-ui consumers.
 */
export * from './lucide.js';
export * from './bespoke.js';
export { Icon, ICON_NAMES } from './Icon.js';
export type { IconName, IconProps as IconDispatcherProps } from './Icon.js';
