import { motion } from "motion/react";

export default function Authorities() {
  return (
    <section className="py-24 bg-surface-container-low" id="autoridades">
      <div className="max-w-7xl mx-auto px-8">
        <span className="font-inter text-xs font-bold tracking-[0.2em] text-primary uppercase mb-4 block text-center">Gobernanza</span>
        <h2 className="text-4xl md:text-5xl font-inter font-bold text-center mb-20 tracking-tight">Cuerpo Directivo y Comisiones</h2>
        
        <div className="space-y-16">
          {/* Comisión Directiva */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            <div className="lg:col-span-4">
              <h3 className="text-3xl font-serif italic text-primary border-l-4 border-primary pl-6">Comisión Directiva</h3>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-inter font-bold text-outline uppercase tracking-wider mb-1">Presidente</p>
                  <p className="text-xl font-inter font-bold text-on-surface">Dra. Yamila Battauz <span className="text-sm font-normal text-secondary">(MP. 3)</span></p>
                </div>
                <div>
                  <p className="text-xs font-inter font-bold text-outline uppercase tracking-wider mb-1">Secretaria</p>
                  <p className="text-xl font-inter font-bold text-on-surface">Dra. Virginia Piani <span className="text-sm font-normal text-secondary">(MP. 27)</span></p>
                </div>
                <div>
                  <p className="text-xs font-inter font-bold text-outline uppercase tracking-wider mb-1">Vocales Titulares</p>
                  <p className="text-lg font-serif text-on-surface-variant">Carlos Caraballo, Noelí Baeza, Justo Cardoso, Rocío Galarza</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-inter font-bold text-outline uppercase tracking-wider mb-1">Vice-Presidente</p>
                  <p className="text-xl font-inter font-bold text-on-surface">Dra. Pamela Zamboni <span className="text-sm font-normal text-secondary">(MP. 21)</span></p>
                </div>
                <div>
                  <p className="text-xs font-inter font-bold text-outline uppercase tracking-wider mb-1">Tesorera</p>
                  <p className="text-xl font-inter font-bold text-on-surface">Dra. Adriana Manzano <span className="text-sm font-normal text-secondary">(MP. 8)</span></p>
                </div>
                <div>
                  <p className="text-xs font-inter font-bold text-outline uppercase tracking-wider mb-1">Suplentes</p>
                  <p className="text-lg font-serif text-on-surface-variant">Julio Benites, Jesica Ríos</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Other Commissions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-16 border-t border-outline-variant/30">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-serif italic text-primary">Comisión Fiscalizadora</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-inter font-bold text-outline uppercase tracking-wider mb-1">Titulares</p>
                  <p className="text-lg font-inter text-on-surface leading-tight">Eloisa García Añino, Griselda Urich, Laura C. Santoni</p>
                </div>
                <div>
                  <p className="text-xs font-inter font-bold text-outline uppercase tracking-wider mb-1">Suplentes</p>
                  <p className="text-lg font-inter text-on-surface">Matias Ayarragaray, Pablo Aceñolaza</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-serif italic text-primary">Tribunal de Ética</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-inter font-bold text-outline uppercase tracking-wider mb-1">Titulares</p>
                  <p className="text-lg font-inter text-on-surface leading-tight">Alfredo Berduc, Laura C. Santoni, Irene Aguer</p>
                </div>
                <div>
                  <p className="text-xs font-inter font-bold text-outline uppercase tracking-wider mb-1">Suplentes</p>
                  <p className="text-lg font-inter text-on-surface">Estela Rodríguez, Paola Soñez, Luciano Torres</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
