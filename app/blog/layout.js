export default function BlogHomeLayout({ children }) {
  return (
    <div className="flex max-w-7xl mx-auto gap-6 px-4 py-8">
      {/* 좌측 카테고리 사이드바 */}
      <aside className="w-52 p-4 bg-gray-50 rounded shadow-sm">
        <h3 className="text-sm font-semibold mb-3">카테고리</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="hover:text-green-600 cursor-pointer">전체 보기</li>
          <li className="hover:text-green-600 cursor-pointer">일상</li>
          <li className="hover:text-green-600 cursor-pointer">개발</li>
          <li className="hover:text-green-600 cursor-pointer">React</li>
          <li className="hover:text-green-600 cursor-pointer">Next.js</li>
        </ul>
      </aside>

      {/* 본문 영역 */}
      <main className="flex-1 space-y-6">{children}</main>
    </div>
  );
}
