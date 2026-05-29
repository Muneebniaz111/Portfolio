import { NextRequest, NextResponse } from "next/server";
import { storeResume, hasUploadedResume } from "@/lib/resume-store";
import { consumeUploadToken } from "@/lib/upload-token-store";

// ── GET — status check called by the frontend on page load ───────────────────
export async function GET(_req: NextRequest) {
  const { exists, name } = await hasUploadedResume();
  return NextResponse.json({ exists, originalName: name });
}

// ── POST — upload (requires a valid OTP upload token) ────────────────────────
export async function POST(request: NextRequest) {
  try {
    const formData   = await request.formData();
    const file        = formData.get("file") as File | null;
    const uploadToken = formData.get("uploadToken") as string | null;

    console.log("[Resume Upload] Received token:", uploadToken ? `${uploadToken.substring(0, 20)}...` : "MISSING");

    // Validate the short-lived token issued after OTP verification
    if (!uploadToken) {
      console.error("[Resume Upload] No uploadToken provided");
      return NextResponse.json(
        { error: "Unauthorized: No token provided. Please verify OTP again." },
        { status: 401 }
      );
    }

    const isValid = await consumeUploadToken(uploadToken);
    console.log("[Resume Upload] Token validation result:", isValid);

    if (!isValid) {
      console.error("[Resume Upload] Token validation failed:", uploadToken.substring(0, 20));
      return NextResponse.json(
        { error: "Unauthorized: OTP verification expired or invalid. Please verify again." },
        { status: 401 }
      );
    }

    if (!file) {
      console.error("[Resume Upload] No file provided");
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes  = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate PDF magic bytes
    if (buffer.slice(0, 4).toString("ascii") !== "%PDF") {
      console.error("[Resume Upload] Invalid PDF magic bytes");
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
    }
    if (buffer.length > 5 * 1024 * 1024) {
      console.error("[Resume Upload] File too large:", buffer.length);
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 });
    }

    const originalName = file.name || "resume.pdf";
    console.log("[Resume Upload] Storing resume:", originalName, "Size:", buffer.length);
    await storeResume(buffer, originalName);

    console.log("[Resume Upload] Upload successful");
    return NextResponse.json({
      success: true,
      message: "Resume uploaded successfully",
      fileName: originalName,
    });

  } catch (err) {
    console.error("Resume upload error:", err);
    return NextResponse.json({ error: "Server error during upload" }, { status: 500 });
  }
}
