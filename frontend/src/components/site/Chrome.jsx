import { Link } from "react-router-dom";
import { scrollToSection } from "@/lib/api";
import { STR, useLang } from "@/lib/i18n";

const NAV_IDS = ["manifesto", "programs", "news", "join"];

const LangToggle = ({ className = "" }) => {
  const { lang, toggle } = useLang();
  return (
    <button
      data-testid="lang-toggle"
      onClick={toggle}
      aria-label="Switch language"
      className={`border-2 border-ink px-3 py-2 text-xs font-bold uppercase tracking-[0.15em] transition-colors duration-300 hover:bg-brand-yellow ${className}`}
    >
      {lang === "en" ? "हिंदी" : "EN"}
    </button>
  );
};

export const Navbar = () => {
  const { lang } = useLang();
  const s = STR[lang].nav;
  return (
    <header
      data-testid="site-navbar"
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b-2 border-ink bg-paper/90 px-6 py-4 backdrop-blur-md md:px-12"
    >
      <button
        data-testid="nav-brand"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="flex items-center gap-2 font-display text-lg font-semibold uppercase tracking-tight"
      >
        <img src="/logo.svg" alt="Buland Awaaz logo" className="h-8 w-8 border-2 border-ink" />
        Buland <span className="text-brand-red">Awaaz</span>
        <span data-testid="demo-badge" className="border-2 border-ink bg-brand-yellow px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-ink">
          Demo
        </span>
      </button>
      <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
        {NAV_IDS.map((id) => (
          <button
            key={id}
            data-testid={`nav-link-${id}`}
            onClick={() => scrollToSection(id)}
            className="text-xs font-bold uppercase tracking-[0.25em] transition-colors duration-200 hover:text-brand-red"
          >
            {s[id]}
          </button>
        ))}
        <Link
          data-testid="nav-link-wall"
          to="/supporters"
          className="text-xs font-bold uppercase tracking-[0.25em] transition-colors duration-200 hover:text-brand-red"
        >
          {s.wall}
        </Link>
        <LangToggle />
        <button
          data-testid="nav-volunteer-cta"
          onClick={() => scrollToSection("volunteer")}
          className="border-2 border-ink bg-ink px-5 py-2.5 text-xs font-bold uppercase tracking-[0.25em] text-paper transition-colors duration-300 hover:bg-brand-red hover:border-brand-red"
        >
          {s.volunteer}
        </button>
      </nav>
      <div className="flex items-center gap-2 md:hidden">
        <LangToggle />
        <button
          data-testid="nav-volunteer-cta-mobile"
          onClick={() => scrollToSection("volunteer")}
          className="border-2 border-ink bg-ink px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-paper"
        >
          {s.volunteer}
        </button>
      </div>
    </header>
  );
};

export const Footer = () => {
  const { lang } = useLang();
  const s = STR[lang];
  return (
    <footer data-testid="site-footer" className="bg-ink px-6 py-16 text-paper md:px-12 md:py-24">
      <div className="flex items-center gap-4">
        <img src="/logo.svg" alt="Buland Awaaz logo" className="h-14 w-14 border-2 border-paper/40 md:h-20 md:w-20" />
        <p className="font-display text-[13vw] font-semibold uppercase leading-[0.85] tracking-tighter text-outline-paper md:text-[8vw]">
          Buland Awaaz
        </p>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-10 border-t-2 border-paper/25 pt-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-yellow">{s.footer.reach}</p>
          <p className="mt-4 text-sm leading-relaxed text-paper/70 md:text-base">
            {s.footer.addr1}
            <br />
            {s.footer.addr2}
          </p>
        </div>
        <div className="md:col-span-4">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-yellow">{s.footer.navTitle}</p>
          <div className="mt-4 flex flex-col gap-2">
            {NAV_IDS.map((id) => (
              <button
                key={id}
                data-testid={`footer-link-${id}`}
                onClick={() => scrollToSection(id)}
                className="w-fit text-left text-sm uppercase tracking-[0.2em] text-paper/70 transition-colors duration-200 hover:text-brand-red"
              >
                {s.nav[id]}
              </button>
            ))}
            <button
              data-testid="footer-link-volunteer"
              onClick={() => scrollToSection("volunteer")}
              className="w-fit text-left text-sm uppercase tracking-[0.2em] text-paper/70 transition-colors duration-200 hover:text-brand-red"
            >
              {s.nav.volunteer}
            </button>
            <Link
              data-testid="footer-link-wall"
              to="/supporters"
              className="w-fit text-left text-sm uppercase tracking-[0.2em] text-paper/70 transition-colors duration-200 hover:text-brand-red"
            >
              {s.nav.wall}
            </Link>
          </div>
        </div>
        <div className="md:col-span-3">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-yellow">{s.footer.joinTitle}</p>
          <button
            data-testid="footer-join-cta"
            onClick={() => scrollToSection("join")}
            className="mt-4 inline-block border-2 border-paper/40 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] transition-colors duration-300 hover:border-brand-red hover:bg-brand-red"
          >
            {s.footer.member}
          </button>
        </div>
      </div>
      <p className="mt-14 text-[10px] uppercase tracking-[0.3em] text-paper/40">
        © {new Date().getFullYear()} {s.footer.copyright}
      </p>
    </footer>
  );
};
