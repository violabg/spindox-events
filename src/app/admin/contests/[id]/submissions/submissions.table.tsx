import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getSubmissionsByContest } from '@/queries/submissions';

type SubmissionsTableProps = {
  submissions: Awaited<ReturnType<typeof getSubmissionsByContest>>;
};

export default function SubmissionsTable({ submissions }: SubmissionsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">Rank</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead className="text-right">Total Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {submissions.map((submission, index) => (
          <TableRow key={submission.user.id}>
            <TableCell className="text-center">#{index + 1}</TableCell>
            <TableCell>{submission.user.name}</TableCell>
            <TableCell className="text-muted-foreground">{submission.user.email}</TableCell>
            <TableCell className="text-right font-medium">{submission.totalScore}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
