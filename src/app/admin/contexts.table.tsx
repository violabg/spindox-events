'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2, MessageSquare, Edit, QrCode } from 'lucide-react';
import { ContextStatus } from '@/prisma/enums';
import { deleteContextAction } from '@/actions/contexts/delete.action';
import { toast } from 'sonner';
import { QRCodeModal } from '@/components/modals';

type ContextWithUserCount = {
  id: string;
  name: string;
  slug: string;
  status: ContextStatus;
  uniqueUserCount: number;
};

type ContextsTableProps = {
  contexts: ContextWithUserCount[];
};

function QRCodeButton({ contextSlug, contextName }: { contextSlug: string; contextName: string }) {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsQRModalOpen(true)}>
        <QrCode className="h-4 w-4" />
      </Button>
      <QRCodeModal contextSlug={contextSlug} contextName={contextName} open={isQRModalOpen} onOpenChange={setIsQRModalOpen} />
    </>
  );
}

function DeleteContextButton({ contextId, contextName }: { contextId: string; contextName: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteContextAction(contextId);
      if (result.success) {
        toast.success('Context deleted successfully');
      } else {
        toast.error(result.error || 'Failed to delete context');
      }
    } catch {
      toast.error('Failed to delete context');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={isDeleting}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Context</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{contextName}&quot;? This action cannot be undone and will fail if the context has associated
            questions or user answers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function ContextsTable({ contexts }: ContextsTableProps) {
  return (
    <>
      <Table>
        <TableCaption>A list of all event contexts.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Users Answered</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contexts.map(context => (
            <TableRow key={context.id}>
              <TableCell className="font-medium">{context.name}</TableCell>
              <TableCell className="font-mono text-sm">{context.slug}</TableCell>
              <TableCell>
                <Badge variant={context.status === 'active' ? 'default' : 'secondary'}>{context.status === 'active' ? 'Active' : 'Inactive'}</Badge>
              </TableCell>
              <TableCell>{context.uniqueUserCount}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <QRCodeButton contextSlug={context.slug} contextName={context.name} />
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/contexts/${context.id}/questions`}>
                      <MessageSquare className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/contexts/${context.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <DeleteContextButton contextId={context.id} contextName={context.name} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {contexts.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">No contexts found. Create your first context to get started.</div>
      )}
    </>
  );
}
