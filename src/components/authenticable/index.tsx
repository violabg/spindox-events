'use client';

import { authClient } from '@/lib/auth-client';
import LoginForm from './login.form';
import type { Session, User } from 'better-auth';

interface AuthenticableProps {
  callbackURL?: string;
  children: ({ user, session }: { user: User; session: Session }) => React.ReactNode;
}

export function Authenticable({ callbackURL, children }: AuthenticableProps) {
  const { data, isPending } = authClient.useSession();

  if (isPending) return null;

  if (!data) {
    return <LoginForm callbackURL={callbackURL} />;
  }

  return children({ user: data.user, session: data.session });
}
