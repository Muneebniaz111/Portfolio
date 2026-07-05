import { NextRequest, NextResponse } from "next/server";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY is not configured in the server environment." },
        { status: 500 }
      );
    }

    const payload = await request.json();

    const response = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("[resume-tailor] proxy error:", error);
    return NextResponse.json(
      { error: "Failed to generate a tailored resume." },
      { status: 500 }
    );
  }
}