'use client';

import { useState } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { QuestionModel } from '@/prisma/models/Question';
import { AnswerModel } from '@/prisma/models/Answer';
import { Button } from '@/components/ui/button';
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createQuestionAction } from '@/actions/questions/create.action';
import { updateQuestionAction } from '@/actions/questions/update.action';
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

// Type for Question with its answers included (what we get from the database)
type QuestionWithAnswers = QuestionModel & {
  answers: AnswerModel[];
};

type QuestionFormProps = {
  contextId: string;
  question?: QuestionWithAnswers;
};

export default function QuestionForm({ contextId, question }: QuestionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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

  const watchedTitle = useWatch({ control: form.control, name: 'title' });
  const watchedContent = useWatch({ control: form.control, name: 'content' });

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
        router.push(`/admin/contexts/${contextId}/questions`);
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

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Field>
        <FieldLabel htmlFor="title">Question Title</FieldLabel>
        <FieldContent>
          <Input id="title" placeholder="Enter question title..." {...form.register('title')} />
          <div className="flex items-center justify-between">
            <FieldDescription>A brief title for the question</FieldDescription>
            <span className="text-xs text-muted-foreground">{(watchedTitle || '').length}/200</span>
          </div>
          <FieldError errors={form.formState.errors.title ? [form.formState.errors.title] : undefined} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="content">Question Content</FieldLabel>
        <FieldContent>
          <Textarea id="content" placeholder="Enter the full question..." className="min-h-[100px]" {...form.register('content')} />
          <div className="flex items-center justify-between">
            <FieldDescription>The complete question text that users will see</FieldDescription>
            <span className="text-xs text-muted-foreground">{(watchedContent || '').length}/1000</span>
          </div>
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
                  <div className="flex items-center justify-between">
                    <div></div>
                    <span className="text-xs text-muted-foreground">{(watchedAnswers[index]?.content || '').length}/200</span>
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

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? `${isEditMode ? 'Updating' : 'Creating'}...` : `${isEditMode ? 'Update' : 'Create'} Question`}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push(`/admin/contexts/${contextId}/questions`)} disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
