'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/providers/auth-provider';
import { loginSchema, type LoginInput } from '@/schemas/auth.schema';
import { getApiError } from '@/services/api';
import { loginRequest } from '@/services/auth.service';

export default function LoginPage() {
  const router = useRouter();
  const { setSession } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginInput) {
    try {
      const session = await loginRequest(values);
      setSession(session.token, session.user);
      toast.success('Logged in successfully');
      router.push('/notes/new');
    } catch (error) {
      toast.error(getApiError(error));
    }
  }

  return <div className="mx-auto max-w-md"><Card><CardHeader><CardTitle>Welcome back</CardTitle><CardDescription>Login to manage your secure notes.</CardDescription></CardHeader><CardContent><form onSubmit={handleSubmit(onSubmit)} className="space-y-4"><div><Input type="email" placeholder="Email" {...register('email')} />{errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}</div><div><Input type="password" placeholder="Password" {...register('password')} />{errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}</div><Button className="w-full" disabled={isSubmitting}>{isSubmitting ? 'Signing in...' : 'Login'}</Button></form><p className="mt-4 text-center text-sm text-muted-foreground">No account? <Link className="text-primary" href="/register">Register</Link></p></CardContent></Card></div>;
}
