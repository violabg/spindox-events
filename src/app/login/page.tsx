import { Suspense } from 'react';
import LoginForm from './login.form';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DynamicContent searchParams={searchParams} />
    </Suspense>
  );
}

async function DynamicContent({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const queryParams = await searchParams;
  const redirectUrl = typeof queryParams.redirect === 'string' ? queryParams.redirect : '/';

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm callbackURL={redirectUrl}></LoginForm>;
    </Suspense>
  );
}
