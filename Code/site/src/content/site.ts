// All copy and settings for the site. Items marked TODO wait on Pedro's answers
// (see docs/requirements/REQUIREMENTS_ANALYSIS.md §11, kept locally).

export const site = {
  lang: "es",
  title: "Calendario de San Valentín 2027",
  description: "14 días de recetas para endulzar el amor. Un corazón nuevo cada día, del 1 al 14 de febrero.",
  subtitle: "14 días de recetas para endulzar el amor", // C08, exact wording requested by Pedro
  shareText: "Mira este Calendario de San Valentín: 14 días de recetas para endulzar el amor 💗",
  // TODO(Pedro): confirm the community hashtag.
  hashtag: "#DulceSanValentin2027",
  // TODO(Q7): brand name and spelling. Null hides it everywhere.
  channelName: null as string | null,
  // TODO(Pedro): YouTube channel link. Null hides the button.
  youtubeUrl: null as string | null,
  // TODO(Q9): release time zone. Default: Puerto Rico (UTC-4, no daylight saving).
  launch: "2027-02-01T00:00:00-04:00",
  days: 14,
  // TODO(Q2, Q3, B02): checkout and buyer area links, available after the platform decision.
  checkoutUrl: null as string | null,
  buyerAreaUrl: null as string | null,
  // TODO(B03): real price. Null shows "muy pronto".
  price: null as null | { amount: number; regular?: number; currency: string },
};

export const nav = [
  { href: "#calendario", label: "Calendario" },
  { href: "#ruta", label: "Ruta" },
  { href: "#incluye", label: "Incluye" },
  { href: "#regala", label: "Regala" },
  { href: "#comunidad", label: "Comunidad" },
  { href: "#precio", label: "Precio" },
  { href: "#preguntas", label: "Preguntas" },
];

// Intro under the landing (the demo's second screen with the 3D book).
export const intro = {
  eyebrow: "Edición San Valentín 2027",
  title: "14 días de amor,",
  accent: "sabor y repostería",
  lead: "Del 1 al 14 de febrero se abre un corazón nuevo cada día con una clase en video, su receta descargable y trucos para que tus postres enamoren.",
};

// Day titles from the approved demo, shown as samples. TODO(Pedro): replace with the real list.
// Day 12 differs from the demo, which repeated Red Velvet (D18).
export const dayTitles = [
  "Cupcakes de terciopelo rojo",
  "Fresas con chocolate",
  "Pastel esponjoso de vainilla",
  "Crema de limón",
  "Cheesecake de guayaba",
  "Relleno de pistacho",
  "Pastel en forma de corazón",
  "Decoración con manga",
  "Rosas de buttercream",
  "Ganache de chocolate",
  "Tembleque romántico",
  "Trufas de chocolate y frambuesa",
  "Galletas con glaseado",
  "Gran final: pastel de amor",
];

// "¿Qué encontrarás dentro?" from the demo. Icons are in assets/icons. TODO(Pedro): confirm the topics.
export const categories = [
  { icon: "strawberry", title: "Postres románticos", text: "Cheesecake de guayaba, fresas con chocolate, cupcakes de terciopelo rojo y más." },
  { icon: "heart-cake", title: "Pasteles de corazón", list: ["Moldeado y relleno", "Cubierta de crema suave", "Decoración con manga"] },
  { icon: "ganache-drip", title: "Rellenos y coberturas", text: "Crema de limón, ganache, dulce de leche y combinaciones que transforman cualquier pastel." },
  { icon: "piping-bag", title: "Decoración creativa", text: "Rosas de buttercream, lazos, detalles dorados y empaque para regalo." },
] as const;

// "Mucho más que videos": only what the calendar really includes (the demo's business extras were the
// reference seller's and are not part of this product).
export const extras = [
  { icon: "recipe", text: "Recetas en PDF para descargar e imprimir" },
  { icon: "video", text: "Clases en video para guardar" },
  { icon: "device", text: "En tu teléfono, tableta o computadora" },
] as const;

