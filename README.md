# Blog GEXPLO · Base editorial de producción (incremental)

Plataforma editorial propia para `blog.gexplo.com` con:
- Frontend público (Home, archivo, post individual, sobre el blog).
- Admin privado para crear/editar/publicar/despublicar.
- Sesión segura con cookie HttpOnly.
- Upload de imagen destacada.
- Persistencia en base de datos real (`SQLite` local con esquema relacional).

> ⚠️ Restricción del entorno actual: `npm` está bloqueado para instalar dependencias como `prisma`, `@prisma/client` o `pg`; por eso esta iteración no pudo implementar PostgreSQL+Prisma todavía. Se dejó la base preparada para migración inmediata cuando el registro npm esté habilitado.

---

## 1) Instalación local

```bash
npm install
cp .env.example .env
npm run seed
npm run dev:api
# en otra terminal
npm run dev
```

- Frontend: `http://localhost:3000`
- API: `http://localhost:4000`

## 2) Variables de entorno

- `ADMIN_EMAIL`: usuario admin.
- `ADMIN_PASSWORD`: contraseña admin.
- `BLOG_PUBLIC_URL`: URL final del blog (ej. `https://blog.gexplo.com`).

## 3) Deploy (VPS / contenedor)

### Build
```bash
npm run build
```

### Runtime recomendado
1. Levantar API (`npm run dev:api`) detrás de un process manager (`pm2` o systemd).
2. Servir frontend estático con `npm run preview` o Nginx.
3. Configurar reverse proxy:
   - `blog.gexplo.com` → frontend
   - `/api` → backend puerto `4000`

### Nginx (esqueleto)
```nginx
server {
  server_name blog.gexplo.com;
  location /api/ {
    proxy_pass http://127.0.0.1:4000/;
  }
  location / {
    proxy_pass http://127.0.0.1:3000/;
  }
}
```

## 4) SEO básico implementado
- Título por post (`document.title`).
- Meta description por post (idea clave).
- Slug editorial legible.

## 5) Roadmap inmediato para cerrar requerimiento PostgreSQL + Prisma
1. Habilitar npm registry para instalar `prisma`, `@prisma/client`, `pg`.
2. Migrar tabla `posts` + `sessions` a PostgreSQL.
3. Sustituir SQL actual por Prisma Client.
4. Mantener misma API (sin romper frontend).
