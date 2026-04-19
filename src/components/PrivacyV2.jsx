"use client";
import React from "react";

export default function PrivacyPage(){
  return (
    <>
      <section style={{padding:'72px 32px 48px', borderBottom:'1px solid var(--line)'}}><div style={{maxWidth:800, margin:'0 auto'}}>
        <div style={{fontSize:12, fontWeight:700, color:'var(--blue)', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:12}}>Legal</div>
        <h1 style={{margin:'0 0 8px', fontSize:40, fontWeight:800, letterSpacing:'-.02em'}}>Privacy Policy</h1>
        <p style={{fontSize:14, color:'var(--muted)'}}>Last updated: March 2026 · Global Supply KFT</p>
      </div></section>

      <section style={{padding:'48px 32px 96px'}}><div style={{maxWidth:800, margin:'0 auto', fontSize:15, color:'var(--body)', lineHeight:1.7}}>
        <h2 style={{fontSize:22, fontWeight:700, color:'var(--ink)', margin:'32px 0 12px'}}>1. Analytics & Tracking</h2>
        <p>We use Google Analytics and Google Tag Manager (GTM) to collect anonymous website usage statistics. Data collected includes pages visited, time spent on site, device type, country-level geographic location, and referral sources to help improve the service.</p>

        <h2 style={{fontSize:22, fontWeight:700, color:'var(--ink)', margin:'32px 0 12px'}}>2. Advertising</h2>
        <p>We use Google AdSense to display advertisements on the site. AdSense may employ cookies to deliver personalized ads based on previous visits to RateShips and other websites. Users can disable personalized advertising through Google Ad Settings.</p>

        <h2 style={{fontSize:22, fontWeight:700, color:'var(--ink)', margin:'32px 0 12px'}}>3. Email Collection</h2>
        <p>Newsletter subscribers have their email addresses retained for sending updates regarding new features, shipping rate modifications, and helpful guides. Users may unsubscribe anytime by selecting the link at the footer of any email message.</p>

        <h2 style={{fontSize:22, fontWeight:700, color:'var(--ink)', margin:'32px 0 12px'}}>4. Local Storage</h2>
        <p>We use localStorage in your browser to save your favorite shipping routes and user preferences. This includes currency and weight unit selections, with data remaining exclusively on your device and not uploaded to our servers.</p>

        <h2 style={{fontSize:22, fontWeight:700, color:'var(--ink)', margin:'32px 0 12px'}}>5. Cookies</h2>
        <p>Our site uses cookies for Google Analytics, Google Tag Manager, and Google AdSense. These cookies facilitate traffic analysis and relevant advertisement display. You can adjust cookie settings via your browser configuration.</p>

        <h2 style={{fontSize:22, fontWeight:700, color:'var(--ink)', margin:'32px 0 12px'}}>6. Data Sales</h2>
        <p>We do not sell, trade, or transfer your personal data to third parties, except as described in this policy. We do not collect names, addresses, or payment information.</p>

        <h2 style={{fontSize:22, fontWeight:700, color:'var(--ink)', margin:'32px 0 12px'}}>7. Contact</h2>
        <p>Privacy inquiries: <a href="mailto:privacy@rateships.com" style={{color:'var(--blue)', fontWeight:600}}>privacy@rateships.com</a></p>

        <div style={{marginTop:40, padding:'20px 24px', background:'var(--bg)', borderRadius:14, border:'1px solid var(--line)', fontSize:14}}>
          <b>Data Controller:</b> Global Supply KFT · Toldi utca 4, Kutasó, Hungary 3066 · EU VAT: HU26179030
        </div>
      </div></section>
    </>
  );
}
