'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { ArrowRight, Trophy } from 'lucide-react';

import { CheckUserHasResultsResponse } from '@/app/api/contests/checkIfUserHasResults/route';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authClient } from '@/lib/auth-client';
import { Prisma } from '@/prisma/client';

import QuestionForm from './question-form';

export type Contest = Prisma.ContestGetPayload<{
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

export default function QuestionPreForm({ contest }: Props) {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [questionSubmitted, setQuestionSubmitted] = useState(false);

  useEffect(() => {
    const checkUserResults = async () => {
      if (!session?.user?.id) return;

      try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/contests/checkIfUserHasResults?slug=${contest.slug}&userId=${session.user.id}`, {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user results status');
        }

        const result: CheckUserHasResultsResponse = await response.json();

        if (result.hasSubmitted) {
          setQuestionSubmitted(true);
        }
      } catch (error) {
        console.error('Error checking results:', error);
      }
    };

    checkUserResults();
  }, [contest.slug, session?.user?.id]);

  const handleRedirectToResults = () => {
    setQuestionSubmitted(false);
    router.push(`/${contest.slug}/results`);
  };

  return (
    <div className="space-y-8">
      <Card className="hidden sm:block bg-slate-100/70 dark:bg-slate-900/70 border border-slate-300/10 dark:border-white/10 text-slate-900 dark:text-slate-200">
        <CardHeader className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-3">
          <div className="flex flex-col gap-2 mb-4">
            <CardTitle className="font-semibold text-slate-900 dark:text-white text-2xl">{contest.name}</CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              {contest.description || 'Select the best answers to climb the leaderboard.'}
            </CardDescription>
          </div>
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1 border border-emerald-600/30 dark:border-emerald-400/30 rounded-full font-medium text-emerald-700 dark:text-emerald-200 text-sm">
            <Trophy className="w-4 h-4" /> Ready to compete
          </div>
        </CardHeader>
        <CardContent className="gap-6 grid sm:grid-cols-3 text-slate-700 dark:text-slate-300 text-sm">
          <div className="bg-slate-100/60 dark:bg-slate-900/60 p-4 border border-slate-300/10 dark:border-white/10 rounded-2xl">
            <p className="mb-1 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wide">Contest mode</p>
            <p className="font-semibold text-slate-900 dark:text-white">{contest.allowMultipleAttempts ? 'Multiple attempts' : 'Single attempt'}</p>
          </div>
          <div className="bg-slate-100/60 dark:bg-slate-900/60 p-4 border border-slate-300/10 dark:border-white/10 rounded-2xl">
            <p className="mb-1 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wide">Time limit</p>
            <p className="font-semibold text-slate-900 dark:text-white">{contest.timeLimit ? `${contest.timeLimit} minutes` : 'No time limit'}</p>
          </div>
          <div className="bg-slate-100/60 dark:bg-slate-900/60 p-4 border border-slate-300/10 dark:border-white/10 rounded-2xl">
            <p className="mb-1 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wide">Questions</p>
            <p className="font-semibold text-slate-900 dark:text-white">{contest.questions.length}</p>
          </div>
        </CardContent>
      </Card>

      {questionSubmitted ? (
        <Card className="bg-rose-500/10 border border-rose-400/30 text-rose-900 dark:text-rose-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-rose-800 dark:text-rose-50 text-lg">You already completed this contest</CardTitle>
            <CardDescription className="text-rose-700/80 dark:text-rose-100/80">Revisit your performance and track your progress.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-3">
              <p className="text-rose-700/70 dark:text-rose-100/70 text-sm">
                Your answers are safely stored. Head to the results dashboard to review them.
              </p>
              <Button onClick={handleRedirectToResults} className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-500/90">
                View results
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <QuestionForm contest={contest} />
      )}
    </div>
  );
}
