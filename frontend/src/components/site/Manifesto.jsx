import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const BAND_IMG =
  "https://images.unsplash.com/photo-1738854710710-4d3714df5186?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjh8MHwxfHNlYXJjaHwzfHxwcm90ZXN0JTIwYWN0aXZpc20lMjBpbmRpYXxlbnwwfHx8fDE3ODU3Mzc4MzF8MA&ixlib=rb-4.1.0&q=85";

const CHAPTERS = [
  {
    num: "01",
    title: "Every child in school",
    text: "We go door to door, find the children the system forgot, counsel their families and walk them into a classroom. Enrollment is not a favour — it is a right.",
  },
  {
    num: "02",
    title: "No child at work",
    text: "Small hands are meant for books, not bricks. We identify child labour in our communities, intervene with families and employers, and stay until the child is safe.",
  },
  {
    num: "03",
    title: "No child bride",
    text: "A girl is not a burden to be married off. We campaign against child marriage, dowry and the quiet customs that steal childhoods — loudly, publicly, relentlessly.",
  },
  {
    num: "04",
    title: "Every woman heard",
    text: "From village squares to city streets, we stand with women facing violence and discrimination — because dignity is not negotiable and silence is not an option.",
  },
];

const Chapter = ({ chapter, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 48 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    data-testid={`manifesto-chapter-${chapter.num}`}
    className={`grid grid-cols-12 gap-6 border-t-2 border-paper/25 py-12 md:py-16 ${
      index % 2 === 1 ? "md:pl-24" : ""
    }`}
  >
    <span className="col-span-3 font-display text-5xl font-semibold text-brand-red md:col-span-2 md:text-8xl">
      {chapter.num}
    </span>
    <div className="col-span-9 md:col-span-8">
      <h3 className="font-display text-2xl font-semibold uppercase leading-none tracking-tight md:text-5xl">
        {chapter.title}
      </h3>
      <p className="mt-5 max-w-xl text-sm leading-relaxed text-paper/70 md:text-lg">{chapter.text}</p>
    </div>
  </motion.div>
);

const ImageBand = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  return (
    <div ref={ref} className="relative h-[46vh] overflow-hidden border-y-2 border-paper/25 md:h-[60vh]">
      <motion.img
        src={BAND_IMG}
        alt="An activist holding a hand-drawn poster for justice"
        style={{ y }}
        className="absolute inset-0 h-[130%] w-full object-cover grayscale contrast-125"
      />
      <div className="absolute inset-0 bg-brand-red/25 mix-blend-multiply" />
      <p className="absolute bottom-6 left-6 max-w-xs border-2 border-ink bg-brand-yellow px-4 py-3 text-xs font-bold uppercase tracking-[0.2em] text-ink md:left-12">
        The voice that refuses to be silenced
      </p>
    </div>
  );
};

export const Manifesto = () => (
  <section id="manifesto" data-testid="manifesto-section" className="bg-ink text-paper">
    <div className="px-6 pt-24 md:px-12 md:pt-32">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-xs font-bold uppercase tracking-[0.3em] text-brand-yellow"
      >
        The manifesto — what we fight for
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="mt-6 max-w-4xl font-display text-4xl font-semibold uppercase leading-[0.95] tracking-tighter md:text-7xl"
      >
        We are not asking<span className="text-brand-red">.</span> We are insisting<span className="text-brand-red">.</span>
      </motion.h2>
    </div>
    <div className="mt-8 px-6 pb-20 md:px-12 md:pb-28">
      {CHAPTERS.map((chapter, i) => (
        <Chapter key={chapter.num} chapter={chapter} index={i} />
      ))}
    </div>
    <ImageBand />
  </section>
);
