import { motion } from "motion/react";

export default function Hero() {
  return (
    <section className="relative h-[921px] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          className="w-full h-full object-cover" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD742Tk5WDcqkI8dwZOn35R_13xsB-AeuZJx19he7weKKmPEH43NgSdZE5BaK412MgkOxqgsLkxzFtx0nKQcfoZpQvJkkxyIcsfh6V8BrE1Pl8JAGMkrE2_e6MwqLul1Bkbj0LhODi6jyVFNR9TbU0AStxkiIMAsd4os2VmSF3G9LVCUnUWaUWueGgus6-EvkaMEHU0Cb0wPWRw7MA1CWCnf0pSqdiO_k5NL2np4SB0L0D4gDIPzkHvCfbP4Rkbfr2ikisWbn-R8U0" 
          alt="Fern leaf in Entre Rios forest"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent"></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <h1 className="text-white text-5xl md:text-7xl font-inter font-extrabold tracking-tighter leading-tight mb-6">
            Colegio de Profesionales en Ciencias Naturales de Entre Ríos
          </h1>
          <div className="flex flex-wrap gap-4 font-inter mt-10">
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#matricula" 
              className="bg-white text-primary px-6 py-3 rounded-md font-bold hover:bg-surface-container-low transition-all"
            >
              Matrícula y aranceles
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#obligatorias" 
              className="bg-primary-container/40 backdrop-blur-md text-white border border-white/20 px-6 py-3 rounded-md font-bold hover:bg-primary-container/60 transition-all"
            >
              ¿Quiénes deben matricularse?
            </motion.a>
            <a href="#autoridades" className="text-white underline underline-offset-8 decoration-primary-fixed/50 hover:decoration-primary-fixed py-3 transition-all">
              Ver Autoridades
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
