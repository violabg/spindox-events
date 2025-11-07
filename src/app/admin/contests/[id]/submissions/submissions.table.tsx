'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { getSubmissionsByContest } from '@/queries/submissions';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { MoreHorizontal, Eye } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

type SubmissionsTableProps = {
  submissions: Awaited<ReturnType<typeof getSubmissionsByContest>>;
};

function SubmissionActionsMenu({ userId }: { userId: string }) {
  const params = useParams();
  const contestId = params.id as string;

  return (
    <Menu>
      <MenuButton as={Button} variant="ghost" size="sm">
        <MoreHorizontal className="h-4 w-4" />
      </MenuButton>
      <MenuItems anchor="bottom end" className="z-50 rounded-md border bg-popover p-1 shadow-md">
        <MenuItem>
          <Link href={`/admin/contests/${contestId}/submissions/${userId}`} className="flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded">
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Link>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}

export default function SubmissionsTable({ submissions }: SubmissionsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">Rank</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead className="text-right">Total Score</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {submissions.map((submission, index) => (
          <TableRow key={submission.user.id}>
            <TableCell className="text-center">#{index + 1}</TableCell>
            <TableCell>{submission.user.name}</TableCell>
            <TableCell className="text-muted-foreground">{submission.user.email}</TableCell>
            <TableCell className="text-right font-medium">{submission.totalScore}</TableCell>
            <TableCell className="text-right">
              <SubmissionActionsMenu userId={submission.user.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
