"use client";
import { I, SectionHead } from "./V2Shared";
import React, { useState } from "react";

export default function DeliveryEstimatorPage(){
  const [from, setFrom] = useState('United States');
  const [to, setTo] = useState('United Kingdom');
  const carriers = [
    {name:'DHL Express', days:'2-3', type:'Express'}, {name:'FedEx Intl Priority', days:'2-4', type:'Express'},
    {name:'UPS Worldwide Saver', days:'3-4', type:'Express'}, {name:'EMS', days:'6-10', type:'Postal'},
    {name:'USPS Priority Mail Intl', days:'6-10', type:'Postal'}, {name:'Landmark Global', days:'5-12', type:'Economy'},
    {name:'Asendia', days:'7-14', type:'Economy'}, {name:'Passport Shipping', days:'1-3', type:'Express'},
  ];

  return (
    <>
      <section style={{padding:'72px 32px 48px', borderBottom:'1px solid var(--line)', position:'relative'}}>
        <div aria-hidden style={{position:'absolute', inset:0, background:'radial-gradient(800px 400px at 60% -10%, rgba(242,201,76,.08), transparent 60%)'}}/>
        <div style={{position:'relative', maxWidth:1240, margin:'0 auto'}}>
          <h1 style={{margin:'0 0 18px', fontSize:'clamp(40px,5vw,64px)', lineHeight:1.02, letterSpacing:'-.03em', fontWeight:800}}>
            Delivery time <span style={{color:'var(--blue)'}}>estimator.</span>
          </h1>
          <p style={{fontSize:19, color:'var(--body)', maxWidth:600}}>Estimate transit times for express, standard, and economy shipments between any two countries. Based on published carrier transit data.</p>
        </div>
      </section>

      <section style={{padding:'64px 32px'}}>
        <div style={{maxWidth:1240, margin:'0 auto'}}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 2fr', gap:32}} className="two-col">
            {/* Form */}
            <div style={{background:'#fff', borderRadius:20, border:'1px solid var(--line)', padding:28, boxShadow:'var(--shadow-sm)'}}>
              <div style={{fontSize:12, fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:20}}>Estimate transit time</div>
              <div style={{display:'flex', flexDirection:'column', gap:12}}>
                <label style={{display:'block', background:'var(--bg)', border:'1px solid var(--line)', borderRadius:12, padding:'10px 14px'}}>
                  <div style={{fontSize:11, fontWeight:600, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.06em'}}>From</div>
                  <select value={from} onChange={e=>setFrom(e.target.value)} style={{width:'100%', border:'none', outline:'none', background:'transparent', fontSize:15, fontWeight:600, marginTop:4, appearance:'none'}}>
                    {['United States','Germany','China','United Kingdom','Japan','Australia','Brazil'].map(c=><option key={c}>{c}</option>)}
                  </select>
                </label>
                <label style={{display:'block', background:'var(--bg)', border:'1px solid var(--line)', borderRadius:12, padding:'10px 14px'}}>
                  <div style={{fontSize:11, fontWeight:600, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.06em'}}>To</div>
                  <select value={to} onChange={e=>setTo(e.target.value)} style={{width:'100%', border:'none', outline:'none', background:'transparent', fontSize:15, fontWeight:600, marginTop:4, appearance:'none'}}>
                    {['United Kingdom','Germany','France','United States','India','Brazil','Mexico'].map(c=><option key={c}>{c}</option>)}
                  </select>
                </label>
                <button style={{padding:'14px', borderRadius:12, background:'var(--blue)', color:'#fff', fontWeight:700, fontSize:15, border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8}}>
                  <I.clock width={16} height={16}/> Estimate delivery
                </button>
              </div>
            </div>

            {/* Results */}
            <div>
              <div style={{fontSize:14, color:'var(--muted)', marginBottom:16}}>Estimated transit times for <b style={{color:'var(--ink)'}}>{from} → {to}</b></div>
              <div style={{display:'flex', flexDirection:'column', gap:10}}>
                {carriers.map((c,i)=>(
                  <div key={i} style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:16, padding:'18px 24px', background:'#fff', border:'1px solid var(--line)', borderRadius:14, alignItems:'center'}}>
                    <div style={{fontWeight:700, fontSize:15}}>{c.name}</div>
                    <div className="tnum" style={{fontSize:16, fontWeight:800, color:'var(--blue)'}}>{c.days} days</div>
                    <span style={{fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:999, textAlign:'center', background: c.type==='Express'?'var(--accent-50)':c.type==='Postal'?'var(--blue-50)':'var(--warm-50)', color: c.type==='Express'?'var(--accent)':c.type==='Postal'?'var(--blue)':'#A37A00'}}>{c.type}</span>
                  </div>
                ))}
              </div>
              <div style={{marginTop:16, padding:'14px 18px', background:'var(--bg)', borderRadius:12, border:'1px solid var(--line)', fontSize:12, color:'var(--muted)', display:'flex', alignItems:'center', gap:10}}>
                <I.shield width={14} height={14} style={{color:'var(--blue)', flexShrink:0}}/>
                Transit times are estimates based on published carrier data. Actual delivery may vary due to customs clearance, weather, and peak seasons.
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
