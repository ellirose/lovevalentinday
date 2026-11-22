import { CursorHearts } from "@/components/CursorHearts";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Community, Faq, Feed, Gift, Offer } from "@/components/Sections";
import { ToastProvider } from "@/components/Social";
import { Stories } from "@/components/Stories";

export default function Home() {
  return (
    <ToastProvider>
      <a href="#calendario" className="sr-only z-[60] rounded-full bg-rose px-5 py-3 font-bold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Saltar al calendario
      </a>
      <Header />
      <main>
        <Hero />
        <Stories />
        <Feed />
        <Gift />
        <Community />
        <Offer />
        <Faq />
      </main>
      <Footer />
      <CursorHearts />
    </ToastProvider>
  );
}
