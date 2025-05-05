import sql from "better-sqlite3";

const db = new sql("blog.db");

export default async function execQuery(query) {
  return db.prepare(query).run();
}
