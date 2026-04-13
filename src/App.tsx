import { useEffect, useMemo, useState } from "react";

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
  status: "DRAFT" | "PUBLISHED";
  publishedAt?: string;
};

const intro = "Bitácora técnica de GEXPLO: transición desde consultoría ambiental e hidrogeológica hacia una operación geocientífica basada en datos, trazabilidad e IA aplicada.";

const emptyPost: Partial<Post> = {
  title: "",
  subtitle: "",
  slug: "",
  keyIdea: "",
  content: "",
  coverImage: "",
  tags: "ambiente,agua",
  weekNumber: 1,
  status: "DRAFT"
};

export function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [posts, setPosts] = useState([] as Post[]);

  useEffect(() => {
    fetch("/api/posts").then((r) => r.json()).then(setPosts);
  }, []);

  const activeSlug = useMemo(() => path.match(/^\/articulos\/(.+)$/)?.[1], [path]);
  const current = posts.find((p) => p.slug === activeSlug);

  useEffect(() => {
    if (!current) {
      document.title = "Blog GEXPLO";
      return;
    }
    document.title = `${current.title} | Blog GEXPLO`;
    setMeta("description", current.keyIdea);
  }, [current]);

  function go(to: string) {
    window.history.pushState({}, "", to);
    setPath(to);
  }

  return (
    <div>
      <header className="header">
        <div className="container nav">
          <button className="brand" onClick={() => go("/")}>GEXPLO · Blog</button>
          <nav>
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
        {path === "/admin" && <Admin onUpdated={() => fetch("/api/posts").then((r) => r.json()).then(setPosts)} />}
      </main>
    </div>
  );
}

function Home({ posts, go }: { posts: Post[]; go: (to: string) => void }) {
  return (
    <section>
      <div className="hero">
        <p className="eyebrow">Ambiente · Agua · Tierra · IA & Blockchain</p>
        <h1>Documentación semanal de la transformación de GEXPLO.</h1>
        <p>{intro}</p>
      </div>
      <h2>Últimas ediciones</h2>
      {posts.slice(0, 3).map((post) => (
        <div key={post.id}><PostCard post={post} go={go} /></div>
      ))}
    </section>
  );
}

function Archive({ posts, go }: { posts: Post[]; go: (to: string) => void }) {
  return (
    <section>
      <h1>Archivo editorial</h1>
      <p className="muted">Seguimiento de estrategia, operaciones y producto.</p>
      {posts.map((post) => (
        <div key={post.id}><PostCard post={post} go={go} /></div>
      ))}
    </section>
  );
}

function PostCard({ post, go }: { post: Post; go: (to: string) => void }) {
  return (
    <article className="card">
      {post.coverImage && <img src={post.coverImage} alt={post.title} />}
      <p className="muted">Semana {post.weekNumber ?? "-"}</p>
      <h3>{post.title}</h3>
      <p>{post.keyIdea}</p>
      <button onClick={() => go(`/articulos/${post.slug}`)}>Leer artículo</button>
    </article>
  );
}

function Article({ post }: { post: Post }) {
  return (
    <article className="article">
      <h1>{post.title}</h1>
      {post.subtitle && <p className="muted">{post.subtitle}</p>}
      {post.coverImage && <img src={post.coverImage} alt={post.title} />}
      <blockquote>{post.keyIdea}</blockquote>
      {post.content.split("\n\n").map((block, index) =>
        block.startsWith("## ") ? <h2 key={index}>{block.slice(3)}</h2> : <p key={index}>{block}</p>
      )}
      <p className="muted">Tags: {post.tags}</p>
    </article>
  );
}

function About() {
  return (
    <section>
      <h1>Sobre este blog</h1>
      <p>{intro}</p>
      <p>Este espacio editorial busca trazabilidad, criterio técnico y continuidad estratégica.</p>
    </section>
  );
}

