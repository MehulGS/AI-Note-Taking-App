import * as React from 'react';
import { cn } from '@/lib/utils';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'destructive' | 'ghost';
};

export function Button({ className, variant = 'default', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition hover:opacity-90 disabled:pointer-events-none disabled:opacity-50',
        variant === 'default' && 'bg-primary text-primary-foreground shadow-sm',
        variant === 'outline' && 'border border-border bg-white text-foreground hover:bg-muted',
        variant === 'destructive' && 'bg-destructive text-destructive-foreground',
        variant === 'ghost' && 'hover:bg-muted',
        className
      )}
      {...props}
    />
  );
}
