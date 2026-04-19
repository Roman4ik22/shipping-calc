"use client";
import { I, SectionHead } from "./V2Shared";
import React from "react";

export default function MethodologyPage(){
  return (
    <>
      <section style={{padding:'72px 32px 48px', borderBottom:'1px solid var(--line)'}}><div style={{maxWidth:800, margin:'0 auto'}}>
        <div style={{fontSize:12, fontWeight:700, color:'var(--blue)', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:12}}>Transparency</div>
        <h1 style={{margin:'0 0 18px', fontSize:'clamp(36px,4vw,52px)', fontWeight:800, letterSpacing:'-.02em'}}>How we source and verify shipping data.</h1>
        <p style={{fontSize:19, color:'var(--body)', maxWidth:640}}>We publish our methodology so you can evaluate the data yourself. No black boxes.</p>
      </div></section>

      <section style={{padding:'64px 32px 96px'}}><div style={{maxWidth:800, margin:'0 auto'}}>
        {[
          { title:'Carrier rate data', icon:<I.box width={20} height={20}/>, color:'var(--blue)', bg:'var(--blue-50)', content:[
            '143 carriers monitored worldwide. 80+ verified directly from official carrier rate cards and pricing tools.',
            'Rates reviewed and updated weekly, every Monday.',
            'We do NOT scrape dynamic prices, login-gated quotes, or negotiated contract rates.',
            'Verified rates are accurate within ±10%. Estimated rates (smaller/regional carriers) are accurate within ±20-30%.',
            'Always confirm the final price with your carrier before shipping.',
          ]},
          { title:'GRI tracking', icon:<I.clock width={20} height={20}/>, color:'var(--good)', bg:'var(--good-50)', content:[
            'General Rate Increases (GRI) are applied within 1 week of carrier announcements.',
            '2026 GRI applied: DHL +4.9%, FedEx +5.9%, UPS +5.9%.',
            'GRI changes are reflected in all affected rate calculations automatically.',
          ]},
          { title:'Customs & duty data', icon:<I.shield width={20} height={20}/>, color:'var(--accent)', bg:'var(--accent-50)', content:[
            '40+ government sources used for customs data, including WTO, EU TARIC, US USITC, UK HMRC, and CBSA.',
            'Customs duty rates and de minimis thresholds updated monthly.',
            'Trade agreement preferential rates included (USMCA, EU FTAs, CPTPP, RCEP).',
            'WCO Harmonized System used for HS code classification.',
          ]},
          { title:'Currency & exchange rates', icon:<I.box width={20} height={20}/>, color:'var(--blue)', bg:'var(--blue-50)', content:[
            'Exchange rates sourced from the European Central Bank (ECB).',
            'Updated daily at 16:00 CET.',
            '30+ currencies supported.',
          ]},
          { title:'Update schedule', icon:<I.clock width={20} height={20}/>, color:'var(--good)', bg:'var(--good-50)', content:[
            'Carrier rates: weekly (every Monday).',
            'Customs & duty data: monthly.',
            'Exchange rates: daily (16:00 CET).',
            'Last full audit: March 2026.',
          ]},
          { title:'What we don\'t do', icon:<I.x width={20} height={20}/>, color:'var(--muted)', bg:'var(--line-2)', content:[
            'We don\'t use AI or machine learning to generate or predict rates.',
            'We don\'t have negotiated contracts with carriers — we show published rates.',
            'We don\'t take commissions or referral fees from any carrier.',
            'We don\'t guarantee rate accuracy — rates are estimates, not binding quotes.',
          ]},
        ].map((s,i)=>(
          <div key={i} style={{marginBottom:40, padding:32, background:'#fff', borderRadius:20, border:'1px solid var(--line)'}}>
            <div style={{display:'flex', alignItems:'center', gap:14, marginBottom:20}}>
              <div style={{width:44, height:44, borderRadius:12, background:s.bg, color:s.color, display:'grid', placeItems:'center'}}>{s.icon}</div>
              <h2 style={{margin:0, fontSize:22, fontWeight:700}}>{s.title}</h2>
            </div>
            <ul style={{margin:0, padding:'0 0 0 20px', display:'flex', flexDirection:'column', gap:10}}>
              {s.content.map((c,j)=>(
                <li key={j} style={{fontSize:15, color:'var(--body)', lineHeight:1.6}}>{c}</li>
              ))}
            </ul>
          </div>
        ))}

        <div style={{padding:'24px 28px', background:'var(--bg)', borderRadius:14, border:'1px solid var(--line)', textAlign:'center'}}>
          <p style={{margin:0, fontSize:15, color:'var(--body)'}}>Found an error in our data? <a href="mailto:info@rateships.com" style={{color:'var(--blue)', fontWeight:600}}>Report it at info@rateships.com</a> — we investigate every report within 1 week.</p>
        </div>
      </div></section>
    </>
  );
}