function Admin({ onUpdated }: { onUpdated: () => void }) {
  const [auth, setAuth] = useState(false);
  const [posts, setPosts] = useState([] as Post[]);
  const [editing, setEditing] = useState(emptyPost as Partial<Post>);

  async function refreshAdmin() {
    const response = await fetch("/api/admin/posts");
    if (!response.ok) return setAuth(false);
    const data = await response.json();
    setPosts(data);
    setAuth(true);
  }

  useEffect(() => {
    refreshAdmin();
  }, []);

  if (!auth) {
    return <Login onSuccess={() => refreshAdmin()} />;
  }

  return (
    <section>
      <h1>Panel editorial</h1>
      <p className="muted">Crear, editar, guardar borrador, publicar o despublicar.</p>

      <div className="admin-layout">
        <div className="card">
          <h3>Posts</h3>
          {posts.map((post) => (
            <button key={post.id} className="row" onClick={() => setEditing(post)}>
              <span>{post.title}</span>
              <small>{post.status}</small>
            </button>
          ))}
          <button onClick={() => setEditing(emptyPost)}>+ Nuevo post</button>
        </div>

        <Editor
          post={editing}
          onChange={setEditing}
          onSave={async (status) => {
            const payload = { ...editing, status };
            const method = editing.id ? "PATCH" : "POST";
            const url = editing.id ? `/api/admin/posts/${editing.id}` : "/api/admin/posts";
            await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
            await refreshAdmin();
            onUpdated();
          }}
        />
      </div>
    </section>
  );
}

function Editor({
  post,
  onChange,
  onSave
}: {
  post: Partial<Post>;
  onChange: (post: Partial<Post>) => void;
  onSave: (status: "DRAFT" | "PUBLISHED") => void;
}) {
  async function upload(file?: File | null) {
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    const response = await fetch("/api/admin/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: file.name, dataUrl })
    });
    const data = await response.json();
    onChange({ ...post, coverImage: data.url });
  }

  return (
    <div className="card editor">
      <h3>{post.id ? "Editar post" : "Nuevo post"}</h3>
      <input placeholder="Título" value={post.title ?? ""} onChange={(e) => onChange({ ...post, title: e.target.value })} />
      <input placeholder="Subtítulo" value={post.subtitle ?? ""} onChange={(e) => onChange({ ...post, subtitle: e.target.value })} />
      <input placeholder="Slug" value={post.slug ?? ""} onChange={(e) => onChange({ ...post, slug: e.target.value })} />
      <textarea placeholder="Idea clave" value={post.keyIdea ?? ""} onChange={(e) => onChange({ ...post, keyIdea: e.target.value })} />
      <textarea rows={10} placeholder="Contenido (usa ## para subtítulos)" value={post.content ?? ""} onChange={(e) => onChange({ ...post, content: e.target.value })} />
      <div className="row">
        <input placeholder="Tags" value={post.tags ?? ""} onChange={(e) => onChange({ ...post, tags: e.target.value })} />
        <input type="number" placeholder="Semana" value={post.weekNumber ?? 1} onChange={(e) => onChange({ ...post, weekNumber: Number(e.target.value) })} />
      </div>
      <input placeholder="URL imagen" value={post.coverImage ?? ""} onChange={(e) => onChange({ ...post, coverImage: e.target.value })} />
      <input type="file" accept="image/*" onChange={(e) => upload(e.target.files?.[0])} />
      <div className="row">
        <button onClick={() => onSave("DRAFT")}>Guardar borrador</button>
        <button onClick={() => onSave("PUBLISHED")}>Publicar</button>
      </div>
    </div>
  );
}

function Login({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit() {
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (response.ok) onSuccess();
  }

  return (
    <section className="card">
      <h1>Acceso admin</h1>
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={submit}>Iniciar sesión</button>
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

function setMeta(name: string, content: string) {
  let tag = document.querySelector(`meta[name='${name}']`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}
