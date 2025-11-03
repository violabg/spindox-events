'use client';

import { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { QuestionModel } from '@/prisma/models/Question';
import { AnswerModel } from '@/prisma/models/Answer';
import { Button } from '@/components/ui/button';
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createQuestionAction } from '@/actions/questions/create.action';
import { updateQuestionAction } from '@/actions/questions/update.action';
import { toast } from 'sonner';
import { FormInput } from '@/components/form/form-input';

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
        score: z.number().int().min(0, 'Score must be 0 or greater'),
      })
    )
    .min(1, 'At least 1 answer is required'),
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
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const isEditMode = !!question;

  const defaultValues: QuestionFormData = {
    contextId,
    questionId: question?.id,
    title: question?.title || '',
    content: question?.content || '',
    answers: question?.answers || [{ content: '', score: 0 }],
  };

  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    mode: 'onChange',
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'answers',
  });

  const addAnswer = () => {
    append({ content: '', score: 0 });
  };

  const removeAnswer = (index: number) => {
    remove(index);
  };

  async function onSubmit(data: QuestionFormData) {
    setError(null);

    try {
      let result;

      if (isEditMode && question) {
        // Update existing question
        result = await updateQuestionAction({
          questionId: question.id,
          contextId: data.contextId,
          title: data.title,
          content: data.content,
          answers: data.answers.map(answer => ({
            content: answer.content,
            score: answer.score,
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
            score: answer.score,
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
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Controller
        name="title"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel htmlFor="title">Question Title</FieldLabel>
            <FieldContent>
              <Input id="title" placeholder="Enter question title..." {...field} />
              <div className="flex items-center justify-between">
                <FieldDescription>A brief title for the question</FieldDescription>
                <span className="text-xs text-muted-foreground">{(field.value || '').length}/200</span>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </FieldContent>
          </Field>
        )}
      />

      <Controller
        name="content"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel htmlFor="content">Question Content</FieldLabel>
            <FieldContent>
              <Textarea id="content" placeholder="Enter the full question..." className="min-h-[100px]" {...field} />
              <div className="flex items-center justify-between">
                <FieldDescription>The complete question text that users will see</FieldDescription>
                <span className="text-xs text-muted-foreground">{(field.value || '').length}/1000</span>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </FieldContent>
          </Field>
        )}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Answer Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map((field, index) => {
            // Get errors for this specific answer
            const contentError = form.formState.errors.answers?.[index]?.content;
            const scoreError = form.formState.errors.answers?.[index]?.score;
            const hasAnswerErrors = contentError || scoreError;

            return (
              <div key={field.id} className="space-y-2">
                <div className="grid grid-cols-[1fr_120px_auto] gap-3 items-end">
                  <FormInput
                    control={form.control}
                    name={`answers.${index}.content`}
                    label={`Answer ${String.fromCharCode(65 + index)}`}
                    disableFieldError={true}
                  >
                    {({ field }) => (
                      <Input
                        id={field.name}
                        placeholder={`Enter answer ${String.fromCharCode(65 + index)}...`}
                        value={typeof field.value === 'string' ? field.value : ''}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    )}
                  </FormInput>

                  <FormInput control={form.control} name={`answers.${index}.score`} label="Score" disableFieldError={true}>
                    {({ field }) => (
                      <Input
                        id={field.name}
                        type="number"
                        min="0"
                        placeholder=""
                        className="w-20"
                        value={typeof field.value === 'number' ? field.value : ''}
                        onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
                      />
                    )}
                  </FormInput>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeAnswer(index)}
                    className="p-2 self-end"
                    disabled={fields.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Single error display for both content and score */}
                {hasAnswerErrors && (
                  <div className="text-sm text-destructive">
                    {contentError && <div>Content: {contentError.message}</div>}
                    {scoreError && <div>Score: {scoreError.message}</div>}
                  </div>
                )}
              </div>
            );
          })}
          <FieldDescription>
            Assign scores to each answer (0 or higher). Higher scores indicate better answers. Add more answers as needed. Users will see these
            options in random order.
          </FieldDescription>
          <div className="pt-2">
            <Button type="button" variant="outline" onClick={addAnswer} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Answer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Display server-side errors */}
      {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

      <div className="flex gap-4">
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? `${isEditMode ? 'Updating' : 'Creating'}...` : `${isEditMode ? 'Update' : 'Create'} Question`}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/admin/contexts/${contextId}/questions`)}
          disabled={form.formState.isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
