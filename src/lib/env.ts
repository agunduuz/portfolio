import { z } from "zod";

/**
 * Public ortam değişkenleri — istemci paketine de girer.
 * Modül seviyesinde parse edilir: eksikse build patlar (ARCHITECTURE §8).
 * Sunucu sırları için `lib/env.server.ts` kullan.
 */
const publicSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url(),
  NEXT_PUBLIC_CAREER_START: z.iso.datetime(),
});

export const publicEnv = publicSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_CAREER_START: process.env.NEXT_PUBLIC_CAREER_START,
});
