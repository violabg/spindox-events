import prisma from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import ContextsTable from './contexts.table';

export default async function AdminPage() {
  // Get contexts with user answer counts in a single optimized query
  const contextsData = await prisma.context.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
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
    slug: context.slug,
    status: context.status,
    uniqueUserCount: context.userAnswers.length,
  }));

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Manage your contexts and events</p>
      </div>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Contexts</CardTitle>
              <CardDescription>All event contexts in the system ({contextsWithUserCounts.length} total)</CardDescription>
            </div>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/admin/contexts/new">
                <Plus className="mr-2 h-4 w-4" />
                New
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <ContextsTable contexts={contextsWithUserCounts} />
        </CardContent>
      </Card>
    </div>
  );
}
