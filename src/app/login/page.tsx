import LoginForm from '@/components/authenticable/login.form';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const queryParams = await searchParams;
  const redirectUrl = typeof queryParams.redirect === 'string' ? queryParams.redirect : '/';

  return <LoginForm callbackURL={redirectUrl}></LoginForm>;
}
