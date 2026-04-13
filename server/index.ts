import "dotenv/config";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import express from "express";
import { exec, initDb, query, sqlQuote } from "./db";

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static(path.join(process.cwd(), "public", "uploads")));

type DbPost = {
  id: number;
  title: string;
  subtitle: string | null;
  slug: string;
  key_idea: string;
  content: string;
  cover_image: string | null;
  tags: string;
  week_number: number | null;
  status: "DRAFT" | "PUBLISHED";
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}

function mapPost(post: DbPost) {
  return {
    id: post.id,
    title: post.title,
    subtitle: post.subtitle ?? undefined,
    slug: post.slug,
    keyIdea: post.key_idea,
    content: post.content,
    coverImage: post.cover_image ?? "",
    tags: post.tags,
    weekNumber: post.week_number ?? undefined,
    status: post.status,
    publishedAt: post.published_at ?? undefined,
    createdAt: post.created_at,
    updatedAt: post.updated_at
  };
}

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function parseCookie(cookieHeader: string | undefined, name: string) {
  if (!cookieHeader) return undefined;
  const cookies = cookieHeader.split(";").map((chunk) => chunk.trim());
  const hit = cookies.find((item) => item.startsWith(`${name}=`));
  return hit?.split("=")[1];
}

function requireAdmin(req: express.Request, res: express.Response) {
  const session = parseCookie(req.headers.cookie, "gexplo_session");
  if (!session) {
    res.status(401).json({ error: "unauthorized" });
    return undefined;
  }

  const tokenHash = hashToken(session);
  const rows = query<{ id: number }>(`SELECT id FROM sessions WHERE token_hash=${sqlQuote(tokenHash)} AND expires_at > ${sqlQuote(new Date().toISOString())} LIMIT 1;`);
  if (!rows.length) {
    res.status(401).json({ error: "unauthorized" });
    return undefined;
  }

  return true;
}

app.get("/api/posts", (_req, res) => {
  const rows = query<DbPost>("SELECT * FROM posts WHERE status='PUBLISHED' ORDER BY published_at DESC;");
  res.json(rows.map(mapPost));
});

app.get("/api/posts/:slug", (req, res) => {
  const rows = query<DbPost>(`SELECT * FROM posts WHERE slug=${sqlQuote(req.params.slug)} AND status='PUBLISHED' LIMIT 1;`);
  if (!rows.length) return res.status(404).json({ error: "not_found" });
  return res.json(mapPost(rows[0]));
});

app.get("/api/admin/posts", (req, res) => {
  if (!requireAdmin(req, res)) return;
  const rows = query<DbPost>("SELECT * FROM posts ORDER BY updated_at DESC;");
  res.json(rows.map(mapPost));
});

app.post("/api/admin/login", (req, res) => {
  const email = String(req.body.email || "");
  const password = String(req.body.password || "");
  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "invalid_credentials" });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString();
  const now = new Date().toISOString();
  exec(`INSERT INTO sessions(token_hash, expires_at, created_at) VALUES(${sqlQuote(tokenHash)}, ${sqlQuote(expires)}, ${sqlQuote(now)});`);

  res.setHeader("Set-Cookie", `gexplo_session=${token}; HttpOnly; Path=/; Max-Age=43200; SameSite=Lax`);
  return res.json({ ok: true });
});

app.post("/api/admin/logout", (req, res) => {
  const session = parseCookie(req.headers.cookie, "gexplo_session");
  if (session) {
    exec(`DELETE FROM sessions WHERE token_hash=${sqlQuote(hashToken(session))};`);
  }
  res.setHeader("Set-Cookie", "gexplo_session=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax");
  res.json({ ok: true });
});

app.post("/api/admin/upload", (req, res) => {
  if (!requireAdmin(req, res)) return;
  const dataUrl = String(req.body.dataUrl || "");
  const filename = String(req.body.filename || `cover-${Date.now()}.png`);

  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) return res.status(400).json({ error: "invalid_image" });

  const ext = match[1].split("/")[1] || "png";
  const cleanName = filename.toLowerCase().replace(/[^a-z0-9.-]/g, "-").replace(/\.+/g, ".");
  const finalName = `${Date.now()}-${cleanName}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, finalName), Buffer.from(match[2], "base64"));

  res.json({ url: `/uploads/${finalName}` });
});

app.post("/api/admin/posts", (req, res) => {
  if (!requireAdmin(req, res)) return;
  const now = new Date().toISOString();
  const status = req.body.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT";
  const slug = slugify(req.body.slug || req.body.title || `post-${Date.now()}`);

  exec(`
    INSERT INTO posts(title, subtitle, slug, key_idea, content, cover_image, tags, week_number, status, published_at, created_at, updated_at)
    VALUES(
      ${sqlQuote(String(req.body.title || ""))},
      ${sqlQuote(String(req.body.subtitle || ""))},
      ${sqlQuote(slug)},
      ${sqlQuote(String(req.body.keyIdea || ""))},
      ${sqlQuote(String(req.body.content || ""))},
      ${sqlQuote(String(req.body.coverImage || ""))},
      ${sqlQuote(String(req.body.tags || ""))},
      ${Number(req.body.weekNumber || 0)},
      ${sqlQuote(status)},
      ${status === "PUBLISHED" ? sqlQuote(String(req.body.publishedAt || now)) : "NULL"},
      ${sqlQuote(now)},
      ${sqlQuote(now)}
    );
  `);

  const rows = query<DbPost>("SELECT * FROM posts ORDER BY id DESC LIMIT 1;");
  res.status(201).json(mapPost(rows[0]));
});

app.patch("/api/admin/posts/:id", (req, res) => {
  if (!requireAdmin(req, res)) return;
  const id = Number(req.params.id);
  const now = new Date().toISOString();
  const status = req.body.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT";
  const slug = slugify(req.body.slug || req.body.title || `post-${id}`);

  exec(`
    UPDATE posts SET
      title=${sqlQuote(String(req.body.title || ""))},
      subtitle=${sqlQuote(String(req.body.subtitle || ""))},
      slug=${sqlQuote(slug)},
      key_idea=${sqlQuote(String(req.body.keyIdea || ""))},
      content=${sqlQuote(String(req.body.content || ""))},
      cover_image=${sqlQuote(String(req.body.coverImage || ""))},
      tags=${sqlQuote(String(req.body.tags || ""))},
      week_number=${Number(req.body.weekNumber || 0)},
      status=${sqlQuote(status)},
      published_at=${status === "PUBLISHED" ? sqlQuote(String(req.body.publishedAt || now)) : "NULL"},
      updated_at=${sqlQuote(now)}
    WHERE id=${id};
  `);

  const rows = query<DbPost>(`SELECT * FROM posts WHERE id=${id} LIMIT 1;`);
  res.json(mapPost(rows[0]));
});

initDb();
app.listen(4000, () => console.log("API ready on :4000"));
