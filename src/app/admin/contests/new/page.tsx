import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/components/admin-layout';
import ContestForm from '../contest.form';

export default function NewContestPage() {
  return (
    <AdminLayout title="Create New Contest" subtitle="Add a new event contest to the system" backHref="/admin">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle>Contest Details</CardTitle>
          <CardDescription>Fill in the information for the new contest</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <ContestForm />
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
