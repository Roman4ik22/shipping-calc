"use client";
import { I, SectionHead } from "./V2Shared";
import React from "react";

export default function ToolsPage(){
  const tools = [
    { icon:<I.scale width={24} height={24}/>, color:'var(--accent)', bg:'var(--accent-50)', title:'Customs Duty Calculator', desc:'Calculate import duties, VAT/GST, and total landed cost for any destination. Covers 213 countries with HS-code lookup.', href:'/v2/customs', cta:'Calculate duties' },
    { icon:<I.clock width={24} height={24}/>, color:'#A37A00', bg:'var(--warm-50)', title:'Delivery Time Estimator', desc:'Estimate transit times for express, standard, and economy shipments between any two countries. Based on carrier transit data.', href:'/v2/tools/delivery', cta:'Estimate delivery' },
    { icon:<I.search width={24} height={24}/>, color:'var(--blue)', bg:'var(--blue-50)', title:'Rate Comparison', desc:'Compare shipping rates from 134+ carriers side-by-side. Filter by price, transit time, or carrier. Export to CSV.', href:'/v2', cta:'Compare rates' },
  ];

  return (
    <>
      <section style={{padding:'72px 32px 48px', borderBottom:'1px solid var(--line)', position:'relative'}}>
        <div aria-hidden style={{position:'absolute', inset:0, background:'radial-gradient(800px 400px at 60% -10%, rgba(232,92,58,.06), transparent 60%)'}}/>
        <div style={{position:'relative', maxWidth:1240, margin:'0 auto'}}>
          <h1 style={{margin:'0 0 18px', fontSize:'clamp(40px,5vw,64px)', lineHeight:1.02, letterSpacing:'-.03em', fontWeight:800}}>
            Free shipping <span style={{color:'var(--blue)'}}>tools.</span>
          </h1>
          <p style={{fontSize:19, color:'var(--body)', maxWidth:600}}>Calculators to estimate costs, duties, and delivery times for international shipments. No signup required.</p>
        </div>
      </section>

      <section style={{padding:'64px 32px 96px'}}>
        <div style={{maxWidth:1240, margin:'0 auto'}}>
          <div style={{display:'grid', gridTemplateColumns:'1fr', gap:24}}>
            {tools.map((t,i)=>(
              <a key={i} href={t.href} style={{display:'grid', gridTemplateColumns:'auto 1fr auto', gap:28, alignItems:'center', padding:32, background:'#fff', border:'1px solid var(--line)', borderRadius:20, boxShadow:'var(--shadow-sm)', transition:'all .2s', textDecoration:'none', color:'inherit'}} className="team-card">
                <div style={{width:64, height:64, borderRadius:16, background:t.bg, color:t.color, display:'grid', placeItems:'center'}}>{t.icon}</div>
                <div>
                  <h3 style={{margin:'0 0 6px', fontSize:22, fontWeight:700}}>{t.title}</h3>
                  <p style={{margin:0, fontSize:15, color:'var(--body)', lineHeight:1.55, maxWidth:560}}>{t.desc}</p>
                </div>
                <div style={{padding:'12px 20px', borderRadius:12, background:'var(--ink)', color:'#fff', fontWeight:600, fontSize:14, display:'inline-flex', alignItems:'center', gap:8, whiteSpace:'nowrap'}}>{t.cta} <I.arrow width={14} height={14}/></div>
              </a>
            ))}
          </div>

          <div style={{marginTop:40, padding:'24px 28px', background:'var(--bg)', borderRadius:16, border:'1px solid var(--line)', textAlign:'center'}}>
            <p style={{margin:0, fontSize:15, color:'var(--body)'}}>All tools are <b style={{color:'var(--ink)'}}>free and don't require signup</b>. Data sourced from published carrier tariffs and customs authority databases. <a href="/v2/methodology" style={{color:'var(--blue)', fontWeight:600}}>Read our methodology →</a></p>
          </div>
        </div>
      </section>
    </>
  );
}
