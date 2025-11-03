import prisma from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import ContestsTable from './contests.table';

export default async function AdminPage() {
  // Get contests with user answer counts in a single optimized query
  const contestsData = await prisma.contest.findMany({
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
  const contestsWithUserCounts = contestsData.map(contest => ({
    id: contest.id,
    name: contest.name,
    slug: contest.slug,
    status: contest.status,
    uniqueUserCount: contest.userAnswers.length,
  }));

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Manage your contests and events</p>
      </div>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Contests</CardTitle>
              <CardDescription>All event contests in the system ({contestsWithUserCounts.length} total)</CardDescription>
            </div>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/admin/contests/new">
                <Plus className="mr-2 h-4 w-4" />
                New
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <ContestsTable contests={contestsWithUserCounts} />
        </CardContent>
      </Card>
    </div>
  );
}
