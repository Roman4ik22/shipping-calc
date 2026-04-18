"use client";
import { I, SectionHead } from "./V2Shared";
import React, { useState } from "react";

const CARRIERS = [
  // International (4)
  { name:'DHL Express', type:'International', countries:220, speed:'1-5 days', letters:'DHL', bg:'#FFCC00', fg:'#D40511', desc:'World\'s leading international express delivery company. Operates in 220+ countries.' },
  { name:'FedEx', type:'International', countries:220, speed:'1-5 days', letters:'FDX', bg:'#4D148C', fg:'#FF6600', desc:'Global courier delivery services. One of the largest express transportation companies.' },
  { name:'UPS', type:'International', countries:220, speed:'1-5 days', letters:'UPS', bg:'#351C15', fg:'#FFB500', desc:'United Parcel Service — one of the world\'s largest package delivery companies.' },
  { name:'TNT (FedEx)', type:'International', countries:200, speed:'2-7 days', letters:'TNT', bg:'#FF6600', fg:'#FFF', desc:'International courier service, now part of FedEx. Strong European network.' },
  // Regional (top 20 of 94)
  { name:'SF Express', type:'Regional', countries:50, speed:'3-7 days', letters:'SF', bg:'#000', fg:'#FFF', desc:'China\'s largest express carrier. Strong Asia-Pacific network.' },
  { name:'Aramex', type:'Regional', countries:65, speed:'2-7 days', letters:'ARX', bg:'#E32219', fg:'#FFF', desc:'Middle East and South Asia specialist with express and freight.' },
  { name:'CDEK', type:'Regional', countries:20, speed:'5-14 days', letters:'CDK', bg:'#00923E', fg:'#FFF', desc:'Leading Russian and CIS courier service.' },
  { name:'DPD', type:'Regional', countries:40, speed:'1-3 days', letters:'DPD', bg:'#DC0032', fg:'#FFF', desc:'European parcel leader. 1-2 day intra-EU delivery.' },
  { name:'J&T Express', type:'Regional', countries:13, speed:'3-7 days', letters:'J&T', bg:'#E31E24', fg:'#FFF', desc:'Southeast Asian express delivery, expanding globally.' },
  { name:'Ninja Van', type:'Regional', countries:6, speed:'2-5 days', letters:'NV', bg:'#C41515', fg:'#FFF', desc:'Southeast Asian logistics company serving 6 countries.' },
  { name:'Cainiao', type:'Regional', countries:50, speed:'7-21 days', letters:'CN', bg:'#FF6A00', fg:'#FFF', desc:'AliExpress logistics arm. Economy shipping from China.' },
  { name:'Yanwen Express', type:'Regional', countries:30, speed:'10-25 days', letters:'YW', bg:'#005BAC', fg:'#FFF', desc:'Chinese cross-border e-commerce logistics provider.' },
  { name:'Delhivery', type:'Regional', countries:15, speed:'3-7 days', letters:'DEL', bg:'#2B45D4', fg:'#FFF', desc:'India\'s largest e-commerce logistics company.' },
  { name:'Blue Dart', type:'Regional', countries:220, speed:'2-5 days', letters:'BD', bg:'#003DA5', fg:'#FFF', desc:'India\'s premier express air and integrated transportation company. DHL Group.' },
  { name:'Evri', type:'Regional', countries:2, speed:'3-5 days', letters:'EVR', bg:'#7B2D8E', fg:'#FFF', desc:'UK parcel delivery, formerly Hermes. Affordable domestic and EU shipping.' },
  { name:'GLS', type:'Regional', countries:40, speed:'2-5 days', letters:'GLS', bg:'#FFC600', fg:'#003087', desc:'European parcel service with strong B2B focus.' },
  { name:'PostNL', type:'Regional', countries:30, speed:'2-5 days', letters:'PNL', bg:'#FF6600', fg:'#FFF', desc:'Dutch postal and e-commerce logistics operator.' },
  { name:'Colissimo', type:'Regional', countries:30, speed:'3-7 days', letters:'COL', bg:'#003DA5', fg:'#FFD700', desc:'La Poste international parcel service from France.' },
  { name:'Landmark Global', type:'Regional', countries:40, speed:'5-12 days', letters:'LG', bg:'#1B365D', fg:'#FFF', desc:'Economy international parcel delivery. Often the cheapest option.' },
  { name:'Asendia', type:'Regional', countries:200, speed:'7-14 days', letters:'ASN', bg:'#E4002B', fg:'#FFF', desc:'Joint venture of La Poste and Swiss Post for international mail.' },
  { name:'Passport Shipping', type:'Regional', countries:40, speed:'1-5 days', letters:'PSP', bg:'#1A1A2E', fg:'#FFF', desc:'Cross-border e-commerce shipping for DTC brands.' },
  { name:'Pitney Bowes', type:'Regional', countries:100, speed:'3-10 days', letters:'PB', bg:'#0078D4', fg:'#FFF', desc:'Global technology company with e-commerce shipping solutions.' },
  { name:'GlobalPost', type:'Regional', countries:30, speed:'6-10 days', letters:'GP', bg:'#333', fg:'#FFF', desc:'Economy international shipping for e-commerce.' },
  // Postal (top 12 of 36)
  { name:'EMS', type:'Postal', countries:190, speed:'3-10 days', letters:'EMS', bg:'#0F3C8A', fg:'#FFD400', desc:'Express mail service offered by postal operators worldwide.' },
  { name:'USPS', type:'Postal', countries:190, speed:'6-14 days', letters:'USPS', bg:'#333E6B', fg:'#FFF', desc:'United States Postal Service. Priority Mail International and First Class.' },
  { name:'Royal Mail', type:'Postal', countries:190, speed:'5-12 days', letters:'RM', bg:'#E2001A', fg:'#FFF', desc:'UK postal service with Parcelforce express option.' },
  { name:'Deutsche Post', type:'Postal', countries:190, speed:'7-14 days', letters:'DP', bg:'#FFCC00', fg:'#333', desc:'German postal service. DHL Paket for domestic, international parcels.' },
  { name:'Japan Post', type:'Postal', countries:120, speed:'5-14 days', letters:'JP', bg:'#CC0000', fg:'#FFF', desc:'Reliable EMS and economy air/surface from Japan.' },
  { name:'China Post', type:'Postal', countries:190, speed:'10-30 days', letters:'CP', bg:'#006633', fg:'#FFF', desc:'China\'s national postal service. Economy international shipping.' },
  { name:'Australia Post', type:'Postal', countries:190, speed:'6-14 days', letters:'AP', bg:'#E3001B', fg:'#FFF', desc:'Parcel and express services from Australia.' },
  { name:'Canada Post', type:'Postal', countries:190, speed:'6-12 days', letters:'CA', bg:'#E31937', fg:'#FFF', desc:'Canadian national postal service with international tracked options.' },
  { name:'India Post', type:'Postal', countries:190, speed:'10-21 days', letters:'IN', bg:'#FF0000', fg:'#FFF', desc:'India\'s postal service with EMS and international registered options.' },
  { name:'Correos', type:'Postal', countries:190, speed:'7-14 days', letters:'COR', bg:'#FFCC00', fg:'#003DA5', desc:'Spain\'s national postal operator.' },
  { name:'Correios', type:'Postal', countries:190, speed:'10-21 days', letters:'CRB', bg:'#009639', fg:'#FFD700', desc:'Brazil\'s postal service. SEDEX and PAC international.' },
  { name:'Korea Post', type:'Postal', countries:190, speed:'7-14 days', letters:'KR', bg:'#E31E24', fg:'#FFF', desc:'South Korea national postal service with K-Packet e-commerce option.' },
];

