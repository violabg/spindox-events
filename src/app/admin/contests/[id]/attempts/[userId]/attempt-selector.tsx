'use client';

import { useRouter } from 'next/navigation';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAllUserAttempts } from '@/queries/userAttempts';

type AttemptSelectorProps = {
  attempts: Awaited<ReturnType<typeof getAllUserAttempts>>;
  selectedAttemptId: string;
  contestId: string;
  userId: string;
};

export default function AttemptSelector({ attempts, selectedAttemptId, contestId, userId }: AttemptSelectorProps) {
  const router = useRouter();

  const handleAttemptChange = (attemptId: string) => {
    router.push(`/admin/contests/${contestId}/attempts/${userId}?attemptId=${attemptId}`);
  };

  return (
    <Select value={selectedAttemptId} onValueChange={handleAttemptChange}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {attempts.map((attempt, index) => (
          <SelectItem key={attempt.id} value={attempt.id}>
            Attempt {index + 1} - Score: {attempt.score} - {new Date(attempt.createdAt).toLocaleString()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
