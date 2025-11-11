'use client';

import { useState, useTransition } from 'react';
import { FormProvider, type SubmitHandler, useForm, useWatch } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { ArrowLeft, ArrowRight, ArrowUpToLine, CheckCircle2, Compass } from 'lucide-react';
import { z } from 'zod';

import { submitAnswersAction } from '@/actions/answers/submit-answers';
import ContestInfo from '@/components/contest/contest-info';
import { QuestionInput } from '@/components/contest/question-input';
import Timer from '@/components/contest/timer';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Stepper, StepperIndicator, StepperItem, StepperTrigger } from '@/components/ui/stepper';
import { formatTime } from '@/lib/date';
import { submitAnswersClientSchema } from '@/lib/schemas/contest.schema';
import { getContestBySlug } from '@/queries/contests';
import { zodResolver } from '@hookform/resolvers/zod';

type Props = {
  contest: NonNullable<Awaited<ReturnType<typeof getContestBySlug>>>;
};

type FormData = z.infer<typeof submitAnswersClientSchema>;

export default function QuestionForm({ contest }: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [startedAt] = useState(() => new Date().toISOString());
  const [hasTimeExpired, setHasTimeExpired] = useState(false);
  const router = useRouter();
  const steps = Array.from({ length: contest.questions.length }, (_, i) => i + 1);
  const totalQuestions = contest.questions.length;

  const methods = useForm<FormData>({
    resolver: zodResolver(submitAnswersClientSchema),
    defaultValues: {
      answers: contest.questions.reduce(
        (acc, q) => {
          acc[q.id] = { answerIds: [] };
          return acc;
        },
        {} as Record<string, { answerIds: string[] }>
      ),
      hasTimeExpired: false,
    },
  });
  const { handleSubmit, control } = methods;

  const answersMap = useWatch({
    control,
    name: 'answers',
  }) as Record<string, { answerIds?: string[] }> | undefined;
  const currentQuestion = contest.questions[currentStep - 1];
  const selectedAnswers: string[] = Array.isArray(answersMap?.[currentQuestion?.id]?.answerIds)
    ? (answersMap[currentQuestion.id].answerIds ?? [])
    : [];
  const answeredCount = Object.values(answersMap || {}).filter(value => Array.isArray(value.answerIds) && value.answerIds.length > 0).length;
  const progressPercentage = totalQuestions ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, totalQuestions));
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  if (!currentQuestion) {
    return null;
  }

  const formattedStartTime = formatTime(startedAt);
  const startLabel = formattedStartTime ? `Started ${formattedStartTime}` : 'Started just now';

  const onSubmit: SubmitHandler<FormData> = data => {
    // Only include answered questions so server-side Zod validation passes
    const answeredEntries = Object.entries(data.answers).filter(([, { answerIds }]) => Array.isArray(answerIds) && answerIds.length > 0);
    const submitData = {
      answers: answeredEntries.map(([questionId, { answerIds }]) => ({ questionId, answerIds })),
      startedAt: startedAt || new Date().toISOString(),
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
      <div className="gap-4 md:gap-8 grid grid-cols-1 md:grid-cols-[2fr_1fr] grid-rows-[auto_1fr_auto] md:grid-rows-1 grid-template-areas-['timer'_'questions'_'info'] md:grid-template-areas-['questions side']">
        {/* Timer for mobile */}
        <div className="md:hidden top-4 z-20 sticky grid-area-[timer] backdrop-blur-sm">
          {contest.timeLimit > 0 ? (
            <div className="w-full">
              <Timer
                timeLimit={contest.timeLimit}
                onTimeUp={() => {
                  setHasTimeExpired(true);
                  // reflect in the form value so client validation knows time expired
                  methods.setValue('hasTimeExpired', true);
                }}
                className="w-full"
              />
              {hasTimeExpired && (
                <div className="bg-rose-500/10 mt-2 md:mt-4 p-3 md:p-4 border border-rose-500/40 rounded-2xl text-rose-100 text-sm">
                  Time is up! You can still review your answers and submit when ready.
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-100/60 dark:bg-slate-900/60 p-4 md:p-6 border border-slate-300/10 dark:border-white/10 rounded-3xl text-slate-900 dark:text-slate-200">
              <h4 className="font-semibold text-slate-900 dark:text-white text-lg">No timer on this contest</h4>
              <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm">Take the time you need—focus on accuracy over speed.</p>
            </div>
          )}
        </div>

        {/* Questions */}
        <section className="space-y-6 grid-area-[questions]">
          <div className="bg-slate-100/80 dark:bg-slate-900/80 shadow-black/20 shadow-xl dark:shadow-black/20 p-4 md:p-6 border border-slate-300/10 dark:border-white/10 rounded-3xl text-left">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-[0.4em]">Question {currentStep}</p>
                <h3 className="mt-1 md:mt-2 font-semibold text-slate-900 dark:text-white text-2xl">Stay focused and make your choice</h3>
              </div>
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 border border-emerald-600/30 dark:border-emerald-400/30 rounded-full font-medium text-emerald-700 dark:text-emerald-100 text-sm">
                <CheckCircle2 className="w-4 h-4" /> {progressPercentage}% complete
              </div>
            </div>

            <div className="mt-4 md:mt-6">
              <Stepper
                value={currentStep}
                onValueChange={val => {
                  if (!hasTimeExpired) setCurrentStep(val);
                }}
                className="flex"
              >
                {steps.map(step => (
                  <StepperItem key={step} step={step} className="flex-1">
                    <StepperTrigger className="flex-col items-start gap-2 w-full" asChild>
                      <StepperIndicator
                        asChild
                        className={`h-2 w-full rounded-full ${step <= currentStep ? 'bg-emerald-400' : 'bg-slate-300/10 dark:bg-white/10'}`}
                      >
                        <span className="sr-only">{step}</span>
                      </StepperIndicator>
                    </StepperTrigger>
                  </StepperItem>
                ))}
              </Stepper>
              <div className="mt-2 text-slate-500 dark:text-slate-400 text-sm">
                Step {currentStep} of {steps.length}
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 md:space-y-8 mt-6 md:mt-8">
              <QuestionInput
                key={currentQuestion.id}
                questionId={currentQuestion.id}
                title={currentQuestion.title}
                content={currentQuestion.content}
                type={currentQuestion.type as 'SINGLE_CHOICE' | 'MULTIPLE_CHOICES'}
                answers={currentQuestion.answers}
                disabled={isPending || hasTimeExpired}
              />

              <div className="flex flex-wrap justify-between items-center gap-4 pt-4 md:pt-6 border-slate-300/10 dark:border-white/10 border-t">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                  <Compass className="w-4 h-4" /> {answeredCount} of {totalQuestions} questions answered
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className={`min-w-[120px] ${hasTimeExpired ? 'hidden' : ''}`}
                    onClick={handlePrev}
                    disabled={currentStep === 1 || isPending || hasTimeExpired}
                  >
                    <ArrowLeft />
                    Previous
                  </Button>

                  <Button
                    type="button"
                    className={`bg-primary hover:bg-primary/90 min-w-[150px] ${hasTimeExpired || currentStep === steps.length ? 'hidden' : ''}`}
                    onClick={handleNext}
                    disabled={selectedAnswers.length === 0 || isPending || hasTimeExpired || currentStep === steps.length}
                  >
                    Next question <ArrowRight />
                  </Button>

                  <Button
                    type="submit"
                    className={`bg-primary hover:bg-primary/90 min-w-[150px] ${hasTimeExpired || currentStep === steps.length ? '' : 'hidden'}`}
                    disabled={isPending}
                  >
                    {isPending ? 'Submitting...' : hasTimeExpired ? 'Submit answers (time elapsed)' : 'Submit answers'}
                    {isPending ? <Spinner /> : <ArrowUpToLine />}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </section>

        {/* Info for mobile */}
        <div className="md:hidden space-y-4 grid-area-[info]">
          <ContestInfo
            startLabel={startLabel}
            totalQuestions={totalQuestions}
            answeredCount={answeredCount}
            mode={contest.allowMultipleAttempts ? 'Multiple attempts' : 'Single attempt'}
          />
        </div>

        {/* Side for desktop */}
        <div className="hidden gap-4 md:gap-8 md:grid grid-cols-1 grid-rows-[auto_1fr] grid-area-[side] grid-template-areas-['timer'_'info']">
          <div className="top-4 z-20 sticky grid-area-[timer] backdrop-blur-sm">
            {contest.timeLimit > 0 ? (
              <div className="w-full">
                <Timer timeLimit={contest.timeLimit} onTimeUp={() => setHasTimeExpired(true)} className="w-full" />
                {hasTimeExpired && (
                  <div className="bg-rose-500/10 mt-2 md:mt-4 p-3 md:p-4 border border-rose-500/40 rounded-2xl text-rose-100 text-sm">
                    Time is up! You can still review your answers and submit when ready.
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-100/60 dark:bg-slate-900/60 p-4 md:p-6 border border-slate-300/10 dark:border-white/10 rounded-3xl text-slate-900 dark:text-slate-200">
                <h4 className="font-semibold text-slate-900 dark:text-white text-lg">No timer on this contest</h4>
                <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm">Take the time you need—focus on accuracy over speed.</p>
              </div>
            )}
          </div>

          <div className="space-y-4 grid-area-[info]">
            <ContestInfo
              startLabel={startLabel}
              totalQuestions={totalQuestions}
              answeredCount={answeredCount}
              mode={contest.allowMultipleAttempts ? 'Multiple attempts' : 'Single attempt'}
            />
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
