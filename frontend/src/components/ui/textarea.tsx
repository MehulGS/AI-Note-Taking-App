import * as React from 'react';
import { cn } from '@/lib/utils';

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn('min-h-36 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary', className)} {...props} />;
}
