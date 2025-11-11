'use client';

import { useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

import Image from 'next/image';

import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { authClient } from '@/lib/auth-client';

export default function LoginForm({ callbackURL }: { callbackURL?: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleSignIn = async (provider: 'github' | 'google') => {
    setIsLoading(true);
    setLoadingProvider(provider);
    try {
      await authClient.signIn.social({ provider, callbackURL });
    } finally {
      setIsLoading(false);
      setLoadingProvider(null);
    }
  };

  return (
    <div className="w-full max-w-md">
      <Card className="border shadow-lg">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto">
            <Image src="/logo.webp" alt="Spindox Events" width={80} height={80} className="mx-auto rounded-lg" priority />
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold">Welcome</CardTitle>
          <CardDescription className="text-sm sm:text-base">Sign in to get started with contests and challenges</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button
            onClick={() => handleSignIn('google')}
            disabled={isLoading}
            variant="outline"
            className="w-full h-11 text-base font-medium transition-all duration-200 hover:bg-muted"
          >
            {loadingProvider === 'google' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <FcGoogle className="mr-2 h-5 w-5" />
                Continue with Google
              </>
            )}
          </Button>

          <Button
            onClick={() => handleSignIn('github')}
            disabled={isLoading}
            variant="outline"
            className="w-full h-11 text-base font-medium transition-all duration-200 hover:bg-muted"
          >
            {loadingProvider === 'github' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <FaGithub className="mr-2 h-5 w-5" />
                Continue with GitHub
              </>
            )}
          </Button>

          <Separator className="my-2" />

          <p className="text-xs sm:text-sm text-center text-muted-foreground leading-relaxed">
            By signing in, you agree to our terms of service and privacy policy. We never share your data with third parties.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
