'use client';

import { useEffect, useState } from 'react';

interface TimerProps {
  timeLimit: number; // in minutes
  onTimeUp?: () => void;
}

export default function Timer({ timeLimit, onTimeUp }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60); // convert to seconds

  useEffect(() => {
    if (timeLimit === 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLimit, onTimeUp]);

  if (timeLimit === 0) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const isWarning = timeLeft < 300; // 5 minutes

  return (
    <div className={`text-center p-4 rounded-lg text-white ${isWarning ? 'bg-red-900 border-red-700' : 'bg-gray-800 border-gray-600'} border`}>
      <div className="font-mono font-bold tabular-nums text-2xl">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      <div className="text-gray-300 text-sm">Time remaining</div>
    </div>
  );
}
