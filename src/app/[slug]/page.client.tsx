'use client';

import { Prisma } from '@/prisma/client';
import { Authenticable } from '@/components/authenticable';

type Props = {
  contest: Prisma.ContestGetPayload<{}>;
};

export default function ContextPageClient({ contest }: Props) {
  return (
    <Authenticable
      callbackURL={`/${contest.slug}`}
      render={({ user }) => {
        return <div>Welcome, {user.name}!</div>;
      }}
    />
  );
}
