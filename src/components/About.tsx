import { motion } from "motion/react";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

export default function About() {
  return (
    <section className="py-24 bg-surface max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="lg:col-span-7"
      >
        <span className="font-inter text-xs font-bold tracking-[0.2em] text-primary uppercase mb-4 block">Institución</span>
        <h2 className="text-4xl md:text-5xl font-inter font-bold text-on-surface mb-8 tracking-tight leading-none">
          ¿Qué es el CPCNER?
        </h2>
        <div className="text-lg md:text-xl leading-relaxed font-serif text-on-surface-variant space-y-6 italic">
          <p>El Colegio de Profesionales en Ciencias Naturales de Entre Ríos (CPCNER) es una entidad de derecho público no estatal creada por la Ley Provincial Nº 10.872, sancionada por la Legislatura de la Provincia de Entre Ríos, con el objeto de regular el ejercicio profesional de las Ciencias Naturales en todo el territorio provincial.</p>
          <p>La norma establece la organización del Colegio, sus funciones y atribuciones, así como la obligatoriedad de la matriculación para el ejercicio profesional, garantizando estándares éticos, técnicos y científicos. Asimismo, el CPCNER tiene entre sus fines velar por el cumplimiento de la ley, fiscalizar el ejercicio profesional, representar a los matriculados y promover el desarrollo y jerarquización de las Ciencias Naturales en la provincia.</p>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="lg:col-span-5 bg-surface-container-low p-10 rounded-xl"
      >
        <div className="mb-6">
          <ShieldCheck className="text-primary w-12 h-12" />
        </div>
        <h3 className="text-2xl font-inter font-bold text-primary mb-4">Nuestros Objetivos</h3>
        <p className="text-lg font-serif text-secondary mb-6 leading-relaxed">
          Creado como una entidad de derecho público, el CPCNER garantiza que el ejercicio de las ciencias naturales sea llevado a cabo por profesionales idóneos, protegiendo así el patrimonio natural de Entre Ríos.
        </p>
        <ul className="space-y-4">
          {[
            "Garantizar estándares éticos profesionales",
            "Regular la matrícula provincial obligatoria",
            "Fomentar la excelencia científica continua"
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <CheckCircle2 className="text-primary-container w-5 h-5 mt-1 shrink-0" />
              <span className="text-on-surface-variant font-inter text-sm">{item}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
