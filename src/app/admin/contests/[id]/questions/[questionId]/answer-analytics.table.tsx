'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

type SubmissionWithDetails = {
  id: string;
  user: {
    name: string;
    email: string;
  };
  answer: {
    content: string;
    score: number;
  };
  score: number;
};

type AnswerAnalyticsTableProps = {
  submissions: SubmissionWithDetails[];
};

export default function AnswerAnalyticsTable({ submissions }: AnswerAnalyticsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Answer</TableHead>
          <TableHead className="text-right">Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {submissions.map(submission => (
          <TableRow key={submission.id}>
            <TableCell className="font-medium">{submission.user.name}</TableCell>
            <TableCell className="text-muted-foreground">{submission.user.email}</TableCell>
            <TableCell>{submission.answer.content}</TableCell>
            <TableCell className="text-right">
              <Badge variant={submission.score > 0 ? 'default' : 'secondary'}>{submission.score}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
