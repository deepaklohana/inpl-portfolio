"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/mail";

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

export async function sendCampaign(
  id: number
): Promise<{ success: boolean; message: string }> {
  try {
    const [campaign, subscribers] = await Promise.all([
      prisma.emailCampaign.findUnique({ where: { id } }),
      prisma.newsletterSubscriber.findMany({ where: { status: "active" } }),
    ]);

    if (!campaign) return { success: false, message: "Campaign not found." };
    if (subscribers.length === 0)
      return { success: false, message: "No active subscribers." };

    // Send emails and track results
    const results = await Promise.allSettled(
      subscribers.map((sub) =>
        sendEmail(sub.email, campaign.subject, campaign.body)
      )
    );

    const succeeded = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    // Log any failures for debugging
    results.forEach((result, i) => {
      if (result.status === "rejected") {
        console.error(
          `[Campaign ${id}] Failed to send to ${subscribers[i].email}:`,
          result.reason
        );
      }
    });

    // If ALL failed, mark as failed
    if (succeeded === 0) {
      await prisma.emailCampaign.update({
        where: { id },
        data: { status: "failed" },
      });
      revalidatePath("/admin/newsletter");
      return {
        success: false,
        message: `Failed to send. All ${failed} emails failed. Check server logs for SMTP errors.`,
      };
    }

    await prisma.emailCampaign.update({
      where: { id },
      data: {
        status: "sent",
        sentAt: new Date(),
        recipientCount: succeeded,
      },
    });

    revalidatePath("/admin/newsletter");
    return {
      success: true,
      message:
        failed > 0
          ? `Sent to ${succeeded} subscribers. ${failed} failed.`
          : `Campaign sent successfully to ${succeeded} subscribers.`,
    };
  } catch (err) {
    console.error(`[Campaign ${id}] sendCampaign error:`, err);
    await prisma.emailCampaign.update({
      where: { id },
      data: { status: "failed" },
    });
    return { success: false, message: "Failed to send campaign. Check server logs." };
  }
}
