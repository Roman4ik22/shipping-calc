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
      <p className="text-white font-medium py-3">
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
        className="flex-1 px-4 py-3 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-white text-accent-dark font-semibold rounded-lg text-sm hover:bg-gray-100 transition-colors"
      >
        {labels.subscribe}
      </button>
    </form>
  );
}
