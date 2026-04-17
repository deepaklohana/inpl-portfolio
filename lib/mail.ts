import nodemailer from "nodemailer";

function createTransporter(debug = false) {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
    debug,   // logs full SMTP conversation when true
    logger: debug,
  });
}

export const sendEmail = async (to: string, subject: string, html: string) => {
  const transporter = createTransporter();
  return transporter.sendMail({
    from: `"Innovative Network" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
};

/** Use this only for one-off SMTP tests — logs full conversation */
export const testSmtpConnection = async (testTo: string) => {
  const transporter = createTransporter(true); // debug ON
  try {
    await transporter.verify();
    console.log("[SMTP Test] ✅ Connection verified successfully.");
    const info = await transporter.sendMail({
      from: `"SMTP Test" <${process.env.SMTP_USER}>`,
      to: testTo,
      subject: "SMTP Test Email",
      html: "<p>This is a test email from Innovative Network server.</p>",
    });
    console.log("[SMTP Test] ✅ Test email sent. MessageID:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error("[SMTP Test] ❌ Error:", err.message);
    return { success: false, error: err.message };
  }
};
