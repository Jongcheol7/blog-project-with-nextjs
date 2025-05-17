import sql from "better-sqlite3";

const db = new sql("blog.db");

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS USERS(
        id TEXT PRIMARY KEY,
        password TEXT,
        name TEXT,
        email TEXT
    )
  `);
  // Lucia용 세션 테이블 생성
  db.exec(`
    CREATE TABLE IF NOT EXISTS SESSIONS (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES USERS(id)
    )
`);
  db.exec(`
        CREATE TABLE IF NOT EXISTS BLOG(
            post_no INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            image_url TEXT NULL,
            user_id TEXT NOT NULL,
            views INTEGER DEFAULT 0,
            private_yn TEXT DEFAULT 'N',
            category_id INTEGER,
            input_datetime DATETIME DEFAULT CURRENT_TIMESTAMP,
            mod_datetime DATETIME NULL,
            del_datetime DATETIME NULL,
            FOREIGN KEY(user_id) REFERENCES USERS(id),
            FOREIGN KEY(category_id) REFERENCES CATEGORY(category_id)
        )
    `);
  db.exec(`
      CREATE TABLE IF NOT EXISTS TAGS(
        tag_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
      )
    `);
  db.exec(`
      CREATE TABLE IF NOT EXISTS BLOG_TAGS(
        post_no INTEGER,
        tag_id INTEGER,
        UNIQUE(post_no, tag_id),
        FOREIGN KEY(post_no) REFERENCES BLOG(post_no),
        FOREIGN KEY(tag_id) REFERENCES TAGS(tag_id)
      )
    `);
  db.exec(`
      CREATE TABLE IF NOT EXISTS COMMENT(
        comment_no INTEGER PRIMARY KEY AUTOINCREMENT,
        post_no INTEGER NOT NULL,
        user_id TEXT NOT NULL,
        content TEXT NOT NULL,
        parent_no INTEGER DEFAULT NULL,
        input_datetime DATETIME DEFAULT CURRENT_TIMESTAMP,
        mod_datetime DATETIME,
        mod_user_id TEXT,
        del_datetime DATETIME,
        del_user_id TEXT,
        FOREIGN KEY(post_no) REFERENCES BLOG(post_no),
        FOREIGN KEY(user_id) REFERENCES USERS(id)
      )
    `);
  db.exec(`
      CREATE TABLE IF NOT EXISTS CATEGORY(
        category_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        parent_id INTEGER
      )
    `);
  db.exec(`
      CREATE TABLE IF NOT EXISTS BLOG_LIKES(
        user_id TEXT NOT NULL,
        post_no INTEGER NOT NULL,
        PRIMARY KEY(user_id, post_no),
        FOREIGN KEY(user_id) REFERENCES USERS(id),
        FOREIGN KEY(post_no) REFERENCES BLOG(post_no)
      )
    `);
  db.exec(`
      CREATE TABLE IF NOT EXISTS GUESTBOOK(
        guestbook_no INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        content TEXT NOT NULL,
        secret_yn TEXT NOT NULL DEFAULT 'N',
        input_datetime DATETIME DEFAULT CURRENT_TIMESTAMP,
        mod_datetime DATETIME,
        del_datetime DATETIME
      )
    `);

  const stmt3 = db.prepare("SELECT COUNT(*) AS CNT FROM CATEGORY");
  // console.log(stmt3);
  // console.log(stmt3.get());
  if (stmt3.get().CNT === 0) {
    db.exec(
      `INSERT INTO CATEGORY(CATEGORY_ID,NAME,PARENT_ID) 
      VALUES(1, '일상', NULL)
      ,(2, '개발', NULL)
      ,(3, 'React', 2)
      ,(4, 'NextJs', 2)`
    );
  }

  //const stmt4 = db.prepare("SELECT COUNT(*) AS CNT FROM USERS");
  // console.log(stmt4);
  // console.log(stmt4.get());
  // if (stmt4.get().CNT === 0) {
  //   db.exec(
  //     `INSERT INTO USERS(USER_ID,PASSWORD,NAME,EMAIL)
  //     VALUES('jclee','1234','이종철','jclee@naver.com')`
  //   );
  // }
}

initDb();

