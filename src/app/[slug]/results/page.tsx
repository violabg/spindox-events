import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { CheckCircle, XCircle } from 'lucide-react';
import { headers } from 'next/headers';
import { Suspense } from 'react';
import Link from 'next/link';
import { ContestMode, QuestionType } from '@/prisma/enums';

type Params = {
  params: {
    slug: string;
  };
};

export default async function Page({ params }: Params) {
  return (
    <>
      <h1>This will be pre-rendered</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <DynamicContent params={params} />
      </Suspense>
    </>
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

  return (
    <div className="space-y-6 p-4">
      <div className={`rounded-lg border-2 p-4 ${percentage >= passScore ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
        <h2 className={`text-xl font-bold ${percentage >= passScore ? 'text-green-900' : 'text-red-900'}`}>
          {percentage >= passScore ? 'Great Job!' : 'Try Again'}
        </h2>
        <p className={`mt-2 ${percentage >= passScore ? 'text-green-800' : 'text-red-800'}`}>
          You scored {totalScore} points ({percentage}%) - {correctCount} out of
          {totalQuestions} questions correct.
        </p>
        {contest.mode === ContestMode.MULTIPLE && (
          <div className="mt-4">
            <Button asChild>
              <Link href={`/${slug}/questions`}>Retake Contest</Link>
            </Button>
          </div>
        )}
        {contest.mode === ContestMode.SINGLE && (
          <div className="mt-4">
            <p className="text-sm text-slate-600">This is a single-attempt contest. You cannot retake it.</p>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Score</CardTitle>
          <CardDescription>Final results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="gap-4 grid grid-cols-3">
            <div className="bg-slate-100 p-4 rounded-lg text-center">
              <div className="font-bold text-slate-900 text-3xl">{totalScore}</div>
              <div className="text-slate-600 text-sm">Points</div>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg text-center">
              <div className="font-bold text-blue-900 text-3xl">{percentage}%</div>
              <div className="text-blue-600 text-sm">Percentage</div>
            </div>
            <div className="bg-slate-100 p-4 rounded-lg text-center">
              <div className="font-bold text-slate-900 text-3xl">
                {correctCount}/{totalQuestions}
              </div>
              <div className="text-slate-600 text-sm">Correct</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Question Review</h3>
        {results.map((result, index) => (
          <Card key={result.questionId} className={result.isCorrect ? 'border-green-200' : 'border-red-200'}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  {result.isCorrect ? (
                    <CheckCircle className="mt-1 w-5 h-5 text-green-600 shrink-0" />
                  ) : (
                    <XCircle className="mt-1 w-5 h-5 text-red-600 shrink-0" />
                  )}
                  <div>
                    <CardTitle className="text-base">Question {index + 1}</CardTitle>
                    <CardDescription className="mt-1">{result.questionContent}</CardDescription>
                  </div>
                </div>
                <span
                  className={`rounded px-2 py-1 text-xs font-semibold ${
                    result.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {result.isCorrect ? 'Correct' : 'Incorrect'}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {!result.isCorrect && (
                <div>
                  <p className="mb-2 font-medium text-slate-700 text-sm">Your Answer:</p>
                  <div className="space-y-1">
                    {result.selectedAnswers.length === 0 ? (
                      <p className="text-red-600 text-sm italic">No answer selected</p>
                    ) : (
                      result.selectedAnswers.map((answer: string) => (
                        <p key={answer} className="text-red-600 text-sm">
                          • {answer}
                        </p>
                      ))
                    )}
                  </div>
                </div>
              )}
              <div>
                <p className="mb-2 font-medium text-slate-700 text-sm">
                  Correct Answer
                  {result.correctAnswers.length > 1 ? 's' : ''}:
                </p>
                <div className="space-y-1">
                  {result.correctAnswers.map((answer: string) => (
                    <p key={answer} className="font-medium text-green-600 text-sm">
                      ✓ {answer}
                    </p>
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
