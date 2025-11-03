'use client';

import { useState } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit } from 'lucide-react';
import { createQuestionAction } from './questions/create.action';
import { updateQuestionAction } from './questions/update.action';
import { toast } from 'sonner';

const questionSchema = z.object({
  contextId: z.string().cuid(),
  questionId: z.string().cuid().optional(),
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  content: z.string().min(1, 'Content is required').max(1000, 'Content must be less than 1000 characters'),
  answers: z
    .array(
      z.object({
        id: z.string().cuid().optional(),
        content: z.string().min(1, 'Answer content is required').max(200, 'Answer must be less than 200 characters'),
        isCorrect: z.boolean(),
      })
    )
    .length(4, 'Exactly 4 answers are required'),
});

type QuestionFormData = z.infer<typeof questionSchema>;

type QuestionData = {
  id: string;
  title: string;
  content: string;
  answers: {
    id: string;
    content: string;
    isCorrect: boolean;
  }[];
};

type QuestionModalProps = {
  contextId: string;
  question?: QuestionData;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
};

export default function QuestionModal({ contextId, question, trigger, onSuccess }: QuestionModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!question;

  const defaultValues: QuestionFormData = {
    contextId,
    questionId: question?.id,
    title: question?.title || '',
    content: question?.content || '',
    answers: question?.answers || [
      { content: '', isCorrect: false },
      { content: '', isCorrect: false },
      { content: '', isCorrect: false },
      { content: '', isCorrect: false },
    ],
  };

  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues,
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: 'answers',
  });

  const watchedAnswers = useWatch({
    control: form.control,
    name: 'answers',
  });

  async function onSubmit(data: QuestionFormData) {
    setIsSubmitting(true);
    setError(null);

    // Validate that exactly one answer is correct
    const correctAnswers = data.answers.filter(answer => answer.isCorrect);
    if (correctAnswers.length !== 1) {
      setError('Exactly one answer must be marked as correct');
      setIsSubmitting(false);
      return;
    }

    try {
      let result;

      if (isEditMode && question) {
        // Update existing question
        result = await updateQuestionAction({
          questionId: question.id,
          contextId: data.contextId,
          title: data.title,
          content: data.content,
          answers: data.answers.map((answer, index) => ({
            id: question.answers[index].id,
            content: answer.content,
            isCorrect: answer.isCorrect,
          })),
        });
      } else {
        // Create new question
        result = await createQuestionAction({
          contextId: data.contextId,
          title: data.title,
          content: data.content,
          answers: data.answers.map(answer => ({
            content: answer.content,
            isCorrect: answer.isCorrect,
          })),
        });
      }

      if (result.success) {
        toast.success(isEditMode ? 'Question updated successfully' : 'Question created successfully');
        form.reset(defaultValues);
        setOpen(false);
        onSuccess?.();
      } else {
        setError(result.error || `Failed to ${isEditMode ? 'update' : 'create'} question`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${isEditMode ? 'update' : 'create'} question`);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleCorrectAnswerChange = (index: number, checked: boolean) => {
    if (checked) {
      // Set this answer as correct and all others as false
      const updatedAnswers = watchedAnswers.map((answer, i) => ({
        ...answer,
        isCorrect: i === index,
      }));
      form.setValue('answers', updatedAnswers);
    } else {
      // Just set this answer to false
      form.setValue(`answers.${index}.isCorrect`, false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset form when closing
      form.reset(defaultValues);
      setError(null);
    }
  };

  const defaultTrigger = isEditMode ? (
    <Button variant="outline" size="sm">
      <Edit className="h-4 w-4" />
    </Button>
  ) : (
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      Add Question
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Question' : 'Add New Question'}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update the question details and answer options. Mark exactly one answer as correct.'
              : 'Create a new question with 4 answer options. Mark exactly one answer as correct.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Field>
            <FieldLabel htmlFor="title">Question Title</FieldLabel>
            <FieldContent>
              <Input id="title" placeholder="Enter question title..." {...form.register('title')} />
              <FieldDescription>A brief title for the question</FieldDescription>
              <FieldError errors={form.formState.errors.title ? [form.formState.errors.title] : undefined} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="content">Question Content</FieldLabel>
            <FieldContent>
              <Textarea id="content" placeholder="Enter the full question..." className="min-h-[100px]" {...form.register('content')} />
              <FieldDescription>The complete question text that users will see</FieldDescription>
              <FieldError errors={form.formState.errors.content ? [form.formState.errors.content] : undefined} />
            </FieldContent>
          </Field>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Answer Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-2">
                  <Field>
                    <FieldLabel htmlFor={`answer-${index}`}>Answer {String.fromCharCode(65 + index)}</FieldLabel>
                    <FieldContent>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <Input
                            id={`answer-${index}`}
                            placeholder={`Enter answer ${String.fromCharCode(65 + index)}...`}
                            {...form.register(`answers.${index}.content`)}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`correct-${index}`}
                            checked={watchedAnswers[index]?.isCorrect || false}
                            onCheckedChange={checked => handleCorrectAnswerChange(index, !!checked)}
                          />
                          <FieldLabel htmlFor={`correct-${index}`} className="text-sm font-normal">
                            Correct
                          </FieldLabel>
                        </div>
                      </div>
                      <FieldError
                        errors={form.formState.errors.answers?.[index]?.content ? [form.formState.errors.answers[index]?.content] : undefined}
                      />
                    </FieldContent>
                  </Field>
                </div>
              ))}
              <FieldDescription>Mark exactly one answer as correct. Users will see these options in random order.</FieldDescription>
            </CardContent>
          </Card>

          {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? `${isEditMode ? 'Updating' : 'Creating'}...` : `${isEditMode ? 'Update' : 'Create'} Question`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
