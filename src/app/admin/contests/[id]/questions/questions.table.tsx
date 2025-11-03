'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2, Edit } from 'lucide-react';
import { QuestionModel } from '@/prisma/models/Question';
import { AnswerModel } from '@/prisma/models/Answer';
import { deleteQuestionAction } from '@/actions/questions/delete.action';
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
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={isDeleting}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Question</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{questionTitle}&quot;? This action cannot be undone and will also delete all associated answers and
            user responses.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function QuestionsTable({ contestId, questions }: QuestionsTableProps) {
  return (
    <>
      <Table>
        <TableCaption>A list of all questions for this contest.</TableCaption>
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
      {questions.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">No questions found. Create your first question to get started.</div>
      )}
    </>
  );
}
