import type { Metadata, Viewport } from "next";
import { Great_Vibes, Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import { SoundProvider } from "@/components/SoundProvider";
import { site } from "@/content/site";
import "./globals.css";

const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], weight: ["500", "700", "800"], style: ["normal", "italic"] });
const vibes = Great_Vibes({ variable: "--font-vibes", subsets: ["latin"], weight: "400" });
const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  openGraph: { title: site.title, description: site.description, locale: "es_US", type: "website" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#fff6f7",
};

// Light is the approved default (Pedro: "el color como está me gusta"); dark is a visitor choice.
const themeInit = `try{if(localStorage.getItem('theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" suppressHydrationWarning className={`${playfair.variable} ${vibes.variable} ${jakarta.variable} antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <link rel="preload" as="image" type="image/avif" href="/img/cover-landscape-1600.avif" media="(min-aspect-ratio: 13/10)" />
        <link rel="preload" as="image" type="image/avif" href="/img/cover-portrait-1080.avif" media="(max-aspect-ratio: 4/5)" />
      </head>
      <body>
        <SoundProvider>{children}</SoundProvider>
      </body>
    </html>
  );
}
