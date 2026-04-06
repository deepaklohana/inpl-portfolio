"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
    return { success: true, message: "Thank you for subscribing!" };
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
