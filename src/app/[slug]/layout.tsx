import Image from 'next/image';
import Link from 'next/link';

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-100">
      <header className="bg-linear-to-r from-slate-900/80 via-slate-900 to-slate-950/80 border-white/10 border-b">
        <div className="flex justify-between items-center gap-4 sm:gap-6 mx-auto px-3 sm:px-6 py-3 sm:py-5 max-w-6xl">
          <div className="flex items-center gap-3">
            <Image decoding="async" width="120" height="32" src="/logo.webp" alt="Contest platform logo" title="Contest Platform" />
            <div>
              <p className="font-semibold text-slate-300 text-sm uppercase tracking-wide">Spindox Events</p>
              <h1 className="font-bold text-white text-2xl leading-tight">Contest Experience</h1>
            </div>
          </div>
          <nav className="hidden sm:flex items-center gap-4 text-slate-300 text-sm">
            <Link href="/" className="hover:text-white/90 transition">
              Home
            </Link>
            <span className="inline-flex bg-emerald-400/80 rounded-full w-2 h-2" aria-hidden />
            <span className="text-white/70">Participate</span>
          </nav>
        </div>
      </header>
      <main className="relative overflow-visible">
        <div className="absolute inset-0 bg-linear-to-br from-sky-500/5 via-fuchsia-500/5 to-emerald-500/5" aria-hidden />
        <section className="relative px-3 sm:px-6 py-6 sm:py-14">
          <div className="mx-auto max-w-5xl">
            <div className="space-y-8 sm:space-y-10">{children}</div>
          </div>
        </section>
      </main>
    </div>
  );
}
