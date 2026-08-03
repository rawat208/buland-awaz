import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { STR, useLang } from "@/lib/i18n";

const Counter = ({ to, suffix }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf;
    const start = performance.now();
    const duration = 1600;
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    <span ref={ref}>
      {val.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
};

export const ImpactStats = () => {
  const { lang } = useLang();
  const s = STR[lang].impact;

  return (
    <section id="impact" data-testid="impact-section" className="border-b-2 border-ink px-6 py-14 md:px-12 md:py-20">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-xs font-bold uppercase tracking-[0.3em] text-brand-red"
      >
        {s.label}
      </motion.p>
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {s.items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            data-testid={`impact-stat-${i}`}
            className="border-2 border-ink p-6 transition-colors duration-300 hover:bg-ink hover:text-paper md:p-8"
          >
            <p className={`font-display text-4xl font-semibold leading-none tracking-tighter min-[420px]:text-5xl md:text-7xl ${i % 2 === 1 ? "text-brand-red" : ""}`}>
              <Counter to={item.num} suffix={item.suffix} />
            </p>
            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.25em] opacity-70 md:text-xs">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
