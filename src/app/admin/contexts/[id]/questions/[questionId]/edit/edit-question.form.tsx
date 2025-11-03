'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { updateQuestionAction } from './update-question.action';
import { toast } from 'sonner';

const updateQuestionSchema = z.object({
  questionId: z.string().cuid(),
  contextId: z.string().cuid(),
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  content: z.string().min(1, 'Content is required').max(1000, 'Content must be less than 1000 characters'),
  answers: z
    .array(
      z.object({
        id: z.string().cuid(),
        content: z.string().min(1, 'Answer content is required').max(200, 'Answer must be less than 200 characters'),
        isCorrect: z.boolean(),
      })
    )
    .length(4, 'Exactly 4 answers are required'),
});

type UpdateQuestionFormData = z.infer<typeof updateQuestionSchema>;

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

type EditQuestionFormProps = {
  contextId: string;
  question: QuestionData;
};

export default function EditQuestionForm({ contextId, question }: EditQuestionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<UpdateQuestionFormData>({
    resolver: zodResolver(updateQuestionSchema),
    defaultValues: {
      questionId: question.id,
      contextId,
      title: question.title,
      content: question.content,
      answers: question.answers,
    },
  });

  const watchedAnswers = useWatch({
    control: form.control,
    name: 'answers',
  });

  async function onSubmit(data: UpdateQuestionFormData) {
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
      const result = await updateQuestionAction(data);

      if (result.success) {
        toast.success('Question updated successfully');
        router.push(`/admin/contexts/${contextId}`);
      } else {
        setError(result.error || 'Failed to update question');
        setIsSubmitting(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update question');
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
          {question.answers.map((answer, index) => (
            <div key={answer.id} className="space-y-2">
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

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Updating...' : 'Update Question'}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href={`/admin/contexts/${contextId}`}>Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
