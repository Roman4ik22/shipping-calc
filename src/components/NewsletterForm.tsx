"use client";

import { useState } from "react";

export default function NewsletterForm({
  locale,
  labels,
}: {
  locale: string;
  labels: { thanks: string; placeholder: string; subscribe: string };
}) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });
    } catch {
      // Fallback to localStorage if API fails
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <p className="text-ink font-medium py-3">
        {labels.thanks}
      </p>
    );
  }

  return (
    <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={handleSubmit}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={labels.placeholder}
        className="flex-1 px-4 py-3 rounded-lg bg-dark-700 border border-white/20 text-gray-100 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-accent text-white btn-press font-semibold rounded-lg text-sm hover:bg-[#1558B8] transition-colors"
      >
        {labels.subscribe}
      </button>
    </form>
  );
}
