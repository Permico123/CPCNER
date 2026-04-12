import { useEffect, useMemo, useState } from "react";

type PostStatus = "DRAFT" | "PUBLISHED";

type Post = {
  id: number;
  title: string;
  subtitle?: string;
  slug: string;
  keyIdea: string;
  content: string;
  coverImage: string;
  tags: string;
  weekNumber?: number;
  status: PostStatus;
  publishedAt?: string;
};

type Toast = { type: "success" | "error"; message: string; post?: Post } | null;

const hero = {
  label: "Bitácora del CEO",
  title: "De consultora ambiental a empresa tecnológica basada en datos",
  subtitle: "Documentación semanal de decisiones, aprendizajes y evolución real de GEXPLO",
  kicker:
    "Un registro editorial en tiempo real sobre cómo una práctica técnica de campo se convierte en una organización guiada por datos, trazabilidad e inteligencia aplicada."
};

const blankPost: Partial<Post> = {
  title: "",
  subtitle: "",
  slug: "",
  keyIdea: "",
  content: "",
  coverImage: "",
  tags: "ambiente,agua,tierra",
  weekNumber: 1,
  status: "DRAFT"
};

export function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [posts, setPosts] = useState([] as Post[]);

  const refreshPublic = async () => {
    const response = await fetch("/api/posts");
    setPosts(await response.json());
  };

  useEffect(() => {
    refreshPublic();
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const activeSlug = useMemo(() => path.match(/^\/articulos\/(.+)$/)?.[1], [path]);
  const current = posts.find((post) => post.slug === activeSlug);

  useEffect(() => {
    if (current) {
      document.title = `${current.title} | Blog GEXPLO`;
      setMeta("description", current.keyIdea);
    } else {
      document.title = "Blog GEXPLO";
      setMeta("description", hero.subtitle);
    }
  }, [current]);

  const go = (to: string) => {
    window.history.pushState({}, "", to);
    setPath(to);
  };

  return (
    <div>
      <SiteHeader go={go} />

      <main className="container">
        {path === "/" && <PublicHome posts={posts} go={go} />}
        {path === "/articulos" && <Archive posts={posts} go={go} />}
        {path.startsWith("/articulos/") && current && <ArticleView post={current} />}
        {path === "/sobre" && <AboutView />}
        {path === "/admin" && <AdminView go={go} onRefreshPublic={refreshPublic} />}
      </main>
    </div>
  );
}

function SiteHeader({ go }: { go: (path: string) => void }) {
  const [logoHidden, setLogoHidden] = useState(false);

  return (
    <header className="site-header">
      <div className="container nav-shell">
        <button className="brand" onClick={() => go("/") }>
          {!logoHidden && (
            <img
              src="/logo.png"
              alt="GEXPLO"
              className="brand-logo"
              onError={() => setLogoHidden(true)}
            />
          )}
          <span className="brand-text">GEXPLO · Laboratorio Editorial</span>
        </button>

        <nav className="main-nav">
          <button className="nav-link" onClick={() => go("/")}>Inicio</button>
          <button className="nav-link" onClick={() => go("/articulos")}>Archivo</button>
          <button className="nav-link" onClick={() => go("/sobre")}>Sobre este blog</button>
          <button className="nav-link nav-link-cta" onClick={() => go("/admin")}>Admin</button>
        </nav>
      </div>
    </header>
  );
}

function PublicHome({ posts, go }: { posts: Post[]; go: (path: string) => void }) {
  return (
    <section className="stack-xl">
      <div className="hero-shell">
        <p className="badge">{hero.label}</p>
        <h1>{hero.title}</h1>
        <p className="hero-subtitle">{hero.subtitle}</p>
        <p className="hero-kicker">{hero.kicker}</p>
      </div>

      <div className="section-title">
        <h2>Ediciones recientes</h2>
        <button className="ghost" onClick={() => go("/articulos")}>Ver archivo completo</button>
      </div>

      <div className="post-grid">
        {posts.slice(0, 6).map((post) => (
          <div key={post.id}><PostCard post={post} go={go} /></div>
        ))}
      </div>
    </section>
  );
}

function Archive({ posts, go }: { posts: Post[]; go: (path: string) => void }) {
  return (
    <section className="stack-lg">
      <div className="archive-intro">
        <h1>Archivo de transformación</h1>
        <p>
          Serie continua de decisiones y aprendizajes: cada semana documenta un paso concreto en la evolución de GEXPLO.
        </p>
      </div>

      <div className="timeline-list">
        {posts.map((post) => (
          <article key={post.id} className="timeline-item">
            <p className="week-pill">Semana {post.weekNumber ?? "-"}</p>
            <div className="timeline-body">
              <h3>{post.title}</h3>
              <p>{post.keyIdea}</p>
              <div className="chip-row">
                {splitTags(post.tags).slice(0, 4).map((tag) => (
                  <span key={tag} className="chip">{tag}</span>
                ))}
              </div>
              <button onClick={() => go(`/articulos/${post.slug}`)}>Leer edición</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function PostCard({ post, go }: { post: Post; go: (path: string) => void }) {
  return (
    <article className="post-card">
      {post.coverImage ? (
        <img src={post.coverImage} alt={post.title} className="post-cover" />
      ) : (
        <div className="cover-fallback">GEXPLO · Bitácora técnica</div>
      )}
      <div className="post-content">
        <p className="overline">Semana {post.weekNumber ?? "-"}</p>
        <h3>{post.title}</h3>
        <p>{post.keyIdea}</p>
        <div className="chip-row">
          {splitTags(post.tags).slice(0, 3).map((tag) => (
            <span key={tag} className="chip">{tag}</span>
          ))}
        </div>
        <button onClick={() => go(`/articulos/${post.slug}`)}>Leer artículo</button>
      </div>
    </article>
  );
}

function ArticleView({ post }: { post: Post }) {
  return (
    <article className="article-page">
      <p className="week-pill inline">Semana {post.weekNumber ?? "-"}</p>
      <h1>{post.title}</h1>
      {post.subtitle && <p className="article-subtitle">{post.subtitle}</p>}

      {post.coverImage ? (
        <img src={post.coverImage} alt={post.title} className="article-cover" />
      ) : (
        <div className="cover-fallback article-fallback">Imagen destacada pendiente</div>
      )}

      <blockquote>{post.keyIdea}</blockquote>

      <div className="article-content">
        {post.content.split("\n\n").map((block, index) =>
          block.startsWith("## ") ? <h2 key={index}>{block.slice(3)}</h2> : <p key={index}>{block}</p>
        )}
      </div>

      <div className="chip-row">
        {splitTags(post.tags).map((tag) => (
          <span key={tag} className="chip">{tag}</span>
        ))}
      </div>
    </article>
  );
}

function AboutView() {
  return (
    <section className="about-card stack-md">
      <h1>Sobre este blog</h1>
      <p>{hero.title}</p>
      <p>{hero.subtitle}</p>
      <p>
        Esta bitácora funciona como un laboratorio editorial: estrategia, operaciones y producto narrados con criterio técnico.
      </p>
    </section>
  );
}

function AdminView({
  go,
  onRefreshPublic
}: {
  go: (path: string) => void;
  onRefreshPublic: () => Promise<void>;
}) {
  const [auth, setAuth] = useState(false);
  const [posts, setPosts] = useState([] as Post[]);
  const [editing, setEditing] = useState(blankPost as Partial<Post>);
  const [listLoading, setListLoading] = useState(false);
  const [saving, setSaving] = useState(null as PostStatus | null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null as Toast);

  const refresh = async () => {
    setListLoading(true);
    const response = await fetch("/api/admin/posts");

    if (!response.ok) {
      setAuth(false);
      setListLoading(false);
      return;
    }

    setPosts(await response.json());
    setAuth(true);
    setListLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const savePost = async (status: PostStatus) => {
    try {
      setSaving(status);
      setToast(null);

      const endpoint = editing.id ? `/api/admin/posts/${editing.id}` : "/api/admin/posts";
      const method = editing.id ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editing, status })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "No se pudo guardar.");
      }

      const saved = await response.json();
      setEditing(saved);
      await refresh();
      await onRefreshPublic();

      setToast({
        type: "success",
        message: status === "PUBLISHED" ? "Publicación realizada correctamente." : "Borrador guardado.",
        post: saved
      });
    } catch (error) {
      setToast({ type: "error", message: (error as Error).message });
    } finally {
      setSaving(null);
    }
  };

  const uploadCover = async (file?: File | null) => {
    if (!file) return;
    try {
      setUploading(true);
      const dataUrl = await fileToDataUrl(file);
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, dataUrl })
      });
      if (!response.ok) throw new Error("No se pudo subir la imagen.");
      const data = await response.json();
      setEditing({ ...editing, coverImage: data.url });
      setToast({ type: "success", message: "Imagen destacada actualizada." });
    } catch (error) {
      setToast({ type: "error", message: (error as Error).message });
    } finally {
      setUploading(false);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuth(false);
    setEditing(blankPost);
  };

  if (!auth) return <LoginView onSuccess={refresh} />;

  return (
    <section className="stack-md">
      <div className="section-title">
        <h1>Panel editorial</h1>
        <button className="ghost" onClick={logout}>Cerrar sesión</button>
      </div>

      {toast && (
        <div className={`alert ${toast.type}`}>
          <p>{toast.message}</p>
          {toast.post && (
            <div className="actions-row">
              <button className="ghost" onClick={() => setEditing(toast.post)}>Seguir editando</button>
              {toast.post.status === "PUBLISHED" && (
                <button onClick={() => go(`/articulos/${toast.post!.slug}`)}>Ir al artículo publicado</button>
              )}
              <button className="ghost" onClick={() => setEditing(blankPost)}>Crear nuevo post</button>
            </div>
          )}
        </div>
      )}

      <div className="admin-grid">
        <aside className="panel">
          <div className="section-title compact">
            <h3>Entradas</h3>
            <button className="ghost" onClick={() => setEditing(blankPost)}>+ Nuevo</button>
          </div>

          {listLoading && <p className="muted">Cargando publicaciones...</p>}

          <div className="entry-list">
            {posts.map((post) => (
              <button key={post.id} className="entry-item" onClick={() => setEditing(post)}>
                <strong>{post.title}</strong>
                <small>{post.status}</small>
              </button>
            ))}
          </div>
        </aside>

        <div className="editor-grid">
          <section className="panel">
            <h3>{editing.id ? "Editar publicación" : "Nueva publicación"}</h3>

            <div className="fields">
              <input placeholder="Título" value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              <input placeholder="Subtítulo" value={editing.subtitle ?? ""} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} />
              <input placeholder="Slug" value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
              <input placeholder="Tags (coma separada)" value={editing.tags ?? ""} onChange={(e) => setEditing({ ...editing, tags: e.target.value })} />
              <input type="number" placeholder="Semana" value={editing.weekNumber ?? 1} onChange={(e) => setEditing({ ...editing, weekNumber: Number(e.target.value) })} />
              <input placeholder="URL imagen destacada" value={editing.coverImage ?? ""} onChange={(e) => setEditing({ ...editing, coverImage: e.target.value })} />
              <textarea placeholder="Idea clave" value={editing.keyIdea ?? ""} onChange={(e) => setEditing({ ...editing, keyIdea: e.target.value })} />
              <textarea rows={12} placeholder="Contenido (usar ## para subtítulos)" value={editing.content ?? ""} onChange={(e) => setEditing({ ...editing, content: e.target.value })} />
            </div>

            <div className="actions-row">
              <label className="upload-btn">
                {uploading ? "Subiendo..." : "Subir imagen"}
                <input type="file" accept="image/*" onChange={(e) => uploadCover(e.target.files?.[0])} disabled={uploading} />
              </label>
              <button className="ghost" onClick={() => savePost("DRAFT")} disabled={saving !== null}>
                {saving === "DRAFT" ? "Guardando..." : "Guardar borrador"}
              </button>
              <button onClick={() => savePost("PUBLISHED")} disabled={saving !== null}>
                {saving === "PUBLISHED" ? "Publicando..." : "Publicar"}
              </button>
              <button className="ghost" onClick={() => savePost("DRAFT")} disabled={saving !== null}>
                Despublicar
              </button>
            </div>
          </section>

          <section className="panel preview-panel">
            <h3>Vista previa editorial</h3>
            <p className="week-pill inline">Semana {editing.weekNumber ?? "-"}</p>
            <h2>{editing.title || "Título de artículo"}</h2>
            {editing.subtitle && <p className="article-subtitle">{editing.subtitle}</p>}
            {editing.coverImage ? (
              <img src={editing.coverImage} alt="preview" className="article-cover" />
            ) : (
              <div className="cover-fallback article-fallback">Sin imagen destacada</div>
            )}
            <blockquote>{editing.keyIdea || "Idea clave del artículo"}</blockquote>
            {(editing.content || "").split("\n\n").slice(0, 4).map((block, idx) =>
              block.startsWith("## ") ? <h4 key={idx}>{block.slice(3)}</h4> : <p key={idx}>{block || "Contenido en construcción..."}</p>
            )}
          </section>
        </div>
      </div>
    </section>
  );
}

function LoginView({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async () => {
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) onSuccess();
    else setError("Credenciales inválidas.");

    setLoading(false);
  };

  return (
    <section className="login-shell">
      <h1>Acceso administrador</h1>
      <p className="muted">Entrada segura al panel editorial de GEXPLO.</p>
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <p className="error-text">{error}</p>}
      <button onClick={login} disabled={loading}>{loading ? "Ingresando..." : "Iniciar sesión"}</button>
    </section>
  );
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

function splitTags(raw: string) {
  return raw.split(",").map((tag) => tag.trim()).filter(Boolean);
}

function setMeta(name: string, content: string) {
  let tag = document.querySelector(`meta[name='${name}']`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}
