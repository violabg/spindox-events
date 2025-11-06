import { Toaster } from '@/components/ui/sonner';
import './globals.css';

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased dark">
        {children}

        <Toaster position="top-right" />
      </body>
    </html>
  );
}
