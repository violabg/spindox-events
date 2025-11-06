import { DeleteContestButton } from '@/components/admin/delete-contest-button';
import { QRCodeButton } from '@/components/admin/qr-code-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getContests } from '@/queries/contests';
import { Edit, MessageSquare, Users } from 'lucide-react';
import Link from 'next/link';

type ContestsTableProps = {
  contests: Awaited<ReturnType<typeof getContests<{ submissions: true; questions: true }>>>;
};

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
            <TableCell>{new Set(contest.submissions.map(ua => ua.userId)).size}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end items-center gap-2">
                <QRCodeButton contestSlug={contest.slug} contestName={contest.name} />
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/contests/${contest.id}/submissions`}>
                    <Users className="w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/contests/${contest.id}/questions`}>
                    <MessageSquare className="w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/contests/${contest.id}/edit`}>
                    <Edit className="w-4 h-4" />
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
