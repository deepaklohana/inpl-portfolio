"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/mail";

/* ─── Welcome email template ──────────────────────────────────────────────── */
function buildWelcomeEmailHtml(email: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Our Newsletter</title>
</head>
<body style="margin:0;padding:0;background:#F4F7FF;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F7FF;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#2251B5 0%,#E96429 100%);border-radius:16px 16px 0 0;padding:48px 40px;text-align:center;">
              <div style="font-size:48px;line-height:1;margin-bottom:16px;">🎉</div>
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">
                Welcome Aboard!
              </h1>
              <p style="margin:12px 0 0;color:rgba(255,255,255,0.85);font-size:16px;line-height:1.6;">
                You're now subscribed to the Innovative Network newsletter.
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:40px;">
              <p style="margin:0 0 20px;color:#4A5565;font-size:15px;line-height:1.7;">
                Hi there! 👋<br/><br/>
                Thank you for subscribing to the <strong style="color:#101828;">Innovative Network</strong> newsletter.
                You'll be the first to know about:
              </p>

              <!-- Feature list -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #F4F7FF;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:36px;">
                          <div style="width:32px;height:32px;background:#EEF2FF;border-radius:8px;text-align:center;line-height:32px;font-size:16px;">🚀</div>
                        </td>
                        <td style="padding-left:12px;color:#101828;font-size:14px;font-weight:600;">Latest Product Updates</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #F4F7FF;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:36px;">
                          <div style="width:32px;height:32px;background:#FFF7ED;border-radius:8px;text-align:center;line-height:32px;font-size:16px;">📰</div>
                        </td>
                        <td style="padding-left:12px;color:#101828;font-size:14px;font-weight:600;">Industry News & Insights</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:36px;">
                          <div style="width:32px;height:32px;background:#F0FDF4;border-radius:8px;text-align:center;line-height:32px;font-size:16px;">🎁</div>
                        </td>
                        <td style="padding-left:12px;color:#101828;font-size:14px;font-weight:600;">Exclusive Offers & Announcements</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <div style="text-align:center;margin:32px 0 24px;">
                <a href="https://innovative-net.com"
                   style="display:inline-block;background:linear-gradient(135deg,#E96429 0%,#c94f1e 100%);color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 36px;border-radius:10px;">
                  Visit Our Website →
                </a>
              </div>

              <p style="margin:0;color:#4A5565;font-size:15px;line-height:1.7;">
                Looking forward to keeping you updated!<br/>
                <strong style="color:#101828;">— The Innovative Network Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#F9FAFB;border-radius:0 0 16px 16px;padding:20px 40px;text-align:center;border-top:1px solid #E0E0E0;">
              <p style="margin:0 0 6px;color:#9CA3AF;font-size:12px;">
                © ${new Date().getFullYear()} Innovative Network Pvt. Ltd. — All rights reserved.
              </p>
              <p style="margin:0;color:#9CA3AF;font-size:12px;">
                You are receiving this email because <strong>${email}</strong> subscribed on our website.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// ─── Subscribe a new email ──────────────────────────────────────────────────
export async function subscribeEmail(
  email: string,
  source: "footer" | "cta" | "manual" = "footer"
): Promise<{ success: boolean; message: string }> {
  if (!email || !email.includes("@")) {
    return { success: false, message: "Please enter a valid email address." };
  }

  const normalised = email.toLowerCase().trim();

  try {
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: normalised },
    });

    if (existing) {
      if (existing.status === "unsubscribed") {
        // Re-activate
        await prisma.newsletterSubscriber.update({
          where: { email: normalised },
          data: { status: "active" },
        });
        revalidatePath("/admin/newsletter");
        return { success: true, message: "You've been re-subscribed!" };
      }
      return { success: true, message: "You're already subscribed. Thank you!" };
    }

    await prisma.newsletterSubscriber.create({
      data: { email: normalised, source, status: "active" },
    });

    revalidatePath("/admin/newsletter");

    // Send welcome email (non-blocking — don't fail subscription if email fails)
    sendEmail(
      normalised,
      "Welcome to Innovative Network Newsletter! 🎉",
      buildWelcomeEmailHtml(normalised)
    ).catch((err) => console.error("Welcome email failed:", err));

    return { success: true, message: "Thank you for subscribing! Check your inbox for a welcome email." };
  } catch {
    return { success: false, message: "Something went wrong. Please try again." };
  }
}

// ─── Unsubscribe ────────────────────────────────────────────────────────────
export async function unsubscribeEmail(
  email: string
): Promise<{ success: boolean; message: string }> {
  try {
    await prisma.newsletterSubscriber.update({
      where: { email: email.toLowerCase().trim() },
      data: { status: "unsubscribed" },
    });
    revalidatePath("/admin/newsletter");
    return { success: true, message: "Unsubscribed successfully." };
  } catch {
    return { success: false, message: "Email not found." };
  }
}

// ─── Delete subscriber ──────────────────────────────────────────────────────
export async function deleteSubscriber(
  id: number
): Promise<{ success: boolean }> {
  try {
    await prisma.newsletterSubscriber.delete({ where: { id } });
    revalidatePath("/admin/newsletter");
    return { success: true };
  } catch {
    return { success: false };
  }
}

// ─── Get all subscribers (admin) ────────────────────────────────────────────
export async function getSubscribers(filter?: "active" | "unsubscribed" | "all") {
  const where =
    filter && filter !== "all" ? { status: filter } : {};

  return prisma.newsletterSubscriber.findMany({
    where,
    orderBy: { subscribedAt: "desc" },
  });
}

// ─── Stats ──────────────────────────────────────────────────────────────────
export async function getSubscriberStats() {
  const [total, active, unsubscribed] = await Promise.all([
    prisma.newsletterSubscriber.count(),
    prisma.newsletterSubscriber.count({ where: { status: "active" } }),
    prisma.newsletterSubscriber.count({ where: { status: "unsubscribed" } }),
  ]);

  const bySource = await prisma.newsletterSubscriber.groupBy({
    by: ["source"],
    _count: { _all: true },
  });

  return { total, active, unsubscribed, bySource };
}
