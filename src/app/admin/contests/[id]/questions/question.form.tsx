'use client';

import { Button } from '@/components/ui/button';
import { FieldDescription } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { AnswerModel } from '@/prisma/models/Answer';
import { QuestionModel } from '@/prisma/models/Question';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, Wand2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';

import { createQuestionAction } from '@/actions/questions/create.action';
import { updateQuestionAction } from '@/actions/questions/update.action';
import { FieldBase, FieldInput, FieldSelect, FieldTextarea } from '@/components/admin';
import { AIQuestionModal } from '@/components/modals';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GeneratedQuestion } from '@/lib/schemas/ai-question.schema';
import { questionSchema, type QuestionData } from '@/schemas/question.schema';
import { toast } from 'sonner';

type QuestionFormData = QuestionData;

// Type for Question with its answers included (what we get from the database)
type QuestionWithAnswers = QuestionModel & {
  answers: AnswerModel[];
};

type QuestionFormProps = {
  contestId: string;
  question?: QuestionWithAnswers;
};

export default function QuestionForm({ contestId, question }: QuestionFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [aiModalOpen, setAIModalOpen] = useState(false);
  const router = useRouter();

  const isEditMode = !!question;

  const defaultValues: QuestionFormData = {
    contestId,
    title: question?.title || '',
    content: question?.content || '',
    type: question?.type || 'SINGLE_CHOICE',
    answers: question?.answers || [{ content: '', score: 0 }],
  };

  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'answers',
  });

  const watchedType = useWatch({
    control: form.control,
    name: 'type',
  });

  const addAnswer = () => {
    append({ content: '', score: 0 });
  };

  const removeAnswer = (index: number) => {
    remove(index);
  };

  const handleAIGenerated = (generatedQuestion: GeneratedQuestion) => {
    // Update form with generated data
    form.setValue('title', generatedQuestion.title);
    form.setValue('content', generatedQuestion.content);
    // If the generated question includes a `type`, use it to set the form's question type
    if (generatedQuestion.type) {
      form.setValue('type', generatedQuestion.type as 'SINGLE_CHOICE' | 'MULTIPLE_CHOICES');
    }
    form.setValue(
      'answers',
      generatedQuestion.answers.map(answer => ({
        content: answer.content,
        score: answer.score,
      }))
    );
    toast.success('Question populated with AI-generated content');
  };

  async function onSubmit(data: QuestionFormData) {
    setError(null);

    try {
      let result;

      if (isEditMode && question) {
        // Update existing question
        result = await updateQuestionAction(contestId, question.id, data);
      } else {
        // Create new question
        result = await createQuestionAction(data);
      }

      if (result.success) {
        toast.success(isEditMode ? 'Question updated successfully' : 'Question created successfully');
        form.reset(defaultValues);
        router.push(`/admin/contests/${contestId}/questions`);
      } else {
        setError(result.error || `Failed to ${isEditMode ? 'update' : 'create'} question`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${isEditMode ? 'update' : 'create'} question`);
    }
  }

  return (
    <>
      <AIQuestionModal open={aiModalOpen} onOpenChange={setAIModalOpen} contestId={contestId} onGenerated={handleAIGenerated} />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Button type="button" variant="outline" onClick={() => setAIModalOpen(true)} title="Generate question with AI">
          <Wand2 className="w-4 h-4" /> Generate Questions
        </Button>

        <div className="gap-6 grid grid-cols-1 sm:grid-cols-2">
          <FieldInput
            name="title"
            control={form.control}
            label="Question Title"
            description="A brief title for the question"
            placeholder="Enter question title..."
            maxLength={200}
          />

          <FieldSelect
            name="type"
            control={form.control}
            label="Question Type"
            description="Choose whether users can select one answer or multiple answers"
            placeholder="Select question type"
            options={[
              { value: 'SINGLE_CHOICE', label: 'Single Choice (one correct answer)' },
              { value: 'MULTIPLE_CHOICES', label: 'Multiple Choices (multiple correct answers)' },
            ]}
          />
        </div>

        <FieldTextarea
          name="content"
          control={form.control}
          label="Question Content"
          description="The complete question text that users will see"
          placeholder="Enter the full question..."
          className="min-h-[100px]"
          maxLength={1000}
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
                <div key={field.id} className="space-y-3">
                  {/* Mobile: Stack all elements vertically, Desktop: Horizontal grid */}
                  <div className="sm:items-end gap-3 grid grid-cols-1 sm:grid-cols-[1fr_auto_auto]">
                    <FieldInput
                      control={form.control}
                      name={`answers.${index}.content`}
                      label={`Answer ${String.fromCharCode(65 + index)}`}
                      placeholder={`Enter answer ${String.fromCharCode(65 + index)}...`}
                      maxLength={200}
                      disableFieldError={true}
                    />

                    <div className="sm:contents flex gap-2">
                      <FieldBase control={form.control} name={`answers.${index}.score`} label="Score" disableFieldError={true}>
                        {({ field }) => (
                          <Input
                            id={field.name}
                            type="number"
                            min="0"
                            placeholder=""
                            className="w-full sm:w-20"
                            value={typeof field.value === 'number' ? field.value : ''}
                            onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
                          />
                        )}
                      </FieldBase>

                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeAnswer(index)}
                          className="p-2 w-10 h-10 shrink-0"
                          disabled={fields.length === 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Single error display for both content and score */}
                  {hasAnswerErrors && (
                    <div className="text-destructive text-sm">
                      {contentError && <div>Content: {contentError.message}</div>}
                      {scoreError && <div>Score: {scoreError.message}</div>}
                    </div>
                  )}
                </div>
              );
            })}
            <FieldDescription>
              {watchedType === 'SINGLE_CHOICE'
                ? 'Assign a score to exactly one answer (the correct one should have a score > 0, others 0).'
                : 'Assign scores to each answer (0 or higher). Higher scores indicate better answers.'}
              {' Add more answers as needed. Users will see these options in random order.'}
            </FieldDescription>
            <div className="pt-2">
              <Button type="button" variant="outline" onClick={addAnswer} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Answer
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Display server-side errors */}
        {error && <div className="bg-destructive/10 p-3 rounded-md text-destructive text-sm">{error}</div>}

        <div className="flex sm:flex-row flex-col gap-3 sm:gap-4 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/admin/contests/${contestId}/questions`)}
            disabled={form.formState.isSubmitting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting} className="w-full sm:w-auto">
            {form.formState.isSubmitting ? `${isEditMode ? 'Updating' : 'Creating'}...` : `${isEditMode ? 'Update' : 'Create'} Question`}
          </Button>
        </div>
      </form>
    </>
  );
}
