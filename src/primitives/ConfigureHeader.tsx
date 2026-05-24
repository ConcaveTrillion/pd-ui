import * as React from 'react';
import { cn } from './cn.js';
import { Breadcrumb } from '../shell/Breadcrumb.js';

/**
 * Breadcrumb trail item for ConfigureHeader.
 * Matches the TrailItem shape from PipelineTemplate for cross-component consistency.
 */
export interface ConfigureHeaderTrailItem {
  label: string;
  /** When true, renders the label in monospace. */
  mono?: boolean;
}

export interface ConfigureHeaderProps {
  /** Page / panel title displayed in the header. */
  title: string;
  /** Breadcrumb trail items rendered above the title. */
  trail?: ConfigureHeaderTrailItem[];
  /** Handler for the close/back action — renders a close button when provided. */
  onClose?: () => void;
  /** Additional controls rendered in the trailing slot. */
  children?: React.ReactNode;
  className?: string;
}

/**
 * ConfigureHeader — standard header for configure / settings panels.
 *
 * Composes Breadcrumb (from shell) and a title row with an optional close button.
 * Used across wf03/wf11/wf-pw configure panels.
 * Token-only styling; no hex literals.
 */
export function ConfigureHeader({
  title,
  trail,
  onClose,
  children,
  className,
}: ConfigureHeaderProps): React.ReactElement {
  return (
    <header className={cn('configure-header', className)}>
      {trail != null && trail.length > 0 ? (
        <Breadcrumb className="configure-header__breadcrumb">
          {trail.map((item, i) => (
            <li key={i} className={cn('configure-header__crumb', item.mono === true ? 'configure-header__crumb--mono' : undefined)}>
              {i > 0 ? <span className="configure-header__sep" aria-hidden="true">/</span> : null}
              <span>{item.label}</span>
            </li>
          ))}
        </Breadcrumb>
      ) : null}
      <div className="configure-header__row">
        <h2 className="configure-header__title">{title}</h2>
        <div className="configure-header__actions">
          {children}
          {onClose != null ? (
            <button
              type="button"
              className="configure-header__close"
              aria-label="Close"
              onClick={onClose}
            >
              <span className="configure-header__close-icon" aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}

ConfigureHeader.displayName = 'ConfigureHeader';
