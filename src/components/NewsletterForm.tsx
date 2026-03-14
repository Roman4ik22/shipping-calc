"use client";

import { useState } from "react";

export default function NewsletterForm({
  locale,
}: {
  locale: string;
}) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Store in localStorage for now (can be connected to a backend later)
    const subscribers = JSON.parse(localStorage.getItem("sw_subscribers") || "[]");
    subscribers.push({ email, date: new Date().toISOString(), locale });
    localStorage.setItem("sw_subscribers", JSON.stringify(subscribers));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <p className="text-white font-medium py-3">
        {locale === "ru" ? "Спасибо за подписку!" : "Thanks for subscribing!"}
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
        placeholder={locale === "ru" ? "Ваш email" : "Your email"}
        className="flex-1 px-4 py-3 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg text-sm hover:bg-blue-50 transition-colors"
      >
        {locale === "ru" ? "Подписаться" : "Subscribe"}
      </button>
    </form>
  );
}
