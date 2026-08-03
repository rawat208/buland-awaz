import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { api, formatApiErrorDetail } from "@/lib/api";

const HELP_OPTIONS = [
  "Campaigns & Marches",
  "Teaching & Tuition Support",
  "Door-to-Door Surveys",
  "Social Media & Content",
  "Event Days",
  "Jo bhi zaroorat ho",
];

const PERKS = [
  { num: "A", text: "Ground campaigns — marches, street plays, awareness drives across Gurugram and beyond." },
  { num: "B", text: "Field work — door-to-door surveys, school enrollment support, family counselling." },
  { num: "C", text: "Community circles — stand with women and children who need a voice beside them." },
];

const inputClass =
  "w-full border-2 border-paper/40 bg-transparent px-4 py-3 text-sm text-paper outline-none transition-colors duration-200 placeholder:text-paper/40 focus:border-brand-yellow";

const Field = ({ label, children }) => (
  <label className="block">
    <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.25em] text-paper/70">{label}</span>
    {children}
  </label>
);

export const JoinSection = () => {
  const empty = { name: "", phone: "", email: "", city: "", help_with: HELP_OPTIONS[0], reason: "" };
  const [form, setForm] = useState(empty);
  const [sending, setSending] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post("/forms/join", form);
      toast.success("Shukriya! Ab aap Buland Awaaz parivaar ka hissa hain. Team jald sampark karegi.");
      setForm(empty);
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail));
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="join" data-testid="join-section" className="border-b-2 border-ink px-6 py-24 md:px-12 md:py-32">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-bold uppercase tracking-[0.3em] text-brand-red"
          >
            Membership · Sadasyata
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 font-display text-4xl font-semibold uppercase leading-[0.95] tracking-tighter md:text-7xl"
          >
            Join Buland
            <br />
            Awaaz<span className="text-brand-red">.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-6 max-w-md text-base leading-relaxed opacity-80 md:text-lg"
          >
            Apni awaaz, apna manch. Member baniye aur har uss ladai ka hissa baniye jo
            bachchon aur mahilaon ke haq ke liye ladi jaati hai.
          </motion.p>
          <div className="mt-10 space-y-0 border-t-2 border-ink">
            {PERKS.map((perk, i) => (
              <motion.div
                key={perk.num}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="flex items-start gap-5 border-b-2 border-ink py-5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-ink bg-brand-yellow font-display text-sm font-semibold">
                  {perk.num}
                </span>
                <p className="text-sm leading-relaxed opacity-80 md:text-base">{perk.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="border-2 border-ink bg-ink p-6 text-paper md:p-10"
        >
          <p className="font-display text-2xl font-semibold uppercase tracking-tight md:text-3xl">Membership form</p>
          <p className="mt-2 text-xs uppercase tracking-[0.25em] text-paper/50">2 minute · koi fees nahi</p>
          <form data-testid="join-form" onSubmit={submit} className="mt-8 flex flex-col gap-5">
            <Field label="Naam / Full name">
              <input data-testid="join-name-input" required value={form.name} onChange={set("name")} className={inputClass} placeholder="Aapka naam" aria-label="Full name" />
            </Field>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Phone">
                <input data-testid="join-phone-input" required value={form.phone} onChange={set("phone")} className={inputClass} placeholder="+91 …" aria-label="Phone" />
              </Field>
              <Field label="Sheher / City">
                <input data-testid="join-city-input" required value={form.city} onChange={set("city")} className={inputClass} placeholder="Gurugram…" aria-label="City" />
              </Field>
            </div>
            <Field label="Email">
              <input data-testid="join-email-input" required type="email" value={form.email} onChange={set("email")} className={inputClass} placeholder="you@example.com" aria-label="Email" />
            </Field>
            <Field label="Kaise help karna chahenge?">
              <select data-testid="join-help-select" value={form.help_with} onChange={set("help_with")} className={inputClass} aria-label="How do you want to help">
                {HELP_OPTIONS.map((o) => (
                  <option key={o} value={o} className="text-ink">
                    {o}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Kyu join karna chahte hain? (optional)">
              <textarea data-testid="join-reason-input" rows={3} value={form.reason} onChange={set("reason")} className={inputClass} placeholder="Apni baat kuch shabdon me…" aria-label="Why do you want to join" />
            </Field>
            <button
              data-testid="join-submit-button"
              disabled={sending}
              className="mt-2 border-2 border-brand-red bg-brand-red px-7 py-4 text-sm font-bold uppercase tracking-[0.2em] text-paper transition-colors duration-300 hover:bg-transparent hover:text-brand-red disabled:opacity-60"
            >
              {sending ? "Join ho raha hai…" : "Member baniye"}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};
