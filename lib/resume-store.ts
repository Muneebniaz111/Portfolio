import { promises as fs } from "fs";
import path from "path";

// ── Persistence paths ─────────────────────────────────────────────────────────
// /tmp is writable on all Next.js hosts (Vercel, Railway, Render, etc.)
// We keep a copy there so uploads survive across warm requests on the same instance.
// Module-level memory cache keeps it fast for subsequent warm requests.
const TMP_DIR   = "/tmp/portfolio_resume";
const PDF_PATH  = path.join(TMP_DIR, "resume.pdf");
const META_PATH = path.join(TMP_DIR, "meta.json");

// ── Default resume (shipped with the app) ─────────────────────────────────────
const PROJECT_ROOT = process.cwd();
const DEFAULT_RESUME_PATH = path.join(PROJECT_ROOT, "public", "resume", "MN Resume-Developer.pdf");
const DEFAULT_RESUME_NAME = "MN Resume-Developer.pdf";

interface ResumeMeta { filename: string; uploadedAt: number; }

// ── In-memory cache (populated lazily from disk) ──────────────────────────────
let memCache: { data: Buffer; filename: string } | null = null;

async function ensureDir() {
  await fs.mkdir(TMP_DIR, { recursive: true });
}

// ── Load default resume from public folder ────────────────────────────────────
async function getDefaultResume(): Promise<{ data: Buffer; filename: string } | null> {
  try {
    const data = await fs.readFile(DEFAULT_RESUME_PATH);
    return { data, filename: DEFAULT_RESUME_NAME };
  } catch {
    return null;
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function storeResume(data: Buffer, filename: string): Promise<void> {
  await ensureDir();
  await fs.writeFile(PDF_PATH, data);
  const meta: ResumeMeta = { filename, uploadedAt: Date.now() };
  await fs.writeFile(META_PATH, JSON.stringify(meta));
  memCache = { data, filename };
}

export async function hasUploadedResume(): Promise<{ exists: boolean; name: string }> {
  if (memCache) return { exists: true, name: memCache.filename };
  try {
    const [dataBuf, metaRaw] = await Promise.all([
      fs.readFile(PDF_PATH),
      fs.readFile(META_PATH, "utf8"),
    ]);
    const meta: ResumeMeta = JSON.parse(metaRaw);
    memCache = { data: dataBuf, filename: meta.filename };
    return { exists: true, name: meta.filename };
  } catch {
    // Fallback to default resume if no uploaded resume exists
    const defaultResume = await getDefaultResume();
    if (defaultResume) {
      memCache = defaultResume;
      return { exists: true, name: defaultResume.filename };
    }
    return { exists: false, name: "" };
  }
}

export async function getLatestResume(): Promise<{ data: Buffer; filename: string } | null> {
  if (memCache) return memCache;
  try {
    const [dataBuf, metaRaw] = await Promise.all([
      fs.readFile(PDF_PATH),
      fs.readFile(META_PATH, "utf8"),
    ]);
    const meta: ResumeMeta = JSON.parse(metaRaw);
    memCache = { data: dataBuf, filename: meta.filename };
    return memCache;
  } catch {
    // Fallback to default resume if no uploaded resume exists
    const defaultResume = await getDefaultResume();
    if (defaultResume) {
      memCache = defaultResume;
      return defaultResume;
    }
    return null;
  }
}
