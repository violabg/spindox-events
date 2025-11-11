import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ArrowRight, Trophy } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getContestBySlug } from '@/queries/contests';
import { getAttemptsByContest } from '@/queries/userAttempts';
import { PageWithParams } from '@/types/pageWithParams';

import QuestionForm from './question-form';

export default async function ContestPage({ params }: PageWithParams<{ slug: string }>) {
  const { slug } = await params;

  const contest = await getContestBySlug(slug);

  if (!contest || !contest.active) return notFound();
  const attempt = await getAttemptsByContest(contest.id);

  const canSubmit = contest.allowMultipleAttempts || !attempt;

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

      {canSubmit ? (
        <QuestionForm contest={contest} />
      ) : (
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
              <Button className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-500/90" asChild>
                <Link href={`/${contest.slug}/results`}>
                  View results
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
