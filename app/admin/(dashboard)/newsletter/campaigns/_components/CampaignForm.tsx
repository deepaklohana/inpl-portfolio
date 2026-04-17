"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCampaign, updateCampaign, sendCampaign } from "@/lib/actions/campaigns";

interface Campaign {
  id?: number;
  subject?: string;
  body?: string;
  status?: string;
}

interface Props {
  initial?: Campaign;
  smtpConfigured?: boolean;
}

export default function CampaignForm({ initial, smtpConfigured = false }: Props) {
  const router = useRouter();
  const isEdit = !!initial?.id;

  const [subject, setSubject] = useState(initial?.subject ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    const result = isEdit
      ? await updateCampaign(initial!.id!, { subject, body })
      : await createCampaign({ subject, body });

    if (result.success) {
      setMessage({ type: "success", text: "Campaign saved as draft." });
      if (!isEdit && "id" in result && result.id) {
        router.push(`/admin/newsletter/campaigns/${result.id}/edit`);
      }
    } else {
      setMessage({ type: "error", text: result.message ?? "Failed to save." });
    }
    setSaving(false);
  }

  async function handleSend() {
    if (!initial?.id) return;
    setSending(true);
    setMessage(null);
    const result = await sendCampaign(initial.id);
    setMessage({
      type: result.success ? "success" : "error",
      text: result.message,
    });
    setSending(false);
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Subject */}
      <div className="space-y-2">
        <label
          htmlFor="campaign-subject"
          className="block text-sm font-medium text-gray-700"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Subject Line
        </label>
        <input
          id="campaign-subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g. New feature release 🚀"
          className="w-full h-12 px-4 rounded-xl text-gray-900 text-sm bg-white border border-gray-200 outline-none transition-all placeholder:text-gray-400 focus:border-[#2251B5] focus:ring-4 focus:ring-[#2251B5]/10"
          style={{ fontFamily: "'Inter', sans-serif" }}
        />
      </div>

      {/* Body */}
      <div className="space-y-2">
        <label
          htmlFor="campaign-body"
          className="block text-sm font-medium text-gray-700"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Email Body
          <span className="ml-2 text-xs text-gray-400 font-normal">
            (HTML supported)
          </span>
        </label>
        <textarea
          id="campaign-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={14}
          placeholder="Write your email content here. You can use HTML tags for formatting."
          className="w-full px-4 py-3 rounded-xl text-gray-900 text-sm bg-white border border-gray-200 outline-none transition-all resize-y placeholder:text-gray-400 focus:border-[#2251B5] focus:ring-4 focus:ring-[#2251B5]/10"
          style={{
            fontFamily: "'Inter', monospace",
            lineHeight: "1.6",
            minHeight: 260,
          }}
        />
      </div>

      {/* SMTP Notice (when not configured) */}
      {!smtpConfigured && (
        <div
          className="flex items-start gap-3 px-4 py-3 rounded-xl text-sm"
          style={{
            background: "rgba(233,100,41,0.05)",
            border: "1px solid rgba(233,100,41,0.2)",
          }}
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            className="w-4 h-4 text-[#E96429] shrink-0 mt-0.5"
            aria-hidden
          >
            <path
              d="M10 8.333v3.334M10 14.167h.008M8.575 3.242L1.908 15a1.667 1.667 0 001.425 2.5h13.334A1.667 1.667 0 0018.09 15L11.424 3.242a1.667 1.667 0 00-2.849 0z"
              stroke="#E96429"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[#E96429]">
            <strong>SMTP not configured.</strong> &quot;Send Now&quot; will be enabled once you
            add your email credentials to the environment variables
            (<code className="text-xs bg-gray-100 border border-[#E96429]/20 px-1 rounded">SMTP_HOST</code>,{" "}
            <code className="text-xs bg-gray-100 border border-[#E96429]/20 px-1 rounded">SMTP_USER</code>,{" "}
            <code className="text-xs bg-gray-100 border border-[#E96429]/20 px-1 rounded">SMTP_PASS</code>).
          </span>
        </div>
      )}

      {/* Feedback message */}
      {message && (
        <div
          className={`px-4 py-3 rounded-xl text-sm font-medium ${
            message.type === "success"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}
          role="alert"
        >
          {message.text}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Save Draft */}
        <button
          onClick={handleSave}
          disabled={saving || !subject.trim() || !body.trim()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: "#2251B5" }}
        >
          {saving ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              Saving…
            </>
          ) : (
            <>
              <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" aria-hidden>
                <path d="M16.667 17.5H3.333A1.667 1.667 0 011.667 15.833V4.167A1.667 1.667 0 013.333 2.5h10.834l4.166 4.167v9.166A1.667 1.667 0 0116.667 17.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14.167 17.5v-6.667H5.833V17.5M5.833 2.5v4.167h6.667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Save as Draft
            </>
          )}
        </button>

        {/* Send Now — only shown on edit page */}
        {isEdit && (
          <button
            onClick={handleSend}
            disabled={sending || !smtpConfigured || initial?.status === "sent"}
            title={
              !smtpConfigured
                ? "SMTP not configured yet"
                : initial?.status === "sent"
                ? "Already sent"
                : "Send to all active subscribers"
            }
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "#E96429" }}
          >
            {sending ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                  <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Sending…
              </>
            ) : (
              <>
                <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" aria-hidden>
                  <path d="M17.5 2.5L9.167 10.833M17.5 2.5l-5.833 15-2.5-7.5-7.5-2.5 15-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Send Now
              </>
            )}
          </button>
        )}

        {/* Back */}
        <button
          onClick={() => router.push("/admin/newsletter")}
          className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-sm font-medium transition-colors hover:bg-gray-200 hover:text-gray-900 border border-gray-200"
        >
          Back to Newsletter
        </button>
      </div>
    </div>
  );
}
