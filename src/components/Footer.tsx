export default function Footer() {
  return (
    <footer className="bg-surface-container-low w-full border-t border-outline-variant/20">
      <div className="max-w-7xl mx-auto px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
          <div>
            <div className="text-lg font-bold text-primary font-inter mb-4 uppercase tracking-tighter">CPCNER</div>
            <p className="font-serif italic text-lg leading-relaxed text-secondary opacity-90">
              © 2024 Consejo Profesional de Ciencias Naturales de Entre Ríos. Todos los derechos reservados.
            </p>
          </div>
          <div className="md:text-right">
            <p className="font-serif italic text-lg text-secondary leading-tight">
              Para consultas institucionales: <a href="mailto:cpcner@gmail.com" className="text-primary font-bold hover:underline">cpcner@gmail.com</a>
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-x-8 gap-y-4 md:justify-end border-t border-outline-variant/20 pt-8">
          {["Privacidad", "Términos de Uso", "Transparencia"].map((link) => (
            <a key={link} href="#" className="font-serif italic text-lg text-secondary hover:text-primary transition-all">
              {link}
            </a>
          ))}
          <a href="mailto:cpcner@gmail.com" className="font-serif italic text-lg text-secondary hover:text-primary transition-all">
            cpcner@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}
