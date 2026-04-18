"use client";
import React from "react";
const updates = [
  {date:'Apr 16, 2026', title:'SSL certificate fixed — site back online', tags:['Fix','Infrastructure'], items:['Caddy proxy was missing rateships.com configuration','Let\'s Encrypt certificate auto-issued on fix','Site fully operational']},
  {date:'Apr 15, 2026', title:'New design system started', tags:['Design'], items:['Claude Design prototype for Homepage, About, Pricing, Customs','Royal Blue #1A73E8 + warm ivory palette finalized','21 pages wireframed in Relume, 4 pages in hi-fi']},
  {date:'Apr 2026', title:'GSC integration & SEO audit', tags:['SEO'], items:['Connected Google Search Console API','742 clicks, 158K impressions in first 28 days','Identified: duplicate meta descriptions, missing OG tags, sitemap gaps']},
  {date:'Mar 2026', title:'Public launch', tags:['Launch'], items:['134 carriers across 213 countries','Customs duty calculator with HS-code lookup','Delivery time estimator','12 language versions','45,000+ shipping routes']},
];
export default function UpdatesPage(){
  return (<>
    <section style={{padding:'72px 32px 48px', borderBottom:'1px solid var(--line)'}}><div style={{maxWidth:800, margin:'0 auto'}}>
      <h1 style={{margin:'0 0 18px', fontSize:'clamp(36px,4vw,52px)', fontWeight:800, letterSpacing:'-.02em'}}>Updates.</h1>
      <p style={{fontSize:17, color:'var(--body)'}}>What we've shipped, fixed, and planned.</p>
    </div></section>
    <section style={{padding:'48px 32px 96px'}}><div style={{maxWidth:800, margin:'0 auto'}}>
      {updates.map((u,i)=>(
        <div key={i} style={{marginBottom:32, padding:28, background:'#fff', borderRadius:20, border:'1px solid var(--line)'}}>
          <div style={{fontSize:13, fontWeight:700, color:'var(--blue)', marginBottom:8}}>{u.date}</div>
          <h2 style={{margin:'0 0 12px', fontSize:20, fontWeight:700}}>{u.title}</h2>
          <div style={{display:'flex', gap:6, marginBottom:14}}>
            {u.tags.map(t=><span key={t} style={{fontSize:11, fontWeight:700, padding:'2px 10px', borderRadius:999, background: t==='Fix'?'var(--accent-50)':t==='Launch'?'var(--good-50)':t==='SEO'?'var(--warm-50)':'var(--blue-50)', color: t==='Fix'?'var(--accent)':t==='Launch'?'var(--good)':t==='SEO'?'#A37A00':'var(--blue)'}}>{t}</span>)}
          </div>
          <ul style={{margin:0, padding:'0 0 0 18px', display:'flex', flexDirection:'column', gap:6}}>
            {u.items.map((item,j)=><li key={j} style={{fontSize:14, color:'var(--body)', lineHeight:1.5}}>{item}</li>)}
          </ul>
        </div>
      ))}
    </div></section>
  </>);
}
