'use client';

import { useState } from 'react';

import Link from 'next/link';

import { Edit, ExternalLink, Eye, MessageSquare, MoreHorizontal, QrCode, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';

import { deleteContestAction } from '@/actions/contests/delete.action';
import { QRCodeModal } from '@/components/modals';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getContests } from '@/queries/contests';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

type ContestsTableProps = {
  contests: Awaited<ReturnType<typeof getContests>>;
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
      <Button variant="ghost" size="sm" onClick={() => setIsQRModalOpen(true)}>
        <QrCode className="h-4 w-4" />
      </Button>
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
            <Link href={`/admin/contests/${contest.id}/attempts`} className="flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded">
              <Users className="mr-2 h-4 w-4" />
              View Attempts
            </Link>
          </MenuItem>
          <div className="my-1 h-px bg-border" />
          <MenuItem>
            <Link href={`/admin/contests/${contest.id}/edit`} className="flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded">
              <Edit className="mr-2 h-4 w-4" />
              Edit Contest
            </Link>
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
          <TableHead>Status</TableHead>
          <TableHead>Questions</TableHead>
          <TableHead>Participants</TableHead>
          <TableHead className="text-center">Total Score</TableHead>
          <TableHead className="text-center">Avg Score</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contests.map(contest => {
          // Calculate total score: sum of max scores from all questions
          const totalScore = contest.questions.reduce((sum, question) => {
            const maxScore = question.answers.length > 0 ? Math.max(...question.answers.map(a => a.score)) : 0;
            return sum + maxScore;
          }, 0);

          // Calculate average score from user attempts
          const totalAttemptScore = contest.attempts.reduce((sum, a) => sum + a.score, 0);
          const avgScore = contest.attempts.length > 0 ? (totalAttemptScore / contest.attempts.length).toFixed(2) : '0.00';

          return (
            <TableRow key={contest.id}>
              <TableCell className="font-medium">{contest.name}</TableCell>
              <TableCell>
                <Badge variant={contest.active ? 'default' : 'secondary'}>{contest.active ? 'Active' : 'Inactive'}</Badge>
              </TableCell>
              <TableCell>{contest.questions.length}</TableCell>
              <TableCell>{contest.attempts.length}</TableCell>
              <TableCell className="text-center">{totalScore}</TableCell>
              <TableCell className="text-center">{avgScore}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <a href={`/${contest.slug}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  <ContestActionsMenu contest={contest} />
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
