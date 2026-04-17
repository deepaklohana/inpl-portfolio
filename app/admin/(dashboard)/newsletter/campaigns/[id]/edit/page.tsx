import { getCampaign } from "@/lib/actions/campaigns";
import { checkSmtpConfigured } from "@/lib/actions/smtp";
import CampaignForm from "../../_components/CampaignForm";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCampaignPage({ params }: Props) {
  const { id } = await params;
  const [campaign, smtpConfigured] = await Promise.all([
    getCampaign(Number(id)),
    checkSmtpConfigured(),
  ]);

  if (!campaign) notFound();

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/admin/newsletter" className="hover:text-gray-900 transition-colors">
          Newsletter
        </Link>
        <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5" aria-hidden>
          <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-gray-900 truncate max-w-[260px]">{campaign.subject}</span>
      </div>

      {/* Title + status */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1
            className="text-2xl font-bold text-gray-900"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Edit Campaign
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {campaign.status === "sent"
              ? `Sent to ${campaign.recipientCount?.toLocaleString() ?? "—"} subscribers`
              : "Draft — not yet sent"}
          </p>
        </div>

        {/* Status pill */}
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${
            campaign.status === "sent"
              ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
              : campaign.status === "failed"
              ? "bg-red-500/15 text-red-400 border border-red-500/30"
              : "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"
          }`}
        >
          {campaign.status}
        </span>
      </div>

      {/* Form */}
      <CampaignForm
        smtpConfigured={smtpConfigured}
        initial={{
          id: campaign.id,
          subject: campaign.subject,
          body: campaign.body,
          status: campaign.status,
        }}
      />
    </div>
  );
}
