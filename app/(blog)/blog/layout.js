export default function BlogLayout({ blog, hotblog }) {
  return (
    <>
      <main className="px-4">{hotblog}</main>
      <section>{blog}</section>
    </>
  );
}
