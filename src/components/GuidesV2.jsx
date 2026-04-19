"use client";
import { I, SectionHead } from "./V2Shared";
import React from "react";

const REGIONS = [
  { name:'Europe', flag:'🇪🇺', countries:['United Kingdom','Germany','France','Italy','Spain','Netherlands','Poland','Sweden','Switzerland','Austria'] },
  { name:'North America', flag:'🇺🇸', countries:['United States','Canada','Mexico','Dominican Republic','Costa Rica','Jamaica'] },
  { name:'Asia-Pacific', flag:'🇯🇵', countries:['China','Japan','South Korea','India','Indonesia','Thailand','Vietnam','Singapore','Australia','New Zealand'] },
  { name:'Middle East', flag:'🇦🇪', countries:['UAE','Saudi Arabia','Israel','Qatar','Kuwait','Bahrain','Oman','Jordan'] },
  { name:'Africa', flag:'🇿🇦', countries:['South Africa','Nigeria','Egypt','Kenya','Morocco','Ghana','Ethiopia','Tanzania'] },
  { name:'Latin America', flag:'🇧🇷', countries:['Brazil','Argentina','Chile','Colombia','Peru','Ecuador','Venezuela'] },
];

export default function GuidesPage(){
  return (
    <>
      <section style={{padding:'72px 32px 48px', borderBottom:'1px solid var(--line)', position:'relative'}}>
        <div aria-hidden style={{position:'absolute', inset:0, background:'radial-gradient(800px 400px at 30% -10%, rgba(26,115,232,.08), transparent 60%)'}}/>
        <div style={{position:'relative', maxWidth:1240, margin:'0 auto'}}>
          <h1 style={{margin:'0 0 18px', fontSize:'clamp(40px,5vw,64px)', lineHeight:1.02, letterSpacing:'-.03em', fontWeight:800}}>
            Shipping guides for<br/><span style={{color:'var(--blue)'}}>213 countries.</span>
          </h1>
          <p style={{fontSize:19, color:'var(--body)', maxWidth:600}}>Customs rules, duty thresholds, required documents, prohibited items, and top carriers — for every destination we cover.</p>
        </div>
      </section>

      <section style={{padding:'64px 32px 96px'}}>
        <div style={{maxWidth:1240, margin:'0 auto'}}>
          {REGIONS.map(r=>(
            <div key={r.name} style={{marginBottom:48}}>
              <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:20}}>
                <span style={{fontSize:24}}>{r.flag}</span>
                <h2 style={{margin:0, fontSize:24, fontWeight:800}}>{r.name}</h2>
                <span style={{fontSize:13, color:'var(--muted)', fontWeight:500}}>{r.countries.length} countries</span>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:10}} className="tools-grid">
                {r.countries.map(c=>(
                  <a key={c} href="#" style={{padding:'16px 18px', background:'#fff', border:'1px solid var(--line)', borderRadius:12, fontSize:14, fontWeight:600, color:'var(--ink)', display:'flex', alignItems:'center', justifyContent:'space-between', transition:'all .2s'}} className="team-card">
                    {c}
                    <I.arrow width={14} height={14} style={{color:'var(--muted)'}}/>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
