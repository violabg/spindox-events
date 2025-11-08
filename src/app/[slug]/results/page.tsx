import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { ContestMode, QuestionType } from '@/prisma/enums';
import { CheckCircle, XCircle } from 'lucide-react';
import { headers } from 'next/headers';
import Link from 'next/link';
import { Suspense } from 'react';

type Params = {
  params: {
    slug: string;
  };
};

export default async function Page({ params }: Params) {
  return (
    <Suspense fallback={<ResultsSkeleton />}>
      <DynamicContent params={params} />
    </Suspense>
  );
}

async function DynamicContent({ params }: Params) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  const { slug } = await params;

  const contest = await prisma.contest.findUnique({
    where: { slug: slug },
    include: {
      questions: {
        include: {
          answers: true,
        },
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!contest) {
    throw new Error('Contest not found');
  }

  // Get the latest attempt for this user
  const attempt = await prisma.userAttempts.findFirst({
    where: {
      userId: session.user.id,
      contestId: contest.id,
    },
    include: {
      userAnswers: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!attempt) {
    throw new Error('No attempt found');
  }

  const answersByQuestion = attempt.userAnswers.reduce<Record<string, string[]>>((acc, ua) => {
    if (!acc[ua.questionId]) acc[ua.questionId] = [];
    acc[ua.questionId].push(ua.answerId);
    return acc;
  }, {});

  let totalScore = 0;
  let correctCount = 0;

  const results = contest.questions.map(question => {
    const selectedIds = answersByQuestion[question.id] || [];
    const selectedAnswers = question.answers.filter(a => selectedIds.includes(a.id));
    const correctAnswers = question.answers.filter(a => a.score > 0);

    let isCorrect = false;
    if (question.type === QuestionType.SINGLE_CHOICE) {
      isCorrect = selectedAnswers.length === 1 && selectedAnswers[0].score > 0;
    } else if (question.type === QuestionType.MULTIPLE_CHOICES) {
      const selSet = new Set(selectedAnswers.map(a => a.id));
      const corSet = new Set(correctAnswers.map(a => a.id));
      isCorrect = selSet.size === corSet.size && [...selSet].every(id => corSet.has(id));
    }

    if (isCorrect) {
      correctCount++;
      totalScore += selectedAnswers.reduce((s, a) => s + a.score, 0);
    }

    return {
      questionId: question.id,
      questionContent: question.content,
      // Render the answer text instead of raw IDs so the UI shows readable content
      selectedAnswers: selectedAnswers.map(a => a.content),
      correctAnswers: correctAnswers.map(a => a.content),
      isCorrect,
    };
  });

  const totalQuestions = contest.questions.length;

  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const passScore = 70;

  const rawDurationMs = new Date(attempt.finishedAt).getTime() - new Date(attempt.startedAt).getTime();
  const durationMs = Math.max(rawDurationMs, 0);
  const totalDurationSeconds = Math.floor(durationMs / 1000);
  const durationMinutes = Math.floor(totalDurationSeconds / 60);
  const durationSeconds = totalDurationSeconds % 60;
  const formattedDuration = `${String(durationMinutes).padStart(2, '0')}:${String(durationSeconds).padStart(2, '0')}`;

  const passed = percentage >= passScore;
  const modeLabel = contest.mode === ContestMode.MULTIPLE ? 'Multiple attempts' : 'Single attempt';

  return (
    <div className="space-y-10 text-slate-100">
      <div
        className={`rounded-3xl border border-white/10 p-8 shadow-xl shadow-black/20 ${
          passed
            ? 'bg-linear-to-br from-emerald-500/20 via-emerald-500/10 to-slate-900/60'
            : 'bg-linear-to-br from-rose-500/25 via-rose-500/10 to-slate-900/60'
        }`}
      >
        <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-6">
          <div>
            <p className="text-white/70 text-sm uppercase tracking-[0.4em]">Contest summary</p>
            <h2 className="mt-3 font-semibold text-3xl sm:text-4xl">{passed ? 'Great job!' : 'Keep going, you are close!'}</h2>
            <p className="mt-4 max-w-2xl text-slate-200 text-sm">
              You scored {totalScore} points ({percentage}%) with {correctCount} correct answers out of {totalQuestions}.{' '}
              {passed ? 'Celebrate your progress and keep the momentum going.' : 'Review the insights below and try another round.'}
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-6 font-semibold text-xs uppercase tracking-wide">
              <span className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 border border-white/30 rounded-full text-white/90">
                {modeLabel}
              </span>
              <span className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 border border-white/30 rounded-full text-white/90">
                Duration {formattedDuration}
              </span>
              <span className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 border border-white/30 rounded-full text-white/90">
                Attempted on {new Date(attempt.finishedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          {contest.mode === ContestMode.MULTIPLE ? (
            <Button asChild size="lg" className="bg-emerald-500 hover:bg-emerald-500/90 text-slate-950">
              <Link href={`/${slug}/questions`}>Retake contest</Link>
            </Button>
          ) : (
            <p className="text-white/70 text-sm">Single-attempt contest - review your answers below.</p>
          )}
        </div>
      </div>

      <Card className="bg-slate-900/70 border border-white/10 text-slate-100">
        <CardHeader>
          <CardTitle className="text-white">Performance snapshot</CardTitle>
          <CardDescription className="text-slate-400">Key metrics from your latest attempt</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="gap-4 grid sm:grid-cols-3">
            <div className="bg-slate-950/60 p-5 border border-white/10 rounded-2xl text-center">
              <p className="text-slate-400 text-xs uppercase tracking-wide">Total points</p>
              <p className="mt-3 font-semibold text-white text-4xl">{totalScore}</p>
            </div>
            <div className="bg-slate-950/60 p-5 border border-white/10 rounded-2xl text-center">
              <p className="text-slate-400 text-xs uppercase tracking-wide">Accuracy</p>
              <p className="mt-3 font-semibold text-white text-4xl">{percentage}%</p>
            </div>
            <div className="bg-slate-950/60 p-5 border border-white/10 rounded-2xl text-center">
              <p className="text-slate-400 text-xs uppercase tracking-wide">Correct answers</p>
              <p className="mt-3 font-semibold text-white text-4xl">
                {correctCount}/{totalQuestions}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/70 border border-white/10 text-slate-100">
        <CardHeader>
          <CardTitle className="text-white">Session timeline</CardTitle>
          <CardDescription className="text-slate-400">Track when this attempt started and finished</CardDescription>
        </CardHeader>
        <CardContent className="gap-4 grid sm:grid-cols-3">
          <div className="bg-slate-950/60 p-4 border border-white/10 rounded-2xl">
            <p className="text-slate-400 text-xs uppercase tracking-wide">Start time</p>
            <p className="mt-2 font-medium text-white text-lg">{new Date(attempt.startedAt).toLocaleTimeString()}</p>
          </div>
          <div className="bg-slate-950/60 p-4 border border-white/10 rounded-2xl">
            <p className="text-slate-400 text-xs uppercase tracking-wide">Finish time</p>
            <p className="mt-2 font-medium text-white text-lg">{new Date(attempt.finishedAt).toLocaleTimeString()}</p>
          </div>
          <div className="bg-slate-950/60 p-4 border border-white/10 rounded-2xl">
            <p className="text-slate-400 text-xs uppercase tracking-wide">Elapsed</p>
            <p className="mt-2 font-medium text-white text-lg">{formattedDuration} (mm:ss)</p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-white text-xl">Question review</h3>
          <p className="text-slate-400 text-sm">Deep dive into each answer below</p>
        </div>
        {results.map((result, index) => (
          <Card
            key={result.questionId}
            className={`border border-white/10 bg-slate-900/70 border-l-4 ${
              result.isCorrect ? 'border-emerald-400 bg-emerald-500/5' : 'border-rose-400 bg-rose-500/5'
            }`}
          >
            <CardHeader>
              <div className="flex sm:flex-row flex-col sm:justify-between sm:items-start gap-3">
                <div className="flex items-start gap-3">
                  {result.isCorrect ? <CheckCircle className="mt-1 w-5 h-5 text-emerald-400" /> : <XCircle className="mt-1 w-5 h-5 text-rose-400" />}
                  <div>
                    <CardTitle className="text-white text-base">Question {index + 1}</CardTitle>
                    <CardDescription className="mt-1 text-slate-200">{result.questionContent}</CardDescription>
                  </div>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    result.isCorrect ? 'bg-emerald-500/20 text-emerald-200' : 'bg-rose-500/20 text-rose-200'
                  }`}
                >
                  {result.isCorrect ? 'Correct' : 'Incorrect'}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {!result.isCorrect && (
                <div className="bg-rose-500/10 p-4 border border-rose-400/30 rounded-2xl text-rose-100">
                  <p className="font-semibold text-rose-50">Your answer</p>
                  <div className="space-y-1 mt-2">
                    {result.selectedAnswers.length === 0 ? (
                      <p className="italic">No answer selected</p>
                    ) : (
                      result.selectedAnswers.map(answer => <p key={answer}>• {answer}</p>)
                    )}
                  </div>
                </div>
              )}
              <div className="bg-emerald-500/10 p-4 border border-emerald-400/30 rounded-2xl text-emerald-100">
                <p className="font-semibold text-emerald-50">Correct answer{result.correctAnswers.length > 1 ? 's' : ''}</p>
                <div className="space-y-1 mt-2">
                  {result.correctAnswers.map(answer => (
                    <p key={answer}>✓ {answer}</p>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ResultsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="bg-slate-900/60 border border-white/10 rounded-3xl h-40" />
      <div className="bg-slate-900/60 border border-white/10 rounded-3xl h-48" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="bg-slate-900/60 border border-white/10 rounded-2xl h-32" />
        ))}
      </div>
    </div>
  );
}
