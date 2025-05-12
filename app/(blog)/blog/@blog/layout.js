export default async function BlogHomeLayout({ children }) {
  return (
    <div className="flex max-w-7xl mx-auto gap-6 px-4 py-3">
      <main className="flex-1 space-y-6">{children}</main>
    </div>
  );
}
