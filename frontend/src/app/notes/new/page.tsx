'use client';

import { useState } from 'react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ProtectedRoute } from '@/components/protected-route';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCopy } from '@/hooks/use-copy';
import { toDatetimeLocalValue } from '@/lib/utils';
import { createNoteSchema, type CreateNoteInput } from '@/schemas/note.schema';
import { getApiError } from '@/services/api';
import { createNoteRequest } from '@/services/note.service';

type Result = { noteId: string; shareUrl: string; password: string | null };

export default function NewNotePage() {
  const copy = useCopy();
  const [result, setResult] = useState<Result | null>(null);
  const minExpiry = toDatetimeLocalValue(new Date(Date.now() + 60 * 1000));
  const defaultExpiry = toDatetimeLocalValue(new Date(Date.now() + 60 * 60 * 1000));
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateNoteInput>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: { shareType: 'TIME_BASED', accessType: 'PUBLIC', expiresAt: defaultExpiry },
  });

  async function onSubmit(values: CreateNoteInput) {
    try {
      const data = await createNoteRequest(values);
      setResult({ noteId: data.note.id, shareUrl: data.shareUrl, password: data.password });
      toast.success('Share link created');
    } catch (error) {
      toast.error(getApiError(error));
    }
  }

  return (
    <ProtectedRoute>
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <Card>
          <CardHeader>
            <CardTitle>Create Note</CardTitle>
            <CardDescription>Generate a secure shareable link.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Input placeholder="Title" {...register('title')} />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
              </div>
              <div>
                <Textarea placeholder="Write your note..." {...register('content')} />
                {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <select className="h-10 rounded-lg border bg-white px-3 text-sm" {...register('shareType')}>
                  <option value="ONE_TIME">One Time</option>
                  <option value="TIME_BASED">Time Based</option>
                </select>
                <select className="h-10 rounded-lg border bg-white px-3 text-sm" {...register('accessType')}>
                  <option value="PUBLIC">Public</option>
                  <option value="PASSWORD_PROTECTED">Password Protected</option>
                </select>
              </div>
              <div>
                <Input type="datetime-local" min={minExpiry} {...register('expiresAt')} />
                {errors.expiresAt && <p className="mt-1 text-sm text-red-600">{errors.expiresAt.message}</p>}
              </div>
              <Button disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create Share Link'}</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
            <CardDescription>Your password is shown only once.</CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-3">
                <div className="break-all rounded-lg bg-muted p-3 text-sm">{result.shareUrl}</div>
                <Button className="w-full" onClick={() => copy(result.shareUrl, 'URL copied')}>Copy URL</Button>
                {result.password && (
                  <>
                    <div className="rounded-lg bg-muted p-3 font-mono text-sm">{result.password}</div>
                    <Button className="w-full" variant="outline" onClick={() => copy(result.password!, 'Password copied')}>Copy Password</Button>
                  </>
                )}
                <a href={result.shareUrl} target="_blank" rel="noreferrer">
                  <Button className="w-full">Open Public Note</Button>
                </a>
                <Link href={`/notes/${result.noteId}`}>
                  <Button className="w-full" variant="outline">View Note</Button>
                </Link>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Create a note to see its share URL here.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
