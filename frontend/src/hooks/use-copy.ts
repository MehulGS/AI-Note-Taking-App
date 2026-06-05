import { toast } from 'sonner';

export function useCopy() {
  return async (value: string, label = 'Copied') => {
    await navigator.clipboard.writeText(value);
    toast.success(label);
  };
}
