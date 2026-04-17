import { getSubscriberStats, getSubscribers } from "@/lib/actions/newsletter";
import { getCampaigns } from "@/lib/actions/campaigns";
import { checkSmtpConfigured } from "@/lib/actions/smtp";
import Link from "next/link";

// ─── Status badge ─────────────────────────────────────────────────────────────
function Badge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    unsubscribed: "bg-red-500/15 text-red-400 border border-red-500/30",
    draft: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
    sent: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
    failed: "bg-red-500/15 text-red-400 border border-red-500/30",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${styles[status] ?? "bg-gray-500/15 text-gray-400"}`}
    >
      {status}
    </span>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: number;
  sub?: string;
  color: string;
}) {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-2 bg-white border border-gray-200 shadow-sm"
    >
      <div className={`text-3xl font-bold ${color}`}>{value.toLocaleString()}</div>
      <div className="text-gray-900 font-semibold text-sm">{label}</div>
      {sub && <div className="text-gray-500 text-xs">{sub}</div>}
    </div>
  );
}

export default async function NewsletterAdminPage() {
  let stats = { total: 0, active: 0, unsubscribed: 0, bySource: [] as Array<{ source: string; _count: { _all: number } }> };
  let subscribers: Array<{
    id: number;
    email: string;
    source: string;
    status: string;
    subscribedAt: Date;
  }> = [];
  let campaigns: Array<{
    id: number;
    subject: string;
    status: string;
    recipientCount: number | null;
    createdAt: Date;
  }> = [];
  let dbUnavailable = false;
  let smtpConfigured = false;

  try {
    [stats, subscribers, campaigns, smtpConfigured] = await Promise.all([
      getSubscriberStats(),
      getSubscribers("all"),
      getCampaigns(),
      checkSmtpConfigured(),
    ]);
  } catch (error) {
    dbUnavailable = true;
    console.error("Failed to load newsletter admin data:", error);
  }

  const footerCount = subscribers.filter((s) => s.source === "footer").length;
  const ctaCount = subscribers.filter((s) => s.source === "cta").length;

  return (
    <div className="space-y-10">
      {/* ── Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold text-gray-900"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Newsletter
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage subscribers and send email campaigns
          </p>
        </div>
        <Link
          href="/admin/newsletter/campaigns/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ background: "#E96429" }}
        >
          <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" aria-hidden>
            <path
              d="M10 4.167v11.666M4.167 10h11.666"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          New Campaign
        </Link>
      </div>

      {dbUnavailable && (
        <div
          className="flex items-start gap-3 px-4 py-3 rounded-xl text-sm"
          style={{
            background: "rgba(239,68,68,0.07)",
            border: "1px solid rgba(239,68,68,0.25)",
          }}
        >
          <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 text-red-600 shrink-0 mt-0.5" aria-hidden>
            <path
              d="M10 8.333v3.334M10 14.167h.008M8.575 3.242L1.908 15a1.667 1.667 0 001.425 2.5h13.334A1.667 1.667 0 0018.09 15L11.424 3.242a1.667 1.667 0 00-2.849 0z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-red-700">
            Database connection issue. Newsletter data is temporarily unavailable.
            Please check database connectivity and refresh.
          </span>
        </div>
      )}

      {/* ── Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Subscribers" value={stats.total} color="text-gray-900" />
        <StatCard
          label="Active"
          value={stats.active}
          sub="Currently subscribed"
          color="text-emerald-600"
        />
        <StatCard
          label="Unsubscribed"
          value={stats.unsubscribed}
          sub="Opted out"
          color="text-red-500"
        />
        <StatCard
          label="Campaigns"
          value={campaigns.length}
          sub={`Footer: ${footerCount} · CTA: ${ctaCount}`}
          color="text-blue-600"
        />
      </div>

      {/* ── Subscribers Table */}
      <section>
        <h2
          className="text-lg font-bold text-gray-900 mb-4"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Subscribers
        </h2>
        <div className="rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm">
          {subscribers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <svg
                viewBox="0 0 48 48"
                fill="none"
                className="w-12 h-12 mb-4 opacity-50"
                aria-hidden
              >
                <rect x="6" y="10" width="36" height="28" rx="4" stroke="currentColor" strokeWidth="2" />
                <path d="M6 18l18 11 18-11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <p className="text-sm font-medium text-gray-500">No subscribers yet</p>
              <p className="text-xs mt-1">When users subscribe from the footer or CTA, they&apos;ll appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["Email", "Source", "Status", "Subscribed On"].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3.5 text-left text-gray-500 font-medium text-xs uppercase tracking-wide bg-gray-50/50"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {subscribers.map((sub, i) => (
                    <tr
                      key={sub.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-5 py-4 text-gray-900 font-medium">{sub.email}</td>
                      <td className="px-5 py-4">
                        <span className="capitalize text-gray-500">{sub.source}</span>
                      </td>
                      <td className="px-5 py-4">
                        <Badge status={sub.status} />
                      </td>
                      <td className="px-5 py-4 text-gray-500">
                        {new Date(sub.subscribedAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* ── Campaigns Table */}
      <section>
        <h2
          className="text-lg font-bold text-gray-900 mb-4"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Email Campaigns
        </h2>

        {/* SMTP Notice — only when not configured */}
        {!smtpConfigured && (
          <div
            className="mb-4 flex items-start gap-3 px-4 py-3 rounded-xl text-sm"
            style={{
              background: "rgba(233,100,41,0.05)",
              border: "1px solid rgba(233,100,41,0.2)",
            }}
          >
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 text-[#E96429] shrink-0 mt-0.5" aria-hidden>
              <path
                d="M10 8.333v3.334M10 14.167h.008M8.575 3.242L1.908 15a1.667 1.667 0 001.425 2.5h13.334A1.667 1.667 0 0018.09 15L11.424 3.242a1.667 1.667 0 00-2.849 0z"
                stroke="#E96429"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[#E96429]">
              <strong>SMTP not configured.</strong> You can create and save campaigns now.
              Email sending will be enabled once you add SMTP credentials.
            </span>
          </div>
        )}

        <div className="rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm">
          {campaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <svg
                viewBox="0 0 48 48"
                fill="none"
                className="w-12 h-12 mb-4 opacity-50"
                aria-hidden
              >
                <path
                  d="M8 12l16 10 16-10M8 12v24h32V12M8 12h32"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-sm font-medium text-gray-500">No campaigns yet</p>
              <p className="text-xs mt-1">
                Click &quot;New Campaign&quot; to compose your first email.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["Subject", "Status", "Recipients", "Created", "Action"].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3.5 text-left text-gray-500 font-medium text-xs uppercase tracking-wide bg-gray-50/50"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {campaigns.map((c, i) => (
                    <tr
                      key={c.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-5 py-4 text-gray-900 font-medium max-w-[240px] truncate">
                        {c.subject}
                      </td>
                      <td className="px-5 py-4">
                        <Badge status={c.status} />
                      </td>
                      <td className="px-5 py-4 text-gray-500">
                        {c.recipientCount != null ? c.recipientCount.toLocaleString() : "—"}
                      </td>
                      <td className="px-5 py-4 text-gray-500">
                        {new Date(c.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          href={`/admin/newsletter/campaigns/${c.id}/edit`}
                          className="text-[#2251B5] hover:text-[#193F8A] text-xs font-semibold transition-colors"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
