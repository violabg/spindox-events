import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { auth } from '@/lib/auth';
import { QrCode } from 'lucide-react';
import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const isAdmin = session?.user?.role === 'admin';

  return (
    <div className="flex flex-col justify-center items-center bg-linear-to-b from-background to-muted p-4 min-h-screen">
      <div className="space-y-8 w-full max-w-md text-center">
        {/* Logo */}
        <div className="flex justify-center">
          <Image src="/logo.webp" alt="Spindox Events" width={80} height={80} className="rounded-lg" priority />
        </div>

        {/* Title and Description */}
        <div className="space-y-3">
          <h1 className="font-bold text-3xl sm:text-4xl">Spindox Events</h1>
          <p className="text-muted-foreground text-lg">Scan a QR code to participate in contests and challenges</p>
        </div>

        {/* QR Code Instruction */}
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center gap-4 pt-8 pb-8">
            <QrCode className="w-16 h-16 text-muted-foreground" />
            <p className="text-muted-foreground text-sm text-center">Open your phone camera and point it at a QR code to join a contest</p>
          </CardContent>
        </Card>
        <Suspense fallback={<div>Loading...</div>}>
          {/* Sign In Button */}
          {!session && (
            <Button asChild size="lg" className="w-full">
              <Link href="/login">Sign In</Link>
            </Button>
          )}

          {/* Admin Link */}
          {isAdmin && (
            <Button asChild variant="outline" size="lg" className="w-full">
              <Link href="/admin">Admin Dashboard</Link>
            </Button>
          )}
        </Suspense>
      </div>
    </div>
  );
}
