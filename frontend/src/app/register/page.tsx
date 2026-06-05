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
import { registerSchema, type RegisterInput } from '@/schemas/auth.schema';
import { getApiError } from '@/services/api';
import { registerRequest } from '@/services/auth.service';

export default function RegisterPage() {
  const router = useRouter();
  const { setSession } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterInput) {
    try {
      const session = await registerRequest(values);
      setSession(session.token, session.user);
      toast.success('Account created successfully');
      router.push('/notes/new');
    } catch (error) {
      toast.error(getApiError(error));
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <CardHeader><CardTitle>Create account</CardTitle><CardDescription>Start creating secure share links.</CardDescription></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div><Input placeholder="Name" {...register('name')} />{errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}</div>
            <div><Input placeholder="Email" type="email" {...register('email')} />{errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}</div>
            <div><Input placeholder="Password" type="password" {...register('password')} />{errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}</div>
            <div><Input placeholder="Confirm Password" type="password" {...register('confirmPassword')} />{errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}</div>
            <Button className="w-full" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Register'}</Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">Already have an account? <Link className="text-primary" href="/login">Login</Link></p>
        </CardContent>
      </Card>
    </div>
  );
}
