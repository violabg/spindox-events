import Image from 'next/image';
import Link from 'next/link';

import { ThemeToggle } from '@/components/theme-toggle';

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100">
      <header className="bg-linear-to-r from-slate-100/80 dark:from-slate-900/80 via-slate-100 dark:via-slate-900 to-slate-50/80 dark:to-slate-950/80 shadow-sm border-slate-300/10 dark:border-white/10 border-b">
        <div className="flex justify-between items-center gap-4 sm:gap-6 mx-auto px-3 sm:px-6 py-3 sm:py-5 max-w-7xl">
          <div className="flex items-center gap-3">
            <Image
              decoding="async"
              width="120"
              height="32"
              src="/logo.webp"
              alt="Contest platform logo"
              title="Contest Platform"
              className="filter-[invert(1)] dark:filter-[invert(0)]"
            />
            <div>
              <p className="font-semibold text-slate-600 dark:text-slate-300 text-sm uppercase tracking-wide">Spindox Events</p>
              <h1 className="font-bold text-slate-900 dark:text-white text-2xl leading-tight">Contest Experience</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <nav className="hidden sm:flex items-center gap-4 text-slate-600 dark:text-slate-300 text-sm">
              <Link href="/" className="hover:text-slate-900/90 dark:hover:text-white/90 transition">
                Home
              </Link>
              <span className="inline-flex bg-emerald-400/80 rounded-full w-2 h-2" aria-hidden />
              <span className="text-slate-900/70 dark:text-white/70">Participate</span>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="relative overflow-visible">
        <div className="absolute inset-0 bg-linear-to-br from-sky-500/5 via-fuchsia-500/5 to-primary/5" aria-hidden />
        <section className="relative px-3 sm:px-6 py-6 sm:py-14">
          <div className="mx-auto max-w-7xl">
            <div className="space-y-8 sm:space-y-10">{children}</div>
          </div>
        </section>
      </main>
    </div>
  );
}
