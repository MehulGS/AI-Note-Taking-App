import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { AppShell } from '@/components/app-shell';
import { AuthProvider } from '@/providers/auth-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Note Sharing',
  description: 'Secure expiring note sharing with one-time and password protected links',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AppShell>{children}</AppShell>
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
