import { NextRequest, NextResponse } from "next/server";
import { getLatestResume } from "@/lib/resume-store";
import { promises as fs } from "fs";
import path from "path";

// ── GET /api/resume-download ─────────────────────────────────────────────────
// Serves the latest uploaded resume PDF with correct inline headers so it
// opens directly in the browser tab and can also be saved via the browser's
// download button. Falls back to the bundled public/resume/resume.pdf.
export async function GET(_req: NextRequest) {
  // 1. Try the in-memory / /tmp store (uploaded via admin OTP flow)
  const stored = await getLatestResume();
  if (stored) {
    return new NextResponse(stored.data, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${encodeURIComponent(stored.filename)}"`,
        "Content-Length": String(stored.data.length),
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  }

  // 2. Fall back to the default resume in public folder
  const defaultResumePath = path.join(process.cwd(), "public", "resume", "MN Resume-Developer.pdf");
  try {
    const buf = await fs.readFile(defaultResumePath);
    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="MN Resume-Developer.pdf"`,
        "Content-Length": String(buf.length),
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (e) {
    console.error("[Resume Download] Failed to read default resume:", e);
    return new NextResponse("Resume not found", { status: 404 });
  }
}
