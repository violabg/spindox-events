'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Copy, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import Image from 'next/image';

type QRCodeModalProps = {
  contestSlug: string;
  contestName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function QRCodeModal({ contestSlug, contestName, open, onOpenChange }: QRCodeModalProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  useEffect(() => {
    if (open) {
      const baseUrl = window.location.origin;
      const fullUrl = `${baseUrl}/${contestSlug}`;

      QRCode.toDataURL(fullUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      })
        .then(url => {
          setQrCodeDataUrl(url);
        })
        .catch(error => {
          console.error('Error generating QR code:', error);
          toast.error('Failed to generate QR code');
        });
    }
  }, [open, contestSlug]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code for {contestName}</DialogTitle>
          <DialogDescription>Scan this QR code or share the link to access this contest</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          {qrCodeDataUrl && <Image src={qrCodeDataUrl} width={512} height={512} alt="QR Code" className="border rounded-lg" />}
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <p className="text-sm text-muted-foreground mb-0">Direct link:</p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Copy link"
                  onClick={() => {
                    const link = `${window.location.origin}/${contestSlug}`;
                    navigator.clipboard
                      .writeText(link)
                      .then(() => toast.success('Link copied'))
                      .catch(() => toast.error('Failed to copy'));
                  }}
                >
                  <Copy />
                </Button>
                <Button variant="outline" size="icon" asChild aria-label="Open link">
                  <Link href={`/${contestSlug}`}>
                    <ExternalLink />
                  </Link>
                </Button>
              </div>
            </div>
            <code className="text-xs bg-muted px-2 py-1 rounded">{typeof window !== 'undefined' && `${window.location.origin}/${contestSlug}`}</code>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
