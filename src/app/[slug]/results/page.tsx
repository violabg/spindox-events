import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { CheckCircle, XCircle } from 'lucide-react';
import { headers } from 'next/headers';

type Params = {
  params: {
    slug: string;
  };
};

export default async function Page({ params }: Params) {
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
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-slate-100 p-4 text-center">
              <div className="text-3xl font-bold text-slate-900">{totalScore}</div>
              <div className="text-sm text-slate-600">Points</div>
            </div>
            <div className="rounded-lg bg-blue-100 p-4 text-center">
              <div className="text-3xl font-bold text-blue-900">{percentage}%</div>
              <div className="text-sm text-blue-600">Percentage</div>
            </div>
            <div className="rounded-lg bg-slate-100 p-4 text-center">
              <div className="text-3xl font-bold text-slate-900">
                {correctCount}/{totalQuestions}
              </div>
              <div className="text-sm text-slate-600">Correct</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Question Review</h3>
        {results.map((result, index) => (
          <Card key={result.questionId} className={result.isCorrect ? 'border-green-200' : 'border-red-200'}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {result.isCorrect ? (
                    <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                  ) : (
                    <XCircle className="mt-1 h-5 w-5 flex-shrink-0 text-red-600" />
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
                  <p className="mb-2 text-sm font-medium text-slate-700">Your Answer:</p>
                  <div className="space-y-1">
                    {result.submissionIds.length === 0 ? (
                      <p className="text-sm italic text-red-600">No answer selected</p>
                    ) : (
                      result.submissionIds.map(id => (
                        <p key={id} className="text-sm text-red-600">
                          • {id}
                        </p>
                      ))
                    )}
                  </div>
                </div>
              )}
              <div>
                <p className="mb-2 text-sm font-medium text-slate-700">
                  Correct Answer
                  {result.correctAnswerIds.length > 1 ? 's' : ''}:
                </p>
                <div className="space-y-1">
                  {result.correctAnswerIds.map(id => (
                    <p key={id} className="text-sm font-medium text-green-600">
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
