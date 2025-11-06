import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/components/admin-layout';
import ContestForm from '../contest.form';

export default function NewContestPage() {
  return (
    <AdminLayout title="Create New Contest" subtitle="Add a new event contest to the system" backHref="/admin">
      <Card>
        <CardHeader>
          <CardTitle>Contest Details</CardTitle>
          <CardDescription>Fill in the information for the new contest</CardDescription>
        </CardHeader>
        <CardContent>
          <ContestForm />
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
