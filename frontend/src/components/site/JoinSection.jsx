import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { api, formatApiErrorDetail } from "@/lib/api";
import { STR, useLang } from "@/lib/i18n";

const inputClass =
  "w-full border-2 border-paper/40 bg-transparent px-4 py-3 text-sm text-paper outline-none transition-colors duration-200 placeholder:text-paper/40 focus:border-brand-yellow";

const Field = ({ label, children }) => (
  <label className="block">
    <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.25em] text-paper/70">{label}</span>
    {children}
  </label>
);

export const JoinSection = () => {
  const { lang } = useLang();
  const s = STR[lang].join;
  const empty = { name: "", phone: "", email: "", city: "", help_with: s.options[0].v, reason: "" };
  const [form, setForm] = useState(empty);
  const [sending, setSending] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post("/forms/join", form);
      toast.success(s.toast);
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
            {s.h2b}<span className="text-brand-red">.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-6 max-w-md text-base leading-relaxed opacity-80 md:text-lg"
          >
            {s.para}
          </motion.p>
          <div className="mt-10 space-y-0 border-t-2 border-ink">
            {s.perks.map((perk, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="flex items-start gap-5 border-b-2 border-ink py-5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-ink bg-brand-yellow font-display text-sm font-semibold">
                  {String.fromCharCode(65 + i)}
                </span>
                <p className="text-sm leading-relaxed opacity-80 md:text-base">{perk}</p>
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
          <p className="font-display text-2xl font-semibold uppercase tracking-tight md:text-3xl">{s.formTitle}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.25em] text-paper/50">{s.formSub}</p>
          <form data-testid="join-form" onSubmit={submit} className="mt-8 flex flex-col gap-5">
            <Field label={s.fields.name}>
              <input data-testid="join-name-input" required value={form.name} onChange={set("name")} className={inputClass} placeholder={s.ph.name} aria-label="Full name" />
            </Field>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label={s.fields.phone}>
                <input data-testid="join-phone-input" required value={form.phone} onChange={set("phone")} className={inputClass} placeholder={s.ph.phone} aria-label="Phone" />
              </Field>
              <Field label={s.fields.city}>
                <input data-testid="join-city-input" required value={form.city} onChange={set("city")} className={inputClass} placeholder={s.ph.city} aria-label="City" />
              </Field>
            </div>
            <Field label={s.fields.email}>
              <input data-testid="join-email-input" required type="email" value={form.email} onChange={set("email")} className={inputClass} placeholder={s.ph.email} aria-label="Email" />
            </Field>
            <Field label={s.fields.help}>
              <select data-testid="join-help-select" value={form.help_with} onChange={set("help_with")} className={inputClass} aria-label="How do you want to help">
                {s.options.map((o) => (
                  <option key={o.v} value={o.v} className="text-ink">
                    {o.l}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={s.fields.reason}>
              <textarea data-testid="join-reason-input" rows={3} value={form.reason} onChange={set("reason")} className={inputClass} placeholder={s.ph.reason} aria-label="Why do you want to join" />
            </Field>
            <button
              data-testid="join-submit-button"
              disabled={sending}
              className="mt-2 border-2 border-brand-red bg-brand-red px-7 py-4 text-sm font-bold uppercase tracking-[0.2em] text-paper transition-colors duration-300 hover:bg-transparent hover:text-brand-red disabled:opacity-60"
            >
              {sending ? s.sending : s.submit}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};
