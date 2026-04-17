import { NextRequest, NextResponse } from "next/server";
import { testSmtpConnection } from "@/lib/mail";

/**
 * Test SMTP route — only available in development
 * Usage: GET /api/test-email?to=yourtest@email.com
 */
export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  const to = req.nextUrl.searchParams.get("to") as string;

  console.log(`[SMTP Test] Sending test email to: ${to}`);
  const result = await testSmtpConnection(to);
  return NextResponse.json(result);
}
