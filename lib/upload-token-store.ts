import { promises as fs } from "fs";
import path from "path";

// ── Persistent token storage ──────────────────────────────────────────────────
// Tokens are stored on disk so they survive server restarts
const TMP_DIR      = "/tmp/portfolio_resume";
const TOKENS_PATH  = path.join(TMP_DIR, "upload_tokens.json");

interface TokenRecord {
  code: string;
  expiresAt: number;
  attempts: number;
  used: boolean;
}

// ── In-memory cache ───────────────────────────────────────────────────────────
let tokenCache: Map<string, TokenRecord> | null = null;

async function ensureDir() {
  await fs.mkdir(TMP_DIR, { recursive: true });
}

async function loadTokens(): Promise<Map<string, TokenRecord>> {
  if (tokenCache) return tokenCache;
  try {
    const content = await fs.readFile(TOKENS_PATH, "utf8");
    const data = JSON.parse(content) as Record<string, TokenRecord>;
    tokenCache = new Map(Object.entries(data));
  } catch {
    tokenCache = new Map();
  }
  return tokenCache;
}

async function saveTokens(tokens: Map<string, TokenRecord>): Promise<void> {
  await ensureDir();
  const obj = Object.fromEntries(tokens);
  await fs.writeFile(TOKENS_PATH, JSON.stringify(obj, null, 2));
}

async function purgeExpired(): Promise<void> {
  const tokens = await loadTokens();
  const now = Date.now();
  let changed = false;

  for (const [key, record] of tokens.entries()) {
    if (record.expiresAt < now) {
      tokens.delete(key);
      changed = true;
    }
  }

  if (changed) {
    tokenCache = tokens;
    await saveTokens(tokens);
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function storeUploadToken(token: string, expiresInMs: number = 15 * 60 * 1000): Promise<void> {
  const tokens = await loadTokens();
  const key = `token_${token}`;
  
  tokens.set(key, {
    code: token,
    expiresAt: Date.now() + expiresInMs,
    attempts: 0,
    used: false,
  });

  tokenCache = tokens;
  await saveTokens(tokens);
}

export async function consumeUploadToken(token: string): Promise<boolean> {
  await purgeExpired();
  const tokens = await loadTokens();
  const key = `token_${token}`;
  const record = tokens.get(key);

  if (!record || record.used || Date.now() > record.expiresAt) {
    return false;
  }

  record.used = true;
  tokenCache = tokens;
  await saveTokens(tokens);
  return true;
}

export async function validateUploadToken(token: string): Promise<boolean> {
  await purgeExpired();
  const tokens = await loadTokens();
  const key = `token_${token}`;
  const record = tokens.get(key);

  if (!record || record.used || Date.now() > record.expiresAt) {
    return false;
  }

  return true;
}
