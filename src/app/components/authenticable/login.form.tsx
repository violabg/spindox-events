'use client';

import { Button } from '@/components/ui/button';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

import { authClient } from '@/lib/auth-client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginForm({ callbackURL }: { callbackURL?: string }) {
  const handleSignIn = async (provider: 'github' | 'google') => {
    await authClient.signIn.social({ provider, callbackURL });
  };

  return (
    <Card className="m-8">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Please enter your credentials to access your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <Button onClick={() => handleSignIn('github')} className="w-full">
            <FaGithub />
            Sign in with GitHub
          </Button>
          <Button onClick={() => handleSignIn('google')} className="w-full">
            <FcGoogle />
            Sign in with Google
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Molestiae dolor, laboriosam consequuntur aut quia placeat culpa sunt magni odit
        error molestias unde est voluptatum, dolores dicta rerum eos tempore reprehenderit!
      </CardFooter>
    </Card>
  );
}
