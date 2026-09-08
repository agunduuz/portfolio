/**
 * `/hakkimda` ana bölgesinin içeriği (CONTENT-MODEL §7).
 *
 * Dil: arayüzün geri kalanı gibi İNGİLİZCE. Blog Türkçe, arayüz İngilizce
 * (CLAUDE.md → yazı tonu). Ay kısaltmaları da bu yüzden İngilizce.
 */

export type Job = {
  company: string;
  role: string;
  location: string;
  /** "YYYY-MM" biçimi. */
  from: string;
  /** `null` → "Present". */
  to: string | null;
  /** Tek satırlık bağlam — şirketin ne yaptığı ya da işin ölçeği. */
  outcome: string;
  /**
   * Madde madde çıktılar. Tip önce yalnızca tek satırlık `outcome` taşıyordu;
   * gerçek içerik geldiğinde her rolün birden fazla somut çıktısı olduğu
   * görüldü ve bunları tek cümleye sıkıştırmak bilgiyi öldürüyordu.
   */
  highlights?: string[];
};

export const ABOUT = {
  /** Her eleman bir paragraf. */
  summary: [
    "Front-End Developer with 3+ years of experience. I own the entire frontend of one of Türkiye's leading auto parts e-commerce platforms (1M+ products, 250K+ orders), where I migrated the search, filtering and cart flows to an asynchronous (AJAX) architecture.",
    "Outside work, I design, build and ship end-to-end products with Next.js, React, TypeScript, Tailwind CSS and Supabase — including a SaaS I founded, a multilingual clinic app with a full CMS, and corporate websites.",
    "Looking to combine my high-traffic e-commerce background with a modern React stack.",
  ] as string[],

  jobHistory: [
    {
      company: "Otoparçasan.com",
      role: "Front-End Developer (Senior Specialist)",
      location: "Samsun, Türkiye",
      from: "2023-09",
      to: null,
      outcome:
        "One of Türkiye's leading auto parts e-commerce platforms: 1M+ SKUs, 250K+ orders, 140K+ customers, web + iOS/Android apps.",
      highlights: [
        "Sole responsibility for all frontend development across the platform: product listing, search, filtering, cart and account flows — the entire user journey.",
        "Rebuilt the product filtering system with a no-page-reload (AJAX) architecture, rewriting the search and filtering experience.",
        "Redesigned the chassis-number part lookup flow end to end; built asynchronous versions of the vehicle selection screens and the cart flow.",
        "Designed and built engagement-focused features such as personalized notification settings, a dynamic price-alert button and a campaign banner system.",
        "Designed, built and shipped the “Partner Services” module from scratch, entirely on my own.",
      ],
    },
    {
      company: "StrategyCube",
      role: "Content Creator",
      location: "Ankara, Türkiye",
      from: "2022-12",
      to: "2023-06",
      outcome:
        "Produced and edited on-site video content for aesthetic clinics.",
      highlights: [
        "This industry experience later became the foundation of the health/beauty web products I built (Aura Clinic, RefTakip).",
      ],
    },
    {
      company: "Litum",
      role: "Software Developer",
      location: "İzmir, Türkiye",
      from: "2022-09",
      to: "2022-12",
      outcome: "IoT / RTLS technology company.",
      highlights: [
        "Built enterprise web interfaces with Angular, TypeScript and DevExpress; worked on reusable component architecture.",
      ],
    },
  ] as Job[],
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** "2023-09" → "Sep 2023". Biçim tek yerde, iki yerde ayrışmasın. */
export function formatMonth(value: string): string {
  const [year, month] = value.split("-");
  const index = Number(month) - 1;
  return MONTHS[index] ? `${MONTHS[index]} ${year}` : value;
}

/** "Sep 2023 — Present" */
export function formatRange(from: string, to: string | null): string {
  return `${formatMonth(from)} — ${to ? formatMonth(to) : "Present"}`;
}
