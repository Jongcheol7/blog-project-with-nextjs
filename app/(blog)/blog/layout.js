export default function BlogRootLayout({ hotblog, blog }) {
  console.log("블로그루트레이아웃");
  return (
    <>
      <main className="px-4">{hotblog}</main>
      <section>{blog}</section>
    </>
  );
}
