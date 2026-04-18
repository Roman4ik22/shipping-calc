"use client";
import { I, SectionHead } from "./V2Shared";
import React from "react";

const posts = [
  { title:'Shipping K-Pop Merch from South Korea', tags:['korea','guide'], date:'Mar 18, 2026' },
  { title:'How to Handle International Shipping Returns', tags:['returns','ecommerce'], date:'Mar 17, 2026' },
  { title:'Shipping to the Middle East', tags:['middle-east','guide'], date:'Mar 16, 2026' },
  { title:'How to Choose the Right Shipping Carrier', tags:['carriers','guide'], date:'Mar 15, 2026' },
  { title:'Shipping to Australia', tags:['australia','customs'], date:'Mar 15, 2026' },
  { title:'How to Calculate Shipping Costs', tags:['cost-saving','beginners'], date:'Mar 14, 2026' },
  { title:'Best Shipping Apps for Shopify Stores', tags:['shopify','ecommerce'], date:'Mar 13, 2026' },
  { title:'EU Customs Reform 2026', tags:['eu','customs'], date:'Mar 12, 2026' },
  { title:'How to Ship Fragile Items Internationally', tags:['fragile','packaging'], date:'Mar 11, 2026' },
  { title:'Shipping to Europe from the USA', tags:['usa','europe'], date:'Mar 10, 2026' },
  { title:'International Shipping for Small Business', tags:['small-business','guide'], date:'Mar 10, 2026' },
  { title:'DHL vs FedEx vs UPS Comparison', tags:['carriers','comparison'], date:'Mar 5, 2026' },
];

function tagColor(tag){
  const guideish = ['guide','beginners','small-business','cost-saving'];
  const customsish = ['customs','eu','returns'];
  const ecomish = ['ecommerce','shopify'];
  if(guideish.includes(tag)) return {bg:'var(--blue-50)', color:'var(--blue)'};
  if(customsish.includes(tag)) return {bg:'var(--accent-50)', color:'var(--accent)'};
  if(ecomish.includes(tag)) return {bg:'var(--warm-50)', color:'#A37A00'};
  return {bg:'var(--line-2)', color:'var(--muted)'};
}

export default function BlogPage(){
  return (
    <>
      <section style={{padding:'72px 32px 48px', borderBottom:'1px solid var(--line)', position:'relative'}}>
        <div aria-hidden style={{position:'absolute', inset:0, background:'radial-gradient(800px 400px at 70% -10%, rgba(232,92,58,.06), transparent 60%)'}}/>
        <div style={{position:'relative', maxWidth:1240, margin:'0 auto'}}>
          <h1 style={{margin:'0 0 18px', fontSize:'clamp(40px,5vw,64px)', lineHeight:1.02, letterSpacing:'-.03em', fontWeight:800}}>
            Shipping <span style={{color:'var(--blue)'}}>intelligence.</span>
          </h1>
          <p style={{fontSize:19, color:'var(--body)', maxWidth:600}}>Practical guides, carrier comparisons, and customs explainers — written by people who actually ship things.</p>
        </div>
      </section>

      <section style={{padding:'64px 32px 96px'}}>
        <div style={{maxWidth:1240, margin:'0 auto'}}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:20}} className="two-col">
            {posts.map((p,i)=>(
              <a key={i} href={`/blog/${p.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,'')}`} style={{background:'#fff', border:'1px solid var(--line)', borderRadius:20, padding:28, display:'flex', flexDirection:'column', gap:14, textDecoration:'none', color:'inherit', transition:'all .2s'}} className="team-card">
                <div style={{display:'flex', gap:8, alignItems:'center', flexWrap:'wrap'}}>
                  {p.tags.map((t,ti)=>{
                    const tc = tagColor(t);
                    return <span key={ti} style={{fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:999, background:tc.bg, color:tc.color}}>{t}</span>;
                  })}
                  <span style={{fontSize:12, color:'var(--muted)', marginLeft:'auto'}}>{p.date}</span>
                </div>
                <h3 style={{margin:0, fontSize:20, fontWeight:700, letterSpacing:'-.01em', lineHeight:1.25}}>{p.title}</h3>
                <span style={{fontSize:14, fontWeight:600, color:'var(--blue)', display:'inline-flex', alignItems:'center', gap:6, marginTop:'auto'}}>Read article <I.arrow width={14} height={14}/></span>
              </a>
            ))}
          </div>

          <div style={{marginTop:40, textAlign:'center'}}>
            <a href="/blog" style={{fontSize:17, fontWeight:700, color:'var(--blue)', textDecoration:'none'}}>See all 31 articles &rarr;</a>
            <p style={{fontSize:14, color:'var(--muted)', marginTop:8}}>Updated weekly. <a href="mailto:info@rateships.com" style={{color:'var(--blue)', fontWeight:600}}>Suggest a topic</a></p>
          </div>
        </div>
      </section>
    </>
  );
}
