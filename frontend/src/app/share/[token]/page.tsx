'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { unlockSchema, type UnlockInput } from '@/schemas/note.schema';
import { getApiError } from '@/services/api';
import { openShareRequest, unlockShareRequest } from '@/services/note.service';
import type { Note } from '@/types';

type Locked = { requiresPassword: true; accessType: string; shareType: string };

function isLocked(value: Note | Locked): value is Locked {
  return 'requiresPassword' in value;
}

export default function SharePage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [note, setNote] = useState<Note | null>(null);
  const [locked, setLocked] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<UnlockInput>({ resolver: zodResolver(unlockSchema) });

  useEffect(() => {
    openShareRequest(token).then((data) => {
      if (isLocked(data)) setLocked(true);
      else setNote(data);
    }).catch((error) => {
      const apiMessage = getApiError(error);
      const ownerId = (error as { response?: { data?: { data?: { ownerId?: string } } } })?.response?.data?.data?.ownerId;
      if (apiMessage === 'This link has been revoked.' && user?.id === ownerId) {
        router.push('/notes/new');
        return;
      }
      setMessage(apiMessage);
    }).finally(() => setLoading(false));
  }, [router, token, user?.id]);

  async function unlock(values: UnlockInput) {
    try {
      const data = await unlockShareRequest(token, values);
      setNote(data);
      setLocked(false);
      toast.success('Note unlocked');
    } catch (error) {
      toast.error(getApiError(error));
    }
  }

  if (loading) return <p className="text-muted-foreground">Opening secure note...</p>;
  if (message) return <Card className="mx-auto max-w-lg"><CardHeader><CardTitle>Unable to open</CardTitle><CardDescription>{message}</CardDescription></CardHeader></Card>;
  if (locked) return <Card className="mx-auto max-w-md"><CardHeader><CardTitle>Password Protected</CardTitle><CardDescription>Enter the generated password to view this note.</CardDescription></CardHeader><CardContent><form onSubmit={handleSubmit(unlock)} className="space-y-4"><div><Input type="password" placeholder="Access password" {...register('password')} />{errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}</div><Button className="w-full" disabled={isSubmitting}>{isSubmitting ? 'Unlocking...' : 'Unlock'}</Button></form></CardContent></Card>;
  if (!note) return <p className="text-muted-foreground">Invalid Share Link</p>;

  return <Card className="mx-auto max-w-3xl"><CardHeader><div className="flex items-start justify-between gap-3"><div><CardTitle>{note.title}</CardTitle><CardDescription>Expires {formatDate(note.expiresAt)}</CardDescription></div><StatusBadge status={note.status} /></div></CardHeader><CardContent className="space-y-4"><p className="whitespace-pre-wrap rounded-xl bg-muted p-4 text-sm leading-6">{note.content}</p><div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-3"><p>Share: {note.shareType}</p><p>Access: {note.accessType}</p><p>Views: {note.viewCount}</p></div></CardContent></Card>;
}
