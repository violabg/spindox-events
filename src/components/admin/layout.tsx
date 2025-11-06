import AdminHeader from './header';

interface AdminLayoutProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  children: React.ReactNode;
}

export default function AdminLayout({ title, subtitle, backHref, children }: AdminLayoutProps) {
  return (
    <article className="container mx-auto p-4 sm:p-6">
      <header>
        <AdminHeader title={title} subtitle={subtitle} backHref={backHref} />
      </header>

      <main>{children}</main>
    </article>
  );
}
