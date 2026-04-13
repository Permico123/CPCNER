import { exec, initDb, sqlQuote } from "./db";

initDb();
exec("DELETE FROM posts;");

const now = new Date().toISOString();

exec(`INSERT INTO posts(title, subtitle, slug, key_idea, content, cover_image, tags, week_number, status, published_at, created_at, updated_at)
VALUES(
${sqlQuote("Semana 01 · De informes aislados a un sistema técnico auditable")},
${sqlQuote("Primeros principios para rediseñar evidencia ambiental")},
${sqlQuote("semana-01-sistema-tecnico-auditable")},
${sqlQuote("Cada dato de campo y laboratorio debe ser auditable.")},
${sqlQuote("## Punto de partida\nGEXPLO evoluciona desde consultoría tradicional a arquitectura de datos geocientífica.\n\n## Próximo paso\nEstandarizar evidencia y trazabilidad documental.")},
${sqlQuote("https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1400&q=80")},
${sqlQuote("ambiente,trazabilidad,transformación")},
1,
'PUBLISHED',
${sqlQuote(now)},
${sqlQuote(now)},
${sqlQuote(now)}
);`);

console.log("Seed DB generado en data/blog.db");
