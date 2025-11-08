'use client';

import { CheckUserHasResultsResponse } from '@/app/api/contests/checkIfUserHasResults/route';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { Prisma } from '@/prisma/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
    <>
      {questionSubmitted ? (
        <div className={`rounded-lg border-2 p-4 border-red-200 bg-red-50'}`}>
          <h2 className={`text-xl font-bold text-red-900'}`}>Already Submitted</h2>
          <p className="text-muted-foreground text-sm">You have already submitted your answers for this contest.</p>
          <p className="text-muted-foreground text-sm">You can view your results and submissions by going to the results page.</p>
          <div className="flex gap-2">
            <Button onClick={handleRedirectToResults} className="flex-1">
              View Results
            </Button>
          </div>
        </div>
      ) : (
        <QuestionForm contest={contest} />
      )}
    </>
  );
}
