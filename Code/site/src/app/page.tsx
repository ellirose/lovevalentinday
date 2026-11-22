import { Calendar } from "@/components/Calendar";
import { CursorHearts } from "@/components/CursorHearts";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { About, Faq, HowItWorks, Inside, Offer } from "@/components/Sections";

export default function Home() {
  return (
    <>
      <a href="#calendario" className="sr-only z-[60] rounded-full bg-rose px-5 py-3 font-bold text-on-rose focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Saltar al calendario
      </a>
      <Header />
      <main>
        <Hero />
        <Calendar />
        <HowItWorks />
        <Inside />
        <About />
        <Offer />
        <Faq />
      </main>
      <Footer />
      <CursorHearts />
    </>
  );
}
