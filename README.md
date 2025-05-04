This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 깃 배포하는법

git status # 뭐가 바뀌었는지 보기
git add . # 전체 파일 추가
git commit -m "수정 내용" # 기록 남기기
git push origin main # GitHub에 올리기

## 파일 구성

- app/about/page.js About 페이지 (추후 메뉴 연결 예정)
- app/actions/blog.js 서버 액션 - insert 등 데이터 쓰기 관련 처리
  -> 2025.05.04 : 태그 중복 제거를 위해 set 사용
  -> 2025.05.04 : revalidatePath 를 / 루트가 아닌 /blog 를 사용해 성능 향상상
- app/api/blog/route.js 클라이언트 fetch용 블로그 API
  -> 2025.05.04 : try-catch 추가
- app/api/category/route.js 클라이언트 fetch용 카테고리 API
  -> 2025.05.04 : try-catch 추가
- app/blog/page.js 블로그 홈 화면
  -> 변수명 변경 filterPosts → filteredPosts
- app/blog-write/page.js 블로그 글쓰기 페이지
- app/guest/page.js 방명록 페이지 (미구현)
- components/blog/BlogLists.js 게시글 목록 표시 UI
  -> 2025.05.04 : 이미지 없을시 기본이미지 보이도록 placeholder-img 파일 public에 추가
- components/blog/BlogListsCategory.js 블로그 사이드 카테고리 목록
  -> 2025.05.04 : 전체보기 카테고리 추가
- components/blog/BlogWriteCategory.js 글쓰기 화면에서 카테고리 선택
- components/blog/BlogWriteForm.js 글쓰기 전체 레이아웃
  -> 2025.05.04 : tag를 join(",")사용하여 명시적으로 , 구분
  -> 2025.05.04 : pending 을 form내부에 넣을수 있도록 수정(제출버튼)
- components/common/Header.js 공통 헤더
  -> 점검완료
- components/common/Image.js 이미지 업로드 시 미리보기 UI
- components/common/NavLink.js 헤더 메뉴 항목 (네비게이션 링크 구성)
