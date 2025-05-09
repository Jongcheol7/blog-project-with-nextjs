import Header from "@common/Header";
import "./globals.css";

export default function RootLayout({ children, login }) {
  return (
    <html lang="en">
      <body className="px-40">
        <Header />
        <main className="">
          {children}
          {/* 인터셉터라우팅을 사용하려면 최상위 레이아웃에 
          사용할 인터셉터 폴더를 prop으로 무조건 받아야한 */}
          {login}
        </main>
      </body>
    </html>
  );
}
