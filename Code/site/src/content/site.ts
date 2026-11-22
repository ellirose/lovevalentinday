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
  { href: "#incluye", label: "Qué incluye" },
  { href: "#regala", label: "Regala" },
  { href: "#comunidad", label: "Comunidad" },
  { href: "#preguntas", label: "Preguntas" },
];

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
