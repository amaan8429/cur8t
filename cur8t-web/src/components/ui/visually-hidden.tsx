import * as React from 'react';

export type VisuallyHiddenProps = React.HTMLAttributes<HTMLSpanElement>;

const VisuallyHidden = React.forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  ({ children, ...props }, forwardedRef) => {
    return (
      <span
        ref={forwardedRef}
        style={{
          position: 'absolute',
          border: 0,
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          wordWrap: 'normal',
        }}
        {...props}
      >
        {children}
      </span>
    );
  }
);
VisuallyHidden.displayName = 'VisuallyHidden';

export { VisuallyHidden };
