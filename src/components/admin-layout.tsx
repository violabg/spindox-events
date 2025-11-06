import React from 'react';
import AdminHeader from './admin-header';

interface AdminLayoutProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export default function AdminLayout({ title, subtitle, backHref, actions, children }: AdminLayoutProps) {
  return (
    <>
      <AdminHeader title={title} subtitle={subtitle} backHref={backHref} />

      {actions && <div className="mb-6 flex items-center gap-2">{actions}</div>}

      {children}
    </>
  );
}
