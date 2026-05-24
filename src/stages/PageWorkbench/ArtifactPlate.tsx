/**
 * ArtifactPlate — internal visual chrome wrapper.
 *
 * Paper shadow + border + padding container. Internal sub-component;
 * not independently exported. Use ArtifactViewer for the composed surface.
 */

import type { ReactNode } from 'react'

export interface ArtifactPlateProps {
  className?: string | undefined
  children: ReactNode
}

/**
 * Outer wrapper providing the "paper card" aesthetic:
 * rounded border, inset shadow, overflow hidden.
 * Uses only CSS custom-property tokens — no hex literals.
 */
export function ArtifactPlate({ className, children }: ArtifactPlateProps) {
  return (
    <div
      data-testid="artifact-plate"
      className={className}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        borderRadius: 'var(--radius-lg, 10px)',
        background: 'var(--bg-raised)',
        border: '1px solid var(--border-1)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-plate, 0 4px 16px color-mix(in oklab, var(--ink-1) 8%, transparent))',
      }}
    >
      {children}
    </div>
  )
}

ArtifactPlate.displayName = 'ArtifactPlate'
