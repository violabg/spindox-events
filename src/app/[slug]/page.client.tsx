'use client';

import { ContestResults } from '@/components/contest-results';
import { QuestionInput } from '@/components/question-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { submitAnswersSchema } from '@/lib/schemas/contest.schema';
import { Prisma } from '@/prisma/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

type Contest = Prisma.ContestGetPayload<{
  include: {
    questions: {
      include: {
        answers: {
          select: {
            id: true;
            content: true;
            score: true;
          };
        };
      };
    };
  };
}>;

type Props = {
  contest: Contest;
};

type FormData = z.infer<typeof submitAnswersSchema>;

interface ResultItem {
  questionId: string;
  questionContent: string;
  userAnswerIds: string[];
  correctAnswerIds: string[];
  isCorrect: boolean;
}

type SubmitResult = {
  score: number;
  totalQuestions: number;
  correctCount: number;
  results: ResultItem[];
};

export default function ContestPageClient({ contest }: Props) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);

  const methods = useForm<FormData>({
    resolver: zodResolver(submitAnswersSchema),
    defaultValues: {
      answers: contest.questions.reduce(
        (acc, q) => {
          acc[q.id] = { answerIds: [] };
          return acc;
        },
        {} as Record<string, { answerIds: string[] }>
      ),
    },
  });

  const onSubmit: SubmitHandler<FormData> = async data => {
    setLoading(true);
    try {
      const submitData = {
        answers: Object.entries(data.answers).map(([questionId, { answerIds }]) => ({
          questionId,
          answerIds,
        })),
      };

      const response = await fetch(`/api/contests/${contest.slug}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit answers');
      }

      const results = await response.json();
      setResult(results);
    } catch (error) {
      console.error('Error submitting answers:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return <ContestResults {...result} />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Answer Questions</CardTitle>
        <CardDescription>Please select your answers below and submit when ready.</CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            {contest.questions.map(question => (
              <QuestionInput
                key={question.id}
                questionId={question.id}
                type={question.type as 'SINGLE_CHOICE' | 'MULTIPLE_CHOICES'}
                answers={question.answers}
                disabled={loading}
              />
            ))}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Submitting...' : 'Submit Answers'}
            </Button>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
