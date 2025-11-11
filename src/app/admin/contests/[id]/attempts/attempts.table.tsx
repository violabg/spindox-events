'use client';

import Link from 'next/link';

import { Eye, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getUniqueUserAttemptsByContest } from '@/queries/userAttempts';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

type AttemptTableProps = {
  attempts: Awaited<ReturnType<typeof getUniqueUserAttemptsByContest>>;
  contestId: string;
};

function AttemptActionsMenu({ userId, contestId }: { userId: string; contestId: string }) {
  return (
    <Menu>
      <MenuButton as={Button} variant="ghost" size="sm">
        <MoreHorizontal className="h-4 w-4" />
      </MenuButton>
      <MenuItems anchor="bottom end" className="z-50 rounded-md border bg-popover p-1 shadow-md">
        <MenuItem>
          <Link href={`/admin/contests/${contestId}/attempts/${userId}`} className="flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded">
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Link>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}

export default function AttemptTable({ attempts, contestId }: AttemptTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">Rank</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead className="text-right">Score</TableHead>
          <TableHead className="text-right">Time Spent</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {attempts.map((attempt, index) => {
          const timeSpent = Math.round((attempt.finishedAt.getTime() - attempt.startedAt.getTime()) / 1000);
          const minutes = Math.floor(timeSpent / 60);
          const seconds = timeSpent % 60;

          return (
            <TableRow key={attempt.id}>
              <TableCell className="text-center">#{index + 1}</TableCell>
              <TableCell>{attempt.user.name}</TableCell>
              <TableCell className="text-muted-foreground">{attempt.user.email}</TableCell>
              <TableCell className="text-right font-medium">{attempt.score}</TableCell>
              <TableCell className="text-right text-sm text-muted-foreground">
                {minutes}m {seconds}s
              </TableCell>
              <TableCell className="text-right">
                <AttemptActionsMenu userId={attempt.user.id} contestId={contestId} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
