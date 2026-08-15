import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = { title: "Yazılar" };

/**
 * Ana bölge: r1 Last Writing, r2–3 üç yazı kartı + sayfalama.
 * Sayfalama `mt-auto` ile tabana itilir. İçerik Faz 5'te gelir.
 */
export default function BlogPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-(--gap-row)">
      <Card title="Last Writing." size="lg" as="h1" className="flex-[1.1]" />
      <Card size="md" className="flex-1" />
      <Card size="md" className="flex-1" />
      <Card size="md" className="flex-1" />
    </div>
  );
}
