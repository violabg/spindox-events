'use client';

import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type UserAnswerDetailTableProps = {
  userAnswers: {
    id: string;
    score: number;
    question: { id: string; title: string };
    answer: { id: string; content: string };
  }[];
};

export default function UserAnswerDetailTable({ userAnswers }: UserAnswerDetailTableProps) {
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
        {userAnswers.map((userAnswer, index) => (
          <TableRow key={userAnswer.id}>
            <TableCell className="text-center">{index + 1}</TableCell>
            <TableCell className="font-medium">{userAnswer.question.title}</TableCell>
            <TableCell>{userAnswer.answer.content}</TableCell>
            <TableCell className="text-right">
              <Badge variant={userAnswer.score > 0 ? 'default' : 'secondary'}>{userAnswer.score}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
