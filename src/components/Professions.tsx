import { motion } from "motion/react";
import { Microscope, Mountain, Users, Leaf, HeartPulse, FlaskConical } from "lucide-react";

const professions = [
  {
    title: "Biólogos",
    description: "Investigación básica y aplicada, gestión de ecosistemas y biotecnología.",
    icon: Microscope
  },
  {
    title: "Geólogos",
    description: "Estudios de suelo, hidrogeología, minería sustentable y riesgos geológicos.",
    icon: Mountain
  },
  {
    title: "Antropólogos",
    description: "Investigación antropológica, arqueológica y gestión del patrimonio cultural.",
    icon: Users
  },
  {
    title: "Lic. en Gestión Ambiental",
    description: "Planificación territorial, gestión de recursos y políticas sustentables.",
    icon: Leaf
  },
  {
    title: "Lic. en Salud Ambiental",
    description: "Evaluación de riesgos ambientales para la salud pública y saneamiento.",
    icon: HeartPulse
  },
  {
    title: "Otras Carreras",
    description: "Disciplinas afines a las Ciencias Naturales según normativa vigente.",
    icon: FlaskConical
  }
];

export default function Professions() {
  return (
    <section className="py-24 bg-surface-container-low" id="obligatorias">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-inter font-bold text-on-surface mb-4">¿Quiénes pueden matricularse?</h2>
            <div className="text-lg text-secondary font-serif italic space-y-4">
              <p>Pueden matricularse los profesionales cuyos títulos y actividades se encuentren comprendidos dentro del campo de las Ciencias Naturales y disciplinas afines, conforme a lo establecido en la Ley Provincial Nº 10.872. El detalle del alcance profesional se encuentra definido en el Artículo 39 de la norma.</p>
              <p>La matriculación es obligatoria para quienes ejerzan profesionalmente utilizando su título universitario dentro de dichas incumbencias. Quedan exceptuados los títulos de profesorado cuando su ejercicio se circunscribe exclusivamente al ámbito docente.</p>
            </div>
          </div>
          <div className="h-[2px] flex-grow mx-8 bg-outline-variant/30 hidden md:block"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {professions.map((prof, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface-container-lowest p-8 rounded-xl flex flex-col justify-between aspect-square group hover:bg-primary transition-all duration-500 cursor-default"
            >
              <prof.icon className="w-12 h-12 text-primary group-hover:text-white transition-colors" />
              <div>
                <h4 className="text-2xl font-inter font-bold text-on-surface group-hover:text-white mb-2">{prof.title}</h4>
                <p className="text-sm text-secondary group-hover:text-primary-fixed font-inter">{prof.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
