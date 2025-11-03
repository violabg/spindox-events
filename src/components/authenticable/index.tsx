'use client';

import { authClient } from '@/lib/auth-client';
import LoginForm from './login.form';
import type { Session, User } from 'better-auth';

interface AuthenticableProps {
  callbackURL?: string;
  render: ({ user, session }: { user: User; session: Session }) => React.ReactNode;
}

export function Authenticable({ callbackURL, render }: AuthenticableProps) {
  const { data, isPending } = authClient.useSession();

  if (isPending) return null;

  if (!data) {
    return <LoginForm callbackURL={callbackURL} />;
  }

  return render({ user: data.user, session: data.session });
}
