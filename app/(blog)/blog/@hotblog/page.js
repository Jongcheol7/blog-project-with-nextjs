import BlogHotLists from "@components/blog/BlogHotLists";

export default function HotBlogPage() {
  console.log("인기글 페이지");
  return (
    <section>
      <h2>🔥인기글🔥</h2>
      <BlogHotLists />
    </section>
  );
}
