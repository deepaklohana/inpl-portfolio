import CampaignForm from "../_components/CampaignForm";
import Link from "next/link";

export default function NewCampaignPage() {
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
        <span className="text-gray-900">New Campaign</span>
      </div>

      {/* Title */}
      <div>
        <h1
          className="text-2xl font-bold text-gray-900"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          New Campaign
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Compose an email to send to all active subscribers.
        </p>
      </div>

      {/* Form */}
      <CampaignForm />
    </div>
  );
}
