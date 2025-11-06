'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { getContests } from '@/queries/contests';
import { MoreHorizontal, Eye, MessageSquare, Users, Edit, QrCode, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { QRCodeModal } from '@/components/modals';
import { deleteContestAction } from '@/actions/contests/delete.action';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type ContestsTableProps = {
  contests: Awaited<ReturnType<typeof getContests<{ submissions: true; questions: true }>>>;
};

function ContestActionsMenu({ contest }: { contest: ContestsTableProps['contests'][number] }) {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteContestAction(contest.id);
      if (result.success) {
        toast.success('Contest deleted successfully');
        setIsDeleteDialogOpen(false);
      } else {
        toast.error(result.error || 'Failed to delete contest');
      }
    } catch {
      toast.error('Failed to delete contest');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Menu>
        <MenuButton as={Button} variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </MenuButton>
        <MenuItems anchor="bottom end" className="z-50 rounded-md border bg-popover p-1 shadow-md">
          <MenuItem>
            <Link href={`/admin/contests/${contest.id}`} className="flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded">
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Link>
          </MenuItem>
          <MenuItem>
            <Link href={`/admin/contests/${contest.id}/questions`} className="flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded">
              <MessageSquare className="mr-2 h-4 w-4" />
              Manage Questions
            </Link>
          </MenuItem>
          <MenuItem>
            <Link href={`/admin/contests/${contest.id}/submissions`} className="flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded">
              <Users className="mr-2 h-4 w-4" />
              View Submissions
            </Link>
          </MenuItem>
          <div className="my-1 h-px bg-border" />
          <MenuItem>
            <Link href={`/admin/contests/${contest.id}/edit`} className="flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded">
              <Edit className="mr-2 h-4 w-4" />
              Edit Contest
            </Link>
          </MenuItem>
          <MenuItem>
            <button onClick={() => setIsQRModalOpen(true)} className="w-full flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded text-left">
              <QrCode className="mr-2 h-4 w-4" />
              Generate QR Code
            </button>
          </MenuItem>
          <div className="my-1 h-px bg-border" />
          <MenuItem>
            <button
              onClick={() => setIsDeleteDialogOpen(true)}
              className="w-full flex items-center px-2 py-1.5 text-sm hover:bg-destructive/10 rounded text-destructive text-left"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Contest
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>
      <QRCodeModal contestSlug={contest.slug} contestName={contest.name} open={isQRModalOpen} onOpenChange={setIsQRModalOpen} />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contest</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{contest.name}&rdquo;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function ContestsTable({ contests }: ContestsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Questions</TableHead>
          <TableHead>Participants</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contests.map(contest => (
          <TableRow key={contest.id}>
            <TableCell className="font-medium">{contest.name}</TableCell>
            <TableCell className="font-mono text-sm">{contest.slug}</TableCell>
            <TableCell>
              <Badge variant={contest.status === 'active' ? 'default' : 'secondary'}>{contest.status === 'active' ? 'Active' : 'Inactive'}</Badge>
            </TableCell>
            <TableCell>{contest.questions.length}</TableCell>
            <TableCell>{new Set(contest.submissions.map(ua => ua.userId)).size}</TableCell>
            <TableCell className="text-right">
              <ContestActionsMenu contest={contest} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
