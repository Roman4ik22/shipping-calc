"use client";
import { I, SectionHead } from "./V2Shared";
import React from "react";

export default function ContactPage(){
  return (
    <>
      <section style={{padding:'72px 32px 48px', borderBottom:'1px solid var(--line)', position:'relative'}}>
        <div aria-hidden style={{position:'absolute', inset:0, background:'radial-gradient(800px 400px at 50% -10%, rgba(26,115,232,.08), transparent 60%)'}}/>
        <div style={{position:'relative', maxWidth:1240, margin:'0 auto'}}>
          <h1 style={{margin:'0 0 18px', fontSize:'clamp(40px,5vw,64px)', lineHeight:1.02, letterSpacing:'-.03em', fontWeight:800}}>
            Get in <span style={{color:'var(--blue)'}}>touch.</span>
          </h1>
          <p style={{fontSize:19, color:'var(--body)', maxWidth:600}}>We respond within 24 hours. Real people, not bots.</p>
        </div>
      </section>

      <section style={{padding:'64px 32px 96px'}}>
        <div style={{maxWidth:1240, margin:'0 auto'}}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:20}} className="tools-grid">
            {[
              { icon:<I.mail width={22} height={22}/>, color:'var(--blue)', bg:'var(--blue-50)', title:'Email', value:'info@rateships.com', desc:'General questions, feedback, partnerships', href:'mailto:info@rateships.com' },
              { icon:<I.box width={22} height={22}/>, color:'var(--accent)', bg:'var(--accent-50)', title:'Carrier suggestions', value:'Missing a carrier?', desc:'Tell us which carrier to add next — we integrate within 30 days', href:'mailto:info@rateships.com?subject=Carrier suggestion' },
              { icon:<I.globe width={22} height={22}/>, color:'var(--good)', bg:'var(--good-50)', title:'Data corrections', value:'Found an error?', desc:'Report incorrect rates, duty data, or country information', href:'mailto:info@rateships.com?subject=Data correction' },
            ].map((c,i)=>(
              <a key={i} href={c.href} style={{background:'#fff', borderRadius:20, border:'1px solid var(--line)', padding:32, display:'flex', flexDirection:'column', gap:16, textDecoration:'none', color:'inherit', transition:'all .2s'}} className="team-card">
                <div style={{width:48, height:48, borderRadius:14, background:c.bg, color:c.color, display:'grid', placeItems:'center'}}>{c.icon}</div>
                <div>
                  <div style={{fontSize:12, fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:4}}>{c.title}</div>
                  <div style={{fontSize:20, fontWeight:700, marginBottom:6}}>{c.value}</div>
                  <p style={{margin:0, fontSize:14, color:'var(--body)', lineHeight:1.5}}>{c.desc}</p>
                </div>
              </a>
            ))}
          </div>

          <div style={{marginTop:48, display:'grid', gridTemplateColumns:'1fr 1fr', gap:20}} className="two-col">
            <div style={{background:'var(--ink)', borderRadius:20, padding:36, color:'#fff'}}>
              <div style={{fontSize:12, fontWeight:700, color:'var(--warm)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:12}}>Legal entity</div>
              <h3 style={{margin:'0 0 16px', fontSize:22, fontWeight:700}}>Global Supply KFT</h3>
              <div style={{display:'flex', flexDirection:'column', gap:10, fontSize:14, color:'rgba(255,255,255,.7)'}}>
                <div><b style={{color:'#fff'}}>Address:</b> Toldi utca 4, Kutasó, Hungary (3066)</div>
                <div><b style={{color:'#fff'}}>EU VAT:</b> HU26179030</div>
                <div><b style={{color:'#fff'}}>Email:</b> info@rateships.com</div>
                <div><b style={{color:'#fff'}}>Founded:</b> 2026</div>
              </div>
            </div>
            <div style={{background:'var(--bg)', borderRadius:20, border:'1px solid var(--line)', padding:36}}>
              <div style={{fontSize:12, fontWeight:700, color:'var(--blue)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:12}}>Response times</div>
              <h3 style={{margin:'0 0 16px', fontSize:22, fontWeight:700}}>What to expect</h3>
              <div style={{display:'flex', flexDirection:'column', gap:14}}>
                {[
                  ['General inquiries','Within 24 hours'],
                  ['Carrier suggestions','Within 48 hours'],
                  ['Data corrections','Within 1 week'],
                  ['Partnership proposals','Within 3 business days'],
                ].map(([q,a])=>(
                  <div key={q} style={{display:'flex', justifyContent:'space-between', alignItems:'center', paddingBottom:10, borderBottom:'1px solid var(--line-2)'}}>
                    <span style={{fontSize:14, color:'var(--body)'}}>{q}</span>
                    <span style={{fontSize:13, fontWeight:700, color:'var(--ink)'}}>{a}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
