"use client";

import { useState } from "react";
import { subscribeEmail } from "@/lib/actions/newsletter";

interface Props {
  source?: "footer" | "cta" | "manual";
  /** Dark background theme (footer) vs light (CTA section) */
  theme?: "dark" | "light";
}

export default function NewsletterSubscribeForm({
  source = "footer",
  theme = "dark",
}: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const isDark = theme === "dark";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    const result = await subscribeEmail(email.trim(), source);

    if (result.success) {
      setStatus("success");
      setMessage(result.message);
      setEmail("");
    } else {
      setStatus("error");
      setMessage(result.message);
    }

    // Reset to idle after 4s
    setTimeout(() => {
      setStatus("idle");
      setMessage("");
    }, 4000);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full" noValidate>
      {/* Input */}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        disabled={status === "loading" || status === "success"}
        required
        className="flex-1 h-[50px] px-4 text-base outline-none rounded-[14px] transition-all duration-200 disabled:opacity-60"
        style={{
          background: isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.85)",
          border: isDark
            ? "1px solid rgba(255,255,255,0.2)"
            : "1px solid rgba(34,81,181,0.25)",
          color: isDark ? "#D1D5DC" : "#1E1F21",
          fontFamily: "'Inter', sans-serif",
        }}
      />

      {/* Button */}
      <button
        type="submit"
        disabled={status === "loading" || status === "success"}
        className="inline-flex items-center justify-center gap-2 h-[50px] px-6 rounded-[14px] text-white font-semibold text-base shrink-0 transition-all duration-200 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
        style={{
          background: "#E96429",
          fontFamily: "'Inter', sans-serif",
          boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)",
          minWidth: 130,
        }}
      >
        {status === "loading" ? (
          <>
            {/* Spinner */}
            <svg
              className="animate-spin w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <circle
                cx="12" cy="12" r="10"
                stroke="currentColor"
                strokeWidth="3"
                strokeOpacity="0.3"
              />
              <path
                d="M12 2a10 10 0 0110 10"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            Subscribing…
          </>
        ) : status === "success" ? (
          <>
            {/* Check */}
            <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5" aria-hidden>
              <path
                d="M5 10l4 4 6-8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Done!
          </>
        ) : (
          <>
            Subscribe
            <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5" aria-hidden>
              <path
                d="M4.167 10h11.666M10 4.167L15.833 10 10 15.833"
                stroke="currentColor"
                strokeWidth="1.667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </>
        )}
      </button>

      {/* Inline feedback message */}
      {message && (
        <span
          className={`absolute mt-[58px] text-xs font-medium transition-all duration-300 ${
            status === "error" ? "text-red-400" : "text-green-400"
          }`}
          style={{ fontFamily: "'Inter', sans-serif" }}
          role="alert"
        >
          {message}
        </span>
      )}
    </form>
  );
}
