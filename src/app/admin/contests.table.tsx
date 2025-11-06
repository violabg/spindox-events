'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, MessageSquare, Edit, QrCode, Users } from 'lucide-react';
import { deleteContestAction } from '@/actions/contests/delete.action';
import { toast } from 'sonner';
import { QRCodeModal } from '@/components/modals';
import { ConfirmationDialog } from '@/components/admin';
import { getContests } from '@/queries/contests';

type ContestsTableProps = {
  contests: Awaited<ReturnType<typeof getContests<{ userAnswers: true; questions: true }>>>;
};

function QRCodeButton({ contestSlug, contestName }: { contestSlug: string; contestName: string }) {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsQRModalOpen(true)}>
        <QrCode className="h-4 w-4" />
      </Button>
      <QRCodeModal contestSlug={contestSlug} contestName={contestName} open={isQRModalOpen} onOpenChange={setIsQRModalOpen} />
    </>
  );
}

function DeleteContestButton({ contestId, contestName }: { contestId: string; contestName: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteContestAction(contestId);
      if (result.success) {
        toast.success('Contest deleted successfully');
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
    <ConfirmationDialog
      title="Delete Contest"
      description={`Are you sure you want to delete "${contestName}"? This action cannot be undone and will fail if the contest has associated questions or user answers.`}
      actionText="Delete"
      onAction={handleDelete}
      isLoading={isDeleting}
      isDangerous
    >
      <Button variant="outline" size="sm" disabled={isDeleting}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </ConfirmationDialog>
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
          <TableHead className="text-right">Actions</TableHead>
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
            <TableCell>{new Set(contest.userAnswers.map(ua => ua.userId)).size}</TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <QRCodeButton contestSlug={contest.slug} contestName={contest.name} />
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/contests/${contest.id}/scores`}>
                    <Users className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/contests/${contest.id}/questions`}>
                    <MessageSquare className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/contests/${contest.id}/edit`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
                <DeleteContestButton contestId={contest.id} contestName={contest.name} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
