import * as React from 'react';
import { cn } from './cn.js';

export interface KeyCapProps extends React.HTMLAttributes<HTMLDivElement> {
  keys: string | string[];
}

export const KeyCap = React.forwardRef<HTMLDivElement, KeyCapProps>(function KeyCap(
  { keys, className, ...props },
  ref,
) {
  const keyArray = Array.isArray(keys) ? keys : [keys];

  return (
    <div ref={ref} className={cn('inline-flex items-center gap-1', className)} {...props}>
      {keyArray.map((key, index) => (
        <React.Fragment key={`${key}-${index}`}>
          <span className="key">{key}</span>
          {index < keyArray.length - 1 && (
            <span aria-hidden className="inline-block" style={{ color: 'var(--ink-3)', fontSize: '10px' }}>+</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
});

KeyCap.displayName = 'KeyCap';
