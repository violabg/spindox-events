'use client';

import { deleteQuestionAction } from '@/actions/questions/delete.action';
import { reorderQuestionsAction } from '@/actions/questions/reorder.action';
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
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AnswerModel } from '@/prisma/models/Answer';
import { QuestionModel } from '@/prisma/models/Question';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Edit, GripVertical, MoreHorizontal, MoveVertical, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

type QuestionWithAnswers = QuestionModel & {
  answers: AnswerModel[];
  userAnswers: { score: number }[];
  order?: number;
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
          <MoreHorizontal className="w-4 h-4" />
        </MenuButton>
        <MenuItems anchor="bottom end" className="z-50 bg-popover shadow-md p-1 border rounded-md">
          <MenuItem>
            <Link
              href={`/admin/contests/${contestId}/questions/${question.id}`}
              className="flex items-center hover:bg-accent px-2 py-1.5 rounded text-sm"
            >
              <Edit className="mr-2 w-4 h-4" />
              View Analytics
            </Link>
          </MenuItem>
          <MenuItem>
            <Link
              href={`/admin/contests/${contestId}/questions/${question.id}/edit`}
              className="flex items-center hover:bg-accent px-2 py-1.5 rounded text-sm"
            >
              <Edit className="mr-2 w-4 h-4" />
              Edit Question
            </Link>
          </MenuItem>
          <div className="my-1 bg-border h-px" />
          <MenuItem>
            <button
              onClick={() => setIsDeleteDialogOpen(true)}
              className="flex items-center hover:bg-destructive/10 px-2 py-1.5 rounded w-full text-destructive text-sm text-left"
            >
              <Trash2 className="mr-2 w-4 h-4" />
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
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
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
  const [items, setItems] = useState<QuestionWithAnswers[]>(() => [...questions]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [dropTarget, setDropTarget] = useState<{ id: string; position: 'above' | 'below' } | null>(null);

  const onDragStart = (e: React.DragEvent, id: string) => {
    if (!isReordering) return;
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggingId(id);
    setDropTarget(null);
  };

  const onDragOver = (e: React.DragEvent) => {
    if (!isReordering) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const offset = e.clientY - rect.top;
    const position = offset > rect.height / 2 ? 'below' : 'above';
    const id = target.getAttribute('data-id');
    if (id) setDropTarget({ id, position });
  };

  const moveItem = (list: QuestionWithAnswers[], fromIndex: number, toIndex: number) => {
    const updated = [...list];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    return updated;
  };

  const onDrop = async (e: React.DragEvent, targetId: string) => {
    if (!isReordering) return;
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    if (!draggedId) return;
    if (draggedId === targetId) return;

    const fromIndex = items.findIndex(i => i.id === draggedId);
    let toIndex = items.findIndex(i => i.id === targetId);
    if (fromIndex === -1 || toIndex === -1) return;

    // adjust toIndex based on dropTarget position
    if (dropTarget && dropTarget.id === targetId && dropTarget.position === 'below') {
      toIndex = toIndex + 1;
    }

    // If dropping to a later index and fromIndex < toIndex, we need to account for removed item
    const adjustedToIndex = toIndex > fromIndex ? toIndex - 1 : toIndex;

    const updated = moveItem(items, fromIndex, adjustedToIndex);
    setItems(updated);
    setDropTarget(null);

    // Persist order to server
    try {
      setIsSaving(true);
      const orderedIds = updated.map(i => i.id);
      const result = await reorderQuestionsAction(contestId, orderedIds);
      if (!result.success) {
        toast.error(result.error || 'Failed to save order');
        // rollback by resetting to original props
        setItems([...questions]);
      } else {
        toast.success('Order saved');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to save order');
      setItems([...questions]);
    } finally {
      setIsSaving(false);
      setDraggingId(null);
    }
  };

  const toggleReorder = () => {
    setIsReordering(v => {
      const next = !v;
      if (!next) {
        // exiting reorder mode: clear any visual state
        setDropTarget(null);
        setDraggingId(null);
      }
      return next;
    });
  };

  return (
    <div>
      {questions.length > 1 && (
        <div className="flex justify-end mb-4 w-full">
          <Button onClick={toggleReorder} variant={isReordering ? 'secondary' : 'outline'} size="sm" disabled={isSaving}>
            <MoveVertical className="mr-2 w-4 h-4" />
            {isReordering ? 'Done' : 'Reorder Questions'}
          </Button>
        </div>
      )}

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
          {items.map(question => {
            const answerCount = question.answers.length;
            const maxScore = question.answers.length > 0 ? Math.max(...question.answers.map(answer => answer.score)) : 0;

            const avgScore =
              question.userAnswers.length > 0
                ? (question.userAnswers.reduce((sum, ua) => sum + ua.score, 0) / question.userAnswers.length).toFixed(2)
                : '0.00';

            return (
              <TableRow
                key={question.id}
                data-id={question.id}
                draggable={isReordering}
                onDragStart={e => onDragStart(e, question.id)}
                onDragOver={onDragOver}
                onDrop={e => onDrop(e, question.id)}
                className={`relative ${draggingId === question.id ? 'opacity-50' : ''}`}
              >
                <TableCell className="flex items-center gap-3 font-medium">
                  {isReordering && (
                    <span className="text-muted-foreground cursor-grab" aria-hidden>
                      <GripVertical className="w-4 h-4" />
                    </span>
                  )}
                  <span>{question.title}</span>

                  {/* Drop indicator (moved inside a td to avoid invalid HTML structure) */}
                  {dropTarget?.id === question.id && (
                    <div
                      className={`pointer-events-none absolute left-0 right-0 h-0.5 bg-primary transition-all ${
                        dropTarget.position === 'above' ? 'top-0' : 'bottom-0'
                      }`}
                    />
                  )}
                </TableCell>
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
    </div>
  );
}
