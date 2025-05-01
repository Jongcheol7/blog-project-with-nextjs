import Header from "../components/common/header";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="px-15">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