function CarrierCard({c}){
  return (
    <a href="#" style={{background:'#fff', border:'1px solid var(--line)', borderRadius:16, padding:24, display:'flex', gap:18, alignItems:'flex-start', transition:'all .2s', textDecoration:'none', color:'inherit'}} className="team-card">
      <div style={{width:48, height:48, borderRadius:12, background:c.bg, color:c.fg, display:'grid', placeItems:'center', fontSize:13, fontWeight:800, letterSpacing:'.02em', flexShrink:0, boxShadow:'inset 0 0 0 1px rgba(0,0,0,.06)'}}>{c.letters}</div>
      <div style={{flex:1, minWidth:0}}>
        <div style={{display:'flex', alignItems:'center', gap:8, flexWrap:'wrap'}}>
          <span style={{fontWeight:700, fontSize:16}}>{c.name}</span>
          <span style={{fontSize:11, fontWeight:600, padding:'2px 8px', borderRadius:999, background: c.type==='International'?'var(--blue-50)':c.type==='Regional'?'var(--accent-50)':'var(--warm-50)', color: c.type==='International'?'var(--blue)':c.type==='Regional'?'var(--accent)':'#A37A00'}}>{c.type}</span>
        </div>
        <p style={{margin:'6px 0 10px', fontSize:13, color:'var(--body)', lineHeight:1.5}}>{c.desc}</p>
        <div style={{display:'flex', gap:16, fontSize:12, color:'var(--muted)'}}>
          <span style={{display:'inline-flex', alignItems:'center', gap:4}}><I.globe width={12} height={12}/> {c.countries} countries</span>
          <span style={{display:'inline-flex', alignItems:'center', gap:4}}><I.star width={12} height={12} style={{color:'var(--warm)'}}/> {c.rating}/5</span>
          <span style={{display:'inline-flex', alignItems:'center', gap:4}}><I.clock width={12} height={12}/> {c.speed}</span>
        </div>
      </div>
      <I.arrow width={16} height={16} style={{color:'var(--muted)', flexShrink:0, marginTop:4}}/>
    </a>
  );
}

