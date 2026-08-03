import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { STR, useLang } from "@/lib/i18n";

const MEDIA = {
  "child-rights": {
    img: "https://images.unsplash.com/photo-1524069290683-0457abfe42c3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBjaGlsZHJlbiUyMGVkdWNhdGlvbnxlbnwwfHx8fDE3ODU3Mzc4MzF8MA&ixlib=rb-4.1.0&q=85",
    alt: "Indian schoolchildren smiling and waving",
    span: "md:col-span-7",
  },
  education: { span: "md:col-span-5" },
  women: {
    img: "https://images.unsplash.com/photo-1609252509229-364936a1d1a2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzN8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBydXJhbCUyMHdvbWVufGVufDB8fHx8MTc4NTczNzgzMXww&ixlib=rb-4.1.0&q=85",
    alt: "Rural Indian women seated together in a community meeting",
    span: "md:col-span-5",
  },
  community: { span: "md:col-span-7" },
};

const ProgramCard = ({ program, index }) => {
  const media = MEDIA[program.id] || {};
  return (
    <motion.article
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      data-testid={`program-card-${program.id}`}
      className={`group flex flex-col border-2 border-ink bg-paper transition-colors duration-300 hover:bg-ink hover:text-paper ${media.span}`}
    >
      {media.img && (
        <div className="h-56 overflow-hidden border-b-2 border-ink md:h-72">
          <img
            src={media.img}
            alt={media.alt}
            className="h-full w-full object-cover grayscale-[45%] contrast-125 transition-[transform,filter] duration-700 group-hover:scale-105 group-hover:grayscale-0"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6 md:p-8">
        <div className="flex items-center justify-between">
          <span className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-brand-red">
            {program.num}
          </span>
          <span className="border border-current px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">
            {program.tag}
          </span>
        </div>
        <h3 className="mt-4 font-display text-2xl font-semibold uppercase leading-none tracking-tight md:text-4xl">
          {program.title}
        </h3>
        <p className="mt-4 max-w-md text-sm leading-relaxed opacity-70 md:text-base">{program.text}</p>
        <ArrowUpRight className="mt-auto h-6 w-6 pt-2 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
      </div>
    </motion.article>
  );
};

export const Programs = () => {
  const { lang } = useLang();
  const s = STR[lang].programs;

  return (
    <section id="programs" data-testid="programs-section" className="border-b-2 border-ink px-6 py-24 md:px-12 md:py-32">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-xs font-bold uppercase tracking-[0.3em] text-brand-red"
      >
        {s.label}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="mt-6 font-display text-4xl font-semibold uppercase leading-[0.95] tracking-tighter md:text-7xl"
      >
        {s.h2a}
        <br />
        {s.h2b}
      </motion.h2>
      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
        {s.cards.map((program, i) => (
          <ProgramCard key={program.id} program={program} index={i} />
        ))}
      </div>
    </section>
  );
};
