import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import { Suspense } from 'react';
import ProfileForm from './ProfileForm';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ needRedirect?: string }>;
};

export default async function ProfilePage({ params, searchParams }: Props) {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-bold text-2xl">Profile</h1>
        <p className="text-muted-foreground text-sm">Manage your profile information for this contest.</p>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <DynamicContent params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function DynamicContent({ params, searchParams }: Props) {
  const { needRedirect } = await searchParams;
  const session = await auth.api.getSession({ headers: await headers() });

  const redirectUrl = needRedirect === 'true' ? `/${(await params).slug}/` : null;

  if (!session) {
    return (
      <div className="p-6">
        <h2 className="font-semibold text-lg">Please sign in</h2>
        <p className="text-muted-foreground text-sm">You must be signed in to view your profile.</p>
      </div>
    );
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  if (!user) {
    return (
      <div className="p-6">
        <h2 className="font-semibold text-lg">User not found</h2>
      </div>
    );
  }

  const missingProfile = !user.ageRange || !user.companyName || !user.jobTitle || !user.firstName || !user.lastName;

  return (
    <>
      <div className="gap-4 grid grid-cols-3">
        <div>
          <p className="text-muted-foreground text-sm">Username</p>
          <p className="font-medium">{user.name}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Email</p>
          <p className="font-medium">{user.email}</p>
        </div>
      </div>

      <ProfileForm
        name={user.name}
        firstName={user.firstName}
        lastName={user.lastName}
        ageRange={user.ageRange ?? undefined}
        companyName={user.companyName}
        jobTitle={user.jobTitle ?? undefined}
        redirectUrl={redirectUrl}
        missingProfile={missingProfile}
      />
    </>
  );
}
