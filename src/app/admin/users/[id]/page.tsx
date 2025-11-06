import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminLayout } from '@/components/admin';
import { notFound } from 'next/navigation';
import { getUserById } from '@/queries/users';
import { Badge } from '@/components/ui/badge';
import LinkedAccounts from '../linked-accounts';
import ToggleAdminButton from './toggle-admin-button';

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function UserDetailPage({ params }: PageProps) {
  const { id: userId } = await params;

  const user = await getUserById(userId, {
    include: {
      submissions: {
        include: {
          contest: true,
          question: true,
        },
      },
      sessions: true,
      accounts: true,
    },
  });

  if (!user) {
    notFound();
  }

  const contestsParticipated = new Map<string, { name: string; count: number }>();
  user.submissions.forEach(ua => {
    if (!contestsParticipated.has(ua.contestId)) {
      contestsParticipated.set(ua.contestId, { name: ua.contest.name, count: 0 });
    }
    const contest = contestsParticipated.get(ua.contestId);
    if (contest) {
      contest.count++;
    }
  });

  return (
    <AdminLayout title="User Details" subtitle={user.name} backHref="/admin/users">
      <div className="space-y-6">
        {/* User Information */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-end gap-2">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Name</p>
                  <p className="font-medium">{user.name}</p>
                </div>
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>{user.role === 'admin' ? 'Admin' : 'User'}</Badge>
              </div>
              <div className="flex items-end gap-2">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <Badge variant="outline">{user.emailVerified ? 'Verified' : 'Unverified'}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Joined</p>
                <p className="font-medium text-sm">{formatDate(user.createdAt)}</p>
              </div>
            </div>
            <div className="pt-4 border-t">
              <ToggleAdminButton userId={userId} isAdmin={user.role === 'admin'} />
            </div>
          </CardContent>
        </Card>

        {/* Contests Participated */}
        <Card>
          <CardHeader>
            <CardTitle>Contests Participated</CardTitle>
            <CardDescription>{contestsParticipated.size} contest(s)</CardDescription>
          </CardHeader>
          <CardContent>
            {contestsParticipated.size === 0 ? (
              <p className="text-sm text-muted-foreground">No contests participated yet</p>
            ) : (
              <div className="space-y-2">
                {Array.from(contestsParticipated.values()).map(contest => (
                  <div key={contest.name} className="flex items-center justify-between p-2 border rounded">
                    <span className="font-medium text-sm">{contest.name}</span>
                    <Badge variant="outline">{contest.count} answers</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Linked Accounts */}
        <LinkedAccounts
          accounts={user.accounts.map(account => ({
            id: account.id,
            providerId: account.providerId,
            accountId: account.accountId,
          }))}
        />
      </div>
    </AdminLayout>
  );
}
