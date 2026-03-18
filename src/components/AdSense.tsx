"use client";

import Script from "next/script";

const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID;

export default function AdSense() {
  if (!ADSENSE_ID) return null;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
      crossOrigin="anonymous"
      strategy="lazyOnload"
    />
  );
}

export function AdBanner({
  slot,
  format = "auto",
  responsive = true,
}: {
  slot: string;
  format?: string;
  responsive?: boolean;
}) {
  if (!ADSENSE_ID) return null;

  return (
    <div className="my-6">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
      <Script id={`ad-${slot}`} strategy="lazyOnload">
        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
      </Script>
    </div>
  );
}
