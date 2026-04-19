"use client";
import React from "react";

const globalPlatforms = [
  {name:'Easyship', desc:'200+ countries, 550+ carrier integrations. Full customs and duties calculation.', coverage:'Global'},
  {name:'ShipEngine', desc:'200+ carrier integrations. API-first platform for developers and businesses.', coverage:'Global'},
  {name:'Shippo', desc:'85+ carrier integrations. Popular with small and mid-size ecommerce businesses.', coverage:'Global'},
  {name:'EasyPost', desc:'100+ carrier integrations. Developer-friendly shipping API.', coverage:'Global'},
  {name:'AfterShip', desc:'859+ carrier integrations. Focused on tracking and post-purchase experience.', coverage:'Global'},
  {name:'Metapack', desc:'400+ carrier integrations. Enterprise delivery management platform.', coverage:'Global'},
  {name:'Sendcloud', desc:'EU-focused shipping platform. Strong European carrier network.', coverage:'EU focus'},
  {name:'ShippyPro', desc:'160+ carrier integrations. Shipping automation for ecommerce.', coverage:'Global'},
];

const regionalCategories = [
  {region:'Europe', count:18, color:'var(--blue)'},
  {region:'North America', count:7, color:'var(--blue)'},
  {region:'India', count:9, color:'var(--accent)'},
  {region:'East Asia', count:8, color:'var(--accent)'},
  {region:'Southeast Asia', count:3, color:'var(--accent)'},
  {region:'Latin America', count:4, color:'#A37A00'},
  {region:'Middle East', count:4, color:'#A37A00'},
  {region:'Oceania', count:4, color:'var(--good)'},
  {region:'Africa', count:5, color:'var(--good)'},
  {region:'CIS / Turkey', count:5, color:'var(--muted)'},
  {region:'Forwarding', count:3, color:'var(--muted)'},
];

export default function PlatformsPage(){
  return (<>
    <section style={{padding:'72px 32px 48px', borderBottom:'1px solid var(--line)', position:'relative'}}>
      <div aria-hidden style={{position:'absolute', inset:0, background:'radial-gradient(800px 400px at 50% -10%, rgba(26,115,232,.08), transparent 60%)'}}/>
      <div style={{position:'relative', maxWidth:1240, margin:'0 auto'}}>
        <h1 style={{margin:'0 0 18px', fontSize:'clamp(40px,5vw,64px)', lineHeight:1.02, letterSpacing:'-.03em', fontWeight:800}}>Shipping <span style={{color:'var(--blue)'}}>platforms.</span></h1>
        <p style={{fontSize:19, color:'var(--body)', maxWidth:600}}>93 shipping platforms tracked worldwide — 23 global and 70 regional. Compare coverage, carrier integrations, and specializations.</p>
      </div>
    </section>

    <section style={{padding:'64px 32px 0'}}><div style={{maxWidth:1240, margin:'0 auto'}}>
      <h2 style={{fontSize:24, fontWeight:700, margin:'0 0 8px'}}>Global platforms</h2>
      <p style={{fontSize:15, color:'var(--muted)', margin:'0 0 24px'}}>23 platforms with worldwide coverage. Key platforms listed below.</p>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}} className="two-col">
        {globalPlatforms.map((p,i)=>(
          <div key={i} style={{background:'#fff', borderRadius:16, border:'1px solid var(--line)', padding:28, display:'flex', flexDirection:'column', gap:12}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <h3 style={{margin:0, fontSize:20, fontWeight:700}}>{p.name}</h3>
              <span style={{fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:999, background:'var(--blue-50)', color:'var(--blue)'}}>{p.coverage}</span>
            </div>
            <p style={{margin:0, fontSize:14, color:'var(--body)', lineHeight:1.5}}>{p.desc}</p>
          </div>
        ))}
      </div>
    </div></section>

    <section style={{padding:'48px 32px 96px'}}><div style={{maxWidth:1240, margin:'0 auto'}}>
      <h2 style={{fontSize:24, fontWeight:700, margin:'0 0 8px'}}>Regional platforms</h2>
      <p style={{fontSize:15, color:'var(--muted)', margin:'0 0 24px'}}>70 platforms across 11 regions, serving local carrier networks and market-specific needs.</p>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16}} className="tools-grid">
        {regionalCategories.map((r,i)=>(
          <div key={i} style={{background:'#fff', borderRadius:16, border:'1px solid var(--line)', padding:24, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <span style={{fontSize:16, fontWeight:700}}>{r.region}</span>
            <span style={{fontSize:14, fontWeight:700, color:r.color}}>{r.count} platforms</span>
          </div>
        ))}
      </div>

      <div style={{marginTop:40, textAlign:'center', padding:'32px', background:'var(--bg)', borderRadius:16, border:'1px solid var(--line)'}}>
        <h3 style={{margin:'0 0 8px', fontSize:20, fontWeight:700}}>Missing a platform?</h3>
        <p style={{margin:'0 0 16px', fontSize:15, color:'var(--body)'}}>We track 93 shipping platforms and add new ones regularly.</p>
        <a href="mailto:info@rateships.com?subject=Platform suggestion" style={{padding:'12px 24px', borderRadius:12, background:'var(--ink)', color:'#fff', fontWeight:600, fontSize:14, textDecoration:'none'}}>Suggest a platform &rarr; info@rateships.com</a>
      </div>
    </div></section>
  </>);
}
