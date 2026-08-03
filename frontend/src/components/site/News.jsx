import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { STR, useLang } from "@/lib/i18n";

const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

export const News = () => {
  const { lang } = useLang();
  const s = STR[lang].news;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/content")
      .then((r) => setItems(r.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="news" data-testid="news-section" className="border-b-2 border-ink px-6 py-24 md:px-12 md:py-32">
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
        {s.h2}
      </motion.h2>

      <div data-testid="news-list" className="mt-14">
        {loading && <p className="py-10 text-sm uppercase tracking-[0.2em] opacity-60">{s.loading}</p>}
        {!loading && items.length === 0 && (
          <p data-testid="news-empty" className="border-t-2 border-ink py-10 text-sm uppercase tracking-[0.2em] opacity-60">
            {s.empty}
          </p>
        )}
        {items.map((item, i) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            data-testid={`news-item-${item.id}`}
            className="group grid grid-cols-1 gap-4 border-t-2 border-ink py-8 last:border-b-2 md:grid-cols-12 md:gap-6 md:py-10"
          >
            <div className="md:col-span-3">
              <span
                className={`inline-block border-2 border-ink px-2 py-1 text-[10px] font-bold uppercase tracking-[0.25em] ${
                  item.type === "event" ? "bg-brand-yellow text-ink" : "bg-brand-red text-paper"
                }`}
              >
                {s.types[item.type] || item.type}
              </span>
              <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] opacity-60">{formatDate(item.date)}</p>
            </div>
            <h3 className="font-display text-2xl font-semibold uppercase leading-none tracking-tight transition-colors duration-300 group-hover:text-brand-red md:col-span-5 md:text-4xl">
              {item.title}
            </h3>
            <p className="text-sm leading-relaxed opacity-70 md:col-span-4 md:text-base">{item.summary}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
};
