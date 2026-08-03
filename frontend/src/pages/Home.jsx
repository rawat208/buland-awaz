import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Navbar, Footer } from "@/components/site/Chrome";
import { scrollToSection } from "@/lib/api";
import { Hero } from "@/components/site/Hero";
import { ImpactStats } from "@/components/site/ImpactStats";
import { Marquee } from "@/components/site/Marquee";
import { Manifesto } from "@/components/site/Manifesto";
import { Programs } from "@/components/site/Programs";
import { News } from "@/components/site/News";
import { JoinSection } from "@/components/site/JoinSection";
import { GetInvolved } from "@/components/site/GetInvolved";
import { ChatbotWidget } from "@/components/ChatbotWidget";

export default function Home() {
  const location = useLocation();
  useEffect(() => {
    if (location.state?.scrollTo) {
      const timer = setTimeout(() => scrollToSection(location.state.scrollTo), 500);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  return (
    <div className="relative min-h-screen bg-paper text-ink">
      <div className="noise-overlay" aria-hidden="true" />
      <Navbar />
      <main>
        <Hero />
        <ImpactStats />
        <Marquee />
        <Manifesto />
        <Programs />
        <News />
        <JoinSection />
        <GetInvolved />
      </main>
      <Footer />
      <ChatbotWidget />
    </div>
  );
}
