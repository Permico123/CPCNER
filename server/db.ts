import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const dbPath = path.join(process.cwd(), "data", "blog.db");

function quote(value: string) {
  return `'${value.replace(/'/g, "''")}'`;
}

function run(sql: string) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  execSync(`sqlite3 ${dbPath}`, { input: sql });
}

export function query<T = any>(sql: string): T[] {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const out = execSync(`sqlite3 -json ${dbPath}`, { input: sql, encoding: "utf-8" });
  return out.trim() ? (JSON.parse(out) as T[]) : [];
}

export function initDb() {
  run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      subtitle TEXT,
      slug TEXT UNIQUE NOT NULL,
      key_idea TEXT NOT NULL,
      content TEXT NOT NULL,
      cover_image TEXT,
      tags TEXT NOT NULL,
      week_number INTEGER,
      status TEXT NOT NULL DEFAULT 'DRAFT',
      published_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      token_hash TEXT UNIQUE NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
}

export function exec(sql: string) {
  run(sql);
}

export function sqlQuote(value: string) {
  return quote(value);
}
