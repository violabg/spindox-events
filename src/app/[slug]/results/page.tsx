import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { CheckCircle, XCircle } from 'lucide-react';
import { headers } from 'next/headers';
import { Suspense } from 'react';

type Params = {
  params: {
    slug: string;
  };
};

export default async function Page({ params }: Params) {
  return (
    <section>
      <h1>This will be pre-rendered</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <DynamicContent params={params} />
      </Suspense>
    </section>
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

  const submissions = await prisma.submission.findMany({
    where: { userId: session.user.id, contestId: contest.id },
  });

  const answersByQuestion = submissions.reduce<Record<string, string[]>>((acc, ua) => {
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
    if (question.type === 'SINGLE_CHOICE') {
      isCorrect = selectedAnswers.length === 1 && selectedAnswers[0].score > 0;
    } else if (question.type === 'MULTIPLE_CHOICES') {
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
      submissionIds: selectedAnswers.map(a => a.content),
      correctAnswerIds: correctAnswers.map(a => a.content),
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
                    <CheckCircle className="flex-shrink-0 mt-1 w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="flex-shrink-0 mt-1 w-5 h-5 text-red-600" />
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
                    {result.submissionIds.length === 0 ? (
                      <p className="text-red-600 text-sm italic">No answer selected</p>
                    ) : (
                      result.submissionIds.map(id => (
                        <p key={id} className="text-red-600 text-sm">
                          • {id}
                        </p>
                      ))
                    )}
                  </div>
                </div>
              )}
              <div>
                <p className="mb-2 font-medium text-slate-700 text-sm">
                  Correct Answer
                  {result.correctAnswerIds.length > 1 ? 's' : ''}:
                </p>
                <div className="space-y-1">
                  {result.correctAnswerIds.map(id => (
                    <p key={id} className="font-medium text-green-600 text-sm">
                      ✓ {id}
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
