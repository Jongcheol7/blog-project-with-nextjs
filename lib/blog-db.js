import sql from "better-sqlite3";

const db = new sql("blog.db");

function initDb() {
  db.exec(`
        CREATE TABLE IF NOT EXISTS USERS(
            NO INTEGER PRIMARY KEY AUTOINCREMENT,
            USER_ID TEXT,
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
            INPUT_DATETIME TEXT DEFAULT CURRENT_TIMESTAMP,
            USER_ID TEXT NOT NULL
        )
    `);

  const stmt = db.prepare("SELECT COUNT(*) AS CNT FROM USERS");
  //console.log(stmt);
  //console.log(stmt.get());
  if (stmt.get().CNT === "0") {
    db.exec(`
        INSERT INTO USERS(USER_ID, PASSWORD, NAME, EMAIL) 
        VALUES('AAA','1234','이종철','aaa@naver.com')
    `);
    db.exec(`
        INSERT INTO USERS(USER_ID, PASSWORD, NAME, EMAIL) 
        VALUES('BBB','1234','김철수','bbb@naver.com')
    `);
  }

  const stmt2 = db.prepare("SELECT COUNT(*) AS CNT FROM BLOG");
  //console.log(stmt2);
  //console.log(stmt2.get());
  if (stmt2.get().CNT === "0") {
    db.exec(`
        INSERT INTO BLOG(POST_NO, TITLE, CONTENT, IMAGE_URL, USER_ID) 
        VALUES(1, 'TEST1', '내용1', NULL, 'AAA')
        `);
  }
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
        INSERT INTO BLOG(POST_NO, TITLE, CONTENT, IMAGE_URL, USER_ID) 
        VALUES(?,?,?,?,?)
        `
    )
    .run(post.postNo, post.title, post.content, post.imageUrl, post.userId);
}
