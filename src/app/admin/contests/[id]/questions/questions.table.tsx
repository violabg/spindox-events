'use client';

import { deleteQuestionAction } from '@/actions/questions/delete.action';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ConfirmationDialog } from '@/components/admin';
import { AnswerModel } from '@/prisma/models/Answer';
import { QuestionModel } from '@/prisma/models/Question';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

type QuestionWithAnswers = QuestionModel & {
  answers: AnswerModel[];
};

type QuestionsTableProps = {
  contestId: string;
  questions: QuestionWithAnswers[];
};

function DeleteQuestionButton({ questionId, questionTitle }: { questionId: string; questionTitle: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteQuestionAction(questionId);
      if (result.success) {
        toast.success('Question deleted successfully');
      } else {
        toast.error(result.error || 'Failed to delete question');
      }
    } catch {
      toast.error('Failed to delete question');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ConfirmationDialog
      title="Delete Question"
      description={`Are you sure you want to delete "${questionTitle}"? This action cannot be undone and will also delete all associated answers and user responses.`}
      actionText="Delete"
      onAction={handleDelete}
      isLoading={isDeleting}
      isDangerous
    >
      <Button variant="outline" size="sm" disabled={isDeleting}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </ConfirmationDialog>
  );
}

export default function QuestionsTable({ contestId, questions }: QuestionsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead className="text-center">Answers</TableHead>
          <TableHead className="text-center">Max Score</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {questions.map(question => {
          const answerCount = question.answers.length;
          const maxScore = question.answers.length > 0 ? Math.max(...question.answers.map(answer => answer.score)) : 0;

          return (
            <TableRow key={question.id}>
              <TableCell className="font-medium">{question.title}</TableCell>
              <TableCell className="text-center">{answerCount}</TableCell>
              <TableCell className="text-center">{maxScore}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/contests/${contestId}/questions/${question.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <DeleteQuestionButton questionId={question.id} questionTitle={question.title} />
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
