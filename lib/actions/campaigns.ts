"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ─── Types ──────────────────────────────────────────────────────────────────
export interface CampaignPayload {
  subject: string;
  body: string;
}

// ─── Get all campaigns ──────────────────────────────────────────────────────
export async function getCampaigns() {
  return prisma.emailCampaign.findMany({
    orderBy: { createdAt: "desc" },
  });
}

// ─── Get single campaign ─────────────────────────────────────────────────────
export async function getCampaign(id: number) {
  return prisma.emailCampaign.findUnique({ where: { id } });
}

// ─── Create campaign (draft) ─────────────────────────────────────────────────
export async function createCampaign(
  data: CampaignPayload
): Promise<{ success: boolean; id?: number; message?: string }> {
  if (!data.subject.trim() || !data.body.trim()) {
    return { success: false, message: "Subject and body are required." };
  }

  try {
    const campaign = await prisma.emailCampaign.create({
      data: {
        subject: data.subject.trim(),
        body: data.body.trim(),
        status: "draft",
      },
    });
    revalidatePath("/admin/newsletter");
    return { success: true, id: campaign.id };
  } catch {
    return { success: false, message: "Failed to create campaign." };
  }
}

// ─── Update campaign ─────────────────────────────────────────────────────────
export async function updateCampaign(
  id: number,
  data: CampaignPayload
): Promise<{ success: boolean; message?: string }> {
  try {
    await prisma.emailCampaign.update({
      where: { id },
      data: {
        subject: data.subject.trim(),
        body: data.body.trim(),
      },
    });
    revalidatePath("/admin/newsletter");
    return { success: true };
  } catch {
    return { success: false, message: "Failed to update campaign." };
  }
}

// ─── Delete campaign ─────────────────────────────────────────────────────────
export async function deleteCampaign(
  id: number
): Promise<{ success: boolean }> {
  try {
    await prisma.emailCampaign.delete({ where: { id } });
    revalidatePath("/admin/newsletter");
    return { success: true };
  } catch {
    return { success: false };
  }
}

// ─── Send campaign (SMTP placeholder) ───────────────────────────────────────
// NOTE: Actual email sending is disabled until SMTP is configured.
// When SMTP is ready, replace the placeholder block below with nodemailer logic.
export async function sendCampaign(
  id: number
): Promise<{ success: boolean; message: string }> {
  const SMTP_CONFIGURED = false; // ← Set to true when SMTP is ready

  if (!SMTP_CONFIGURED) {
    return {
      success: false,
      message:
        "SMTP is not configured yet. Please add your email credentials to enable sending.",
    };
  }

  try {
    const [campaign, subscribers] = await Promise.all([
      prisma.emailCampaign.findUnique({ where: { id } }),
      prisma.newsletterSubscriber.findMany({ where: { status: "active" } }),
    ]);

    if (!campaign) return { success: false, message: "Campaign not found." };
    if (subscribers.length === 0)
      return { success: false, message: "No active subscribers." };

    // ── TODO: Replace with nodemailer when SMTP is ready ──────────────────
    // const transporter = nodemailer.createTransport({ ... });
    // for (const sub of subscribers) {
    //   await transporter.sendMail({ to: sub.email, subject: campaign.subject, html: campaign.body });
    // }
    // ─────────────────────────────────────────────────────────────────────

    await prisma.emailCampaign.update({
      where: { id },
      data: {
        status: "sent",
        sentAt: new Date(),
        recipientCount: subscribers.length,
      },
    });

    revalidatePath("/admin/newsletter");
    return {
      success: true,
      message: `Campaign sent to ${subscribers.length} subscribers.`,
    };
  } catch {
    await prisma.emailCampaign.update({
      where: { id },
      data: { status: "failed" },
    });
    return { success: false, message: "Failed to send campaign." };
  }
}
