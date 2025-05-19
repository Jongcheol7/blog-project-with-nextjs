import Header from "@common/Header";
import "./globals.css";
import UserSession from "@lib/UserSession";

export default async function RootLayout({ children, login, nickname }) {
  const initialUser = await UserSession();

  return (
    <html lang="en">
      <body className="max-w-7xl mx-auto gap-6 px-4 py-3 bg-gray-50">
        <Header initialUser={initialUser} />
        <main className="">
          {children}
          {/* 인터셉터라우팅을 사용하려면 최상위 레이아웃에 
          사용할 인터셉터 폴더를 prop으로 무조건 받아야한 */}
          {login}
          {nickname}
        </main>
      </body>
    </html>
  );
}
