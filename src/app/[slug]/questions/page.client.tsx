'use client';

import { submitAnswersAction } from '@/actions/answers/submit-answers';
import { QuestionInput } from '@/components/question-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { submitAnswersSchema } from '@/lib/schemas/contest.schema';
import { Prisma } from '@/prisma/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

type Contest = Prisma.ContestGetPayload<{
  include: {
    questions: {
      select: {
        id: true;
        title: true;
        content: true;
        type: true;
        order: true;
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

// result types are not needed in this client file anymore

export default function ContestPageClient({ contest }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

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

  const onSubmit: SubmitHandler<FormData> = data => {
    const submitData = {
      answers: Object.entries(data.answers).map(([questionId, { answerIds }]) => ({ questionId, answerIds })),
    };

    startTransition(() => {
      submitAnswersAction(submitData, contest.slug)
        .then(() => router.push(`/${contest.slug}/results`))
        .catch(error => {
          console.error('Error submitting answers:', error);
          alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        });
    });
  };

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
                title={question.title}
                content={question.content}
                type={question.type as 'SINGLE_CHOICE' | 'MULTIPLE_CHOICES'}
                answers={question.answers}
                disabled={isPending}
              />
            ))}
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? 'Submitting...' : 'Submit Answers'}
            </Button>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
