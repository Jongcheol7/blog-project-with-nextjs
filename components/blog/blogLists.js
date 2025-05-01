import Image from "next/image";

export default function BlogLists({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.POST_NO}>
          <Post post={post} />
        </li>
      ))}
    </ul>
  );
}

function Post({ post }) {
  return (
    <article>
      <div>
        <Image src={post.IMAGE_URL} alt={post.TITLE} width={300} height={200} />
      </div>
      <div>
        <header>
          <div>
            <h2>{post.TITLE}</h2>
            <p>
              Shared by {post.USER_ID} on {post.INPUT_DATETIME}
            </p>
          </div>
          <div>
            {/* <form
          //   action={action.bind(null, post.id)}
            className={post.isLiked ? "liked" : ""}
          >
            { <LikeButton /> }
          </form> */}
          </div>
        </header>
        <p>{post.CONTENT}</p>
      </div>
    </article>
  );
}
