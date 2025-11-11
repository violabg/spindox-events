import AdminBreadcrumb, { type BreadcrumbItem } from './breadcrumb';
import AdminHeader from './header';

interface AdminLayoutProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  breadcrumbs?: BreadcrumbItem[];
  children: React.ReactNode;
}

export default function AdminLayout({ title, subtitle, backHref, breadcrumbs, children }: AdminLayoutProps) {
  return (
    <article className="container mx-auto p-4 sm:p-6">
      <header>
        <AdminHeader title={title} subtitle={subtitle} backHref={backHref} />
      </header>

      {breadcrumbs && breadcrumbs.length > 0 && <AdminBreadcrumb items={breadcrumbs} />}

      <main>{children}</main>
    </article>
  );
}
