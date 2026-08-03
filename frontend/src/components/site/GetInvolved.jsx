import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { api, formatApiErrorDetail } from "@/lib/api";
import { STR, useLang } from "@/lib/i18n";

const inputClass =
  "w-full border-2 border-current bg-transparent px-4 py-3 text-sm outline-none transition-colors duration-200 placeholder:opacity-50 focus:bg-black/5";

const Field = ({ label, children }) => (
  <label className="block">
    <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.25em]">{label}</span>
    {children}
  </label>
);

const VolunteerForm = ({ s }) => {
  const empty = { name: "", email: "", phone: "", interest: s.interests[0].v, message: "" };
  const [form, setForm] = useState(empty);
  const [sending, setSending] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post("/forms/volunteer", form);
      toast.success(s.volToast);
      setForm(empty);
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail));
    } finally {
      setSending(false);
    }
  };

  return (
    <form data-testid="volunteer-form" onSubmit={submit} className="flex flex-col gap-5">
      <Field label={s.fields.name}>
        <input data-testid="volunteer-name-input" required value={form.name} onChange={set("name")} className={inputClass} placeholder={s.ph.name} aria-label="Full name" />
      </Field>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label={s.fields.email}>
          <input data-testid="volunteer-email-input" required type="email" value={form.email} onChange={set("email")} className={inputClass} placeholder={s.ph.email} aria-label="Email" />
        </Field>
        <Field label={s.fields.phone}>
          <input data-testid="volunteer-phone-input" required value={form.phone} onChange={set("phone")} className={inputClass} placeholder={s.ph.phone} aria-label="Phone" />
        </Field>
      </div>
      <Field label={s.fields.interest}>
        <select data-testid="volunteer-interest-select" value={form.interest} onChange={set("interest")} className={inputClass} aria-label="Area of interest">
          {s.interests.map((o) => (
            <option key={o.v} value={o.v} className="text-ink">
              {o.l}
            </option>
          ))}
        </select>
      </Field>
      <Field label={s.fields.msg}>
        <textarea data-testid="volunteer-message-input" rows={3} value={form.message} onChange={set("message")} className={inputClass} placeholder={s.ph.volMsg} aria-label="Message" />
      </Field>
      <button
        data-testid="volunteer-submit-button"
        disabled={sending}
        className="mt-2 border-2 border-paper bg-paper px-7 py-4 text-sm font-bold uppercase tracking-[0.2em] text-brand-red transition-colors duration-300 hover:bg-transparent hover:text-paper disabled:opacity-60"
      >
        {sending ? s.volSending : s.volBtn}
      </button>
    </form>
  );
};

const ContactForm = ({ s }) => {
  const empty = { name: "", email: "", phone: "", message: "" };
  const [form, setForm] = useState(empty);
  const [sending, setSending] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post("/forms/contact", form);
      toast.success(s.contactToast);
      setForm(empty);
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail));
    } finally {
      setSending(false);
    }
  };

  return (
    <form id="contact" data-testid="contact-form" onSubmit={submit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label={s.fields.contactName}>
          <input data-testid="contact-name-input" required value={form.name} onChange={set("name")} className={inputClass} placeholder={s.ph.name} aria-label="Name" />
        </Field>
        <Field label={s.fields.email}>
          <input data-testid="contact-email-input" required type="email" value={form.email} onChange={set("email")} className={inputClass} placeholder={s.ph.email} aria-label="Email" />
        </Field>
      </div>
      <Field label={s.fields.contactPhone}>
        <input data-testid="contact-phone-input" value={form.phone} onChange={set("phone")} className={inputClass} placeholder={s.ph.phone} aria-label="Phone" />
      </Field>
      <Field label={s.fields.contactMsg}>
        <textarea data-testid="contact-message-input" required rows={5} value={form.message} onChange={set("message")} className={inputClass} placeholder={s.ph.contactMsg} aria-label="Message" />
      </Field>
      <button
        data-testid="contact-submit-button"
        disabled={sending}
        className="mt-2 border-2 border-ink bg-ink px-7 py-4 text-sm font-bold uppercase tracking-[0.2em] text-paper transition-colors duration-300 hover:bg-brand-red hover:border-brand-red disabled:opacity-60"
      >
        {sending ? s.contactSending : s.contactBtn}
      </button>
    </form>
  );
};

export const GetInvolved = () => {
  const { lang } = useLang();
  const s = STR[lang].involved;

  return (
    <section id="volunteer" data-testid="get-involved-section" className="border-b-2 border-ink">
      <div className="px-6 pt-24 md:px-12 md:pt-32">
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
          {s.h2a}<span className="text-brand-red">.</span>
          <br />
          {s.h2b}<span className="text-brand-red">.</span>
        </motion.h2>
      </div>
      <div className="mt-14 grid grid-cols-1 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="border-t-2 border-ink bg-brand-red p-6 text-paper md:p-12 lg:border-r-2"
        >
          <h3 className="font-display text-2xl font-semibold uppercase tracking-tight md:text-4xl">{s.volTitle}</h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed opacity-80 md:text-base">
            {s.volPara}
          </p>
          <div className="mt-8">
            <VolunteerForm s={s} />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="border-t-2 border-ink p-6 md:p-12"
        >
          <h3 className="font-display text-2xl font-semibold uppercase tracking-tight md:text-4xl">{s.contactTitle}</h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed opacity-70 md:text-base">
            {s.contactPara}
          </p>
          <div className="mt-8">
            <ContactForm s={s} />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
