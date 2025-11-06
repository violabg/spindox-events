'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/admin/contests/${contest.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/admin/contests/${contest.id}/questions`}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Manage Questions
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/admin/contests/${contest.id}/submissions`}>
              <Users className="mr-2 h-4 w-4" />
              View Submissions
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/admin/contests/${contest.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Contest
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setIsQRModalOpen(true)}>
            <QrCode className="mr-2 h-4 w-4" />
            Generate QR Code
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setIsDeleteDialogOpen(true)} className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Contest
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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
