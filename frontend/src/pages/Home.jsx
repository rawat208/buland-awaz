import { Navbar, Footer } from "@/components/site/Chrome";
import { Hero } from "@/components/site/Hero";
import { Marquee } from "@/components/site/Marquee";
import { Manifesto } from "@/components/site/Manifesto";
import { Programs } from "@/components/site/Programs";
import { News } from "@/components/site/News";
import { GetInvolved } from "@/components/site/GetInvolved";
import { ChatbotWidget } from "@/components/ChatbotWidget";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-paper text-ink">
      <div className="noise-overlay" aria-hidden="true" />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Manifesto />
        <Programs />
        <News />
        <GetInvolved />
      </main>
      <Footer />
      <ChatbotWidget />
    </div>
  );
}
