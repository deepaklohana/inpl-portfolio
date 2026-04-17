"use server";

import { sendEmail } from "@/lib/mail";

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

/* ─── Email template sent to the ADMIN ── */
function buildAdminEmailHtml(data: ContactPayload): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Contact Inquiry</title>
</head>
<body style="margin:0;padding:0;background:#F4F7FF;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F7FF;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#2251B5 0%,#1a3f8f 100%);border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.3px;">
                📬 New Contact Form Inquiry
              </h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.75);font-size:14px;">
                Innovative Network Pvt. Ltd.
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:36px 40px;">

              <p style="margin:0 0 24px;color:#4A5565;font-size:15px;line-height:1.6;">
                You have received a new message through the Contact Us page. Here are the details:
              </p>

              <!-- Info table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E0E0E0;border-radius:12px;overflow:hidden;margin-bottom:24px;">
                <tr style="background:#F9FAFB;">
                  <td style="padding:12px 16px;color:#6B7280;font-size:13px;font-weight:600;width:30%;border-bottom:1px solid #E0E0E0;">Full Name</td>
                  <td style="padding:12px 16px;color:#101828;font-size:14px;font-weight:500;border-bottom:1px solid #E0E0E0;">${data.name}</td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;color:#6B7280;font-size:13px;font-weight:600;border-bottom:1px solid #E0E0E0;">Email</td>
                  <td style="padding:12px 16px;border-bottom:1px solid #E0E0E0;">
                    <a href="mailto:${data.email}" style="color:#2251B5;text-decoration:none;font-size:14px;">${data.email}</a>
                  </td>
                </tr>
                <tr style="background:#F9FAFB;">
                  <td style="padding:12px 16px;color:#6B7280;font-size:13px;font-weight:600;border-bottom:1px solid #E0E0E0;">Phone</td>
                  <td style="padding:12px 16px;color:#101828;font-size:14px;border-bottom:1px solid #E0E0E0;">${data.phone || "—"}</td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;color:#6B7280;font-size:13px;font-weight:600;">Subject</td>
                  <td style="padding:12px 16px;color:#101828;font-size:14px;">${data.subject || "—"}</td>
                </tr>
              </table>

              <!-- Message -->
              <p style="margin:0 0 8px;color:#6B7280;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;">Message</p>
              <div style="background:#F4F7FF;border-left:4px solid #2251B5;border-radius:0 8px 8px 0;padding:16px 20px;color:#101828;font-size:15px;line-height:1.7;white-space:pre-wrap;">${data.message}</div>

              <!-- Reply button -->
              <div style="text-align:center;margin-top:32px;">
                <a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(data.subject || "Your Inquiry")}"
                   style="display:inline-block;background:linear-gradient(135deg,#E96429 0%,#c94f1e 100%);color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 32px;border-radius:10px;">
                  Reply to ${data.name}
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#F9FAFB;border-radius:0 0 16px 16px;padding:20px 40px;text-align:center;border-top:1px solid #E0E0E0;">
              <p style="margin:0;color:#9CA3AF;font-size:12px;line-height:1.6;">
                This email was generated automatically from the Contact Us form on<br/>
                <strong>innovative-net.com</strong>
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

/* ─── Email template sent to the USER (confirmation) ── */
function buildUserEmailHtml(data: ContactPayload): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Thank You for Contacting Us</title>
</head>
<body style="margin:0;padding:0;background:#F4F7FF;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F7FF;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#E96429 0%,#2251B5 100%);border-radius:16px 16px 0 0;padding:40px;text-align:center;">
              <div style="width:64px;height:64px;background:rgba(255,255,255,0.2);border-radius:50%;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-size:28px;line-height:64px;">
                ✅
              </div>
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:-0.5px;">
                Thank You, ${data.name}!
              </h1>
              <p style="margin:10px 0 0;color:rgba(255,255,255,0.85);font-size:15px;line-height:1.5;">
                We've received your message and will get back to you soon.
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:36px 40px;">

              <p style="margin:0 0 20px;color:#4A5565;font-size:15px;line-height:1.7;">
                Hi <strong style="color:#101828;">${data.name}</strong>,<br/><br/>
                Thank you for reaching out to <strong style="color:#101828;">Innovative Network Pvt. Ltd.</strong>
                Our team has received your inquiry and will respond within <strong style="color:#2251B5;">24 hours</strong>.
              </p>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #E0E0E0;margin:24px 0;" />

              <!-- Summary of submitted info -->
              <p style="margin:0 0 12px;color:#6B7280;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;">Your Submission Summary</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E0E0E0;border-radius:12px;overflow:hidden;margin-bottom:28px;">
                <tr style="background:#F9FAFB;">
                  <td style="padding:11px 16px;color:#6B7280;font-size:13px;font-weight:600;width:32%;border-bottom:1px solid #E0E0E0;">Subject</td>
                  <td style="padding:11px 16px;color:#101828;font-size:14px;border-bottom:1px solid #E0E0E0;">${data.subject || "General Inquiry"}</td>
                </tr>
                <tr>
                  <td style="padding:11px 16px;color:#6B7280;font-size:13px;font-weight:600;">Your Message</td>
                  <td style="padding:11px 16px;color:#4A5565;font-size:14px;line-height:1.6;">${data.message.replace(/\n/g, "<br/>")}</td>
                </tr>
              </table>

              <!-- Contact details -->
              <div style="background:#F4F7FF;border-radius:12px;padding:20px 24px;margin-bottom:28px;">
                <p style="margin:0 0 10px;color:#101828;font-size:14px;font-weight:700;">Need immediate help?</p>
                <p style="margin:4px 0;color:#4A5565;font-size:14px;">📧 <a href="mailto:contact@innovative-net.com" style="color:#2251B5;text-decoration:none;">contact@innovative-net.com</a></p>
                <p style="margin:4px 0;color:#4A5565;font-size:14px;">📞 (021) 34303051-55</p>
              </div>

              <p style="margin:0;color:#4A5565;font-size:15px;line-height:1.7;">
                We look forward to connecting with you!<br/>
                <strong style="color:#101828;">— The Innovative Network Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#F9FAFB;border-radius:0 0 16px 16px;padding:20px 40px;text-align:center;border-top:1px solid #E0E0E0;">
              <p style="margin:0 0 8px;color:#9CA3AF;font-size:12px;">
                © ${new Date().getFullYear()} Innovative Network Pvt. Ltd. — All rights reserved.
              </p>
              <p style="margin:0;color:#9CA3AF;font-size:12px;">
                This is an automated confirmation email. Please do not reply directly to this email.
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

/* ─── Server Action ── */
export async function submitContactForm(
  data: ContactPayload
): Promise<{ success: boolean; message: string }> {
  try {
    const adminEmail = process.env.SMTP_FROM_EMAIL;

    // 1. Email to ADMIN — contains the inquiry details
    await sendEmail(
      adminEmail!,
      `📬 New Inquiry: ${data.subject || "General Contact"} — ${data.name}`,
      buildAdminEmailHtml(data)
    );

    // 2. Confirmation email to the USER
    await sendEmail(
      data.email,
      `Thank you for contacting Innovative Network, ${data.name}!`,
      buildUserEmailHtml(data)
    );

    return { success: true, message: "Your message has been sent successfully! Check your email for confirmation." };
  } catch (error) {
    console.error("Error sending contact email:", error);
    return { success: false, message: "Failed to send message. Please try again later." };
  }
}
