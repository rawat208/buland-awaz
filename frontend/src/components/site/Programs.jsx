import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const CHILDREN_IMG =
  "https://images.unsplash.com/photo-1524069290683-0457abfe42c3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBjaGlsZHJlbiUyMGVkdWNhdGlvbnxlbnwwfHx8fDE3ODU3Mzc4MzF8MA&ixlib=rb-4.1.0&q=85";
const WOMEN_IMG =
  "https://images.unsplash.com/photo-1609252509229-364936a1d1a2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzN8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBydXJhbCUyMHdvbWVufGVufDB8fHx8MTc4NTczNzgzMXww&ixlib=rb-4.1.0&q=85";

const PROGRAMS = [
  {
    id: "child-rights",
    num: "P.01",
    tag: "Protection",
    title: "Child rights & protection",
    text: "Surveys, rescue referrals and family counselling to pull children out of labour and abuse — and keep them out.",
    img: CHILDREN_IMG,
    alt: "Indian schoolchildren smiling and waving",
    span: "md:col-span-7",
  },
  {
    id: "education",
    num: "P.02",
    tag: "Education",
    title: "Education & enrollment",
    text: "Admission support, documentation help and follow-ups so no child drops through the cracks between home and school.",
    span: "md:col-span-5",
  },
  {
    id: "women",
    num: "P.03",
    tag: "Dignity",
    title: "Women's empowerment",
    text: "Campaigns against dowry and violence, and circles where women learn their rights — and use them.",
    img: WOMEN_IMG,
    alt: "Rural Indian women seated together in a community meeting",
    span: "md:col-span-5",
  },
  {
    id: "community",
    num: "P.04",
    tag: "Outreach",
    title: "Community campaigns",
    text: "Street plays, marches and city drives — from child marriage awareness to Good Morning Gurugram's cleanliness mission.",
    span: "md:col-span-7",
  },
];

const ProgramCard = ({ program, index }) => (
  <motion.article
    initial={{ opacity: 0, y: 48 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.8, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    data-testid={`program-card-${program.id}`}
    className={`group flex flex-col border-2 border-ink bg-paper transition-colors duration-300 hover:bg-ink hover:text-paper ${program.span}`}
  >
    {program.img && (
      <div className="h-56 overflow-hidden border-b-2 border-ink md:h-72">
        <img
          src={program.img}
          alt={program.alt}
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

export const Programs = () => (
  <section id="programs" data-testid="programs-section" className="border-b-2 border-ink px-6 py-24 md:px-12 md:py-32">
    <motion.p
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="text-xs font-bold uppercase tracking-[0.3em] text-brand-red"
    >
      On the ground
    </motion.p>
    <motion.h2
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="mt-6 font-display text-4xl font-semibold uppercase leading-[0.95] tracking-tighter md:text-7xl"
    >
      What we do<span className="text-brand-red">,</span>
      <br />
      where it counts
    </motion.h2>
    <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
      {PROGRAMS.map((program, i) => (
        <ProgramCard key={program.id} program={program} index={i} />
      ))}
    </div>
  </section>
);
