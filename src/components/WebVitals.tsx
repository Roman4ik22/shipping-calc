"use client";

import { useReportWebVitals } from "next/web-vitals";

type ReportWebVitalsCallback = Parameters<typeof useReportWebVitals>[0];

const sendToGA: ReportWebVitalsCallback = (metric) => {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("event", metric.name, {
    value: Math.round(
      metric.name === "CLS" ? metric.value * 1000 : metric.value
    ),
    event_label: metric.id,
    non_interaction: true,
  });
};

export default function WebVitals() {
  useReportWebVitals(sendToGA);
  return null;
}
