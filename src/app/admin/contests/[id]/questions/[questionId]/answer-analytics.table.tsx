'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

type UserAnswerWithDetails = {
  id: string;
  score: number;
  userAttempt: {
    user: {
      name: string;
      email: string;
    };
  };
  answer: {
    content: string;
  };
};

type AnswerAnalyticsTableProps = {
  userAnswers: UserAnswerWithDetails[];
};

export default function AnswerAnalyticsTable({ userAnswers }: AnswerAnalyticsTableProps) {
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
        {userAnswers.map(ua => (
          <TableRow key={ua.id}>
            <TableCell className="font-medium">{ua.userAttempt.user.name}</TableCell>
            <TableCell className="text-muted-foreground">{ua.userAttempt.user.email}</TableCell>
            <TableCell>{ua.answer.content}</TableCell>
            <TableCell className="text-right">
              <Badge variant={ua.score > 0 ? 'default' : 'secondary'}>{ua.score}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