export async function selectBlogs(loginUserId) {
  return db
    .prepare(
      `
        SELECT B.post_no, 
               B.title, 
               B.content,
               B.image_url, 
               B.user_id, 
               B.views,
               B.private_yn,
               B.category_id,
               B.input_datetime,
               GROUP_CONCAT(T.name,',') AS tags,
               CASE WHEN EXISTS(
                SELECT 1 
                FROM BLOG_LIKES BL
                WHERE BL.post_no = B.post_no
                AND BL.user_id = :loginUserId
               ) THEN 'Y' ELSE 'N' END like_yn
        FROM BLOG B JOIN BLOG_TAGS BT 
        ON B.post_no = BT.post_no 
        JOIN TAGS T 
        ON BT.tag_id = T.tag_id
        WHERE B.del_datetime IS NULL
        GROUP BY B.post_no
        ORDER BY B.input_datetime DESC
        `
    )
    .all({ loginUserId });
}
export function selectBlog(postNo, loginUserId) {
  return db
    .prepare(
      `
      SELECT B.post_no, 
               B.title, 
               B.content,
               B.image_url, 
               B.user_id, 
               B.views,
               B.private_yn,
               B.category_id,
               B.input_datetime,
               GROUP_CONCAT(T.name,',') AS tags,
               CASE WHEN EXISTS(
                SELECT 1 
                FROM BLOG_LIKES BL
                WHERE BL.post_no = B.post_no
                AND BL.user_id = :loginUserId
               ) THEN 'Y' ELSE 'N' END like_yn
        FROM BLOG B JOIN BLOG_TAGS BT 
        ON B.post_no = BT.post_no 
        JOIN TAGS T 
        ON BT.tag_id = T.tag_id
        WHERE B.del_datetime IS NULL
        AND B.post_no = :postNo
        GROUP BY B.post_no
        ORDER BY B.input_datetime DESC 
    `
    )
    .get({ postNo: postNo, loginUserId: loginUserId });
}

export async function selectHotBlogs() {
  return db
    .prepare(
      `
        SELECT post_no, 
               title, 
               content,
               image_url, 
               user_id, 
               views,
               private_yn,
               category_id,
               input_datetime
        FROM BLOG  
        WHERE del_datetime IS NULL
        AND input_datetime >= DATETIME('now', '-7 days') 
        ORDER BY views DESC 
        LIMIT 5
    `
    )
    .all();
}

export async function selectCategory() {
  return db
    .prepare(
      `
      SELECT 
          category_id,
          name AS category_name,
          CASE 
            WHEN parent_id IS NULL THEN '대분류'
            ELSE '소분류'
            END AS category_type,
          parent_id
      FROM CATEGORY
      ORDER BY 
      COALESCE(parent_id, category_id),
      category_type
  `
    )
    .all();
}

export async function insertBlog(post) {
  console.log("post: ", post);
  return db
    .prepare(
      `
        INSERT INTO BLOG(title, content, image_url, user_id, category_id, input_datetime, private_yn) 
        VALUES(?,?,?,?,?,CURRENT_TIMESTAMP,?)
        `
    )
    .run(
      post.title,
      post.content,
      post.imageUrl,
      post.userId,
      post.categoryId,
      post.privateYn
    );
}

export async function insertTags(tagNames, postNo) {
  console.log("tagNames: ", tagNames);
  for (const tagName of tagNames) {
    console.log("tagName: ", tagName);
    //sqlite는 merge 지원이 안된단다..
    db.prepare(
      `
        INSERT OR IGNORE INTO TAGS (name) VALUES(?)
      `
    ).run(tagName);
    const tag = db
      .prepare(`SELECT tag_id FROM TAGS WHERE name = ?`)
      .get(tagName);
    if (tag) {
      db.prepare(
        `
          INSERT INTO BLOG_TAGS(post_no, tag_id) VALUES(?,?)
        `
      ).run(postNo, tag.tag_id);
    }
  }
}

export async function deleteBlog(postNo) {
  return db
    .prepare(
      `
      UPDATE BLOG SET del_datetime = CURRENT_TIMESTAMP WHERE post_no = ?
    `
    )
    .run(postNo);
}

export async function deleteBlogTags(postNo) {
  return db
    .prepare(
      `
      DELETE FROM BLOG_TAGS WHERE post_no = ?
    `
    )
    .run(postNo);
}
export async function deleteTags(postNo) {
  return db
    .prepare(
      `
      DELETE FROM TAGS WHERE tag_id IN(
        SELECT tag_id FROM BLOG_TAGS WHERE post_no = ?
      ) 
    `
    )
    .run(postNo);
}

export async function updateBlog(post) {
  return db
    .prepare(
      `
      UPDATE BLOG 
      SET title = ?,
          content = ?,
          image_url = ?,
          category_id = ?,
          mod_datetime = CURRENT_TIMESTAMP,
          private_yn = ?
      WHERE post_no = ?
    `
    )
    .run(
      post.title,
      post.content,
      post.imageUrl,
      post.categoryId,
      post.privateYn,
      post.postNo
    );
}

