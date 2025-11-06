'use client';

import { QRCodeModal } from '@/components/modals';
import { Button } from '@/components/ui/button';
import { QrCode } from 'lucide-react';
import { useState } from 'react';

function QRCodeButton({ contestSlug, contestName }: { contestSlug: string; contestName: string }) {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsQRModalOpen(true)}>
        <QrCode className="w-4 h-4" />
      </Button>
      <QRCodeModal contestSlug={contestSlug} contestName={contestName} open={isQRModalOpen} onOpenChange={setIsQRModalOpen} />
    </>
  );
}

export { QRCodeButton };
