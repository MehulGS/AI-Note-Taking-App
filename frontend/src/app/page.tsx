import Link from 'next/link';
import { ShieldCheck, Timer, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="rounded-2xl border bg-white p-8 text-center shadow-sm md:p-14">
        <p className="mb-3 text-sm font-medium text-primary">Secure note sharing for modern teams</p>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">Create private notes with expiring, one-time, and password-protected links.</h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">A clean production-ready MERN app demonstrating JWT auth, MongoDB atomic updates, hashed access keys, and recruiter-friendly UX.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/register" className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90">Get Started</Link>
          <Link href="/login" className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted">Login</Link>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        {[['One-time links', ShieldCheck], ['Expiry control', Timer], ['Password access', KeyRound]].map(([title, Icon]) => (
          <Card key={title as string}>
            <CardHeader><Icon className="h-6 w-6 text-primary" /><CardTitle>{title as string}</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">Built with secure defaults, validation, and atomic view-count logic.</CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
