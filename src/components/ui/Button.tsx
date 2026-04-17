import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'danger';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:pointer-events-none disabled:opacity-50",
          {
            'bg-slate-900 text-white hover:bg-slate-800': variant === 'default',
            'bg-slate-100 text-slate-900 hover:bg-slate-200': variant === 'secondary',
            'border-2 border-slate-200 bg-transparent hover:bg-slate-100 text-slate-900': variant === 'outline',
            'bg-transparent hover:bg-slate-100 text-slate-700': variant === 'ghost',
            'bg-red-500 text-white hover:bg-red-600': variant === 'danger',
            'h-12 px-6 py-2': size === 'default',
            'h-9 rounded-md px-3': size === 'sm',
            'h-14 rounded-xl px-8 text-lg': size === 'lg',
            'h-12 w-12': size === 'icon',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
