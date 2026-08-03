import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { scrollToSection } from "@/lib/api";
import { STR, useLang } from "@/lib/i18n";

const HERO_IMG =
  "https://images.unsplash.com/photo-1618245472177-2a74ad3b994a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzV8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBnaXJsJTIwcG9ydHJhaXQlMjBkb2N1bWVudGFyeXxlbnwwfHx8fDE3ODU3Mzc4NDF8MA&ixlib=rb-4.1.0&q=85";

export const MaskedLine = ({ children, delay = 0, className = "" }) => (
  <div className="overflow-hidden">
    <motion.div
      initial={{ y: "115%" }}
      animate={{ y: 0 }}
      transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  </div>
);

export const Hero = () => {
  const ref = useRef(null);
  const { lang } = useLang();
  const s = STR[lang].hero;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      data-testid="hero-section"
      className="relative min-h-screen border-b-2 border-ink px-6 pt-28 pb-14 md:px-12 md:pt-36 overflow-hidden"
    >
      <motion.div style={{ opacity: fade }} className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <MaskedLine delay={0.1}>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-red md:text-sm">
              {s.tag}
            </p>
          </MaskedLine>

          <h1 className="mt-6 font-display font-semibold uppercase leading-[0.85] tracking-tighter">
            <MaskedLine delay={0.25}>
              <span className="block text-[18vw] lg:text-[9.5vw] text-outline">Buland</span>
            </MaskedLine>
            <MaskedLine delay={0.4}>
              <span className="block text-[18vw] lg:text-[9.5vw] text-brand-red">Awaaz</span>
            </MaskedLine>
          </h1>

          <MaskedLine delay={0.6}>
            <p className="mt-8 max-w-xl text-base leading-relaxed md:text-lg">
              {s.para}
            </p>
          </MaskedLine>

          <MaskedLine delay={0.75}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                data-testid="hero-volunteer-cta"
                onClick={() => scrollToSection("volunteer")}
                className="group inline-flex items-center gap-2 border-2 border-ink bg-ink px-7 py-4 text-sm font-bold uppercase tracking-[0.2em] text-paper transition-colors duration-300 hover:bg-brand-red hover:border-brand-red"
              >
                {s.cta1}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
              <button
                data-testid="hero-work-cta"
                onClick={() => scrollToSection("programs")}
                className="inline-flex items-center gap-2 border-2 border-ink bg-transparent px-7 py-4 text-sm font-bold uppercase tracking-[0.2em] text-ink transition-colors duration-300 hover:bg-ink hover:text-paper"
              >
                {s.cta2}
              </button>
            </div>
          </MaskedLine>
        </div>

        <div className="relative lg:col-span-5">
          <motion.div
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            animate={{ clipPath: "inset(0% 0 0 0)" }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="absolute -bottom-4 -right-4 h-full w-full bg-brand-red" aria-hidden="true" />
            <div className="relative overflow-hidden border-2 border-ink">
              <motion.img
                src={HERO_IMG}
                alt="A young Indian girl looking directly at the camera"
                style={{ y: imgY }}
                className="h-[46vh] w-full scale-110 object-cover grayscale-[35%] contrast-125 md:h-[62vh]"
              />
            </div>
            <div className="absolute left-0 top-0 -translate-x-2 -translate-y-2 border-2 border-ink bg-brand-yellow px-3 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-ink md:text-xs">
              {s.badge}
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-6 left-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] md:left-12 md:text-xs"
      >
        <ArrowDown className="h-4 w-4 animate-bounce" />
        {s.cue}
      </motion.div>
    </section>
  );
};