// TODO(Pedro): real reviews from buyers, with their permission. While empty, the section invites the first ones.
export const testimonials: { quote: string; name: string; place: string }[] = [];

export const closing = {
  title: "¡Nos vemos en febrero!",
  line: "Un regalo dulce para ti y para quien más quieres.",
};

export const months = ["enero", "febrero", "marzo"];

export function dayDate(n: number) {
  return new Date(new Date(site.launch).getTime() + (n - 1) * 86_400_000);
}

export const highlights = [
  { icon: "ticket", title: "Reserva", text: "Compras una vez y recibes tu acceso personal." },
  { icon: "heart", title: "Abre", text: "Del 1 al 14 de febrero se abre un corazón nuevo cada día." },
  { icon: "whisk", title: "Hornea", text: "Mira la clase, descarga el video y la receta en PDF." },
  { icon: "share", title: "Comparte", text: "Regala el calendario y enseña tus postres con el hashtag." },
] as const;

export const posts = [
  {
    id: "video",
    media: "video",
    date: "1 feb",
    caption: "Cada corazón trae una clase en video, paso a paso, para verla cuando quieras y descargarla.",
    tags: ["#ClaseEnVideo", "#Repostería"],
  },
  {
    id: "recipe",
    media: "recipe",
    date: "1 feb",
    caption: "Y su receta en PDF: ingredientes y pasos listos para imprimir o guardar en tu teléfono.",
    tags: ["#RecetaDelDía", "#SanValentín"],
  },
  {
    id: "sprinkles",
    media: "sprinkles",
    date: "14 feb",
    caption: "14 días, 14 clases, 14 recetas. Un corazón nuevo cada mañana de febrero.",
    tags: ["#14Días", "#DulceAmor"],
  },
] as const;

export const included = [
  "14 clases en video, paso a paso",
  "14 recetas en PDF para descargar",
  "Un corazón nuevo cada día, del 1 al 14 de febrero",
  "Acceso desde cualquier dispositivo",
];

// TODO(Q10, Q11): confirm each answer with Pedro before launch.
export const faqs = [
  { q: "¿Cuándo se abre cada corazón?", a: "Uno por día, del 1 al 14 de febrero de 2027. Cada corazón se abre en su fecha y se queda abierto para ti." },
  { q: "¿Puedo descargar los videos y las recetas?", a: "¡Sí! Cada día incluye la clase en video y la receta en PDF para que las guardes." },
  { q: "¿Qué pasa si compro después del 1 de febrero?", a: "Encontrarás abiertos todos los corazones de los días que ya pasaron, listos para ver." },
  { q: "¿Puedo regalarlo?", a: "Claro. Crea una tarjeta de amor en la sección «Regala» y compártela con quien quieras." },
  { q: "¿En qué dispositivos funciona?", a: "En teléfono, tableta o computadora, desde cualquier navegador actualizado." },
];

// TODO: replace with Pedro's own words and photo.
export const profile = {
  name: "Pedro",
  line: "Repostería con corazón · Puerto Rico → Nueva York",
  // Shown as chips beside the story; plain descriptions of the product, not claims about results.
  values: ["Sabor de Puerto Rico", "Paso a paso", "Para hornear todo el año"],
  bio: "Pedro es puertorriqueño, vive en Nueva York y comparte su repostería en YouTube. Este calendario reúne 14 de sus recetas para San Valentín, explicadas paso a paso para que las prepares en casa.",
};

export const gift = {
  messages: [
    "Te regalo 14 días de dulzura",
    "Para endulzar nuestro amor",
    "Horneemos juntos este San Valentín",
    "Porque eres mi receta favorita",
  ],
};

// Sample content shown in the day-1 preview story before launch.
export const preview = {
  note: "Vista previa con contenido de muestra",
  recipe: {
    title: "Receta de muestra",
    ingredients: ["2 tazas de harina", "1 taza de azúcar", "3 huevos", "1 taza de mantequilla", "1 cdta. de vainilla"],
  },
};
