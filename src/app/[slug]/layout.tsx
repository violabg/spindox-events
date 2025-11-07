import Image from 'next/image';

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <header className="flex justify-between items-center gap-4 p-6 border-b">
        <Image decoding="async" width="100" height="24" src="/logo.webp" alt="" title="logo-tagline" />
        <h1 className="font-bold text-2xl">Contest Platform</h1>
      </header>
      <main className="p-6">
        <section className="mx-auto py-8 container">
          <div className="mx-auto max-w-6xl">{children}</div>
        </section>
      </main>
    </>
  );
}
