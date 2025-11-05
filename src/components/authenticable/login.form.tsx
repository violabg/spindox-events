'use client';

import { Button } from '@/components/ui/button';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { authClient } from '@/lib/auth-client';

export default function LoginForm({ callbackURL }: { callbackURL?: string }) {
  return (
    <Card className="m-8">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Please enter your credentials to access your account.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={async () => {
            await authClient.signIn.social({ provider: 'github', callbackURL });
          }}
          className="w-full"
        >
          <FaGithub />
          Sign in with GitHub
        </Button>
        <Button
          onClick={async () => {
            await authClient.signIn.social({ provider: 'google', callbackURL });
          }}
          className="w-full"
        >
          <FcGoogle />
          Sign in with Google
        </Button>
      </CardContent>
      <CardFooter>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Molestiae dolor, laboriosam consequuntur aut quia placeat culpa sunt magni odit
        error molestias unde est voluptatum, dolores dicta rerum eos tempore reprehenderit!
      </CardFooter>
    </Card>
  );
}
