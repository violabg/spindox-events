import { Suspense } from 'react';

import LoginForm from './login.form';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-background to-muted flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <Suspense fallback={<LoginPageSkeleton />}>
        <DynamicContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function DynamicContent({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const queryParams = await searchParams;
  const redirectUrl = typeof queryParams.redirect === 'string' ? queryParams.redirect : '/';

  return <LoginForm callbackURL={redirectUrl} />;
}

function LoginPageSkeleton() {
  return (
    <div className="w-full max-w-md animate-pulse">
      <div className="h-96 bg-muted rounded-lg"></div>
    </div>
  );
}
