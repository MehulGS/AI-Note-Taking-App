'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ProtectedRoute } from '@/components/protected-route';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCopy } from '@/hooks/use-copy';
import { formatDate } from '@/lib/utils';
import { getApiError } from '@/services/api';
import { getNoteRequest, revokeNoteRequest } from '@/services/note.service';
import type { Note } from '@/types';

export default function NoteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const copy = useCopy();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNoteRequest(id).then(setNote).catch((error) => toast.error(getApiError(error))).finally(() => setLoading(false));
  }, [id]);

  async function revoke() {
    try {
      await revokeNoteRequest(id);
      toast.success('Share link revoked successfully.');
      router.push('/notes/new');
    } catch (error) {
      toast.error(getApiError(error));
    }
  }

  if (loading) return <p className="text-muted-foreground">Loading note...</p>;
  if (!note) return <p className="text-muted-foreground">Note not found.</p>;

  return <ProtectedRoute><Card><CardHeader><div className="flex flex-wrap items-start justify-between gap-3"><div><CardTitle>{note.title}</CardTitle><CardDescription>{note.shareUrl}</CardDescription></div><StatusBadge status={note.status} /></div></CardHeader><CardContent className="space-y-6"><p className="whitespace-pre-wrap rounded-xl bg-muted p-4 text-sm leading-6">{note.content}</p><div className="grid gap-3 text-sm md:grid-cols-2"><p><b>Share Type:</b> {note.shareType}</p><p><b>Access Type:</b> {note.accessType}</p><p><b>Expiry:</b> {formatDate(note.expiresAt)}</p><p><b>View Count:</b> {note.viewCount}</p><p><b>Share Status:</b> {note.status}</p><p className="break-all"><b>Share Link:</b> {note.shareUrl}</p></div><div className="flex flex-wrap gap-3"><Button variant="outline" onClick={() => copy(note.shareUrl || '', 'Share link copied')}>Copy Share Link</Button><Button variant="destructive" disabled={note.isRevoked} onClick={revoke}>Revoke Link</Button></div></CardContent></Card></ProtectedRoute>;
}
