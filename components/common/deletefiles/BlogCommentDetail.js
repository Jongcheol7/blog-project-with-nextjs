import ReactMarkdown from "react-markdown";

export default function BlogCommentDetail({
  comment,
  userId,
  onClickEdit,
  onClickDelete,
}) {
  //   console.log("블로그 댓글 디테일 : ", comment, userId);
  return (
    <>
      {/* 작성자 */}
      <p className="font-semibold text-gray-800">{comment.user_id}</p>

      {/* 본문 */}
      <div className="text-gray-700 text-sm mt-1 whitespace-pre-wrap leading-relaxed">
        <ReactMarkdown>{comment.content}</ReactMarkdown>
      </div>

      {/* 날짜 + 답글쓰기 */}
      <div className="flex justify-between text-xs text-gray-400 mt-2">
        <span>
          {new Date(comment.input_datetime).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        <div className="flex gap-2">
          <button className="hover:underline">답글쓰기</button>
          {comment.user_id === userId ? (
            <button
              className="hover:underline"
              onClick={() => onClickEdit(comment.comment_no)}
            >
              수정
            </button>
          ) : undefined}
          {comment.user_id === userId ? (
            <button
              className="hover:underline"
              onClick={() => onClickDelete(comment.comment_no)}
            >
              삭제
            </button>
          ) : undefined}
        </div>
      </div>
    </>
  );
}
