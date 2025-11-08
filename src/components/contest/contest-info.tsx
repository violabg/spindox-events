import { Clock3 } from 'lucide-react';

interface ContestInfoProps {
  startLabel: string;
  totalQuestions: number;
  answeredCount: number;
  mode: string;
}

export default function ContestInfo({ startLabel, totalQuestions, answeredCount, mode }: ContestInfoProps) {
  return (
    <div className="space-y-4 bg-slate-900/60 p-4 md:p-6 border border-white/10 rounded-3xl text-slate-200">
      <div className="flex items-center gap-3">
        <Clock3 className="w-5 h-5 text-emerald-300" />
        <div>
          <p className="font-semibold text-white text-sm">Session timeline</p>
          <p className="text-slate-400 text-xs uppercase tracking-wide" suppressHydrationWarning>
            {startLabel}
          </p>
        </div>
      </div>
      <div className="gap-4 grid text-sm">
        <div className="bg-slate-950/60 p-4 border border-white/10 rounded-2xl">
          <p className="text-slate-400 text-xs uppercase tracking-wide">Questions remaining</p>
          <p className="mt-2 font-semibold text-white text-xl">{totalQuestions - answeredCount}</p>
        </div>
        <div className="bg-slate-950/60 p-4 border border-white/10 rounded-2xl">
          <p className="text-slate-400 text-xs uppercase tracking-wide">Current mode</p>
          <p className="mt-2 font-semibold text-white text-xl">{mode}</p>
        </div>
      </div>
    </div>
  );
}
