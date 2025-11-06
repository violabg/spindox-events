import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getUsers } from '@/queries/users';
import { Eye } from 'lucide-react';
import Link from 'next/link';

type UsersTableProps = {
  users: Awaited<ReturnType<typeof getUsers<{ submissions: true; sessions: true }>>>;
};

export default function UsersTable({ users }: UsersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead className="text-center">Contests Taken</TableHead>
          <TableHead className="text-center">Sessions</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map(user => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell className="text-muted-foreground">{user.email}</TableCell>
            <TableCell className="text-center">{new Set(user.submissions.map(ua => ua.contestId)).size}</TableCell>
            <TableCell className="text-center">{user.sessions.length}</TableCell>
            <TableCell className="text-right">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/users/${user.id}`}>
                  <Eye className="w-4 h-4" />
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
