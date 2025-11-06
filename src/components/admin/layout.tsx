import AdminHeader from './header';
import AdminBreadcrumb, { type BreadcrumbItem } from './breadcrumb';

interface AdminLayoutProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export default function AdminLayout({ title, subtitle, backHref, breadcrumbs, actions, children }: AdminLayoutProps) {
  return (
    <article className="container mx-auto p-4 sm:p-6">
      <header>
        <AdminHeader title={title} subtitle={subtitle} backHref={backHref} />
      </header>

      {breadcrumbs && breadcrumbs.length > 0 && <AdminBreadcrumb items={breadcrumbs} />}

      {actions && <div className="mb-6 flex items-center gap-2">{actions}</div>}

      <main>{children}</main>
    </article>
  );
}
