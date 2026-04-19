"use client";

import React from "react";

const { useState, useEffect, useRef } = React;

/* =============================================================
   SHARED PRIMITIVES (kept in sync with Homepage)
============================================================= */

const I = {
  ship: (p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M2 20s2 1 4 1 3-1 4-1 2 1 4 1 3-1 4-1 4-1 4-1"/><path d="M4 18L3 12h18l-1 6"/><path d="M12 4v8M8 8h8"/></svg>,
  arrow: (p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>,
  eye:   (p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>,
  scale: (p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3v18"/><path d="M5 8h14"/><path d="M3 14l3-7 3 7M15 14l3-7 3 7"/><path d="M3 14a3 3 0 006 0M15 14a3 3 0 006 0"/></svg>,
  target:(p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>,
  quote: (p)=> <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M7 7h4v4H8c0 2 1 3 3 3v2c-3 0-5-2-5-5V7zm8 0h4v4h-3c0 2 1 3 3 3v2c-3 0-5-2-5-5V7z"/></svg>,
  check: (p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 6L9 17l-5-5"/></svg>,
  shield:(p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 2l8 3v7c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5l8-3z"/><path d="M9 12l2 2 4-4"/></svg>,
  twitter:(p)=> <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  linkedin:(p)=> <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 11.01-4.12 2.06 2.06 0 01-.01 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0h.01z"/></svg>,
  plane: (p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 12l18-7-7 18-2.5-7.5L3 12z"/></svg>,
  globe: (p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/></svg>,
  receipt:(p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 3v18l3-2 3 2 3-2 3 2 3-2V3H5z"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>,
  code:   (p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M8 6l-6 6 6 6M16 6l6 6-6 6"/></svg>,
  sparkle:(p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5z"/></svg>,
};

/* =============================================================
   NAV
============================================================= */

function Nav(){
  return (
    <header style={{
      position:'sticky', top:0, zIndex:40,
      background:'rgba(250,247,242,.85)', backdropFilter:'saturate(1.2) blur(10px)',
      borderBottom:'1px solid var(--line)',
    }}>
      <div style={{maxWidth:1240, margin:'0 auto', padding:'14px 32px', display:'flex', alignItems:'center', gap:32}}>
        <a href="Homepage.html" style={{display:'flex', alignItems:'center', gap:10}}>
          <div style={{
            width:28, height:28, borderRadius:8,
            background:'linear-gradient(135deg, var(--blue) 0%, #2F88FF 100%)',
            display:'grid', placeItems:'center', color:'#fff',
            boxShadow:'0 4px 10px rgba(26,115,232,.28)'
          }}><I.ship width="16" height="16"/></div>
          <span style={{fontWeight:800, fontSize:17, letterSpacing:'-.01em'}}>RateShips</span>
        </a>
        <nav style={{display:'flex', gap:28, fontSize:14, color:'var(--body)', fontWeight:500}} className="desktop-only">
          <a href="Homepage.html">Rates</a>
          <a href="Homepage.html">Tools</a>
          <a href="Homepage.html">Carriers</a>
          <a href="Homepage.html">API</a>
          <a href="Homepage.html">Pricing</a>
          <a href="#" style={{color:'var(--ink)'}}>About</a>
        </nav>
        <div style={{marginLeft:'auto', display:'flex', alignItems:'center', gap:14}}>
          <a href="#" style={{fontSize:14, fontWeight:500, color:'var(--body)'}} className="desktop-only">Sign in</a>
          <a href="Homepage.html#calc" style={{
            padding:'9px 16px', borderRadius:999, background:'var(--ink)', color:'#fff',
            fontSize:14, fontWeight:600,
          }}>Get started — free</a>
        </div>
      </div>
    </header>
  );
}

/* =============================================================
   HERO
============================================================= */

function Hero(){
  return (
    <section style={{position:'relative', overflow:'hidden', borderBottom:'1px solid var(--line)'}}>
      {/* Abstract shapes: rotating route arcs + floating parcels */}
      <div aria-hidden style={{position:'absolute', inset:0, zIndex:0}}>
        <div style={{position:'absolute', inset:0, background:`
          radial-gradient(1000px 400px at 90% 10%, rgba(26,115,232,.10), transparent 60%),
          radial-gradient(700px 400px at -5% 50%, rgba(232,92,58,.08), transparent 60%)
        `}}/>
        {/* Grid */}
        <div style={{position:'absolute', inset:0, backgroundImage:`
          linear-gradient(var(--line-2) 1px, transparent 1px),
          linear-gradient(90deg, var(--line-2) 1px, transparent 1px)`,
          backgroundSize:'48px 48px',
          maskImage:'linear-gradient(180deg, #000 40%, transparent 100%)'}}/>
        {/* Abstract shipping arcs */}
        <svg viewBox="0 0 1440 600" preserveAspectRatio="none" style={{position:'absolute', inset:0, width:'100%', height:'100%'}}>
          <defs>
            <linearGradient id="arcA" x1="0" x2="1">
              <stop offset="0" stopColor="#1A73E8" stopOpacity=".0"/>
              <stop offset=".5" stopColor="#1A73E8" stopOpacity=".35"/>
              <stop offset="1" stopColor="#1A73E8" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path d="M -50 400 Q 400 100, 800 360 T 1500 300" stroke="url(#arcA)" strokeWidth="1.5" fill="none" strokeDasharray="4 6"/>
          <path d="M -50 500 Q 500 250, 900 480 T 1500 420" stroke="url(#arcA)" strokeWidth="1" fill="none" strokeDasharray="2 5" opacity=".6"/>
        </svg>
        {/* Floating abstract box shapes */}
        <div style={{position:'absolute', top:'30%', right:'8%', width:80, height:80, borderRadius:16,
          background:'linear-gradient(135deg, var(--warm) 0%, #E8B43D 100%)', transform:'rotate(-8deg)',
          boxShadow:'0 20px 40px -10px rgba(242,201,76,.5)'}} className="hero-shape hero-shape-a"/>
        <div style={{position:'absolute', bottom:'18%', right:'22%', width:56, height:56, borderRadius:12,
          background:'var(--accent)', transform:'rotate(12deg)', opacity:.9,
          boxShadow:'0 14px 30px -8px rgba(232,92,58,.5)'}} className="hero-shape hero-shape-b"/>
        <div style={{position:'absolute', top:'22%', right:'30%', width:44, height:44, borderRadius:10,
          background:'#fff', border:'2px solid var(--blue)', transform:'rotate(-4deg)',
          boxShadow:'var(--shadow-md)'}} className="hero-shape hero-shape-c"/>
      </div>

      <div style={{position:'relative', zIndex:1, maxWidth:1240, margin:'0 auto', padding:'96px 32px 112px'}}>
        <div style={{maxWidth:820}}>
          <div style={{
            display:'inline-flex', alignItems:'center', gap:8,
            padding:'6px 12px 6px 8px', borderRadius:999,
            background:'#fff', border:'1px solid var(--line)',
            fontSize:12, fontWeight:600, color:'var(--ink-2)',
            boxShadow:'var(--shadow-sm)'
          }}>
            <span style={{width:6, height:6, borderRadius:999, background:'var(--accent)'}}/>
            About RateShips · Founded 2026 · Hungary
          </div>
          <h1 style={{
            margin:'24px 0 22px', fontSize:'clamp(44px, 6vw, 76px)',
            lineHeight:1.02, letterSpacing:'-.03em', fontWeight:800
          }}>
            We built RateShips because shipping pricing is <span style={{
              color:'var(--accent)', position:'relative', display:'inline-block'
            }}>broken
              <svg aria-hidden viewBox="0 0 180 20" style={{position:'absolute', left:0, bottom:-6, width:'100%', height:12}}>
                <path d="M2 12 Q 50 2, 100 10 T 178 8" stroke="var(--warm)" strokeWidth="5" fill="none" strokeLinecap="round" opacity=".9"/>
              </svg>
            </span>.
          </h1>
          <p style={{fontSize:20, color:'var(--body)', lineHeight:1.55, maxWidth:680, margin:0}}>
            Fuel surcharges that change on Tuesdays. Dim-weight math that nobody explains. Customs invoices that arrive three weeks after the package. Carriers built quoting engines to protect margin, not to serve shippers. We're rebuilding that layer — transparently, neutrally, and with receipts.
          </p>
          <div style={{marginTop:36, display:'flex', gap:28, flexWrap:'wrap', fontSize:13, color:'var(--muted)'}}>
            {[
              ['Languages','12'],
              ['Countries','213'],
              ['Routes','45,000+'],
              ['Carriers','134+'],
            ].map(([k,v])=>(
              <div key={k}>
                <div className="tnum" style={{fontSize:22, fontWeight:800, color:'var(--ink)', letterSpacing:'-.02em'}}>{v}</div>
                <div style={{fontSize:12, textTransform:'uppercase', letterSpacing:'.08em', marginTop:2}}>{k}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =============================================================
   ORIGIN STORY
============================================================= */

function OriginStory(){
  return (
    <section style={{padding:'96px 32px', position:'relative'}}>
      <div style={{maxWidth:1240, margin:'0 auto'}}>
        <SectionHead eyebrow="Origin story" title="Why we built this."/>
        <div style={{display:'grid', gridTemplateColumns:'1.1fr .9fr', gap:56, alignItems:'start'}} className="two-col">
          <div>
            <p style={{fontSize:17, color:'var(--body)', lineHeight:1.7, marginTop:0}}>
              In early 2026, we tried to ship a parcel from Hungary to the UK. Simple task — or so we thought. We opened <b style={{color:'var(--ink)'}}>10 carrier websites</b>, compared rates that were formatted differently on each one, and still had no idea what customs duties would add to the final cost.
            </p>
            <p style={{fontSize:17, color:'var(--body)', lineHeight:1.7}}>
              It took <b style={{color:'var(--accent)'}}>an entire afternoon</b> to figure out the best option for a single parcel. Fuel surcharges were buried in PDFs. Dim-weight formulas differed between carriers. Customs thresholds were scattered across government websites in different languages.
            </p>
            <p style={{fontSize:17, color:'var(--body)', lineHeight:1.7}}>
              So we built a tool that checks all of them at once. We aggregated published tariffs from <b style={{color:'var(--ink)'}}>134 carriers across 213 countries</b>, added a customs duty calculator, and made it free. The spreadsheet became a side project. The side project became <b style={{color:'var(--ink)'}}>RateShips</b>.
            </p>
            <p style={{fontSize:17, color:'var(--body)', lineHeight:1.7}}>
              Today, any shipper can do in 5 seconds what used to take an afternoon — and see the customs costs before they pay.
            </p>

            <div style={{marginTop:32, display:'flex', alignItems:'center', gap:14}}>
              <div style={{
                width:48, height:48, borderRadius:999, overflow:'hidden',
                background:'var(--blue-50)', color:'var(--blue)',
                display:'grid', placeItems:'center',
                border:'3px solid #fff', boxShadow:'var(--shadow-md)'
              }}><I.ship width="22" height="22"/></div>
              <div>
                <div style={{fontWeight:700, fontSize:15}}>RateShips Team</div>
                <div style={{fontSize:13, color:'var(--muted)'}}>Global Supply KFT · Hungary · Founded 2026</div>
              </div>
            </div>
          </div>

          {/* Right: problem illustration with pullquote */}
          <div style={{position:'relative'}}>
            <InvoiceIllustration/>
            <div style={{
              position:'absolute', bottom:-24, left:-24, right:40,
              background:'var(--ink)', color:'#fff', borderRadius:20, padding:'28px 30px',
              boxShadow:'var(--shadow-lg)', transform:'rotate(-1deg)'
            }} className="pullquote">
              <I.quote width="28" height="28" style={{color:'var(--warm)', marginBottom:10}}/>
              <div style={{fontSize:'clamp(22px,2vw,28px)', fontWeight:700, letterSpacing:'-.015em', lineHeight:1.25}}>
                10 websites. One afternoon. One parcel.
              </div>
              <div style={{marginTop:10, fontSize:12, color:'rgba(255,255,255,.6)', textTransform:'uppercase', letterSpacing:'.08em', fontWeight:700}}>
                2026 — the problem that started it all
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InvoiceIllustration(){
  return (
    <div style={{
      background:'#fff', borderRadius:20, border:'1px solid var(--line)',
      padding:28, boxShadow:'var(--shadow-lg)', transform:'rotate(2deg)',
      maxWidth:440, marginLeft:'auto'
    }}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', paddingBottom:16, borderBottom:'1px solid var(--line-2)'}}>
        <div>
          <div style={{
            width:56, height:28, borderRadius:4, background:'#FFCC00',
            display:'grid', placeItems:'center', fontSize:14, fontWeight:800, color:'#D40511', letterSpacing:'.04em'
          }}>DHL</div>
          <div style={{fontSize:11, color:'var(--muted)', marginTop:8, fontWeight:600}}>IMPORT DUTY INVOICE</div>
        </div>
        <div className="mono" style={{fontSize:11, color:'var(--muted)', textAlign:'right', lineHeight:1.5}}>
          <div>#INV-2026-01-4412</div>
          <div>Issued 15.01.2026</div>
          <div>Due in 14 days</div>
        </div>
      </div>

      <div style={{margin:'18px 0 10px', fontSize:12, fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.08em'}}>
        Shipment NYC → Stuttgart
      </div>
      <div style={{fontSize:13, color:'var(--body)'}}>Watchmaking tools · HS 8203.20 · 2.4 kg</div>

      <div style={{marginTop:20, display:'flex', flexDirection:'column', gap:10}}>
        {[
          ['Declared value','€1,820.00','muted'],
          ['Import duty (4.7%)','€85.54','normal'],
          ['German VAT (19%)','€346.80','normal'],
          ['Customs processing','€28.50','normal'],
          ['Broker handling fee','€45.00','normal'],
          ['Paperwork & advance','€38.00','normal'],
          ['Late-release penalty','€204.16','bad'],
        ].map(([l,v,t])=>(
          <div key={l} style={{display:'flex', justifyContent:'space-between', fontSize:14, color: t==='muted'?'var(--muted)': t==='bad'?'var(--accent)':'var(--ink-2)'}}>
            <span>{l}</span>
            <span className="tnum" style={{fontWeight:600}}>{v}</span>
          </div>
        ))}
      </div>

      <div style={{marginTop:16, padding:'14px 0', borderTop:'2px solid var(--ink)', display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
        <span style={{fontWeight:700, fontSize:14}}>Amount payable by recipient</span>
        <span className="tnum" style={{fontWeight:800, fontSize:28, letterSpacing:'-.02em', color:'var(--accent)'}}>€748.00</span>
      </div>

      {/* stamp */}
      <div style={{
        position:'absolute', transform:'rotate(-12deg)', right:24, bottom:60,
        border:'3px solid var(--accent)', color:'var(--accent)',
        padding:'6px 12px', borderRadius:6, fontSize:11, fontWeight:800, letterSpacing:'.08em',
        opacity:.85
      }}>UNEXPECTED</div>
    </div>
  );
}

/* =============================================================
   MISSION — 3 principles
============================================================= */

function Mission(){
  const cards = [
    { icon:<I.eye width="22" height="22"/>, tint:'var(--blue)', tintBg:'var(--blue-50)',
      title:'Transparency', tag:'Every fee upfront',
      desc:'No carrier-surcharge surprises. We show fuel, remote-area, dim-weight and customs fees before you pay, not when the package lands at a border.' },
    { icon:<I.scale width="22" height="22"/>, tint:'var(--accent)', tintBg:'var(--accent-50)',
      title:'Neutrality', tag:'Zero carrier commissions',
      desc:'We don\'t take rebates from DHL, FedEx, or anyone else. Revenue comes from shipper subscriptions, so the ranking on the results page is the honest one.' },
    { icon:<I.target width="22" height="22"/>, tint:'#A37A00', tintBg:'var(--warm-50)',
      title:'Accuracy', tag:'Live API data, not estimates',
      desc:'Rates sourced from published carrier tariffs, updated weekly. Customs data from official authority databases across 213 countries.' },
  ];
  return (
    <section style={{padding:'80px 32px', background:'#fff', borderTop:'1px solid var(--line)', borderBottom:'1px solid var(--line)'}}>
      <div style={{maxWidth:1240, margin:'0 auto'}}>
        <SectionHead eyebrow="Mission" title={<>Three principles. Non-negotiable.</>}
          desc="Everything we build — rate tables, customs estimator, the tracking API — gets measured against these three."/>
        <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:20}} className="mission-grid">
          {cards.map((c,i)=>(
            <div key={c.title} className="mission-card" style={{
              background:'var(--bg)', borderRadius:20, border:'1px solid var(--line)', padding:28,
              position:'relative', transition:'transform .2s, box-shadow .2s',
              display:'flex', flexDirection:'column', gap:18
            }}>
              <div style={{
                position:'absolute', top:28, right:28,
                fontSize:11, fontWeight:800, letterSpacing:'.08em', color:'var(--muted)',
              }}>{String(i+1).padStart(2,'0')}</div>
              <div style={{
                width:52, height:52, borderRadius:14, background:c.tintBg, color:c.tint,
                display:'grid', placeItems:'center'
              }}>{c.icon}</div>
              <div>
                <div style={{fontSize:11, fontWeight:700, color:c.tint, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:6}}>{c.tag}</div>
                <h3 style={{margin:0, fontSize:24, fontWeight:800, letterSpacing:'-.02em'}}>{c.title}</h3>
              </div>
              <p style={{margin:0, fontSize:15, color:'var(--body)', lineHeight:1.6}}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =============================================================
   DATA METHODOLOGY — flow diagram
============================================================= */

function DataMethodology(){
  const sources = [
    { icon:<I.code width="18" height="18"/>,    title:'Carrier APIs',       sub:'134+ direct integrations', color:'var(--blue)' },
    { icon:<I.ship width="18" height="18"/>,    title:'Partner freight',    sub:'17 NVOCCs & consolidators', color:'#8B5CF6' },
    { icon:<I.globe width="18" height="18"/>,   title:'Customs feeds',      sub:'213 tariff authorities',   color:'var(--accent)' },
    { icon:<I.receipt width="18" height="18"/>, title:'Crowdsourced',       sub:'Community-contributed data', color:'#A37A00' },
  ];
  return (
    <section style={{padding:'96px 32px', position:'relative', overflow:'hidden'}}>
      <div style={{maxWidth:1240, margin:'0 auto'}}>
        <SectionHead eyebrow="Data methodology" title={<>Where the numbers come from.</>}
          desc="Four independent data pipes, normalized into one pricing layer. We publish the methodology so you can audit it."/>

        <div style={{
          background:'#fff', borderRadius:24, border:'1px solid var(--line)',
          padding:'48px 40px', boxShadow:'var(--shadow-sm)', position:'relative'
        }}>
          <div className="flow-layout" style={{
            display:'grid', gridTemplateColumns:'1fr 100px 1fr', gap:32, alignItems:'center'
          }}>
            {/* Left: source nodes */}
            <div style={{display:'flex', flexDirection:'column', gap:16}}>
              {sources.map((s,i)=>(
                <div key={s.title} className="flow-node" style={{
                  display:'flex', alignItems:'center', gap:14, padding:'14px 18px',
                  background:'var(--bg)', borderRadius:14, border:'1px solid var(--line)',
                  position:'relative'
                }}>
                  <div style={{
                    width:40, height:40, borderRadius:10,
                    background:`${s.color}15`, color:s.color,
                    display:'grid', placeItems:'center', flex:'0 0 40px'
                  }}>{s.icon}</div>
                  <div style={{flex:1, minWidth:0}}>
                    <div style={{fontWeight:700, fontSize:15}}>{s.title}</div>
                    <div style={{fontSize:12, color:'var(--muted)'}}>{s.sub}</div>
                  </div>
                  <div className="mono" style={{fontSize:10, color:s.color, fontWeight:700, letterSpacing:'.04em'}}>SRC-{i+1}</div>
                </div>
              ))}
            </div>

            {/* Middle: flow lines SVG */}
            <div className="flow-arrows" style={{position:'relative', height:'100%', minHeight:280}}>
              <svg viewBox="0 0 100 280" preserveAspectRatio="none" style={{width:'100%', height:'100%'}}>
                <defs>
                  <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                    <path d="M0 0 L6 4 L0 8 z" fill="#1A73E8"/>
                  </marker>
                </defs>
                {[30, 100, 170, 240].map((y,i)=>(
                  <g key={i}>
                    <path d={`M 0 ${y} C 40 ${y}, 60 140, 100 140`}
                      stroke="#1A73E8" strokeWidth="1.5" fill="none" strokeDasharray="4 4"
                      markerEnd="url(#arrowhead)"/>
                  </g>
                ))}
              </svg>
            </div>

            {/* Right: central engine */}
            <div style={{
              background:'var(--ink)', color:'#fff', borderRadius:18, padding:'28px 24px',
              boxShadow:'var(--shadow-lg)', position:'relative'
            }}>
              <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:14}}>
                <div style={{
                  width:36, height:36, borderRadius:10,
                  background:'linear-gradient(135deg, var(--blue), #2F88FF)', display:'grid', placeItems:'center'
                }}><I.sparkle width="18" height="18"/></div>
                <div style={{fontWeight:800, fontSize:16}}>RateShips engine</div>
              </div>
              <div style={{display:'flex', flexDirection:'column', gap:10}}>
                {[
                  ['Normalize',   'schema + unit conversion'],
                  ['De-duplicate','cross-source matching'],
                  ['Validate',    'outlier detection'],
                  ['Rank',        'landed-cost first'],
                ].map(([l,s],i)=>(
                  <div key={l} style={{display:'flex', alignItems:'center', gap:10, padding:'8px 12px', background:'rgba(255,255,255,.05)', borderRadius:8}}>
                    <span className="mono tnum" style={{fontSize:10, color:'var(--warm)', fontWeight:700}}>0{i+1}</span>
                    <span style={{fontSize:13, fontWeight:600}}>{l}</span>
                    <span style={{fontSize:11, color:'rgba(255,255,255,.5)', marginLeft:'auto'}}>{s}</span>
                  </div>
                ))}
              </div>
              <div style={{marginTop:16, paddingTop:14, borderTop:'1px solid rgba(255,255,255,.1)', display:'flex', alignItems:'center', gap:8}}>
                <span style={{width:6, height:6, borderRadius:999, background:'var(--good)', boxShadow:'0 0 0 4px rgba(17,138,84,.25)'}}/>
                <span style={{fontSize:12, color:'rgba(255,255,255,.7)'}}>
                  <span className="tnum" style={{color:'#fff', fontWeight:700}}>2.1M</span> rates / day
                </span>
                <span style={{fontSize:12, color:'rgba(255,255,255,.7)', marginLeft:'auto'}}>
                  p95 latency <span className="tnum" style={{color:'#fff', fontWeight:700}}>1.9s</span>
                </span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div style={{
            marginTop:32, paddingTop:24, borderTop:'1px dashed var(--line)',
            display:'flex', justifyContent:'space-between', alignItems:'center', gap:20, flexWrap:'wrap', fontSize:13, color:'var(--muted)'
          }}>
            <span>All rate data sourced from published carrier tariffs and customs authority databases. <a href="#" style={{color:'var(--blue)', fontWeight:600}}>Read our methodology →</a></span>
            <span className="mono" style={{fontSize:11}}>v3.2 · updated Apr 2026</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =============================================================
   TEAM
============================================================= */

function Avatar({seed, bg, gender}){
  // DiceBear "adventurer" — cartoon faces. Use gender-appropriate features
  const params = gender === 'f'
    ? 'earrings=variant01&earringsProbability=60&hairColor=562e14,85461e,ab8e5e,c99c62&hair=long01,long02,long03,long04,long05,long06,long07,long08,long09,long10,long11,long12,long13,long14,long15,long16,long17,long18,long19,long20&mouth=variant01,variant02,variant03,variant30'
    : 'earringsProbability=0&hairColor=28150a,3a2212,562e14,85461e&hair=short01,short02,short03,short04,short05,short06,short07,short08,short09,short10,short11,short12,short13,short14,short15,short16,short17,short18,short19&mouth=variant01,variant02,variant03,variant30';
  const url = `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(seed)}&backgroundColor=transparent&radius=50&${params}`;
  return (
    <div style={{
      width:72, height:72, borderRadius:999, flex:'0 0 72px',
      background:bg, overflow:'hidden',
      border:'3px solid #fff', boxShadow:'var(--shadow-sm)'
    }}>
      <img src={url} alt={seed} width={72} height={72} style={{borderRadius:999}} loading="lazy"/>
    </div>
  );
}

function Team(){
  const members = [
    { name:'Dmytro Kolosovskiy', role:'Project Manager',
      bio:'Manages the project from vision to execution. Coordinates development, data collection, and carrier integrations.',
      bg:'var(--blue-50)', seed:'Dmytro-PM-2026', gender:'m',
      loc:'Hungary' },
    { name:'Roman Kolosovskiy',  role:'Head of Engineering',
      bio:'Leads all engineering and development. Built the rate aggregation engine, customs calculator, and delivery estimator from the ground up.',
      bg:'var(--accent-50)', seed:'Roman-Engineer-Dev', gender:'m',
      loc:'Hungary' },
    { name:'Zhenya Yakovenko',   role:'Marketing Lead',
      bio:'Drives growth, content strategy, and user acquisition across 12 languages. Turns shipping data into stories people actually read.',
      bg:'var(--warm-50)', seed:'Zhenya-Marketing-UA', gender:'m',
      loc:'Ukraine' },
    { name:'Oleksii R.',         role:'Data Engineering',
      bio:'Maintains carrier tariff database and automated data pipelines. Ensures 134 carriers are updated weekly with accurate rate data.',
      bg:'var(--good-50)', seed:'Oleksii-DataEng-42', gender:'m',
      loc:'Poland' },
    { name:'Katarina M.',        role:'Customs & Compliance',
      bio:'Verifies duty rates, de minimis thresholds, and trade agreement rules across 213 countries. Former customs broker.',
      bg:'#F3E8FF', seed:'Katarina-Customs-EU', gender:'f',
      loc:'Croatia' },
    { name:'Taras V.',           role:'Content & Localization',
      bio:'Creates country-specific shipping guides and manages translations. Makes sure every market gets locally relevant information.',
      bg:'#E0F2FE', seed:'Taras-Content-Globe', gender:'m',
      loc:'Portugal' },
  ];
  return (
    <section style={{padding:'96px 32px', background:'#fff', borderTop:'1px solid var(--line)', borderBottom:'1px solid var(--line)'}}>
      <div style={{maxWidth:1240, margin:'0 auto'}}>
        <div style={{maxWidth:620, marginBottom:40}}>
          <div style={{fontSize:12, fontWeight:700, color:'var(--blue)', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:12}}>Team</div>
          <h2 style={{margin:0, fontSize:'clamp(28px,3.2vw,40px)', fontWeight:800, letterSpacing:'-.02em', lineHeight:1.1}}>A small team, moving fast.</h2>
          <p style={{margin:'14px 0 0', fontSize:17, color:'var(--body)'}}>We're a small team based in Hungary with remote collaborators. No big offices — just people who think shipping pricing should be transparent.</p>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:20}} className="team-grid">
          {members.map(m=>(
            <div key={m.name} className="team-card" style={{
              background:'var(--bg)', borderRadius:20, border:'1px solid var(--line)',
              padding:24, display:'flex', gap:18, alignItems:'flex-start',
              transition:'transform .2s, box-shadow .2s'
            }}>
              <Avatar bg={m.bg} seed={m.seed} gender={m.gender}/>
              <div style={{flex:1, minWidth:0}}>
                <div style={{display:'flex', alignItems:'center', gap:8, flexWrap:'wrap'}}>
                  <span style={{fontWeight:700, fontSize:16}}>{m.name}</span>
                  <span className="mono" style={{fontSize:10, color:'var(--muted)', padding:'2px 6px', background:'#fff', border:'1px solid var(--line)', borderRadius:4, letterSpacing:'.04em'}}>{m.loc}</span>
                </div>
                <div style={{fontSize:12, fontWeight:700, color:'var(--blue)', textTransform:'uppercase', letterSpacing:'.06em', marginTop:2}}>{m.role}</div>
                <p style={{margin:'10px 0 0', fontSize:13.5, color:'var(--body)', lineHeight:1.55}}>{m.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =============================================================
   TIMELINE
============================================================= */

function Timeline(){
  const events = [
    { y:'Jan \'26', t:'The idea', d:'Spent an afternoon comparing 10 carrier websites for one parcel. Decided there has to be a better way.', badge:null },
    { y:'Feb \'26', t:'First prototype', d:'Built a working rate aggregator covering 40 carriers and 50 countries. Tested with real shipments from Hungary.', badge:null },
    { y:'Mar \'26', t:'Public launch', d:'RateShips goes live with 134 carriers across 213 countries. Customs duty calculator and delivery estimator included from day one.', badge:'Launch' },
    { y:'Apr \'26', t:'12 languages', d:'Added support for Russian, Spanish, German, French, Portuguese, Chinese, Japanese, Korean, Arabic, Turkish, and Italian.', badge:null },
    { y:'Q2 \'26', t:'45,000+ routes', d:'Expanded corridor coverage. Every major trade lane now has rate data from multiple carriers. Weekly data updates established.', badge:null },
    { y:'Q3 \'26', t:'Tools & guides', d:'Launched country-specific shipping guides for 195+ destinations. HS-code lookup integrated into customs calculator.', badge:'Planned' },
    { y:'Q4 \'26', t:'API for platforms', d:'REST API for e-commerce integrations. Shopify and WooCommerce plugins in development.', badge:'Planned' },
    { y:'2027', t:'What\'s next', d:'Carrier reviews from real shippers. Booking integration. Rate-change alerts. Built based on what shippers actually need.', badge:'Next' },
  ];
  const scrollRef = useRef(null);
  return (
    <section style={{padding:'96px 0 80px', position:'relative', overflow:'hidden'}}>
      <div style={{maxWidth:1240, margin:'0 auto', padding:'0 32px'}}>
        <SectionHead eyebrow="Timeline" title={<>From idea to 134 carriers in 3 months.</>}
          desc="We move fast because shippers shouldn't have to wait."/>
      </div>
      {/* Horizontal scroll */}
      <div ref={scrollRef} className="timeline-scroll" style={{
        overflowX:'auto', overflowY:'visible', paddingBottom:24, scrollSnapType:'x mandatory'
      }}>
        <div style={{
          display:'flex', gap:0, padding:'48px 32px 32px',
          minWidth:'max-content', position:'relative'
        }}>
          {/* Connecting line */}
          <div aria-hidden style={{
            position:'absolute', left:32, right:32, top:72, height:2,
            background:'repeating-linear-gradient(90deg, var(--line) 0 6px, transparent 6px 12px)'
          }}/>
          {events.map((e,i)=>{
            const isLaunch = e.badge==='Launch';
            const isPlanned = e.badge==='Planned' || e.badge==='Next';
            const badgeColors = {
              'Launch':  {bg:'var(--good-50)', fg:'var(--good)'},
              'Planned': {bg:'var(--warm-50)', fg:'#A37A00'},
              'Next':    {bg:'var(--blue-50)', fg:'var(--blue)'},
            };
            return (
              <div key={e.y} className="timeline-item" style={{
                width:280, flex:'0 0 280px', scrollSnapAlign:'start', paddingRight:24, position:'relative'
              }}>
                {/* dot */}
                <div style={{
                  width:24, height:24, borderRadius:999,
                  background: isLaunch?'var(--good)': isPlanned?'var(--line)':'#fff',
                  border:'2px solid '+(isLaunch?'var(--good)':'var(--line)'),
                  boxShadow: isLaunch?'0 0 0 6px rgba(17,138,84,.18), var(--shadow-md)':'var(--shadow-sm)',
                  display:'grid', placeItems:'center', position:'relative', zIndex:1, marginBottom:20,
                  opacity: isPlanned?.6:1
                }}>
                  {isLaunch && <span style={{width:8, height:8, borderRadius:999, background:'#fff'}}/>}
                </div>
                <div style={{
                  background: isLaunch?'var(--ink)':'#fff', color: isLaunch?'#fff':'var(--ink)',
                  borderRadius:14, border:'1px solid '+(isLaunch?'var(--ink)':'var(--line)'),
                  padding:20, boxShadow: isLaunch?'var(--shadow-lg)':'var(--shadow-sm)',
                  position:'relative', opacity: isPlanned?.7:1
                }}>
                  {e.badge && (
                    <span style={{
                      position:'absolute', top:14, right:14, padding:'3px 8px', borderRadius:999,
                      background: badgeColors[e.badge]?.bg||'var(--blue-50)',
                      color: badgeColors[e.badge]?.fg||'var(--blue)',
                      fontSize:10, fontWeight:800, letterSpacing:'.06em', textTransform:'uppercase'
                    }}>{e.badge}</span>
                  )}
                  <div className="tnum" style={{
                    fontSize:28, fontWeight:800, letterSpacing:'-.02em',
                    color: isLaunch?'var(--warm)':'var(--blue)'
                  }}>{e.y}</div>
                  <h4 style={{margin:'4px 0 8px', fontSize:17, fontWeight:700, letterSpacing:'-.01em'}}>{e.t}</h4>
                  <p style={{margin:0, fontSize:13, color: isLaunch?'rgba(255,255,255,.7)':'var(--body)', lineHeight:1.55}}>{e.d}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{maxWidth:1240, margin:'0 auto', padding:'0 32px', fontSize:12, color:'var(--muted)'}}>
        ← scroll horizontally to see the full timeline →
      </div>
    </section>
  );
}

/* =============================================================
   COMPANY STATS (dark)
============================================================= */

function CompanyStats(){
  const stats = [
    { v:'2026',    l:'Founded',        s:'Hungary',              accent:false },
    { v:'134+',    l:'Carriers',       s:'live integrations',   accent:false },
    { v:'213',     l:'Countries',      s:'every territory',     accent:false },
    { v:'45K+',    l:'Routes',         s:'updated weekly',      accent:true  },
  ];
  return (
    <section style={{padding:'80px 32px', background:'var(--ink)', color:'#fff', position:'relative', overflow:'hidden'}}>
      <div aria-hidden style={{position:'absolute', inset:0, backgroundImage:`
        radial-gradient(600px 300px at 15% 20%, rgba(26,115,232,.2), transparent 60%),
        radial-gradient(500px 300px at 85% 80%, rgba(232,92,58,.12), transparent 60%)`}}/>
      <div style={{position:'relative', maxWidth:1240, margin:'0 auto'}}>
        <div style={{fontSize:12, fontWeight:700, color:'var(--warm)', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:10}}>By the numbers</div>
        <h2 style={{margin:'0 0 40px', fontSize:'clamp(28px,3.2vw,40px)', fontWeight:800, letterSpacing:'-.02em', lineHeight:1.1, maxWidth:720}}>
          A small company with big receipts.
        </h2>
        <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:32}} className="stats-grid">
          {stats.map((it,i)=>(
            <div key={i} style={{
              paddingLeft: i>0?28:0,
              borderLeft: i>0?'1px solid rgba(255,255,255,.12)':'none'
            }}>
              <div className="tnum" style={{
                fontSize:'clamp(40px,4.2vw,60px)', fontWeight:800, letterSpacing:'-.03em', lineHeight:1,
                color: it.accent?'var(--warm)':'#fff'
              }}>{it.v}</div>
              <div style={{marginTop:10, fontWeight:600, fontSize:15}}>{it.l}</div>
              <div style={{fontSize:13, color:'rgba(255,255,255,.55)', marginTop:4}}>{it.s}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =============================================================
   PRESS + COMPLIANCE
============================================================= */

function Press(){
  const principles = [
    { icon:<I.eye width="22" height="22"/>, color:'var(--blue)',
      t:'Open methodology', d:'Our data sources, aggregation logic, and update frequency are published on our Data Methodology page. No black boxes.' },
    { icon:<I.scale width="22" height="22"/>, color:'var(--accent)',
      t:'Carrier-neutral', d:'We take zero commissions from carriers. Users pay us directly — that\'s how we keep comparisons honest.' },
    { icon:<I.shield width="22" height="22"/>, color:'var(--good)',
      t:'Verifiable rates', d:'Every rate comes from a published carrier tariff or partner agreement. We link to original sources where available.' },
  ];
  return (
    <section style={{padding:'80px 32px', background:'#fff', borderTop:'1px solid var(--line)', borderBottom:'1px solid var(--line)'}}>
      <div style={{maxWidth:1240, margin:'0 auto'}}>
        <div style={{fontSize:12, fontWeight:700, color:'var(--blue)', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:12}}>Trust & transparency</div>
        <h2 style={{margin:'0 0 36px', fontSize:'clamp(28px,3.2vw,40px)', fontWeight:800, letterSpacing:'-.02em', lineHeight:1.1, maxWidth:720}}>
          Why shippers trust the data.
        </h2>
        <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:20}} className="press-grid">
          {principles.map((p,i)=>(
            <div key={i} style={{
              background:'var(--bg)', border:'1px solid var(--line)', borderRadius:20,
              padding:28, display:'flex', flexDirection:'column', gap:16
            }}>
              <div style={{
                width:44, height:44, borderRadius:12, display:'grid', placeItems:'center',
                background: i===0?'var(--blue-50)': i===1?'var(--accent-50)':'var(--good-50)',
                color: p.color
              }}>{p.icon}</div>
              <h3 style={{margin:0, fontSize:20, fontWeight:700, letterSpacing:'-.01em'}}>{p.t}</h3>
              <p style={{margin:0, fontSize:14, color:'var(--body)', lineHeight:1.55}}>{p.d}</p>
            </div>
          ))}
        </div>

        {/* Data sources strip */}
        <div style={{
          marginTop:40, paddingTop:32, borderTop:'1px dashed var(--line)',
          display:'flex', gap:28, alignItems:'center', flexWrap:'wrap'
        }}>
          <div style={{fontSize:11, fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.08em'}}>Data sources</div>
          {[
            ['134+ carrier APIs','Updated weekly'],
            ['213 countries','Customs authority feeds'],
            ['Open tariff data','Published rates only'],
            ['12 languages','Community-verified translations'],
          ].map(([t,s])=>(
            <div key={t} style={{
              padding:'10px 14px', borderRadius:10, border:'1px solid var(--line)',
              background:'#fff', display:'inline-flex', alignItems:'center', gap:10
            }}>
              <I.check width="16" height="16" style={{color:'var(--blue)'}}/>
              <div style={{lineHeight:1.2}}>
                <div style={{fontSize:13, fontWeight:700}}>{t}</div>
                {s && <div style={{fontSize:11, color:'var(--muted)'}}>{s}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =============================================================
   CAREERS CTA
============================================================= */

function Careers(){
  const ways = [
    { icon:<I.globe width="18" height="18"/>, dept:'CAR', t:'Add a missing carrier', d:'Know a regional carrier we don\'t cover? Tell us and we\'ll integrate it within 30 days.' },
    { icon:<I.plane width="18" height="18"/>, dept:'LNG', t:'Improve a translation', d:'Help us make RateShips better in any of our 12 supported languages — corrections welcome.' },
    { icon:<I.receipt width="18" height="18"/>, dept:'DAT', t:'Share shipping data', d:'Upload anonymized shipping receipts to improve rate accuracy for every shipper.' },
  ];
  return (
    <section id="community" style={{padding:'96px 32px', position:'relative', overflow:'hidden'}}>
      <div aria-hidden style={{position:'absolute', inset:0, background:`
        radial-gradient(700px 400px at 20% 40%, rgba(26,115,232,.06), transparent 60%)
      `}}/>
      <div style={{position:'relative', maxWidth:1240, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, alignItems:'center'}} className="careers-grid">
        <div>
          <div style={{fontSize:12, fontWeight:700, color:'var(--blue)', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:12}}>Community</div>
          <h2 style={{margin:0, fontSize:'clamp(32px,3.6vw,48px)', fontWeight:800, letterSpacing:'-.025em', lineHeight:1.05}}>
            Built for <span style={{color:'var(--blue)'}}>shippers</span>,<br/>shaped by shippers.
          </h2>
          <p style={{margin:'18px 0 28px', fontSize:17, color:'var(--body)', lineHeight:1.55, maxWidth:480}}>
            RateShips is built by a small team in Hungary. We don't have open positions — but we grow through the people who use and improve the platform every day.
          </p>
          <div style={{display:'flex', gap:12, flexWrap:'wrap', marginBottom:24}}>
            <a href="#" style={{
              padding:'14px 22px', borderRadius:12, background:'var(--ink)', color:'#fff',
              fontWeight:600, fontSize:15, display:'inline-flex', alignItems:'center', gap:8
            }}>Suggest a carrier <I.arrow width="16" height="16"/></a>
            <a href="#" style={{
              padding:'14px 22px', borderRadius:12, background:'#fff', color:'var(--ink)',
              fontWeight:600, fontSize:15, border:'1px solid var(--line)'
            }}>Report a data issue →</a>
          </div>
          <div style={{display:'flex', gap:24, flexWrap:'wrap', fontSize:13, color:'var(--muted)'}}>
            {['134+ carriers','12 languages','Open rate data','Updated weekly'].map(x=>(
              <span key={x} style={{display:'inline-flex', alignItems:'center', gap:6}}>
                <I.check width="14" height="14" style={{color:'var(--good)'}}/> {x}
              </span>
            ))}
          </div>
        </div>

        {/* Right: contribution cards */}
        <div style={{display:'flex', flexDirection:'column', gap:12}}>
          {ways.map((r,i)=>(
            <a key={i} href="#" className="role-row" style={{
              display:'flex', alignItems:'center', gap:16, padding:'20px 24px',
              background:'#fff', borderRadius:16, border:'1px solid var(--line)',
              boxShadow:'var(--shadow-sm)', transition:'all .2s',
              transform:`translateY(${i * 16}px)`,
            }}>
              <div style={{
                width:40, height:40, borderRadius:10,
                background: i===0?'var(--blue-50)': i===1?'var(--accent-50)':'var(--warm-50)',
                color: i===0?'var(--blue)': i===1?'var(--accent)':'#A37A00',
                display:'grid', placeItems:'center', flexShrink:0
              }}>{r.icon}</div>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontWeight:700, fontSize:15, marginBottom:4}}>{r.t}</div>
                <div style={{fontSize:13, color:'var(--body)', lineHeight:1.45}}>{r.d}</div>
              </div>
              <I.arrow width="16" height="16" style={{color:'var(--muted)', flexShrink:0}}/>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =============================================================
   FINAL CTA
============================================================= */

function FinalCTA(){
  return (
    <section style={{padding:'112px 32px', position:'relative', overflow:'hidden', borderTop:'1px solid var(--line)'}}>
      <div aria-hidden style={{
        position:'absolute', inset:0,
        background:`radial-gradient(800px 400px at 20% 30%, rgba(26,115,232,.14), transparent 60%),
                    radial-gradient(800px 400px at 80% 70%, rgba(232,92,58,.08), transparent 60%)`,
      }}/>
      <div style={{position:'relative', maxWidth:900, margin:'0 auto', textAlign:'center'}}>
        <h2 style={{
          margin:'0 0 18px', fontSize:'clamp(36px, 5vw, 64px)',
          lineHeight:1.04, letterSpacing:'-.025em', fontWeight:800
        }}>
          Ready to stop <span style={{color:'var(--accent)'}}>overpaying?</span>
        </h2>
        <p style={{fontSize:18, color:'var(--body)', margin:'0 0 32px', maxWidth:560, marginLeft:'auto', marginRight:'auto'}}>
          Compare rates in 5 seconds, or partner with us to power shipping inside your own product.
        </p>
        <div style={{display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap'}}>
          <a href="Homepage.html#calc" style={{
            padding:'16px 28px', borderRadius:12, background:'var(--ink)', color:'#fff',
            fontWeight:700, fontSize:15, display:'inline-flex', alignItems:'center', gap:8,
            boxShadow:'0 14px 28px -10px rgba(15,23,42,.35)'
          }}>Compare rates <I.arrow width="16" height="16"/></a>
          <a href="#" style={{
            padding:'16px 28px', borderRadius:12, background:'#fff', color:'var(--ink)',
            fontWeight:600, fontSize:15, border:'1px solid var(--line)', display:'inline-flex', alignItems:'center', gap:8
          }}>Partner with us →</a>
        </div>
      </div>
    </section>
  );
}

/* =============================================================
   FOOTER (matches homepage)
============================================================= */

function Footer(){
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const cols = [
    {title:'Product', links:['Rate comparison','Rate tables','Customs calculator','Delivery estimator','API & webhooks','Changelog']},
    {title:'Carriers', links:['DHL Express','FedEx','UPS','SF Express','EMS Worldwide','Aramex','All 134 carriers →']},
    {title:'Resources', links:['Shipping guides','Country profiles (213)','HS-code lookup','Incoterms 2026','Help center','Status page']},
    {title:'Company', links:['About','Community','Community','Press','Partners','Contact']},
  ];
  return (
    <footer style={{background:'var(--ink)', color:'#fff', padding:'72px 32px 32px'}}>
      <div style={{maxWidth:1240, margin:'0 auto'}}>
        <div style={{
          background:'rgba(255,255,255,.04)', borderRadius:20,
          border:'1px solid rgba(255,255,255,.08)',
          padding:'28px 32px', marginBottom:48,
          display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:32, alignItems:'center'
        }} className="newsletter-grid">
          <div>
            <div style={{fontSize:12, fontWeight:700, color:'var(--warm)', textTransform:'uppercase', letterSpacing:'.06em'}}>The Freight Brief</div>
            <h3 style={{margin:'8px 0 6px', fontSize:22, fontWeight:700, letterSpacing:'-.015em'}}>Carrier rate changes, in your inbox.</h3>
            <p style={{margin:0, fontSize:14, color:'rgba(255,255,255,.65)'}}>Monthly digest of fuel-surcharge shifts, peak-season forecasts, and new carrier launches. Subscribe to shipping rate updates.</p>
          </div>
          <form onSubmit={(e)=>{e.preventDefault(); setSent(true);}} style={{display:'flex', gap:8}}>
            <input type="email" required placeholder="you@company.com" value={email} onChange={e=>setEmail(e.target.value)} style={{
              flex:1, padding:'12px 16px', borderRadius:10, border:'1px solid rgba(255,255,255,.12)',
              background:'rgba(255,255,255,.05)', color:'#fff', fontSize:14, outline:'none'
            }}/>
            <button type="submit" style={{
              padding:'12px 18px', borderRadius:10, background:'var(--warm)', color:'var(--ink)',
              fontSize:14, fontWeight:700, whiteSpace:'nowrap'
            }}>{sent?'Subscribed ✓':'Subscribe'}</button>
          </form>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1.2fr repeat(4, 1fr)', gap:32}} className="footer-cols">
          <div>
            <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:14}}>
              <div style={{width:28, height:28, borderRadius:8, background:'linear-gradient(135deg, var(--blue), #2F88FF)', display:'grid', placeItems:'center'}}><I.ship width="16" height="16"/></div>
              <span style={{fontWeight:800, fontSize:17, letterSpacing:'-.01em'}}>RateShips</span>
            </div>
            <p style={{fontSize:13, color:'rgba(255,255,255,.55)', margin:'0 0 16px', lineHeight:1.6, maxWidth:260}}>The neutral shipping rate comparison platform. We're not a carrier — we work for you.</p>
            <div style={{display:'flex', gap:10}}>
              <a href="#" style={{width:32, height:32, borderRadius:8, background:'rgba(255,255,255,.06)', display:'grid', placeItems:'center', color:'rgba(255,255,255,.7)'}}><I.twitter width="14" height="14"/></a>
              <a href="#" style={{width:32, height:32, borderRadius:8, background:'rgba(255,255,255,.06)', display:'grid', placeItems:'center', color:'rgba(255,255,255,.7)'}}><I.linkedin width="14" height="14"/></a>
            </div>
          </div>
          {cols.map(c=>(
            <div key={c.title}>
              <div style={{fontSize:13, fontWeight:700, marginBottom:14}}>{c.title}</div>
              <div style={{display:'flex', flexDirection:'column', gap:8}}>
                {c.links.map(l=> <a key={l} href={l==='About'?'#':'Homepage.html'} style={{fontSize:13, color:'rgba(255,255,255,.6)'}}>{l}</a>)}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop:40, paddingTop:20, borderTop:'1px solid rgba(255,255,255,.08)',
          display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, alignItems:'center'
        }} className="footer-badges">
          <div>
            <div style={{fontSize:11, fontWeight:700, color:'rgba(255,255,255,.45)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:10}}>DATA COVERAGE</div>
            <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
              {[{n:'VISA',bg:'#1A1F71',fg:'#fff'},{n:'MC',bg:'#EB001B',fg:'#fff'},{n:'AMEX',bg:'#2E77BB',fg:'#fff'},{n:'PAY',bg:'#000',fg:'#fff'},{n:'G PAY',bg:'#fff',fg:'#0F172A'},{n:'SEPA',bg:'#10298E',fg:'#fff'},{n:'WIRE',bg:'#334155',fg:'#fff'}].map(p=>(
                <div key={p.n} style={{padding:'6px 10px', borderRadius:6, background:p.bg, color:p.fg, fontSize:10, fontWeight:800, letterSpacing:'.04em', minWidth:40, textAlign:'center', border:p.bg==='#fff'?'1px solid rgba(255,255,255,.2)':'none'}}>{p.n}</div>
              ))}
            </div>
          </div>
          <div>
            <div style={{fontSize:11, fontWeight:700, color:'rgba(255,255,255,.45)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:10}}>Legal entity</div>
            <div style={{display:'flex', gap:10, flexWrap:'wrap'}}>
              {[['Global Supply KFT','Hungary'],['VAT','HU26179030'],['Free service','No payment required'],['Updated','Weekly']].map(([t,s])=>(
                <div key={t} style={{padding:'8px 12px', borderRadius:10, border:'1px solid rgba(255,255,255,.12)', background:'rgba(255,255,255,.03)', display:'inline-flex', alignItems:'center', gap:8}}>
                  <I.shield width="14" height="14" style={{color:'var(--warm)'}}/>
                  <div style={{lineHeight:1.2}}>
                    <div style={{fontSize:12, fontWeight:700}}>{t}</div>
                    {s && <div style={{fontSize:10, color:'rgba(255,255,255,.55)'}}>{s}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{marginTop:28, paddingTop:20, borderTop:'1px solid rgba(255,255,255,.08)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16, fontSize:12, color:'rgba(255,255,255,.45)'}}>
          <div>© 2026 Global Supply KFT · 134 carriers · 213 countries · Updated weekly</div>
          <div style={{display:'flex', gap:20}}>
            <a href="#">Privacy</a><a href="#">Terms</a><a href="#">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* =============================================================
   HELPERS
============================================================= */

function SectionHead({eyebrow, title, desc}){
  return (
    <div style={{marginBottom:40, maxWidth:720}}>
      {eyebrow && <div style={{fontSize:12, fontWeight:700, color:'var(--blue)', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:12}}>{eyebrow}</div>}
      <h2 style={{margin:0, fontSize:'clamp(28px, 3.2vw, 40px)', fontWeight:800, letterSpacing:'-.02em', lineHeight:1.1}}>{title}</h2>
      {desc && <p style={{margin:'14px 0 0', fontSize:17, color:'var(--body)', maxWidth:620}}>{desc}</p>}
    </div>
  );
}

function ResponsiveCSS(){
  return (
    <style>{`
      @keyframes float-a { 0%,100% { transform: translateY(0) rotate(-8deg); } 50% { transform: translateY(-12px) rotate(-8deg); } }
      @keyframes float-b { 0%,100% { transform: translateY(0) rotate(12deg); } 50% { transform: translateY(-10px) rotate(12deg); } }
      @keyframes float-c { 0%,100% { transform: translateY(0) rotate(-4deg); } 50% { transform: translateY(-6px) rotate(-4deg); } }
      .hero-shape-a { animation: float-a 7s ease-in-out infinite; }
      .hero-shape-b { animation: float-b 6s ease-in-out infinite -2s; }
      .hero-shape-c { animation: float-c 8s ease-in-out infinite -4s; }

      .mission-card:hover { transform: translateY(-3px); box-shadow: 0 14px 30px -10px rgba(15,23,42,.1); }
      .team-card:hover { transform: translateY(-3px); box-shadow: 0 14px 30px -10px rgba(15,23,42,.1); }
      .role-row:hover { background: var(--bg); }
      a[href]:hover { opacity: .92; }

      .timeline-scroll::-webkit-scrollbar { height: 8px; }
      .timeline-scroll::-webkit-scrollbar-track { background: var(--line-2); }
      .timeline-scroll::-webkit-scrollbar-thumb { background: var(--line); border-radius: 4px; }

      @media (max-width: 960px) {
        .desktop-only { display: none !important; }
        .hero-shape { display: none !important; }
        .two-col { grid-template-columns: 1fr !important; gap: 40px !important; }
        .pullquote { position: static !important; transform: none !important; margin-top: 20px; }
        .mission-grid, .team-grid, .press-grid { grid-template-columns: 1fr !important; }
        .flow-layout { grid-template-columns: 1fr !important; gap: 20px !important; }
        .flow-arrows { display: none !important; }
        .stats-grid { grid-template-columns: 1fr 1fr !important; gap: 28px !important; }
        .stats-grid > div { padding-left: 0 !important; border-left: none !important; }
        .careers-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        .footer-cols { grid-template-columns: 1fr 1fr !important; gap: 28px !important; }
        .newsletter-grid, .footer-badges { grid-template-columns: 1fr !important; gap: 20px !important; }
      }
      @media (max-width: 560px) {
        section { padding-left: 20px !important; padding-right: 20px !important; }
      }
    `}</style>
  );
}

/* =============================================================
   APP
============================================================= */

export default function App(){
  return (
    <>
      <ResponsiveCSS/>
      <Hero/>
      <OriginStory/>
      <Mission/>
      <DataMethodology/>
      <Team/>
      <Timeline/>
      <CompanyStats/>
      <Press/>
      <Careers/>
      <FinalCTA/>
    </>
  );
}

