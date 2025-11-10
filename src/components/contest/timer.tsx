'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface TimerProps {
  timeLimit: number; // in minutes
  onTimeUp?: () => void;
  className?: string;
}

export default function Timer({ timeLimit, onTimeUp, className }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60); // convert to seconds

  useEffect(() => {
    if (timeLimit === 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLimit, onTimeUp]);

  // Call onTimeUp from an effect when timeLeft reaches 0. Calling parent's setState
  // directly during the child's state update can trigger the React warning about
  // updating a component while rendering another. Using an effect ensures the
  // callback runs after render.
  useEffect(() => {
    if (timeLeft === 0) {
      // call asynchronously to be extra-safe
      Promise.resolve().then(() => onTimeUp?.());
    }
  }, [timeLeft, onTimeUp]);

  if (timeLimit === 0) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const isWarning = timeLeft < 300; // 5 minutes

  return (
    <div
      className={cn(
        'shadow-black/30 shadow-inner dark:shadow-black/30 p-5 border rounded-2xl font-medium text-center transition-colors',
        isWarning
          ? 'border-rose-500/50 bg-rose-500/20 text-rose-50 dark:border-rose-500/50 dark:bg-rose-500/20 dark:text-rose-50'
          : 'border-slate-500/40 dark:border-slate-500/40 bg-slate-100/80 dark:bg-slate-900/80 text-slate-900 dark:text-slate-100',
        className
      )}
    >
      <div className="font-mono font-bold tabular-nums text-2xl">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      <div className="mt-1 text-slate-600/80 dark:text-slate-300/80 text-xs uppercase tracking-wider">Time remaining</div>
    </div>
  );
}
