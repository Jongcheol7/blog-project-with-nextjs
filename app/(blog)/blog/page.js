export function generateMetadata() {
  return {
    title: "Next.js 인강 독학후 실습으로 만든 블로그",
    description: `
      프론트엔드를 공부를 시작한지 어느덧 3개월이 되었습니다.
      실습하기 위해 가능한 모든 페이징 기술을 구현하려고 했습니다.
      라우팅그룹, 정적라우팅, 동적라우팅, 중첩라우팅, 병렬라우팅, 인터셉트라우팅
    `
      .replace(/\s+/g, " ")
      .trim(),
  };
}

export default function BlogRootPage() {
  return null;
}
