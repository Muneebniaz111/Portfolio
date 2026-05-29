import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";
import { createDecipheriv } from "crypto";

// ── Decrypt the AES-256-GCM encrypted email password ────────────────────────
// The value stored in EMAIL_PASSWORD_ENCRYPTED has the format:
//   <iv_hex>:<authTag_hex>:<ciphertext_hex>
// The 256-bit key is stored in ENCRYPTION_KEY (hex).
function decryptEmailPassword(): string {
  const encryptionKey = process.env.ENCRYPTION_KEY;
  const encryptedValue = process.env.EMAIL_PASSWORD_ENCRYPTED;

  if (!encryptionKey || !encryptedValue) {
    throw new Error("Missing EMAIL_PASSWORD_ENCRYPTED or ENCRYPTION_KEY environment variables");
  }

  const parts = encryptedValue.split(":");
  if (parts.length !== 3) {
    throw new Error("Invalid EMAIL_PASSWORD_ENCRYPTED format — expected iv:authTag:ciphertext");
  }

  const [ivHex, authTagHex, ciphertextHex] = parts;
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const keyBuffer = Buffer.from(encryptionKey, "hex");

  const decipher = createDecipheriv("aes-256-gcm", keyBuffer, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(ciphertextHex, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// Email validation helper function
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, guestType, message } = await request.json();

    // Validate required fields
    if (!name || !email || !guestType || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Get email credentials from environment variables
    const emailUser = process.env.EMAIL_USER;
    const recipientEmail = process.env.RECIPIENT_EMAIL;

    if (!emailUser || !recipientEmail) {
      console.error("Missing email configuration");
      return NextResponse.json(
        { error: "Email service is not configured" },
        { status: 500 }
      );
    }

    // Decrypt email password at runtime — never stored or logged in plain text
    let emailPassword: string;
    try {
      emailPassword = decryptEmailPassword();
    } catch (decryptErr) {
      console.error("Failed to decrypt email password:", decryptErr);
      return NextResponse.json(
        { error: "Email service is not configured correctly" },
        { status: 500 }
      );
    }

    // Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    });

    // Email template
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px;">
        <h2 style="color: #121212; margin-top: 0;">New Portfolio Contact Message</h2>
        <div style="background: white; padding: 20px; border-left: 4px solid #6366f1;">
          <p><strong>From:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
          <p><strong>Guest Type:</strong> ${escapeHtml(guestType)}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;">
          <p><strong>Message:</strong></p>
          <p style="color: #333; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(message)}</p>
        </div>
        <p style="color: #666; font-size: 12px; margin-top: 15px; text-align: center;">
          This message was sent from your portfolio contact form.
        </p>
      </div>
    `;

    // Send email
    await transporter.sendMail({
      from: emailUser,
      to: recipientEmail,
      replyTo: email,
      subject: `Portfolio Contact: ${escapeHtml(name)} (${escapeHtml(guestType)})`,
      html: htmlContent,
      text: `New message from ${name} (${email})\n\nGuest Type: ${guestType}\n\nMessage:\n${message}`,
    });

    return NextResponse.json(
      { success: true, message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}

// Helper function to escape HTML special characters
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
