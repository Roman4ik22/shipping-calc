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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const subscribers = JSON.parse(localStorage.getItem("sw_subscribers") || "[]");
    subscribers.push({ email, date: new Date().toISOString(), locale });
    localStorage.setItem("sw_subscribers", JSON.stringify(subscribers));
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
        className="flex-1 px-4 py-3 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg text-sm hover:bg-blue-50 transition-colors"
      >
        {labels.subscribe}
      </button>
    </form>
  );
}
