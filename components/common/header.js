"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import NavLink from "@common/NavLink";

export default function Header() {
  const [isDark, setIsDark] = useState(false);

  const onHandleDarkMode = () => {
    setIsDark((prev) => !prev);
  };

  // 💡 핵심: html 태그에 .dark 클래스를 붙여야 Tailwind가 인식함
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <header className="flex items-center justify-between px-6 py-4 pb-10">
      <Link href={"/"}>
        {/* <Image src="/logo2.png" width={70} height={70} alt="Logo" priority /> */}
        <p className="text-2xl font-bold">종철.log</p>
      </Link>

      <nav className="flex gap-4 items-center">
        <ul className="flex gap-8 text-lg font-semibold">
          <li>
            <NavLink href="/blog">Blog</NavLink>
          </li>
          <li>
            <NavLink href="/guest" className="hover:text-green-800">
              Guest
            </NavLink>
          </li>
          <li>
            <NavLink href="/about" className="hover:text-green-800">
              About
            </NavLink>
          </li>
          <li>
            <NavLink href="/manager" className="hover:text-green-800">
              관리자
            </NavLink>
          </li>
          <li>
            <NavLink href="/login" className="hover:text-green-800">
              Login
            </NavLink>
          </li>
        </ul>
        <button
          onClick={onHandleDarkMode}
          className="w-10 text-base font-semibold px-1 py-1 rounded hover:bg-gray-100 dark:bg-white dark:text-black"
        >
          {isDark ? "☀️" : "🌙"}
        </button>
      </nav>
    </header>
  );
}
