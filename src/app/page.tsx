import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { QrCode } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const isAdmin = session?.user?.role === 'admin';

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Logo */}
        <div className="flex justify-center">
          <Image src="/logo.webp" alt="Spindox Events" width={80} height={80} className="rounded-lg" priority />
        </div>

        {/* Title and Description */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold">Spindox Events</h1>
          <p className="text-lg text-muted-foreground">Scan a QR code to participate in contests and challenges</p>
        </div>

        {/* QR Code Instruction */}
        <Card className="border-2 border-dashed">
          <CardContent className="pt-8 pb-8 flex flex-col items-center gap-4">
            <QrCode className="h-16 w-16 text-muted-foreground" />
            <p className="text-sm text-muted-foreground text-center">Open your phone camera and point it at a QR code to join a contest</p>
          </CardContent>
        </Card>

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
      </div>
    </div>
  );
}
