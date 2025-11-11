import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { LogInIcon, Sparkles, Timer, Trophy } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getContestBySlug } from '@/queries/contests';
import { PageWithParams } from '@/types/pageWithParams';
import { headers } from 'next/headers';

export default async function ContestPage({ params }: PageWithParams<{ slug: string }>) {
  const { slug } = await params;

  const contest = await getContestBySlug(slug);
  if (!contest || !contest.active) return notFound();

  const session = await auth.api.getSession({ headers: await headers() });

  const user = await prisma.user.findUnique({ where: { id: session?.user.id } });

  const missingProfile = !user?.ageRange || !user?.companyName || !user?.jobTitle || !user?.firstName || !user?.lastName;

  if (contest?.requireCompletedProfile && missingProfile) {
    redirect(`/${slug}/profile?needRedirect=true`);
  }

  return (
    <div className="space-y-8">
      <div className="bg-linear-to-br from-slate-100/60 dark:from-slate-900/60 via-slate-100/40 dark:via-slate-900/40 to-slate-100/60 dark:to-slate-900/60 shadow-black/30 shadow-inner dark:shadow-black/30 p-8 border border-slate-300/5 dark:border-white/5 rounded-3xl">
        <p className="font-semibold text-slate-500 dark:text-slate-400 text-sm uppercase tracking-[0.4em]">Featured Challenge</p>
        <h2 className="mt-4 font-semibold text-slate-900 dark:text-white text-3xl sm:text-4xl">{contest.name}</h2>
        <p className="mt-4 max-w-2xl text-slate-700 dark:text-slate-300 text-base">
          {contest.description || 'Get ready to test your knowledge and climb the leaderboard.'}
        </p>
        <div className="flex flex-wrap gap-3 mt-6 text-slate-600 dark:text-slate-200 text-sm">
          <span className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 border border-emerald-400/40 rounded-full">
            <span className="bg-emerald-400 rounded-full w-2 h-2" aria-hidden />
            Active now
          </span>
          <span className="inline-flex items-center gap-2 bg-slate-200/60 dark:bg-slate-800/60 px-4 py-1.5 border border-slate-500/40 dark:border-slate-500/40 rounded-full">
            Mode:{' '}
            <strong className="font-semibold text-slate-900 dark:text-white">
              {contest.allowMultipleAttempts ? 'Multiple attempts' : 'Single attempt'}
            </strong>
          </span>
          <span className="inline-flex items-center gap-2 bg-slate-200/60 dark:bg-slate-800/60 px-4 py-1.5 border border-slate-500/40 dark:border-slate-500/40 rounded-full">
            Questions: <strong className="font-semibold text-slate-900 dark:text-white">{contest.questions.length}</strong>
          </span>
          <span className="inline-flex items-center gap-2 bg-slate-200/60 dark:bg-slate-800/60 px-4 py-1.5 border border-slate-500/40 dark:border-slate-500/40 rounded-full">
            Time limit:{' '}
            <strong className="font-semibold text-slate-900 dark:text-white">{contest.timeLimit ? `${contest.timeLimit} min` : 'No limit'}</strong>
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-4 mt-8">
          <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
            <Link href={`/${slug}/questions`}>
              Enter Contest <LogInIcon />
            </Link>
          </Button>
          <p className="text-slate-500 dark:text-slate-400 text-sm">You&apos;ll have immediate access to all questions once you start.</p>
        </div>
      </div>

      <Card className="bg-slate-100/80 dark:bg-slate-900/80 border border-slate-300/5 dark:border-white/5 text-slate-900 dark:text-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white">Contest insights</CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400">Know the rules before you begin</CardDescription>
        </CardHeader>
        <CardContent className="gap-6 grid sm:grid-cols-3">
          <div className="bg-linear-to-br from-primary/10 dark:from-primary/10 via-primary/5 dark:via-primary/5 to-slate-50/70 dark:to-slate-950/70 shadow-inner shadow-primary/10 p-5 border border-slate-300/10 dark:border-white/10 rounded-2xl">
            <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-200">
              <Sparkles className="w-5 h-5" />
              <p className="text-xs uppercase tracking-wide">Your mission</p>
            </div>
            <p className="mt-3 text-slate-700 dark:text-slate-200 text-sm">
              Answer every question and submit when you feel confident with your choices.
            </p>
          </div>
          <div className="bg-linear-to-br from-amber-500/10 dark:from-amber-500/10 via-amber-500/5 dark:via-amber-500/5 to-slate-50/70 dark:to-slate-950/70 shadow-amber-500/10 shadow-inner p-5 border border-slate-300/10 dark:border-white/10 rounded-2xl">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-200">
              <Trophy className="w-5 h-5" />
              <p className="text-xs uppercase tracking-wide">Scoring</p>
            </div>
            <p className="mt-3 text-slate-700 dark:text-slate-200 text-sm">
              Each correct answer boosts your score. Chase multipliers hidden in multi-choice rounds.
            </p>
          </div>
          <div className="bg-linear-to-br from-sky-500/10 dark:from-sky-500/10 via-sky-500/5 dark:via-sky-500/5 to-slate-50/70 dark:to-slate-950/70 shadow-inner shadow-sky-500/10 p-5 border border-slate-300/10 dark:border-white/10 rounded-2xl">
            <div className="flex items-center gap-3 text-sky-600 dark:text-sky-200">
              <Timer className="w-5 h-5" />
              <p className="text-xs uppercase tracking-wide">Timing</p>
            </div>
            <p className="mt-3 text-slate-700 dark:text-slate-200 text-sm">
              {contest.timeLimit
                ? 'The clock starts as soon as you begin. Stay sharp and watch the countdown.'
                : 'No ticking clock today—take a deep breath and plan each answer.'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
