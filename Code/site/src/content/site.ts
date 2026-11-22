// All copy and settings for the site. Items marked TODO wait on Pedro's answers
// (see docs/requirements/REQUIREMENTS_ANALYSIS.md §11).

export const site = {
  lang: "es",
  title: "Calendario de San Valentín 2027",
  description: "14 días de recetas para endulzar el amor. Un corazón nuevo cada día, del 1 al 14 de febrero.",
  subtitle: "14 días de recetas para endulzar el amor", // C08, exact wording requested by Pedro
  // TODO(Q7): brand name and spelling on the cover. Null hides it everywhere.
  channelName: null as string | null,
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
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#incluye", label: "Qué incluye" },
  { href: "#precio", label: "Precio" },
  { href: "#preguntas", label: "Preguntas" },
];

export const months = ["enero", "febrero", "marzo"];

export function dayDate(n: number) {
  return new Date(new Date(site.launch).getTime() + (n - 1) * 86_400_000);
}

export const steps = [
  {
    icon: "ticket",
    title: "Reserva tu calendario",
    text: "Haz tu compra una sola vez y recibe tu acceso personal.",
  },
  {
    icon: "heart",
    title: "Abre un corazón al día",
    text: "Del 1 al 14 de febrero se abre uno nuevo. Los anteriores siguen abiertos para ti.",
  },
  {
    icon: "whisk",
    title: "Cocina y descarga",
    text: "Mira la clase, descarga el video y guarda la receta en PDF.",
  },
] as const;

export const features = [
  { icon: "device", text: "En tu teléfono, tableta o computadora" },
  { icon: "download", text: "Videos y recetas para descargar" },
  { icon: "chat", text: "Todo en español" },
] as const;

export const included = [
  "14 clases en video, paso a paso",
  "14 recetas en PDF para descargar",
  "Un corazón nuevo cada día, del 1 al 14 de febrero",
  "Acceso desde cualquier dispositivo",
];

// TODO(Q10, Q11): confirm each answer with Pedro before launch.
export const faqs = [
  {
    q: "¿Cuándo se abre cada corazón?",
    a: "Uno por día, del 1 al 14 de febrero de 2027. Cada corazón se abre en su fecha y se queda abierto.",
  },
  {
    q: "¿Puedo descargar los videos y las recetas?",
    a: "Sí. Cada día incluye la clase en video y la receta en PDF para que las guardes.",
  },
  {
    q: "¿Qué pasa si compro después del 1 de febrero?",
    a: "Encontrarás abiertos todos los corazones de los días que ya pasaron, listos para ver.",
  },
  {
    q: "¿En qué dispositivos funciona?",
    a: "En teléfono, tableta o computadora, desde cualquier navegador actualizado.",
  },
];

// TODO: replace with Pedro's own words and photo.
export const about = {
  title: "Hecho con el corazón de Puerto Rico",
  text: "Pedro es puertorriqueño, vive en Nueva York y comparte su repostería en YouTube. Este calendario reúne 14 de sus recetas para San Valentín, explicadas paso a paso para que las prepares en casa.",
};

// Sample content shown in the day-1 preview before launch.
export const preview = {
  title: "Vista previa del Día 1",
  note: "Contenido de muestra. Las clases y recetas de Pedro se cargan antes del lanzamiento.",
  recipe: {
    title: "Receta de muestra",
    ingredients: ["2 tazas de harina", "1 taza de azúcar", "3 huevos", "1 taza de mantequilla", "1 cdta. de vainilla"],
  },
};