// 유저 조회
export async function findUserById(userId) {
  return db.prepare("SELECT * FROM USERS WHERE id = ?").get(userId);
}

// 유저 삽입
export async function insertUser(user) {
  return db
    .prepare("INSERT INTO USERS(id, email) VALUES(?, ?)")
    .run(user.id, user.email);
}

// 블로그 조회수 증가
export async function blogViewUp(postNo) {
  return db
    .prepare(
      `
    UPDATE BLOG SET views = views + 1 WHERE post_no = ? 
    `
    )
    .run(postNo);
}

// 블로그 좋아요 업데이트
export async function updateBlogLike(postNo, userId) {
  const existing = db
    .prepare(`SELECT 1 FROM BLOG_LIKES WHERE post_no = ? AND user_id = ?`)
    .get(postNo, userId);

  if (existing) {
    db.prepare(`DELETE FROM BLOG_LIKES WHERE post_no = ? AND user_id = ?`).run(
      postNo,
      userId
    );
  } else {
    db.prepare(`INSERT INTO BLOG_LIKES (post_no, user_id) VALUES (?, ?)`).run(
      postNo,
      userId
    );
  }

  const count = db
    .prepare(`SELECT COUNT(*) as count FROM BLOG_LIKES WHERE post_no = ?`)
    .get(postNo).count;

  return { liked: existing ? "N" : "Y", likeCount: count };
}

// 댓글 조회
export async function selectComments(postNo) {
  return db
    .prepare(
      `
    WITH RECURSIVE comment_tree AS (
      SELECT 
        comment_no, 
        parent_no, 
        post_no,
        content, 
        user_id, 
        input_datetime,
        0 AS depth,
        CAST(comment_no AS TEXT) AS path
      FROM COMMENT
      WHERE parent_no IS NULL AND post_no = :postNo

      UNION ALL

      SELECT 
        c.comment_no, 
        c.parent_no, 
        c.post_no,
        c.content, 
        c.user_id, 
        c.input_datetime,
        p.depth + 1,
        p.path || '-' || c.comment_no
      FROM COMMENT c
      JOIN comment_tree p ON c.parent_no = p.comment_no
      WHERE c.post_no = :postNo
    )
    SELECT * FROM comment_tree
    ORDER BY path
    `
    )
    .all({ postNo: postNo });
}

// 댓글 작성
export async function insertComment(comment) {
  return db
    .prepare(
      `
      INSERT INTO COMMENT(post_no, user_id, content, parent_no, input_datetime) 
      VALUES(?, ?, ?, ?, CURRENT_TIMESTAMP)
    `
    )
    .run(comment.postNo, comment.userId, comment.content, comment.parentNo);
}

// 댓글 수정
export async function updateComment(comment) {
  return db
    .prepare(
      `
      UPDATE COMMENT 
      SET content = ?, 
          mod_datetime = CURRENT_TIMESTAMP,
          mod_user_id = ? 
      WHERE comment_no = ? 
      AND user_id = ?
    `
    )
    .run(comment.content, comment.user_id, comment.comment_no, comment.user_id);
}

// 댓글 삭제
export async function deleteComment(commentNo) {
  return db
    .prepare(
      `
      DELETE FROM COMMENT 
      WHERE comment_no = ? 
    `
    )
    .run(commentNo);
}

// 방명록 글 조회
export async function selectGuestbook() {
  return db
    .prepare(
      `
      SELECT * FROM GUESTBOOK
      WHERE del_datetime IS NULL
      ORDER BY input_datetime DESC
    `
    )
    .all();
}

// 방명록 글 생성
export async function insertGuestbook(guestbook) {
  console.log("방명록 글 생성 객체 조회 :", guestbook);
  return db
    .prepare(
      `
      INSERT INTO GUESTBOOK(user_id, content, secret_yn)
      VALUES(?, ?, ?)
    `
    )
    .run(guestbook.userId, guestbook.content, guestbook.secretYn);
}

// 방명록 글 수정
export async function updateGuestbook(guestbook) {
  return db
    .prepare(
      `
      UPDATE GUESTBOOK 
      SET content = ?,
          secret_yn = ?,
          mod_datetime = CURRENT_TIMESTAMP
      WHERE guestbook_no = ?
    `
    )
    .run(guestbook.content, guestbook.secretYn, guestbook.guestbookNo);
}

// 방명록 글 삭제
export async function deleteGuestbook(guestbookNo) {
  return db
    .prepare(
      `
      UPDATE GUESTBOOK 
      SET del_datetime = CURRENT_TIMESTAMP
      WHERE guestbook_no = ?
    `
    )
    .run(guestbookNo);
}

export default db;
