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
        NAME TEXT NOT NULL UNIQUE
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
}

initDb();

export async function selectBlogs() {
  return db
    .prepare(
      `
        SELECT * 
        FROM BLOG
        ORDER BY INPUT_DATETIME DESC
        `
    )
    .all();
}

export async function insertBlog(post) {
  return db
    .prepare(
      `
        INSERT INTO BLOG(TITLE, CONTENT, IMAGE_URL, USER_ID) 
        VALUES(?,?,?,?)
        `
    )
    .run(post.title, post.content, post.imageUrl, post.userId);
}

export async function insertTags(tagNames, postNo) {
  for (const tagName of tagNames) {
    //sqlite는 merge 지원이 안된단다..
    db.prepare(
      `
        INSERT OR IGNORE INTO TAGS (NAME) VALUES(?)
      `
    ).run(tagName);
    const tag = db
      .prepare(`SELECT TAG_ID FROM TAGS WHERE NAME = ?`)
      .get(tagName);
    if (tag) {
      db.prepare(
        `
          INSERT INTO BLOG_TAGS(POST_NO, TAG_ID) VALUES(?,?)
        `
      ).run(postNo, tag.TAG_ID);
    }
  }
}
