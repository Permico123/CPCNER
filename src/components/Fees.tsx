import { motion } from "motion/react";

const naturaFees = [
  { concept: "Día de Campo (8 horas)", value: 30 },
  { concept: "Día en Gabinete (8 horas)", value: 20 },
  { concept: "Día de Laboratorio (8 horas)", value: 25 },
  { concept: "Hora de Campo", value: 9 },
  { concept: "Hora de Gabinete", value: 5 },
  { concept: "Hora de Laboratorio", value: 8 },
  { concept: "Consulta en Gabinete, sin inspección ocular", value: 5 },
  { concept: "Consulta en Gabinete, con inspección ocular", value: 7 },
  { concept: "Consulta a campo, con inspección ocular", value: 15 },
  { concept: "Informe Ambiental", value: 50 },
  { concept: "Estudio de Impacto Ambiental", value: 70 },
  { concept: "Visados de Trabajos Profesionales del CPCN", value: 2, highlight: true },
];

export default function Fees() {
  return (
    <section className="py-24 bg-surface max-w-7xl mx-auto px-8" id="matricula">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-primary rounded-2xl overflow-hidden shadow-2xl flex flex-col lg:flex-row"
      >
        <div className="lg:w-1/2 p-12 lg:p-20 text-white flex flex-col justify-center">
          <h2 className="text-4xl md:text-5xl font-inter font-extrabold mb-6 leading-tight">Matrícula y Aranceles</h2>
          <p className="text-primary-fixed text-lg font-serif italic mb-8">Información actualizada sobre el canon anual y beneficios del colegiado.</p>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/10 mb-8">
            <p className="text-sm font-inter uppercase tracking-[0.2em] opacity-80 mb-2">Cuota Anual 2026</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-inter font-black">$65.000</span>
              <span className="text-primary-fixed text-sm font-inter">AR$</span>
            </div>
            <p className="mt-4 text-sm font-inter opacity-80">Válida hasta Junio 2026</p>
          </div>
          
          <p className="text-sm font-inter leading-relaxed text-primary-fixed">
            Para iniciar su trámite de matriculación o solicitar información institucional, contáctenos vía correo electrónico: 
            <a href="mailto:cpcner@gmail.com" className="font-bold underline hover:text-white transition-colors ml-1">cpcner@gmail.com</a>
          </p>
        </div>
        
        <div className="lg:w-1/2 relative min-h-[400px]">
          <img 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzf1QxwfLdkS5biJI2i-UpGWrdMqqfjoJ5zyuxHwr6c90aSCEJiyx9x_rgoMypuIMrdcSLU6b36cbrcz9yyQ-zHaI4WpyFs0UBBw7RyhANqdkuAjfXRWwlPp9Xa06PgPuDTXVd1rhoxDPHktbbYDpIaPVyMMVZxsBIQ3iKUbXY6bkzV-Zz7JuAIsWY7oB0Hshfboca24CsuVEaxlRSRMATyKDqsKsbyb9fpABK35l1Rq4xrxzF_U6IVxy8N7idtis6RbwAQ8aiK78" 
            alt="Laboratory equipment"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent lg:bg-gradient-to-l"></div>
        </div>
      </motion.div>

      <div className="mt-16 bg-surface-container-low rounded-xl p-8 lg:p-12 border border-outline-variant/30">
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <h3 className="text-3xl font-inter font-bold text-primary mb-4">Honorarios Profesionales (Módulo NATURA)</h3>
          <p className="text-lg font-serif italic text-on-surface-variant">
            Los aranceles están establecidos en base a la unidad arancelaria “NATURA”. El valor de la unidad NATURA es de pesos diez mil seiscientos ($10.600), sujeto a actualización según resolución del Consejo.
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-primary/20">
                <th className="py-4 px-6 font-inter font-bold text-primary uppercase text-xs tracking-wider">Concepto de Tarea</th>
                <th className="py-4 px-6 font-inter font-bold text-primary uppercase text-xs tracking-wider text-right">Valor en NATURA</th>
              </tr>
            </thead>
            <tbody className="font-inter text-sm divide-y divide-outline-variant/20">
              {naturaFees.map((fee, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-surface/50" : ""}>
                  <td className={`py-4 px-6 text-on-surface ${fee.highlight ? "font-semibold" : ""}`}>{fee.concept}</td>
                  <td className="py-4 px-6 text-right font-bold text-primary">{fee.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
