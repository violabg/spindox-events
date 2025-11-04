import LoginForm from '@/components/authenticable/login.form';
type ContestPageParams = {
  params: Promise<{ slug: string }>;
};
export default async function LoginPage({ params }: ContestPageParams) {
  const { slug } = await params;
  console.log('🚀 ~ LoginPage ~ slug:', slug);
  return <LoginForm callbackURL={`/${slug}`}></LoginForm>;
}
