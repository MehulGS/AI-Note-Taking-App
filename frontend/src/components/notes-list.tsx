'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Copy, Eye, PlusCircle, RotateCcw } from 'lucide-react';
import { ProtectedRoute } from '@/components/protected-route';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCopy } from '@/hooks/use-copy';
import { formatDate } from '@/lib/utils';
import { getApiError } from '@/services/api';
import { getMyNotesRequest, revokeNoteRequest } from '@/services/note.service';
import type { Note } from '@/types';

export function NotesList({ scope }: { scope: 'active' | 'history' }) {
  const copy = useCopy();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const isHistory = scope === 'history';

  useEffect(() => {
    getMyNotesRequest(scope).then(setNotes).catch((error) => toast.error(getApiError(error))).finally(() => setLoading(false));
  }, [scope]);

  const sortedNotes = useMemo(() => [...notes].sort((a, b) => {
    if (a.status === 'Active' && b.status !== 'Active') return -1;
    if (a.status !== 'Active' && b.status === 'Active') return 1;
    const createdDiff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return createdDiff || b.viewCount - a.viewCount;
  }), [notes]);

  async function revoke(noteId: string) {
    try {
      await revokeNoteRequest(noteId);
      setNotes((current) => current.filter((note) => note.id !== noteId));
      toast.success('Share link revoked successfully.');
    } catch (error) {
      toast.error(getApiError(error));
    }
  }

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{isHistory ? 'Notes History' : 'My Notes'}</h1>
            <p className="text-sm text-muted-foreground">{isHistory ? 'Expired, revoked, and used notes are read-only.' : 'Your active note-sharing workspace.'}</p>
          </div>
          {!isHistory && <Link href="/notes/new"><Button><PlusCircle className="mr-2 h-4 w-4" />Create Note</Button></Link>}
          {isHistory && <Link href="/notes"><Button variant="outline">Back to Active Notes</Button></Link>}
        </div>
        {loading ? <p className="text-muted-foreground">Loading notes...</p> : sortedNotes.length === 0 ? (
          <Card className="text-center">
            <CardHeader>
              <CardTitle>{isHistory ? 'No history yet.' : 'No notes created yet.'}</CardTitle>
              <CardDescription>{isHistory ? 'Inactive notes will appear here when they expire, are revoked, or are used once.' : 'Create your first secure share link to get started.'}</CardDescription>
            </CardHeader>
            {!isHistory && <CardContent><Link href="/notes/new"><Button>Create Your First Note</Button></Link></CardContent>}
          </Card>
        ) : (
          <div className="grid gap-4">
            {sortedNotes.map((note) => (
              <Card key={note.id}>
                <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                  <div>
                    <CardTitle>{note.title}</CardTitle>
                    <CardDescription>Views: {note.viewCount} · Expires: {formatDate(note.expiresAt)}</CardDescription>
                  </div>
                  <StatusBadge status={note.status} />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-4">
                    <p><b>Share Type:</b> {note.shareType}</p>
                    <p><b>Access Type:</b> {note.accessType}</p>
                    <p><b>Created:</b> {formatDate(note.createdAt)}</p>
                    <p><b>Status:</b> {note.status}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/notes/${note.id}`}><Button variant="outline"><Eye className="mr-2 h-4 w-4" />View</Button></Link>
                    {!isHistory && <Button variant="outline" onClick={() => copy(note.shareUrl || '', 'Share link copied')}><Copy className="mr-2 h-4 w-4" />Copy Share Link</Button>}
                    {!isHistory && <Button variant="destructive" onClick={() => revoke(note.id)}><RotateCcw className="mr-2 h-4 w-4" />Revoke</Button>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
