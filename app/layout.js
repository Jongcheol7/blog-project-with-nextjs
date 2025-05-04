import Header from "../components/common/Header";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="px-40">
        <Header />
        <main className="">{children}</main>
      </body>
    </html>
  );
}
