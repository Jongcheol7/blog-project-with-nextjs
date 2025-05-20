"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import NavLink from "@common/NavLink";
import { useUserStore } from "@store/UserStore";
import { Router } from "next/router";

export default function Header({ initialUser }) {
  const { user, setUser, logout } = useUserStore();
  const [isDark, setIsDark] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 창크기에 따른 보여주는 갯수 조절하기.
  useEffect(() => {
    const updateMobileDisplay = () => {
      if (window.innerWidth < 800) {
        setIsMobile(true); //모바일
      } else {
        setIsMobile(false);
      }
    };
    updateMobileDisplay();
    window.addEventListener("resize", updateMobileDisplay);
    return () => window.addEventListener("resize", updateMobileDisplay);
  }, []);

  // zustand 전역값 세팅
  useEffect(() => {
    if (initialUser) setUser(initialUser);
    else logout();
  }, [initialUser]);

  // 핵심: html 태그에 .dark 클래스를 붙여야 Tailwind가 인식함
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // 세션값 가져와서 관리자 여부인지, 세션이 있는지 판단
  const isAdmin = user?.isAdmin ? true : false;
  const isUser = user === null ? false : true;

  // 닉네임 가져오기
  const nickName = user?.nickName;

  const onHandleDarkMode = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <header
      className={`flex items-center  px-6 py-4 pb-10 ${
        isMobile ? "justify-center" : "justify-between"
      }`}
    >
      <Link href={"/"}>
        {/* <Image src="/logo2.png" width={70} height={70} alt="Logo" priority /> */}
        <p className="text-2xl font-bold">종철.log</p>
      </Link>

      {!isMobile && (
        <nav className="flex gap-4 items-center">
          <ul className="flex gap-8 text-lg font-semibold">
            {isUser && (
              <li>
                <p>
                  {user.nickName === null ? user.id : user.nickName}{" "}
                  <Link href={"/nickname"} className="hover:text-green-800">
                    ⚙️
                  </Link>{" "}
                  님
                </p>
              </li>
            )}
            <li>
              <NavLink href="/blog">Blog</NavLink>
            </li>
            <li>
              <NavLink href="/guest" className="hover:text-green-800">
                Guestbook
              </NavLink>
            </li>
            <li>
              <NavLink href="/about" className="hover:text-green-800">
                About
              </NavLink>
            </li>
            {isAdmin && (
              <li>
                <NavLink href="/manager" className="hover:text-green-800">
                  Manager
                </NavLink>
              </li>
            )}

            {/* 로그아웃시 서버에서는 잘 로그아웃이 되지만 클라이언트에서는 그걸 감지하지 못함
          따라서 Link 가 아닌 button 으로 강제적으로 리다이렉션 시켜줌. */}
            <li>
              {isUser ? (
                <button
                  onClick={() => {
                    logout();
                    window.location.href = "/api/auth/logout";
                  }}
                  className="hover:text-green-800"
                >
                  Logout
                </button>
              ) : (
                <Link href={"/login"} className="hover:text-green-800">
                  Login
                </Link>
              )}
            </li>
          </ul>
          <button
            onClick={onHandleDarkMode}
            className="w-10 text-base font-semibold px-1 py-1 rounded hover:bg-gray-100 dark:bg-white dark:text-black"
          >
            {isDark ? "☀️" : "🌙"}
          </button>
        </nav>
      )}
      {isMobile && (
        <div className="text-right">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-2xl font-bold"
          >
            ☰
          </button>
        </div>
      )}
    </header>
  );
}