export default function CarriersPage(){
  const [filter, setFilter] = useState('All');
  const types = ['All','International','Regional','Postal'];
  const filtered = filter==='All' ? CARRIERS : CARRIERS.filter(c=>c.type===filter);

  return (
    <>
      <section style={{position:'relative', overflow:'hidden', padding:'72px 32px 48px', borderBottom:'1px solid var(--line)'}}>
        <div aria-hidden style={{position:'absolute', inset:0, background:'radial-gradient(900px 400px at 70% -10%, rgba(26,115,232,.08), transparent 60%)'}}/>
        <div style={{position:'relative', maxWidth:1240, margin:'0 auto'}}>
          <div style={{display:'inline-flex', alignItems:'center', gap:8, padding:'6px 12px', borderRadius:999, background:'#fff', border:'1px solid var(--line)', fontSize:12, fontWeight:600, color:'var(--ink-2)', boxShadow:'var(--shadow-sm)', marginBottom:20}}>
            <I.box width={14} height={14} style={{color:'var(--blue)'}}/> 134 carriers · 4 international · 94 regional · 36 postal
          </div>
          <h1 style={{margin:'0 0 18px', fontSize:'clamp(40px, 5vw, 64px)', lineHeight:1.02, letterSpacing:'-.03em', fontWeight:800}}>
            Every carrier,<br/><span style={{color:'var(--blue)'}}>one search.</span>
          </h1>
          <p style={{fontSize:19, color:'var(--body)', lineHeight:1.55, maxWidth:600, margin:0}}>
            Browse all 134 carriers we compare — from global express giants to regional specialists and national postal services across 213 countries.
          </p>
        </div>
      </section>

      <section style={{padding:'48px 32px 96px'}}>
        <div style={{maxWidth:1240, margin:'0 auto'}}>
          <div style={{display:'flex', gap:8, marginBottom:32}}>
            {types.map(t=>(
              <button key={t} onClick={()=>setFilter(t)} style={{padding:'8px 16px', borderRadius:999, fontSize:13, fontWeight:600, border:'1px solid '+(filter===t?'var(--ink)':'var(--line)'), background:filter===t?'var(--ink)':'#fff', color:filter===t?'#fff':'var(--body)', cursor:'pointer'}}>{t}{t!=='All'?` (${CARRIERS.filter(c=>c.type===t).length})`:''}</button>
            ))}
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}} className="two-col">
            {filtered.map(c=> <CarrierCard key={c.name} c={c}/>)}
          </div>
          <div style={{marginTop:32, padding:'20px 24px', background:'var(--bg)', borderRadius:14, border:'1px solid var(--line)', display:'flex', alignItems:'center', gap:16, flexWrap:'wrap'}}>
            <I.shield width={18} height={18} style={{color:'var(--blue)'}}/>
            <div style={{flex:1}}>
              <div style={{fontWeight:700, fontSize:14}}>This is a sample of our carrier database.</div>
              <div style={{fontSize:13, color:'var(--muted)', marginTop:2}}>The full platform compares 134 carriers including 94 regional and 36 postal services. Rate data from published carrier tariffs, updated weekly.</div>
            </div>
            <a href="/v2" style={{padding:'10px 18px', borderRadius:10, background:'var(--ink)', color:'#fff', fontWeight:600, fontSize:14, display:'inline-flex', alignItems:'center', gap:6, whiteSpace:'nowrap'}}>Compare rates <I.arrow width={14} height={14}/></a>
          </div>
        </div>
      </section>
    </>
  );
}
