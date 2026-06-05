import { cn } from '@/lib/utils';
import type { ShareStatus } from '@/types';

export function StatusBadge({ status }: { status: ShareStatus }) {
  return <span className={cn('rounded-full px-3 py-1 text-xs font-medium', status === 'Active' && 'bg-green-100 text-green-700', status === 'Expired' && 'bg-amber-100 text-amber-700', status === 'Revoked' && 'bg-red-100 text-red-700', status === 'Used' && 'bg-slate-100 text-slate-700')}>{status}</span>;
}
