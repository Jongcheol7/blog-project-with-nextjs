import sql from "better-sqlite3";

const db = new sql("blog.db");

function initDb() {
  db.exec(`
        CREATE TABLE IF NOT EXISTS USERS(
            NO INTEGER PRIMARY KEY AUTOINCREMENT,
            USER_ID TEXT UNIQUE,
            PASSWORD TEXT,
            NAME TEXT,
            EMAIL TEXT
        )
    `);
  db.exec(`
        CREATE TABLE IF NOT EXISTS BLOG(
            POST_NO INTEGER PRIMARY KEY AUTOINCREMENT,
            TITLE TEXT NOT NULL,
            CONTENT TEXT NOT NULL,
            IMAGE_URL TEXT NULL,
            USER_ID TEXT NOT NULL,
            VIEWS INTEGER DEFAULT 0,
            PRIVATE_YN TEXT DEFAULT 'N',
            CATEGORY_ID INTEGER,
            INPUT_DATETIME DATETIME DEFAULT CURRENT_TIMESTAMP,
            MOD_DATETIME DATETIME NULL,
            DEL_DATETIME DATETIME NULL,
            FOREIGN KEY(USER_ID) REFERENCES USERS(USER_ID),
            FOREIGN KEY(CATEGORY_ID) REFERENCES CATEGORY(CATEGORY_ID)
        )
    `);
  db.exec(`
      CREATE TABLE IF NOT EXISTS TAGS(
        TAG_ID INTEGER PRIMARY KEY AUTOINCREMENT,
        NAME TEXT NOT NULL UNIQUE
      )
    `);
  db.exec(`
      CREATE TABLE IF NOT EXISTS BLOG_TAGS(
        POST_NO INTEGER,
        TAG_ID INTEGER,
        UNIQUE(POST_NO, TAG_ID),
        FOREIGN KEY(POST_NO) REFERENCES BLOG(POST_NO),
        FOREIGN KEY(TAG_ID) REFERENCES TAGS(TAG_ID)
      )
    `);
  db.exec(`
      CREATE TABLE IF NOT EXISTS COMMENT(
        COMMENT_NO INTEGER PRIMARY KEY AUTOINCREMENT,
        POST_NO INTEGER NOT NULL,
        USER_ID TEXT NOT NULL,
        CONTENT TEXT NOT NULL,
        INPUT_DATETIME DATETIME DEFAULT CURRENT_TIMESTAMP,
        MOD_DATETIME DATETIME,
        MOD_USER_ID TEXT,
        DEL_DATETIME DATETIME,
        DEL_USER_ID TEXT,
        FOREIGN KEY(POST_NO) REFERENCES BLOG(POST_NO),
        FOREIGN KEY(USER_ID) REFERENCES USER(USER_ID)
      )
    `);
  db.exec(`
      CREATE TABLE IF NOT EXISTS CATEGORY(
        CATEGORY_ID INTEGER PRIMARY KEY AUTOINCREMENT,
        NAME TEXT NOT NULL UNIQUE,
        PARENT_ID INTEGER
      )
    `);
  db.exec(`
      CREATE TABLE IF NOT EXISTS BLOG_LIKES(
        USER_ID TEXT NOT NULL,
        POST_NO INTEGER NOT NULL,
        PRIMARY KEY(USER_ID, POST_NO),
        FOREIGN KEY(USER_ID) REFERENCES USER(USER_ID),
        FOREIGN KEY(POST_NO) REFERENCES BLOG(POST_NO)
      )
    `);

  //const stmt = db.prepare("SELECT COUNT(*) AS CNT FROM USERS");
  //console.log(stmt);
  //console.log(stmt.get());
  // if (stmt.get().CNT === "0") {
  //   db.exec(`
  //       INSERT INTO USERS(USER_ID, PASSWORD, NAME, EMAIL)
  //       VALUES('AAA','1234','이종철','aaa@naver.com')
  //   `);
  //   db.exec(`
  //       INSERT INTO USERS(USER_ID, PASSWORD, NAME, EMAIL)
  //       VALUES('BBB','1234','김철수','bbb@naver.com')
  //   `);
  // }

  //const stmt2 = db.prepare("SELECT COUNT(*) AS CNT FROM BLOG");
  //console.log(stmt2);
  //console.log(stmt2.get());
  // if (stmt2.get().CNT === "0") {
  //   db.exec(`
  //       INSERT INTO BLOG(TITLE, CONTENT, IMAGE_URL, USER_ID)
  //       VALUES(1, 'TEST1', '내용1', NULL, 'AAA')
  //       `);
  // }

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

  const stmt4 = db.prepare("SELECT COUNT(*) AS CNT FROM USERS");
  // console.log(stmt4);
  // console.log(stmt4.get());
  if (stmt4.get().CNT === 0) {
    db.exec(
      `INSERT INTO USERS(USER_ID,PASSWORD,NAME,EMAIL) 
      VALUES('jclee','1234','이종철','jclee@naver.com')`
    );
  }
}

