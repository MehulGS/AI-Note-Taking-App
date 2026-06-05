'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, LogOut, Menu, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';

const navItems = [
  { href: '/notes/new', label: 'Create Note', icon: PlusCircle },
  { href: '/notes', label: 'My Notes', icon: FileText },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { token, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const authenticated = Boolean(token || (typeof window !== 'undefined' && localStorage.getItem('token')));

  const sidebar = (
    <Card className="h-full rounded-none border-0 border-r bg-white shadow-none md:rounded-xl md:border md:shadow-sm">
      <CardContent className="flex h-full flex-col gap-2 p-4">
        <Link href="/notes" className="mb-4 text-lg font-semibold tracking-tight" onClick={() => setOpen(false)}>AI Note Sharing</Link>
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} onClick={() => setOpen(false)} className={cn('flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-muted', pathname === href && 'bg-muted text-primary')}>
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
        <Button variant="ghost" className="mt-auto justify-start gap-3" onClick={logout}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-30 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            {authenticated && <Button variant="outline" className="md:hidden" onClick={() => setOpen(true)}><Menu className="h-4 w-4" /></Button>}
            <Link href={authenticated ? '/notes' : '/'} className="font-semibold tracking-tight">AI Note Sharing</Link>
          </div>
          <nav className="flex items-center gap-3 text-sm">
            {authenticated ? (
              <>
                <Link href="/notes/new" className="hidden hover:text-primary sm:inline">Create Note</Link>
                <Button variant="outline" onClick={logout}>Logout</Button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-primary">Login</Link>
                <Link href="/register" className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90">Register</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      {authenticated && open && <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setOpen(false)}><aside className="h-full w-72" onClick={(event) => event.stopPropagation()}>{sidebar}</aside></div>}
      <div className={cn('mx-auto max-w-6xl px-4 py-6', authenticated && 'md:grid md:grid-cols-[240px_1fr] md:gap-6')}>
        {authenticated && <aside className="hidden md:block md:min-h-[calc(100vh-112px)]">{sidebar}</aside>}
        <main>{children}</main>
      </div>
    </div>
  );
}
