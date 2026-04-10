import { motion } from "motion/react";

export default function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md">
      <nav className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl font-bold text-primary tracking-tighter font-inter uppercase"
        >
          CPCNER
        </motion.div>
        <div className="hidden md:flex items-center space-x-8 font-inter font-semibold tracking-tight">
          <a href="#" className="text-primary border-b-2 border-primary-container pb-1">Inicio</a>
          <a href="#matricula" className="text-secondary hover:text-primary transition-colors">Matrícula</a>
          <a href="#autoridades" className="text-secondary hover:text-primary transition-colors">Autoridades</a>
          <a href="#noticias" className="text-secondary hover:text-primary transition-colors">Noticias</a>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-primary text-white px-5 py-2 text-sm font-inter font-semibold rounded-md hover:bg-primary-container transition-all"
        >
          Portal Colegiado
        </motion.button>
      </nav>
    </header>
  );
}
