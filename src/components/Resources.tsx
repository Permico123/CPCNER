import { motion } from "motion/react";
import { FileText, Newspaper } from "lucide-react";

export default function Resources() {
  return (
    <section className="py-24 bg-surface max-w-7xl mx-auto px-8" id="noticias">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <motion.a 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          href="https://drive.google.com/drive/folders/1kutzul5x1zcsZxAEPAf9grQ4G7VXymDG?usp=sharing" 
          target="_blank"
          className="bg-surface-container-low p-10 rounded-xl flex items-center gap-8 group cursor-pointer hover:bg-primary-fixed/20 transition-colors"
        >
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <FileText className="text-primary w-10 h-10" />
          </div>
          <div>
            <h4 className="text-2xl font-inter font-bold text-on-surface mb-1">Resoluciones</h4>
            <p className="text-secondary font-serif italic">Acceda a la documentación oficial y normativas vigentes.</p>
          </div>
        </motion.a>
        
        <motion.a 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          href="https://drive.google.com/drive/folders/1t3_XSknqwg6zQluLt8P82QCqDB2ZNZx5?usp=sharing" 
          target="_blank"
          className="bg-surface-container-low p-10 rounded-xl flex items-center gap-8 group cursor-pointer hover:bg-primary-fixed/20 transition-colors"
        >
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <Newspaper className="text-primary w-10 h-10" />
          </div>
          <div>
            <h4 className="text-2xl font-inter font-bold text-on-surface mb-1">Noticias</h4>
            <p className="text-secondary font-serif italic">Actualidad institucional y del ámbito científico provincial.</p>
          </div>
        </motion.a>
      </div>
    </section>
  );
}
