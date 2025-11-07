'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getSubmissionsByUserAndContest } from '@/queries/submissionsByUserAndContest';
import { Badge } from '@/components/ui/badge';

type SubmissionDetailTableProps = {
  submissions: Awaited<ReturnType<typeof getSubmissionsByUserAndContest>>;
};

export default function SubmissionDetailTable({ submissions }: SubmissionDetailTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">No.</TableHead>
          <TableHead>Question</TableHead>
          <TableHead>Answer</TableHead>
          <TableHead className="text-right">Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {submissions.map((submission, index) => (
          <TableRow key={submission.id}>
            <TableCell className="text-center">{index + 1}</TableCell>
            <TableCell className="font-medium">{submission.question.title}</TableCell>
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
