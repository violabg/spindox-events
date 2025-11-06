import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdminLayout } from '@/components/admin';
import { notFound } from 'next/navigation';
import { getContestById } from '@/queries/contests';
import { formatDate } from '@/lib/date';
import Link from 'next/link';
import { ExternalLink, Edit } from 'lucide-react';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ContestDetailPage({ params }: PageProps) {
  const { id } = await params;

  const contest = await getContestById(id);

  if (!contest) {
    notFound();
  }

  return (
    <AdminLayout
      title={contest.name}
      subtitle="Contest details and information"
      backHref="/admin/contests"
      breadcrumbs={[{ label: 'Contests', href: '/admin/contests' }, { label: contest.name }]}
    >
      <div className="grid gap-6">
        {/* Header Card with Status */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-2xl">{contest.name}</CardTitle>
                <CardDescription className="mt-2">{contest.description || 'No description'}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={contest.status === 'active' ? 'default' : 'secondary'} className="whitespace-nowrap">
                  {contest.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
                <Button asChild size="icon" variant="ghost" className="h-8 w-8">
                  <Link href={`/${contest.slug}`} target="_blank" title="View on site">
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Details Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">ID</p>
                <p className="text-sm font-mono mt-1">{contest.id}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Slug</p>
                <p className="text-sm mt-1">{contest.slug}</p>
              </div>
              {contest.theme && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase">Theme</p>
                  <p className="text-sm mt-1">{contest.theme}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Created</p>
                <p className="text-sm mt-1">{formatDate(contest.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Last Updated</p>
                <p className="text-sm mt-1">{formatDate(contest.updatedAt)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <Link href={`/admin/contests/${id}/questions`}>View Questions</Link>
              </Button>
              <Button asChild>
                <Link href={`/admin/contests/${id}/submissions`}>View Submissions</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={`/admin/contests/${id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