initDb();

export async function selectBlogs() {
  return db
    .prepare(
      `
        SELECT B.POST_NO, 
               B.TITLE, 
               B.CONTENT,
               B.IMAGE_URL, 
               B.USER_ID, 
               B.VIEWS,
               B.PRIVATE_YN,
               B.CATEGORY_ID,
               B.INPUT_DATETIME,
               GROUP_CONCAT(T.NAME,',') AS TAGS
        FROM BLOG B JOIN BLOG_TAGS BT 
        ON B.POST_NO = BT.POST_NO 
        JOIN TAGS T 
        ON BT.TAG_ID = T.TAG_ID
        WHERE B.DEL_DATETIME IS NULL
        GROUP BY B.POST_NO
        ORDER BY INPUT_DATETIME DESC
        `
    )
    .all();
}
export function selectBlog(postNo) {
  return db
    .prepare(
      `
      SELECT B.POST_NO, 
               B.TITLE, 
               B.CONTENT,
               B.IMAGE_URL, 
               B.USER_ID, 
               B.VIEWS,
               B.PRIVATE_YN,
               B.CATEGORY_ID,
               B.INPUT_DATETIME,
               GROUP_CONCAT(T.NAME,',') AS TAGS
        FROM BLOG B JOIN BLOG_TAGS BT 
        ON B.POST_NO = BT.POST_NO 
        JOIN TAGS T 
        ON BT.TAG_ID = T.TAG_ID
        WHERE B.DEL_DATETIME IS NULL
        AND B.POST_NO = ?
        GROUP BY B.POST_NO
        ORDER BY INPUT_DATETIME DESC 
    `
    )
    .get(postNo);
}
export async function selectCategory() {
  return db
    .prepare(
      `
      SELECT 
          CATEGORY_ID,
          NAME AS CATEGORY_NAME,
          CASE 
            WHEN PARENT_ID IS NULL THEN '대분류'
            ELSE '소분류'
            END AS CATEGORY_TYPE,
          PARENT_ID
      FROM CATEGORY
      ORDER BY 
      COALESCE(PARENT_ID, CATEGORY_ID),
      CATEGORY_TYPE
  `
    )
    .all();
}

export async function insertBlog(post) {
  console.log("post: ", post);
  return db
    .prepare(
      `
        INSERT INTO BLOG(TITLE, CONTENT, IMAGE_URL, USER_ID, CATEGORY_ID, INPUT_DATETIME) 
        VALUES(?,?,?,?,?,CURRENT_TIMESTAMP)
        `
    )
    .run(post.title, post.content, post.imageUrl, post.userId, post.categoryId);
}

export async function insertTags(tagNames, postNo) {
  console.log("tagNames: ", tagNames);
  for (const tagName of tagNames) {
    console.log("tagName: ", tagName);
    //sqlite는 merge 지원이 안된단다..
    db.prepare(
      `
        INSERT OR IGNORE INTO TAGS (NAME) VALUES(?)
      `
    ).run(tagName);
    const tag = db
      .prepare(`SELECT TAG_ID FROM TAGS WHERE NAME = ?`)
      .get(tagName);
    console.log("tag.TAG_ID: ", tag.TAG_ID, "POST_NO: ", postNo);
    if (tag) {
      db.prepare(
        `
          INSERT INTO BLOG_TAGS(POST_NO, TAG_ID) VALUES(?,?)
        `
      ).run(postNo, tag.TAG_ID);
    }
  }
}

export async function deleteBlog(postNo) {
  return db
    .prepare(
      `
      UPDATE BLOG SET DEL_DATETIME = CURRENT_TIMESTAMP WHERE POST_NO = ?
    `
    )
    .run(postNo);
}

export async function deleteBlogTags(postNo) {
  return db
    .prepare(
      `
      DELETE FROM BLOG_TAGS WHERE POST_NO = ?
    `
    )
    .run(postNo);
}
export async function deleteTags(postNo) {
  return db
    .prepare(
      `
      DELETE FROM TAGS WHERE TAG_ID IN(
        SELECT TAG_ID FROM BLOG_TAGS WHERE POST_NO = ?
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
      SET TITLE = ?,
          CONTENT = ?,
          IMAGE_URL = ?,
          CATEGORY_ID = ?,
          MOD_DATETIME = CURRENT_TIMESTAMP 
      WHERE POST_NO = ?
    `
    )
    .run(post.title, post.content, post.imageUrl, post.categoryId, post.postNo);
}
