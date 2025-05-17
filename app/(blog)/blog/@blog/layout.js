export default async function BlogHomeLayout({ children }) {
  console.log("블로그 홈화면 레이아웃");
  return (
    <div className="">
      {/* flex max-w-7xl mx-auto gap-6 px-4 py-3 */}
      <main className="">{children}</main>
      {/* flex-1 space-y-6 */}
    </div>
  );
}
