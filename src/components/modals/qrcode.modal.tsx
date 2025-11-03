'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import QRCode from 'qrcode';

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
          {qrCodeDataUrl && <img src={qrCodeDataUrl} alt="QR Code" className="w-64 h-64 border rounded-lg" />}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Direct link:</p>
            <code className="text-xs bg-muted px-2 py-1 rounded">{typeof window !== 'undefined' && `${window.location.origin}/${contestSlug}`}</code>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
