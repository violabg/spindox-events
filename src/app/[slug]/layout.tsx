export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <main className="p-6">{children}</main>;
}
