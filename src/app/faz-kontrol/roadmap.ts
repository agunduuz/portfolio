import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * GEÇİCİ — Faz Kontrol paneli. Proje bitince `src/app/faz-kontrol/` silinir.
 *
 * `docs/ROADMAP.md` tek doğruluk kaynağıdır; ayrı bir durum dosyası tutulmaz.
 * Panel dosyayı parse eder, checkbox tıklaması dosyayı yerinde günceller.
 */

const ROADMAP_PATH = path.join(process.cwd(), "docs", "ROADMAP.md");

/** Bu başlıktan sonrası yol haritası değil, fikir listesi. */
const STOP_HEADING = "## v2 fikirleri";

const HEADING_RE = /^## Faz (-?\d+)\s+—\s+(.+?)\s*$/;
const META_RE = /^(.*?)\s*\(([^)]*)\)\s*$/;
const ITEM_RE = /^- \[([ xX])\]\s?(.*)$/;
const FINISH_RE = /^\*\*Bitiş:\*\*\s*(.*)$/;

export type RoadmapItem = {
  phase: number;
  /** Faz içindeki sırası — sadece görüntüleme için. */
  index: number;
  /** 0-tabanlı satır numarası. Yazma sırasında çapa olarak kullanılır. */
  line: number;
  done: boolean;
  /** Devam satırları tek boşlukla birleştirilmiş madde metni. */
  text: string;
};

export type RoadmapPhase = {
  number: number;
  title: string;
  /** Başlıktaki parantez içi, ör. "1 oturum". */
  meta: string | null;
  /** Başlığın altındaki serbest paragraf. */
  note: string | null;
  /** `**Bitiş:**` satırı — fazın çıkış kriteri. */
  finish: string | null;
  items: RoadmapItem[];
};

export type Roadmap = {
  phases: RoadmapPhase[];
  total: number;
  done: number;
};

export function parseRoadmap(source: string): Roadmap {
  const lines = source.split("\n");
  const phases: RoadmapPhase[] = [];

  let current: RoadmapPhase | null = null;
  let lastItem: RoadmapItem | null = null;
  let collecting: "note" | "finish" | null = null;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i] ?? "";
    const trimmed = raw.trim();

    if (trimmed === STOP_HEADING) break;

    const heading = HEADING_RE.exec(raw);
    if (heading) {
      const number = Number(heading[1]);
      const rest = heading[2] ?? "";
      const withMeta = META_RE.exec(rest);

      current = {
        number,
        title: (withMeta ? withMeta[1] : rest) ?? rest,
        meta: withMeta ? (withMeta[2] ?? null) : null,
        note: null,
        finish: null,
        items: [],
      };
      phases.push(current);
      lastItem = null;
      collecting = null;
      continue;
    }

    if (!current) continue;

    const item = ITEM_RE.exec(raw);
    if (item) {
      lastItem = {
        phase: current.number,
        index: current.items.length,
        line: i,
        done: (item[1] ?? " ").toLowerCase() === "x",
        text: (item[2] ?? "").trim(),
      };
      current.items.push(lastItem);
      collecting = null;
      continue;
    }

    // Girintili devam satırı, açık bir maddenin parçasıdır.
    if (lastItem && /^\s{2,}\S/.test(raw)) {
      lastItem.text = `${lastItem.text} ${trimmed}`;
      continue;
    }

    const finish = FINISH_RE.exec(raw);
    if (finish) {
      current.finish = (finish[1] ?? "").trim();
      collecting = "finish";
      lastItem = null;
      continue;
    }

    if (trimmed === "") {
      collecting = null;
      lastItem = null;
      continue;
    }

    if (trimmed === "---" || trimmed.startsWith("#")) {
      collecting = null;
      lastItem = null;
      continue;
    }

    // Çok satırlı `**Bitiş:**` metninin devamı.
    if (collecting === "finish" && current.finish !== null) {
      current.finish = `${current.finish} ${trimmed}`;
      continue;
    }

    // Başlığın hemen altındaki serbest paragraf — fazın notu.
    if (current.items.length === 0) {
      current.note = current.note ? `${current.note} ${trimmed}` : trimmed;
      collecting = "note";
    }
  }

  const all = phases.flatMap((p) => p.items);

  return {
    phases,
    total: all.length,
    done: all.filter((i) => i.done).length,
  };
}

export async function readRoadmap(): Promise<Roadmap> {
  return parseRoadmap(await readFile(ROADMAP_PATH, "utf8"));
}

export type ToggleResult =
  { ok: true; done: boolean } | { ok: false; error: string };

/**
 * Tek bir maddenin işaretini çevirir.
 *
 * `line` çapa, `expectedText` doğrulamadır: dosya panel açıkken elle
 * düzenlendiyse satır kaymış olabilir; o durumda yazmadan hata döneriz.
 */
export async function toggleItem(
  line: number,
  expectedText: string,
): Promise<ToggleResult> {
  const source = await readFile(ROADMAP_PATH, "utf8");
  const lines = source.split("\n");
  const raw = lines[line];

  if (raw === undefined) {
    return { ok: false, error: "Satır bulunamadı — ROADMAP.md değişmiş." };
  }

  const item = ITEM_RE.exec(raw);
  if (!item) {
    return { ok: false, error: "Bu satır bir görev maddesi değil." };
  }

  // Devam satırları metne dahil olduğu için baştan eşleşme yeterli.
  const text = (item[2] ?? "").trim();
  if (!expectedText.startsWith(text)) {
    return {
      ok: false,
      error: "Madde metni eşleşmedi — ROADMAP.md dışarıdan değişmiş.",
    };
  }

  const done = (item[1] ?? " ").toLowerCase() !== "x";
  lines[line] = raw.replace(ITEM_RE, `- [${done ? "x" : " "}] $2`);

  await writeFile(ROADMAP_PATH, lines.join("\n"), "utf8");
  return { ok: true, done };
}
