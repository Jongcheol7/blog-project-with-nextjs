// app/not-found.js
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white dark:bg-black text-center px-4">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
        404 - 페이지를 찾을 수 없어요
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        존재하지 않거나 이동된 페이지입니다.
      </p>
      <a
        href="/"
        className="inline-block px-6 py-2 text-white bg-green-500 rounded hover:bg-green-600 transition"
      >
        홈으로 돌아가기
      </a>
    </div>
  );
}
