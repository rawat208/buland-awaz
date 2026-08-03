import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { api } from "@/lib/api";
import { STR, useLang } from "@/lib/i18n";

const AVATAR_STYLES = [
  "bg-brand-red text-paper",
  "bg-brand-yellow text-ink",
  "bg-ink text-paper",
];

const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

export default function Supporters() {
  const navigate = useNavigate();
  const { lang, setLang } = useLang();
  const s = STR[lang].supporters;
  const [members, setMembers] = useState(null);

  useEffect(() => {
    api
      .get("/members/public")
      .then((r) => setMembers(r.data))
      .catch(() => setMembers([]));
  }, []);

  return (
    <div data-testid="supporters-page" className="relative min-h-screen bg-paper text-ink">
      <div className="noise-overlay" aria-hidden="true" />
      <header className="flex items-center justify-between border-b-2 border-ink bg-paper/90 px-6 py-4 backdrop-blur-md md:px-12">
        <Link to="/" data-testid="supporters-brand" className="flex items-center gap-2 font-display text-lg font-semibold uppercase tracking-tight">
          <img src="/logo.svg" alt="Buland Awaaz logo" className="h-8 w-8 border-2 border-ink" />
          Buland <span className="text-brand-red">Awaaz</span>
          <span className="border-2 border-ink bg-brand-yellow px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-ink">
            Demo
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <div data-testid="lang-toggle" className="flex border-2 border-ink" role="group" aria-label="Language">
            <button
              data-testid="lang-en"
              onClick={() => setLang("en")}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em] transition-colors duration-200 ${lang === "en" ? "bg-ink text-paper" : "bg-transparent text-ink hover:bg-brand-yellow"}`}
            >
              EN
            </button>
            <button
              data-testid="lang-hi"
              onClick={() => setLang("hi")}
              className={`border-l-2 border-ink px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em] transition-colors duration-200 ${lang === "hi" ? "bg-ink text-paper" : "bg-transparent text-ink hover:bg-brand-yellow"}`}
            >
              हिंदी
            </button>
          </div>
          <Link
            to="/"
            data-testid="supporters-back-link"
            className="inline-flex items-center gap-2 border-2 border-ink px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] transition-colors duration-300 hover:bg-ink hover:text-paper"
          >
            <ArrowLeft className="h-4 w-4" /> {s.back}
          </Link>
        </div>
      </header>

      <main className="px-6 py-20 md:px-12 md:py-28">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs font-bold uppercase tracking-[0.3em] text-brand-red"
        >
          {s.label}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 font-display text-5xl font-semibold uppercase leading-[0.9] tracking-tighter md:text-8xl"
        >
          {s.h1a}
          <br />
          {s.h1b}<span className="text-brand-red">.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 max-w-xl text-base leading-relaxed opacity-80 md:text-lg"
        >
          {members === null ? s.loading : s.sub.replace("{n}", members.length)}
        </motion.p>

        <div data-testid="supporters-list" className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {members?.map((m, i) => (
            <motion.article
              key={m.id || i}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.07, ease: [0.16, 1, 0.3, 1] }}
              data-testid={`member-card-${m.id || i}`}
              className="group border-2 border-ink bg-white p-6 transition-colors duration-300 hover:bg-ink hover:text-paper"
            >
              <div className="flex items-center gap-4">
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center border-2 border-ink font-display text-xl font-semibold ${AVATAR_STYLES[i % 3]}`}
                  aria-hidden="true"
                >
                  {(m.name || "?").trim().charAt(0).toUpperCase()}
                </span>
                <div>
                  <h2 className="font-display text-xl font-semibold uppercase leading-none tracking-tight">
                    {m.name}
                  </h2>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] opacity-60">{m.city}</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="border border-current px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">
                  {m.help_with}
                </span>
                {m.created_at && (
                  <span className="text-[10px] uppercase tracking-[0.2em] opacity-50">
                    {s.joined} {formatDate(m.created_at)}
                  </span>
                )}
              </div>
            </motion.article>
          ))}
          {members !== null && members.length === 0 && (
            <p data-testid="supporters-empty" className="col-span-full border-2 border-ink p-10 text-center text-sm uppercase tracking-[0.2em] opacity-60">
              {s.empty}
            </p>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-16 flex flex-col items-start gap-6 border-2 border-ink bg-brand-yellow p-8 md:flex-row md:items-center md:justify-between md:p-12"
        >
          <p className="max-w-xl font-display text-2xl font-semibold uppercase leading-tight tracking-tight md:text-4xl">
            {s.ctaTitle}<span className="text-brand-red">.</span>
          </p>
          <button
            data-testid="supporters-join-cta"
            onClick={() => navigate("/", { state: { scrollTo: "join" } })}
            className="group inline-flex items-center gap-2 border-2 border-ink bg-ink px-7 py-4 text-sm font-bold uppercase tracking-[0.2em] text-paper transition-colors duration-300 hover:bg-brand-red hover:border-brand-red"
          >
            {s.ctaBtn}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>
        </motion.div>
      </main>
    </div>
  );
}
