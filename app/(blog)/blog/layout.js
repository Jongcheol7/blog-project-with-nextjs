export default function BlogRootLayout({ hotblog, blog, nickname }) {
  console.log("블로그루트레이아웃");
  return (
    <>
      <main className="px-4 mb-7">{hotblog}</main>
      <section>{blog}</section>
      {nickname}
    </>
  );
}
