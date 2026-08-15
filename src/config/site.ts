import { publicEnv } from "@/lib/env";

/**
 * `email` bilinçli olarak burada sabit: sayfada `mailto:` olarak görünür, yani
 * zaten public. Sunucu tarafındaki `CONTACT_EMAIL` (Resend'in teklifi göndereceği
 * adres) `lib/env.server.ts` içinde ayrı durur.
 */
const CONTACT = "anil.gundduz@gmail.com";

export const SITE = {
  name: "Anıl Gündüz",
  role: "Front End Developer",
  url: publicEnv.NEXT_PUBLIC_SITE_URL,
  location: "Samsun, Türkiye",
  email: CONTACT,
  resume: "/anil-gunduz-cv.pdf",
  careerStart: publicEnv.NEXT_PUBLIC_CAREER_START,
  socials: [
    { name: "GitHub", url: "https://github.com/agunduuz", icon: "github" },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/anilgunduuz",
      icon: "linkedin",
    },
    { name: "X", url: "https://x.com/frontendanil", icon: "x" },
    { name: "Medium", url: "https://medium.com/@anilgunduz", icon: "medium" },
    {
      name: "Instagram",
      url: "https://instagram.com/frontendanil",
      icon: "instagram",
    },
    {
      name: "Upwork",
      url: "https://upwork.com/freelancers/anilgunduz",
      icon: "upwork",
    },
    { name: "Mail", url: `mailto:${CONTACT}`, icon: "mail" },
  ],
} as const;

export const DECK = ["/", "/hakkimda", "/projeler", "/blog"] as const;

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/hakkimda", label: "About" },
  { href: "/projeler", label: "Projects" },
  { href: "/blog", label: "Writings" },
] as const;

/**
 * Arayüz metinleri tek yerde (CONTENT-MODEL §5).
 * Arayüz İngilizce, blog içerikleri Türkçe. Lorem ipsum yasak.
 */
export const COPY = {
  hero: {
    title: "Developer. Improver.",
    bio: "I enjoy creating websites using new technologies. I see each task as a challenge for myself. Through these tasks, I can learn new things and reinforce what I already know.",
  },
  projects: { title: "Projects.", more: "More" },
  writings: { title: "Writings.", more: "More" },
  aboutMe: {
    title: "About Me.",
    statusPrefix: "I'm working right now about",
    currentFocus: "Portfolio Web Page",
    counterLabel: "The Time Spent",
    more: "More",
  },
  jobOffers: {
    title: "Job Offers.",
    lead: "Do you want to work with me?",
    fields: {
      location: "What is your job location?",
      type: "What is your job type?",
      technology: "What is your base technology?",
      amount: "What is your offer amount?",
    },
    submit: "Send the Offer.",
    pending: "Sending…",
    success: "Offer sent.",
  },
  subscribe: {
    title: "Subscribe.",
    homeLead: "Yeni yazılar ve proje güncellemeleri için e-posta bırak.",
    detailLead: "Subscribed for next writing",
    submit: "Enter.",
    success: "Kayıt tamam. İlk yazıda görüşürüz.",
  },
  nav: { resume: "Resume" },
  footer: { rights: "All rights reserved." },
} as const;
