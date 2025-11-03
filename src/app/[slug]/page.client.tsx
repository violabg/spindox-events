'use client';

import { Prisma } from '@/prisma/client';
import { Authenticable } from '@/components/authenticable';

type Props = {
  context: Prisma.ContextGetPayload<{}>;
};

export default function ContextPageClient({ context }: Props) {
  return (
    <Authenticable
      callbackURL={`/${context.slug}`}
      render={({ user }) => {
        return <div>Welcome, {user.name}!</div>;
      }}
    />
  );
}
