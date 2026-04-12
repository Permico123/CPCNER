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

const editorialTitle = "De consultora ambiental a empresa tecnológica basada en datos";
const editorialSubtitle =
  "Documentación semanal de decisiones, aprendizajes y evolución real de GEXPLO";

const emptyPost: Partial<Post> = {
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

  const refreshPublicPosts = async () => {
    const response = await fetch("/api/posts");
    const data = await response.json();
    setPosts(data);
  };

  useEffect(() => {
    refreshPublicPosts();
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const activeSlug = useMemo(() => path.match(/^\/articulos\/(.+)$/)?.[1], [path]);
  const current = posts.find((p) => p.slug === activeSlug);

  useEffect(() => {
    if (!current) {
      document.title = "Blog GEXPLO";
      setMeta("description", editorialSubtitle);
      return;
    }

    document.title = `${current.title} | Blog GEXPLO`;
    setMeta("description", current.keyIdea);
  }, [current]);

  const go = (to: string) => {
    window.history.pushState({}, "", to);
    setPath(to);
  };

  return (
    <div>
      <header className="header">
        <div className="container nav">
          <button className="brand" onClick={() => go("/")}>GEXPLO · Editorial</button>
          <nav>
            <button onClick={() => go("/")}>Inicio</button>
            <button onClick={() => go("/articulos")}>Artículos</button>
            <button onClick={() => go("/sobre")}>Sobre este blog</button>
            <button onClick={() => go("/admin")}>Admin</button>
          </nav>
        </div>
      </header>

      <main className="container">
        {path === "/" && <Home posts={posts} go={go} />}
        {path === "/articulos" && <Archive posts={posts} go={go} />}
        {path.startsWith("/articulos/") && current && <Article post={current} />}
        {path === "/sobre" && <About />}
        {path === "/admin" && (
          <Admin
            go={go}
            onPublicDataChange={refreshPublicPosts}
          />
        )}
      </main>
    </div>
  );
}

function Home({ posts, go }: { posts: Post[]; go: (to: string) => void }) {
  return (
    <section className="stack-lg">
      <div className="hero">
        <div className="hero-badge">Bitácora del CEO</div>
        <h1>{editorialTitle}</h1>
        <p className="hero-subtitle">{editorialSubtitle}</p>
        <p className="muted">
          Ambiente, Agua, Tierra e IA & Blockchain en una narrativa de transformación real, semanal y verificable.
        </p>
      </div>

      <div className="section-head">
        <h2>Últimas ediciones</h2>
        <button onClick={() => go("/articulos")}>Ver archivo completo</button>
      </div>

      <div className="card-grid">
        {posts.slice(0, 6).map((post) => (
          <div key={post.id}><PostCard post={post} go={go} /></div>
        ))}
      </div>
    </section>
  );
}

function Archive({ posts, go }: { posts: Post[]; go: (to: string) => void }) {
  return (
    <section className="stack-md">
      <h1>Archivo editorial</h1>
      <p className="muted">Seguimiento semanal de estrategia, operaciones y evolución de producto.</p>
      <div className="card-grid">
        {posts.map((post) => (
          <div key={post.id}><PostCard post={post} go={go} /></div>
        ))}
      </div>
    </section>
  );
}

function PostCard({ post, go }: { post: Post; go: (to: string) => void }) {
  return (
    <article className="post-card">
      {post.coverImage && <img src={post.coverImage} alt={post.title} />}
      <div className="post-body">
        <p className="micro">Semana {post.weekNumber ?? "-"}</p>
        <h3>{post.title}</h3>
        <p>{post.keyIdea}</p>
        <div className="tag-row">
          {splitTags(post.tags).slice(0, 3).map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
        <button onClick={() => go(`/articulos/${post.slug}`)}>Leer artículo</button>
      </div>
    </article>
  );
}

function Article({ post }: { post: Post }) {
  return (
    <article className="article">
      <p className="micro">Semana {post.weekNumber ?? "-"}</p>
      <h1>{post.title}</h1>
      {post.subtitle && <p className="article-subtitle">{post.subtitle}</p>}
      {post.coverImage && <img src={post.coverImage} alt={post.title} />}

      <blockquote>{post.keyIdea}</blockquote>

      <div className="article-content">
        {post.content.split("\n\n").map((block, index) =>
          block.startsWith("## ") ? <h2 key={index}>{block.slice(3)}</h2> : <p key={index}>{block}</p>
        )}
      </div>

      <div className="tag-row">
        {splitTags(post.tags).map((tag) => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>
    </article>
  );
}

function About() {
  return (
    <section className="stack-md">
      <h1>Sobre este blog</h1>
      <p>{editorialTitle}</p>
      <p>{editorialSubtitle}</p>
      <p className="muted">
        Este espacio no funciona como un blog técnico tradicional: es una capa editorial de decisiones reales para construir trazabilidad estratégica.
      </p>
    </section>
  );
}

function Admin({
  onPublicDataChange,
  go
}: {
  onPublicDataChange: () => Promise<void>;
  go: (to: string) => void;
}) {
  const [auth, setAuth] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [posts, setPosts] = useState([] as Post[]);
  const [editing, setEditing] = useState(emptyPost as Partial<Post>);
  const [saving, setSaving] = useState(null as "DRAFT" | "PUBLISHED" | null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null as Toast);

  const refreshAdmin = async () => {
    setLoadingList(true);
    const response = await fetch("/api/admin/posts");
    if (!response.ok) {
      setAuth(false);
      setLoadingList(false);
      return;
    }

    const data = await response.json();
    setPosts(data);
    setAuth(true);
    setLoadingList(false);
  };

  useEffect(() => {
    refreshAdmin();
  }, []);

  const handleSave = async (status: PostStatus) => {
    try {
      setSaving(status);
      setToast(null);

      const payload = {
        ...editing,
        status
      };

      const method = editing.id ? "PATCH" : "POST";
      const url = editing.id ? `/api/admin/posts/${editing.id}` : "/api/admin/posts";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "No se pudo guardar el post.");
      }

      const saved = await response.json();
      setEditing(saved);
      await refreshAdmin();
      await onPublicDataChange();

      setToast({
        type: "success",
        message: status === "PUBLISHED" ? "Post publicado correctamente." : "Borrador guardado correctamente.",
        post: saved
      });
    } catch (error) {
      setToast({ type: "error", message: (error as Error).message });
    } finally {
      setSaving(null);
    }
  };

  const handleUpload = async (file?: File | null) => {
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
      setToast({ type: "success", message: "Imagen subida correctamente." });
    } catch (error) {
      setToast({ type: "error", message: (error as Error).message });
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuth(false);
    setEditing(emptyPost);
  };

  if (!auth) {
    return <Login onSuccess={refreshAdmin} />;
  }

  return (
    <section className="stack-md">
      <div className="section-head">
        <h1>Panel editorial</h1>
        <button className="secondary" onClick={handleLogout}>Cerrar sesión</button>
      </div>

      {toast && (
        <div className={`toast ${toast.type}`}>
          <p>{toast.message}</p>
          {toast.post && (
            <div className="row-actions">
              <button className="secondary" onClick={() => setEditing(toast.post)}>Seguir editando</button>
              {toast.post.status === "PUBLISHED" && (
                <button onClick={() => go(`/articulos/${toast.post?.slug}`)}>Ir al artículo publicado</button>
              )}
              <button className="secondary" onClick={() => setEditing(emptyPost)}>Crear nuevo post</button>
            </div>
          )}
        </div>
      )}

      <div className="admin-layout">
        <aside className="panel">
          <div className="section-head compact">
            <h3>Posts</h3>
            <button className="secondary" onClick={() => setEditing(emptyPost)}>+ Nuevo</button>
          </div>

          {loadingList && <p className="muted">Cargando posts...</p>}

          <div className="post-list">
            {posts.map((post) => (
              <button key={post.id} className="post-item" onClick={() => setEditing(post)}>
                <span>{post.title}</span>
                <small>{post.status}</small>
              </button>
            ))}
          </div>
        </aside>

        <div className="editor-shell">
          <div className="panel">
            <h3>{editing.id ? "Editar post" : "Nuevo post"}</h3>
            <div className="form-grid">
              <input placeholder="Título" value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              <input placeholder="Subtítulo" value={editing.subtitle ?? ""} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} />
              <input placeholder="Slug" value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
              <input placeholder="Tags (coma separada)" value={editing.tags ?? ""} onChange={(e) => setEditing({ ...editing, tags: e.target.value })} />
              <input type="number" placeholder="Semana" value={editing.weekNumber ?? 1} onChange={(e) => setEditing({ ...editing, weekNumber: Number(e.target.value) })} />
              <input placeholder="URL imagen" value={editing.coverImage ?? ""} onChange={(e) => setEditing({ ...editing, coverImage: e.target.value })} />
              <textarea placeholder="Idea clave" value={editing.keyIdea ?? ""} onChange={(e) => setEditing({ ...editing, keyIdea: e.target.value })} />
              <textarea rows={10} placeholder="Contenido (usa ## para subtítulos)" value={editing.content ?? ""} onChange={(e) => setEditing({ ...editing, content: e.target.value })} />
            </div>

            <div className="row-actions">
              <label className="file-input">
                {uploading ? "Subiendo imagen..." : "Subir imagen"}
                <input type="file" accept="image/*" onChange={(e) => handleUpload(e.target.files?.[0])} disabled={uploading} />
              </label>
              <button
                className="secondary"
                onClick={() => handleSave("DRAFT")}
                disabled={saving !== null}
              >
                {saving === "DRAFT" ? "Guardando..." : "Guardar borrador"}
              </button>
              <button
                onClick={() => handleSave("PUBLISHED")}
                disabled={saving !== null}
              >
                {saving === "PUBLISHED" ? "Publicando..." : "Publicar"}
              </button>
              <button
                className="secondary"
                onClick={() => handleSave("DRAFT")}
                disabled={saving !== null}
              >
                Despublicar
              </button>
            </div>
          </div>

          <div className="panel preview">
            <h3>Vista previa</h3>
            <p className="micro">Semana {editing.weekNumber ?? "-"}</p>
            <h2>{editing.title || "Título del artículo"}</h2>
            {editing.subtitle && <p className="article-subtitle">{editing.subtitle}</p>}
            {editing.coverImage && <img src={editing.coverImage} alt="Vista previa" />}
            <blockquote>{editing.keyIdea || "Idea clave del post"}</blockquote>
            {(editing.content || "").split("\n\n").slice(0, 4).map((block, index) =>
              block.startsWith("## ") ? <h4 key={index}>{block.slice(3)}</h4> : <p key={index}>{block || "Contenido del artículo..."}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Login({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      onSuccess();
    } else {
      setError("Credenciales inválidas.");
    }

    setLoading(false);
  };

  return (
    <section className="login-card">
      <h1>Acceso administrador</h1>
      <p className="muted">Panel editorial privado de GEXPLO.</p>
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <p className="error-text">{error}</p>}
      <button onClick={submit} disabled={loading}>{loading ? "Ingresando..." : "Iniciar sesión"}</button>
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

function splitTags(value: string) {
  return value.split(",").map((tag) => tag.trim()).filter(Boolean);
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
