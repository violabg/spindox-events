'use client';

import { deleteQuestionAction } from '@/actions/questions/delete.action';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AnswerModel } from '@/prisma/models/Answer';
import { QuestionModel } from '@/prisma/models/Question';
import { Edit, Trash2, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type QuestionWithAnswers = QuestionModel & {
  answers: AnswerModel[];
  userAnswers: { score: number }[];
};

type QuestionsTableProps = {
  contestId: string;
  questions: QuestionWithAnswers[];
};

function QuestionActionsMenu({ question, contestId }: { question: QuestionWithAnswers; contestId: string }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteQuestionAction(question.id);
      if (result.success) {
        toast.success('Question deleted successfully');
        setIsDeleteDialogOpen(false);
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
    <>
      <Menu>
        <MenuButton as={Button} variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </MenuButton>
        <MenuItems anchor="bottom end" className="z-50 rounded-md border bg-popover p-1 shadow-md">
          <MenuItem>
            <Link
              href={`/admin/contests/${contestId}/questions/${question.id}`}
              className="flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded"
            >
              <Edit className="mr-2 h-4 w-4" />
              View Analytics
            </Link>
          </MenuItem>
          <MenuItem>
            <Link
              href={`/admin/contests/${contestId}/questions/${question.id}/edit`}
              className="flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Question
            </Link>
          </MenuItem>
          <div className="my-1 h-px bg-border" />
          <MenuItem>
            <button
              onClick={() => setIsDeleteDialogOpen(true)}
              className="w-full flex items-center px-2 py-1.5 text-sm hover:bg-destructive/10 rounded text-destructive text-left"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Question
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Question</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{question.title}&rdquo;? This action cannot be undone and will also delete all associated answers
              and user responses.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
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
          <TableHead className="text-center">Avg Score</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {questions.map(question => {
          const answerCount = question.answers.length;
          const maxScore = question.answers.length > 0 ? Math.max(...question.answers.map(answer => answer.score)) : 0;

          // Calculate average score from user answers
          const avgScore =
            question.userAnswers.length > 0
              ? (question.userAnswers.reduce((sum, ua) => sum + ua.score, 0) / question.userAnswers.length).toFixed(2)
              : '0.00';

          return (
            <TableRow key={question.id}>
              <TableCell className="font-medium">{question.title}</TableCell>
              <TableCell className="text-center">{answerCount}</TableCell>
              <TableCell className="text-center">{maxScore}</TableCell>
              <TableCell className="text-center">{avgScore}</TableCell>
              <TableCell className="text-right">
                <QuestionActionsMenu question={question} contestId={contestId} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
