import BlogHotLists from "@components/blog/BlogHotLists";

export default function HotBlogPage() {
  console.log("인기글 페이지");
  return (
    <section>
      <p className="font-bold text-xl mb-1">🔥Hot</p>
      <BlogHotLists />
    </section>
  );
}
