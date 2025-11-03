import prisma from '@/lib/prisma';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default async function AdminPage() {
  // Get contexts with user answer counts in a single optimized query
  const contextsData = await prisma.context.findMany({
    select: {
      id: true,
      name: true,
      status: true,
      createdAt: true,
      userAnswers: {
        select: {
          userId: true,
        },
        distinct: ['userId'],
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Transform the data to include user count
  const contextsWithUserCounts = contextsData.map(context => ({
    id: context.id,
    name: context.name,
    status: context.status,
    uniqueUserCount: context.userAnswers.length,
  }));

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your contexts and events</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Contexts</CardTitle>
              <CardDescription>All event contexts in the system ({contextsWithUserCounts.length} total)</CardDescription>
            </div>
            <Button asChild>
              <Link href="/admin/contexts/new">
                <Plus className="mr-2 h-4 w-4" />
                New
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of all event contexts.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Users Answered</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contextsWithUserCounts.map(context => (
                <TableRow key={context.id}>
                  <TableCell className="font-medium">{context.name}</TableCell>
                  <TableCell>
                    <Badge variant={context.status === 'active' ? 'default' : 'secondary'}>
                      {context.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>{context.uniqueUserCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {contextsWithUserCounts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No contexts found. Create your first context to get started.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
