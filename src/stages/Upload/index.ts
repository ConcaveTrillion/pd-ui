/**
 * Upload stage barrel.
 *
 * Public exports from this subpath:
 *   - ModalB (compact drop-target upload modal, Phase 2 M12)
 *   - ModalC (desktop 4-step right-side sheet, Phase 2 M12)
 *   - Types: ModalBProps, ModalCProps, UploadStep
 */

// ─── ModalB (Phase 2 M12) ─────────────────────────────────────────────────────
export { ModalB } from './ModalB.js';
export type { ModalBProps } from './ModalB.js';

// ─── ModalC (Phase 2 M12) ─────────────────────────────────────────────────────
export { ModalC } from './ModalC.js';
export type { ModalCProps, UploadStep } from './ModalC.js';
