'use client';

import { submitAnswersAction } from '@/actions/answers/submit-answers';
import { QuestionInput } from '@/components/question-input';
import { Button } from '@/components/ui/button';
import { Stepper, StepperIndicator, StepperItem, StepperTrigger } from '@/components/ui/stepper';
import { submitAnswersSchema } from '@/lib/schemas/contest.schema';
import { Prisma } from '@/prisma/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
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

export default function QuestionForm({ contest }: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const steps = Array.from({ length: contest.questions.length }, (_, i) => i + 1);

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

  const currentQuestion = contest.questions[currentStep - 1];
  const selectedAnswers = methods.watch(`answers.${currentQuestion.id}.answerIds`);

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
    <FormProvider {...methods}>
      <div className="space-y-8 mx-auto text-center">
        <div className="space-y-3">
          <Stepper value={currentStep} onValueChange={setCurrentStep}>
            {steps.map(step => (
              <StepperItem key={step} step={step} className="flex-1">
                <StepperTrigger className="flex-col items-start gap-2 w-full" asChild>
                  <StepperIndicator asChild className="bg-border rounded-none w-full h-2">
                    <span className="sr-only">{step}</span>
                  </StepperIndicator>
                </StepperTrigger>
              </StepperItem>
            ))}
          </Stepper>
          <div className="font-medium tabular-nums text-muted-foreground text-sm">
            Step {currentStep} of {steps.length}
          </div>
        </div>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          {contest.questions
            .filter((_, index) => index === currentStep - 1)
            .map(question => (
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
          {currentStep === steps.length && (
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? 'Submitting...' : 'Submit Answers'}
            </Button>
          )}
        </form>
        <div className="flex justify-center space-x-4">
          {/* <Button variant="outline" className="w-32" onClick={() => setCurrentStep(prev => prev - 1)} disabled={currentStep === 1}>
            Prev step
          </Button> */}
          {currentStep < steps.length && (
            <Button variant="outline" className="w-32" onClick={() => setCurrentStep(prev => prev + 1)} disabled={selectedAnswers.length === 0}>
              Next step
            </Button>
          )}
        </div>
      </div>
    </FormProvider>
  );
}
