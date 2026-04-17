"use server";

export async function checkSmtpConfigured(): Promise<boolean> {
  return !!(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    process.env.SMTP_HOST !== "smtp.gmail.com" ||
    (
      process.env.SMTP_HOST === "smtp.gmail.com" &&
      process.env.SMTP_USER &&
      process.env.SMTP_USER !== "your_email@gmail.com" &&
      process.env.SMTP_PASS &&
      process.env.SMTP_PASS !== "your_app_password"
    )
  );
}
