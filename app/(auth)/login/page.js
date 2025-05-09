export default function LoginPage() {
  return (
    <div>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow-lg">
          <h2 className="text-xl mb-4">로그인</h2>
          <div className="flex gap-3">
            <a
              href="/api/auth/google"
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Google로 로그인
            </a>
            <a
              href="/api/auth/kakao"
              className="bg-yellow-500 text-white px-4 py-2 rounded"
            >
              KakaoTalk으으로 로그인
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
