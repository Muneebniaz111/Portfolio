import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createDecipheriv, randomInt } from "crypto";
import { storeUploadToken } from "@/lib/upload-token-store";

// ── Reuse the same AES-256-GCM email password decryption from contact route ──
function decryptEmailPassword(): string {
  const encryptionKey = process.env.ENCRYPTION_KEY;
  const encryptedValue = process.env.EMAIL_PASSWORD_ENCRYPTED;
  if (!encryptionKey || !encryptedValue) throw new Error("Missing email env vars");
  const parts = encryptedValue.split(":");
  if (parts.length !== 3) throw new Error("Invalid EMAIL_PASSWORD_ENCRYPTED format");
  const [ivHex, authTagHex, ciphertextHex] = parts;
  const decipher = createDecipheriv(
    "aes-256-gcm",
    Buffer.from(encryptionKey, "hex"),
    Buffer.from(ivHex, "hex")
  );
  decipher.setAuthTag(Buffer.from(authTagHex, "hex"));
  let decrypted = decipher.update(ciphertextHex, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// ── In-memory OTP store (per-instance, sufficient for a personal portfolio) ──
interface OtpRecord {
  code: string;
  expiresAt: number;  // epoch ms
  attempts: number;   // wrong-guess counter
  used: boolean;
}

// Module-level map survives across requests on the same server instance
const otpStore = new Map<string, OtpRecord>();

const OTP_TTL_MS    = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS  = 5;
const OTP_KEY       = "resume_admin";  // single owner, fixed key

// Clean up expired records periodically
function purgeExpired() {
  const now = Date.now();
  for (const [k, v] of otpStore.entries()) {
    if (v.expiresAt < now) otpStore.delete(k);
  }
}

// ── POST /api/resume-otp ─────────────────────────────────────────────────────
// Body: { action: "send" }          → generates & emails OTP
//       { action: "verify", code }  → verifies code, returns a short-lived token
export async function POST(request: NextRequest) {
  try {
    purgeExpired();
    const body = await request.json();
    const { action, code } = body as { action: string; code?: string };

    // ── Send OTP ─────────────────────────────────────────────────────────────
    if (action === "send") {
      // Generate 6-digit OTP
      const otp = String(randomInt(100000, 999999));

      otpStore.set(OTP_KEY, {
        code: otp,
        expiresAt: Date.now() + OTP_TTL_MS,
        attempts: 0,
        used: false,
      });

      const emailUser      = process.env.EMAIL_USER;
      const recipientEmail = process.env.RECIPIENT_EMAIL;
      if (!emailUser || !recipientEmail) {
        return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
      }

      let emailPassword: string;
      try { emailPassword = decryptEmailPassword(); }
      catch { return NextResponse.json({ error: "Email credentials error" }, { status: 500 }); }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: emailUser, pass: emailPassword },
      });

      const html = `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;background:#0f172a;padding:32px;border-radius:12px;">
          <h2 style="color:#f9fafb;margin:0 0 8px">Resume Update OTP</h2>
          <p style="color:#94a3b8;margin:0 0 24px;font-size:14px">Someone requested to update your portfolio resume.</p>
          <div style="background:#1e293b;border:1px solid rgba(99,102,241,0.4);border-radius:8px;padding:24px;text-align:center;margin-bottom:24px;">
            <p style="color:#94a3b8;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 8px">Your verification code</p>
            <p style="color:#a5b4fc;font-size:40px;font-weight:700;letter-spacing:0.2em;margin:0;font-family:monospace">${otp}</p>
          </div>
          <p style="color:#64748b;font-size:12px;margin:0">This code expires in <strong style="color:#94a3b8">10 minutes</strong>. If you didn't request this, ignore this email — your resume is safe.</p>
        </div>
      `;

      await transporter.sendMail({
        from: emailUser,
        to: recipientEmail,
        subject: "Resume Update OTP — Portfolio",
        html,
        text: `Your resume update OTP is: ${otp}\n\nExpires in 10 minutes.`,
      });

      return NextResponse.json({ success: true, message: "OTP sent to your email" });
    }

    // ── Verify OTP ────────────────────────────────────────────────────────────
    if (action === "verify") {
      if (!code || typeof code !== "string") {
        return NextResponse.json({ error: "Code is required" }, { status: 400 });
      }

      const record = otpStore.get(OTP_KEY);

      if (!record) {
        return NextResponse.json({ error: "No OTP requested. Please send a new code." }, { status: 400 });
      }
      if (record.used) {
        return NextResponse.json({ error: "This OTP has already been used. Request a new one." }, { status: 400 });
      }
      if (Date.now() > record.expiresAt) {
        otpStore.delete(OTP_KEY);
        return NextResponse.json({ error: "OTP expired. Please request a new code." }, { status: 400 });
      }
      if (record.attempts >= MAX_ATTEMPTS) {
        otpStore.delete(OTP_KEY);
        return NextResponse.json({ error: "Too many failed attempts. Request a new code." }, { status: 429 });
      }

      if (code.trim() !== record.code) {
        record.attempts++;
        const remaining = MAX_ATTEMPTS - record.attempts;
        return NextResponse.json(
          { error: `Incorrect code. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.` },
          { status: 401 }
        );
      }

      // ✅ Correct — issue a short-lived upload token (valid for 15 min)
      const uploadToken = `otp_verified_${Date.now()}_${randomInt(100000, 999999)}`;
      record.used = true;

      // Store token persistently so it survives server restarts
      await storeUploadToken(uploadToken, 15 * 60 * 1000); // 15 minute validity

      return NextResponse.json({ success: true, uploadToken });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (err) {
    console.error("OTP route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
