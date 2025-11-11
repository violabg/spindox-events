'use client';

import { useState } from 'react';

import Link from 'next/link';

import { Edit, Eye, MoreHorizontal, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { deleteUserAction } from '@/actions/users/delete.action';
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
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/date';
import { getUsers } from '@/queries/users';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

type UsersTableProps = {
  users: Awaited<ReturnType<typeof getUsers<{ attempts: true; sessions: true }>>>;
};

function UserActionsMenu({ user }: { user: UsersTableProps['users'][number] }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteUserAction(user.id);
      if (result.success) {
        toast.success('User deleted successfully');
        setIsDeleteDialogOpen(false);
      } else {
        toast.error(result.error || 'Failed to delete user');
      }
    } catch {
      toast.error('Failed to delete user');
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
            <Link href={`/admin/users/${user.id}`} className="flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded">
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Link>
          </MenuItem>
          <MenuItem>
            <Link href={`/admin/users/${user.id}/edit`} className="flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded">
              <Edit className="mr-2 h-4 w-4" />
              Edit User
            </Link>
          </MenuItem>
          <div className="my-1 h-px bg-border" />
          <MenuItem>
            <button
              onClick={() => setIsDeleteDialogOpen(true)}
              className="w-full flex items-center px-2 py-1.5 text-sm hover:bg-destructive/10 rounded text-destructive text-left"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete User
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete &ldquo;{user.name}&rdquo;? This action cannot be undone.</AlertDialogDescription>
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

export default function UsersTable({ users }: UsersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map(user => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell className="text-muted-foreground">{user.email}</TableCell>
            <TableCell>{user.role || '-'}</TableCell>
            <TableCell>{formatDate(user.createdAt)}</TableCell>
            <TableCell className="text-right">
              <UserActionsMenu user={user} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
