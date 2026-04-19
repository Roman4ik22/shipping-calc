"use client";

import React from "react";

const { useState, useMemo, useEffect, useRef } = React;

/* =============================================================
   SHARED PRIMITIVES
============================================================= */

// Reveal-on-scroll hook
function useReveal(){
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(()=>{
    if (!ref.current || seen) return;
    const io = new IntersectionObserver(es=>{
      es.forEach(e=>{ if (e.isIntersecting) { setSeen(true); io.disconnect(); }});
    },{threshold:.1, rootMargin:'0px 0px -60px 0px'});
    io.observe(ref.current);
    return ()=> io.disconnect();
  },[seen]);
  return [ref, seen];
}
function Reveal({children, delay=0, as:As='div', ...rest}){
  const [ref, seen] = useReveal();
  return <As ref={ref} style={{
    ...(rest.style||{}),
    opacity: seen?1:0, transform: seen?'translateY(0)':'translateY(20px)',
    transition:`opacity .7s ease ${delay}ms, transform .7s cubic-bezier(.2,.7,.3,1) ${delay}ms`
  }} {...rest}>{children}</As>;
}

// Tiny icon set — stroke-based, 1.5px
const I = {
  plane: (p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 12l18-7-7 18-2.5-7.5L3 12z"/></svg>,
  box: (p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/></svg>,
  scale: (p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3v18"/><path d="M5 8h14"/><circle cx="6" cy="14" r="3"/><circle cx="18" cy="14" r="3"/></svg>,
  bolt: (p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"/></svg>,
  clock: (p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>,
  star: (p)=> <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  check: (p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 6L9 17l-5-5"/></svg>,
  x: (p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M18 6L6 18M6 6l12 12"/></svg>,
  arrow: (p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>,
  chev: (p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 9l6 6 6-6"/></svg>,
  calc: (p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h2M12 11h4M8 15h2M12 15h4M8 19h2M12 19h4"/></svg>,
  doc: (p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></svg>,
  pin: (p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  search: (p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>,
  ship: (p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M2 20s2 1 4 1 3-1 4-1 2 1 4 1 3-1 4-1 4-1 4-1"/><path d="M4 18L3 12h18l-1 6"/><path d="M12 4v8M8 8h8"/></svg>,
  globe: (p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/></svg>,
  tag: (p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20.59 13.41L13 21a2 2 0 01-2.83 0l-7-7A2 2 0 012.59 13V4a2 2 0 012-2h9a2 2 0 011.41.59l7 7a2 2 0 010 2.83z"/><circle cx="7" cy="7" r="1.2"/></svg>,
  shield: (p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 2l8 3v7c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5l8-3z"/><path d="M9 12l2 2 4-4"/></svg>,
  target: (p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>,
  spark: (p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></svg>,
  twitter: (p)=> <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  linkedin: (p)=> <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 11.01-4.12 2.06 2.06 0 01-.01 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0h.01z"/></svg>,
};

// Flag pill — CSS-drawn, not emoji
function Flag({code, size=16}){
  const emoji = {
    US:'🇺🇸', UK:'🇬🇧', GB:'🇬🇧', DE:'🇩🇪', FR:'🇫🇷', CN:'🇨🇳', JP:'🇯🇵',
    AE:'🇦🇪', AU:'🇦🇺', CA:'🇨🇦', IN:'🇮🇳', BR:'🇧🇷', MX:'🇲🇽', KR:'🇰🇷',
    IT:'🇮🇹', ES:'🇪🇸', NL:'🇳🇱', SE:'🇸🇪', CH:'🇨🇭', SG:'🇸🇬', TH:'🇹🇭',
    VN:'🇻🇳', ID:'🇮🇩', MY:'🇲🇾', PH:'🇵🇭', RU:'🇷🇺', UA:'🇺🇦', PL:'🇵🇱',
    TR:'🇹🇷', SA:'🇸🇦', EG:'🇪🇬', ZA:'🇿🇦', NG:'🇳🇬', KE:'🇰🇪', IL:'🇮🇱',
    NZ:'🇳🇿', AR:'🇦🇷', CL:'🇨🇱', CO:'🇨🇴', PE:'🇵🇪', PT:'🇵🇹', AT:'🇦🇹',
    BE:'🇧🇪', DK:'🇩🇰', NO:'🇳🇴', FI:'🇫🇮', IE:'🇮🇪', CZ:'🇨🇿', HU:'🇭🇺',
    RO:'🇷🇴', GR:'🇬🇷', HK:'🇭🇰', TW:'🇹🇼', PK:'🇵🇰', BD:'🇧🇩', LK:'🇱🇰',
  };
  return <span style={{fontSize:size, lineHeight:1, verticalAlign:'middle'}}>{emoji[code]||'🏳️'}</span>;
}

const COUNTRY_CODES = {
  'United States':'US','United Kingdom':'GB','Germany':'DE','France':'FR','China':'CN',
  'Japan':'JP','South Korea':'KR','Canada':'CA','Australia':'AU','India':'IN',
  'Brazil':'BR','Mexico':'MX','Italy':'IT','Spain':'ES','Netherlands':'NL',
  'Turkey':'TR','Singapore':'SG','Thailand':'TH','Vietnam':'VN','Indonesia':'ID',
  'Russia':'RU','Ukraine':'UA','Poland':'PL','Switzerland':'CH','Sweden':'SE',
  'Saudi Arabia':'SA','UAE':'AE','South Africa':'ZA','Argentina':'AR','New Zealand':'NZ',
};

// Carrier brand mark — tiny squared logo
function CarrierMark({name, bg, fg, letters}){
  return (
    <div style={{
      width:36, height:36, borderRadius:8, background:bg, color:fg,
      display:'flex', alignItems:'center', justifyContent:'center',
      fontSize:11, fontWeight:800, letterSpacing:'.02em',
      boxShadow:'inset 0 0 0 1px rgba(0,0,0,.06)',
      flex:'0 0 36px',
    }} aria-label={name}>{letters}</div>
  );
}

const CARRIERS = [
  { id:'dhl',   name:'DHL Express',    letters:'DHL', bg:'#FFCC00', fg:'#D40511', price:42.80, days:'2–3', service:'Express Worldwide', rating:4.8, reviews:'128k', badge:'Most popular', tracking:'Real-time', insured:true },
  { id:'fedex', name:'FedEx',          letters:'FDX', bg:'#4D148C', fg:'#FF6600', price:46.20, days:'2–4', service:'Intl Priority',      rating:4.7, reviews:'94k',  badge:null, tracking:'Real-time', insured:true },
  { id:'ups',   name:'UPS',            letters:'UPS', bg:'#351C15', fg:'#FFB500', price:49.75, days:'3–4', service:'Worldwide Saver',    rating:4.6, reviews:'71k',  badge:null, tracking:'Real-time', insured:true },
  { id:'sfx',   name:'SF Express',     letters:'SF',  bg:'#000000', fg:'#FFFFFF', price:38.90, days:'4–6', service:'International Std',  rating:4.5, reviews:'22k',  badge:'Cheapest', tracking:'Scan-based', insured:false },
  { id:'ara',   name:'Aramex',         letters:'ARX', bg:'#E32219', fg:'#FFFFFF', price:41.10, days:'3–5', service:'Priority Express',   rating:4.4, reviews:'18k',  badge:null, tracking:'Scan-based', insured:true },
  { id:'ems',   name:'EMS',            letters:'EMS', bg:'#0F3C8A', fg:'#FFD400', price:34.50, days:'6–10',service:'EMS Worldwide',      rating:4.2, reviews:'45k',  badge:'Best value', tracking:'Scan-based', insured:false },
];

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
        <a href="#" style={{display:'flex', alignItems:'center', gap:10}}>
          <div style={{
            width:28, height:28, borderRadius:8,
            background:'linear-gradient(135deg, var(--blue) 0%, #2F88FF 100%)',
            display:'grid', placeItems:'center', color:'#fff',
            boxShadow:'0 4px 10px rgba(26,115,232,.28)'
          }}>
            <I.ship width="16" height="16"/>
          </div>
          <span style={{fontWeight:800, fontSize:17, letterSpacing:'-.01em'}}>RateShips</span>
        </a>
        <nav style={{display:'flex', gap:28, fontSize:14, color:'var(--body)', fontWeight:500}} className="desktop-only">
          <a href="#">Rates</a>
          <a href="#">Tools</a>
          <a href="#">Carriers</a>
          <a href="#">API</a>
          <a href="#">Pricing</a>
          <a href="#">Resources</a>
        </nav>
        <div style={{marginLeft:'auto', display:'flex', alignItems:'center', gap:14}}>
          <a href="mailto:info@rateships.com" style={{fontSize:13, fontWeight:500, color:'var(--muted)'}} className="desktop-only">info@rateships.com</a>
          <a href="#calc" style={{
            padding:'9px 16px', borderRadius:999, background:'var(--ink)', color:'#fff',
            fontSize:14, fontWeight:600,
          }}>Compare rates — free</a>
        </div>
      </div>
    </header>
  );
}

/* =============================================================
   HERO + CALCULATOR
============================================================= */

const HERO_IMG = 'https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=900&q=80&auto=format&fit=crop'; // shipping containers

// World map SVG with shipping arcs
const WorldMap = ({opacity=.14})=>(
  <svg viewBox="0 0 1000 500" style={{width:'100%', height:'100%', opacity}} aria-hidden>
    <defs>
      <pattern id="dots" width="10" height="10" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.1" fill="#6B7280"/>
      </pattern>
      <mask id="continents">
        {/* Rough continental shapes */}
        <path d="M140 140 Q 170 90, 240 110 Q 290 130, 280 180 Q 260 250, 200 260 Q 140 250, 130 200 Z" fill="white"/>
        <path d="M210 310 Q 260 300, 290 340 Q 300 400, 260 440 Q 220 450, 210 400 Z" fill="white"/>
        <path d="M450 120 Q 520 100, 560 130 Q 550 180, 500 180 Q 460 170, 450 140 Z" fill="white"/>
        <path d="M470 200 Q 530 200, 560 260 Q 540 340, 480 360 Q 440 320, 440 260 Z" fill="white"/>
        <path d="M600 140 Q 720 120, 820 160 Q 860 200, 810 240 Q 720 250, 640 230 Q 590 190, 600 140 Z" fill="white"/>
        <path d="M820 370 Q 880 360, 900 400 Q 880 430, 830 420 Z" fill="white"/>
      </mask>
    </defs>
    <rect width="1000" height="500" fill="url(#dots)" mask="url(#continents)"/>
    {/* shipping arcs */}
    <g fill="none" stroke="#1A73E8" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="3 4">
      <path d="M220 180 Q 360 80, 500 150" opacity=".7"/>
      <path d="M500 150 Q 640 60, 760 180" opacity=".7"/>
      <path d="M240 220 Q 400 340, 500 280" opacity=".6"/>
      <path d="M760 180 Q 820 280, 840 380" opacity=".6"/>
      <path d="M240 340 Q 360 400, 480 320" opacity=".5"/>
    </g>
    {/* city dots */}
    {[[220,180],[500,150],[760,180],[240,340],[840,380],[500,280],[480,320]].map(([x,y],i)=>(
      <g key={i}><circle cx={x} cy={y} r="5" fill="#1A73E8" opacity=".25"/><circle cx={x} cy={y} r="2.5" fill="#1A73E8"/></g>
    ))}
  </svg>
);

// Carrier brand row — real brand colors
const CARRIER_BRANDS = [
  { name:'DHL',       bg:'#FFCC00', fg:'#D40511' },
  { name:'FedEx',     bg:'#4D148C', fg:'#FF6600' },
  { name:'UPS',       bg:'#351C15', fg:'#FFB500' },
  { name:'EMS',       bg:'#0F3C8A', fg:'#FFD400' },
  { name:'SF Express',bg:'#000000', fg:'#FFFFFF' },
  { name:'Aramex',    bg:'#E32219', fg:'#FFFFFF' },
];
function CarrierStrip({label='Trusted by shippers using'}){
  return (
    <div>
      <div style={{fontSize:11, fontWeight:700, color:'var(--muted)', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:14}}>{label}</div>
      <div style={{display:'flex', gap:10, flexWrap:'wrap', alignItems:'center'}}>
        {CARRIER_BRANDS.map(b=>(
          <div key={b.name} style={{
            padding:'8px 14px', borderRadius:8, background:b.bg, color:b.fg,
            fontWeight:800, fontSize:13, letterSpacing:'.02em',
            boxShadow:'inset 0 0 0 1px rgba(0,0,0,.08)',
          }}>{b.name}</div>
        ))}
        <div style={{fontSize:12, color:'var(--muted)', paddingLeft:8}}>+ 128 more</div>
      </div>
    </div>
  );
}

const PARCEL_IMG = 'https://images.unsplash.com/photo-1607166452427-7e4477079cb9?w=600&q=80&auto=format&fit=crop'; // parcel stack
const WAREHOUSE_IMG = 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80&auto=format&fit=crop'; // warehouse
const PORT_IMG = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&q=80&auto=format&fit=crop'; // port aerial
const CARGO_IMG = 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=700&q=80&auto=format&fit=crop'; // cargo plane
const COURIER_IMG = 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=600&q=80&auto=format&fit=crop'; // courier delivery

function Hero(){
  const [from, setFrom] = useState('United States');
  const [to, setTo] = useState('United Kingdom');
  const [weight, setWeight] = useState('2.5');
  const [type, setType] = useState('Package');
  return (
    <section style={{position:'relative', overflow:'hidden'}}>
      <div aria-hidden style={{
        position:'absolute', inset:0, zIndex:0,
        backgroundImage:`
          radial-gradient(1000px 400px at 80% -10%, rgba(26,115,232,.08), transparent 60%),
          radial-gradient(800px 400px at -10% 20%, rgba(232,92,58,.05), transparent 60%),
          linear-gradient(var(--line-2) 1px, transparent 1px),
          linear-gradient(90deg, var(--line-2) 1px, transparent 1px)`,
        backgroundSize:'auto, auto, 48px 48px, 48px 48px',
        maskImage:'linear-gradient(180deg, #000 60%, transparent 100%)'
      }}/>
      {/* world map behind calculator */}
      <div aria-hidden style={{position:'absolute', inset:0, zIndex:0, pointerEvents:'none'}}>
        <div style={{position:'absolute', top:'8%', right:'-5%', width:'70%', height:'80%'}}>
          <WorldMap opacity={.18}/>
        </div>
      </div>
      <div style={{position:'relative', zIndex:1, maxWidth:1320, margin:'0 auto', padding:'56px 32px 80px'}}>
        {/* Asymmetric grid: copy 5, calc 4, image 3 */}
        <div style={{display:'grid', gridTemplateColumns:'1.15fr .95fr', gap:48, alignItems:'flex-start'}} className="hero-grid">
          {/* LEFT: copy — offset down slightly */}
          <div style={{paddingTop:32}}>
            <div style={{
              display:'inline-flex', alignItems:'center', gap:8,
              padding:'6px 12px 6px 8px', borderRadius:999,
              background:'#fff', border:'1px solid var(--line)',
              fontSize:12, fontWeight:600, color:'var(--ink-2)',
              boxShadow:'var(--shadow-sm)'
            }}>
              <span style={{width:6, height:6, borderRadius:999, background:'var(--good)', boxShadow:'0 0 0 4px var(--good-50)'}}/>
              45,000+ shipping routes covered
            </div>
            <h1 style={{
              margin:'20px 0 18px', fontSize:'clamp(40px, 5.4vw, 68px)',
              lineHeight:1.0, letterSpacing:'-.03em', fontWeight:800, color:'var(--ink)'
            }}>
              Compare <span style={{
                color:'var(--blue)', position:'relative', display:'inline-block'
              }}>134+ carriers
                <svg aria-hidden viewBox="0 0 340 20" style={{position:'absolute', left:0, bottom:-10, width:'100%', height:14}}>
                  <path d="M2 12 Q 80 2, 170 10 T 338 8" stroke="var(--warm)" strokeWidth="5" fill="none" strokeLinecap="round" opacity=".85"/>
                </svg>
              </span>
              <br/>in 5 seconds.
            </h1>
            <p style={{fontSize:19, color:'var(--body)', lineHeight:1.5, maxWidth:520, margin:'0 0 28px'}}>
              One search. Every global courier. Live rates for DHL, FedEx, UPS, SF Express, EMS, Aramex and 128 others — across 213 countries.
            </p>
            <div style={{display:'flex', gap:12, flexWrap:'wrap'}}>
              <a href="#calc" style={{
                padding:'14px 22px', borderRadius:12, background:'var(--blue)', color:'#fff',
                fontWeight:600, fontSize:15, display:'inline-flex', alignItems:'center', gap:8,
                boxShadow:'0 10px 20px -8px rgba(26,115,232,.6), inset 0 1px 0 rgba(255,255,255,.2)'
              }}>Get a free quote <I.arrow width="16" height="16"/></a>
              <a href="#" style={{
                padding:'14px 22px', borderRadius:12, background:'#fff', color:'var(--ink)',
                fontWeight:600, fontSize:15, border:'1px solid var(--line)', boxShadow:'var(--shadow-sm)'
              }}>See live rates →</a>
            </div>
            <div style={{marginTop:32, display:'flex', gap:28, flexWrap:'wrap', fontSize:13, color:'var(--muted)'}}>
              <span style={{display:'inline-flex', alignItems:'center', gap:8}}><I.check width="14" height="14" style={{color:'var(--good)'}}/> No credit card</span>
              <span style={{display:'inline-flex', alignItems:'center', gap:8}}><I.check width="14" height="14" style={{color:'var(--good)'}}/> Save up to 35%</span>
              <span style={{display:'inline-flex', alignItems:'center', gap:8}}><I.check width="14" height="14" style={{color:'var(--good)'}}/> Live rates, not averages</span>
            </div>

            {/* Brand strip below copy */}
            <div style={{marginTop:56, paddingTop:28, borderTop:'1px solid var(--line)'}}>
              <CarrierStrip/>
            </div>
          </div>

          {/* RIGHT: calculator + floating image */}
          <div style={{position:'relative'}}>
            {/* Offset decorative image — top right, rotated */}
            <div style={{
              position:'absolute', top:-20, right:-24, width:220, height:150,
              borderRadius:16, overflow:'hidden', transform:'rotate(4deg)',
              boxShadow:'var(--shadow-lg)', border:'4px solid #fff', zIndex:2,
              backgroundImage:`url(${HERO_IMG})`, backgroundSize:'cover', backgroundPosition:'center'
            }} className="hero-float hero-img-a"/>
            {/* Calculator, offset */}
            <div style={{position:'relative', zIndex:1, marginTop:40}}>
              <Calculator {...{from, setFrom, to, setTo, weight, setWeight, type, setType}}/>
            </div>
            {/* Parcel image bottom left, opposite rotation */}
            <div style={{
              position:'absolute', bottom:-30, left:-40, width:180, height:180,
              borderRadius:'50%', overflow:'hidden', transform:'rotate(-6deg)',
              boxShadow:'var(--shadow-lg)', border:'4px solid #fff', zIndex:2,
              backgroundImage:`url(${PARCEL_IMG})`, backgroundSize:'cover', backgroundPosition:'center'
            }} className="hero-float hero-img-b"/>
            {/* Floating data badge */}
            <div style={{
              position:'absolute', bottom:40, right:-30, zIndex:3,
              background:'#fff', borderRadius:14, border:'1px solid var(--line)',
              padding:'12px 16px', boxShadow:'var(--shadow-lg)', transform:'rotate(3deg)',
              display:'flex', alignItems:'center', gap:10
            }} className="hero-float hero-badge">
              <div style={{width:36, height:36, borderRadius:10, background:'var(--accent-50)', color:'var(--accent)', display:'grid', placeItems:'center'}}>
                <I.spark width="18" height="18"/>
              </div>
              <div>
                <div className="tnum" style={{fontSize:18, fontWeight:800, letterSpacing:'-.01em', lineHeight:1}}>$18.40</div>
                <div style={{fontSize:11, color:'var(--muted)', marginTop:2}}>saved on last quote</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Calculator({from, setFrom, to, setTo, weight, setWeight, type, setType}){
  return (
    <div id="calc" style={{
      background:'var(--card)', borderRadius:20, padding:22,
      border:'1px solid var(--line)', boxShadow:'var(--shadow-lg)',
      position:'relative'
    }}>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14}}>
        <div style={{display:'flex', alignItems:'center', gap:8}}>
          <div style={{width:30, height:30, borderRadius:8, background:'var(--blue-50)', color:'var(--blue)', display:'grid', placeItems:'center'}}>
            <I.calc width="16" height="16"/>
          </div>
          <div>
            <div style={{fontWeight:700, fontSize:14}}>Shipping calculator</div>
            <div style={{fontSize:12, color:'var(--muted)'}}>Live rates · updated 12s ago</div>
          </div>
        </div>
        <span style={{
          padding:'4px 10px', fontSize:11, fontWeight:700, letterSpacing:'.04em', textTransform:'uppercase',
          background:'var(--good-50)', color:'var(--good)', borderRadius:999
        }}>LIVE</span>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
        <Field label="From" value={from} onChange={setFrom} flag={COUNTRY_CODES[from]||'US'} options={['United States','United Kingdom','Germany','France','China','Japan','South Korea','Canada','Australia','India','Brazil','Mexico','Italy','Spain','Netherlands','Turkey','Singapore','Thailand','Vietnam','Indonesia','Russia','Ukraine','Poland','Switzerland','Sweden','Saudi Arabia','UAE','South Africa','Argentina','New Zealand']}/>
        <Field label="To" value={to} onChange={setTo} flag={COUNTRY_CODES[to]||'GB'} options={['United Kingdom','United States','Germany','France','China','Japan','South Korea','Canada','Australia','India','Brazil','Mexico','Italy','Spain','Netherlands','Turkey','Singapore','Thailand','Vietnam','Indonesia','Russia','Ukraine','Poland','Switzerland','Sweden','Saudi Arabia','UAE','South Africa','Argentina','New Zealand']}/>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'1.1fr .9fr', gap:10, marginTop:10}}>
        <Field label="Weight" value={weight} onChange={setWeight} suffix="kg" numeric/>
        <Field label="Type" value={type} onChange={setType} options={['Package','Document','Pallet','Fragile']}/>
      </div>

      <div style={{
        marginTop:14, padding:'12px 14px', background:'var(--bg)', borderRadius:12,
        border:'1px dashed var(--line)', display:'flex', alignItems:'center', gap:12, fontSize:13,
      }}>
        <I.bolt width="16" height="16" style={{color:'var(--accent)'}}/>
        <span style={{color:'var(--body)'}}>We found <b style={{color:'var(--ink)'}}>17 carriers</b> for this route. Cheapest from</span>
        <span className="tnum" style={{marginLeft:'auto', fontWeight:800, color:'var(--ink)'}}>$34.50</span>
      </div>

      <button style={{
        marginTop:14, width:'100%', padding:'14px', borderRadius:12,
        background:'var(--blue)', color:'#fff', fontWeight:700, fontSize:15,
        display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8,
        boxShadow:'0 10px 20px -8px rgba(26,115,232,.55), inset 0 1px 0 rgba(255,255,255,.25)'
      }}>
        <I.search width="16" height="16"/> Compare rates
      </button>

      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:12}}>
        <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
          {['0.5 kg envelope','Pallet (EU)','Fragile art','5kg box'].map(p=>(
            <button key={p} style={{
              padding:'6px 10px', fontSize:12, color:'var(--body)', fontWeight:500,
              background:'#fff', border:'1px solid var(--line)', borderRadius:999,
            }}>{p}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Field({label, value, onChange, options, suffix, numeric, flag}){
  return (
    <label style={{
      display:'block', background:'#fff', border:'1px solid var(--line)',
      borderRadius:12, padding:'10px 14px', transition:'border-color .15s',
    }}>
      <div style={{fontSize:11, fontWeight:600, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.06em'}}>{label}</div>
      <div style={{display:'flex', alignItems:'center', gap:8, marginTop:4}}>
        {flag && <Flag code={flag}/>}
        {options ? (
          <select value={value} onChange={e=>onChange(e.target.value)} style={{
            flex:1, border:'none', outline:'none', appearance:'none', background:'transparent',
            fontSize:15, fontWeight:600, color:'var(--ink)', padding:0,
          }}>
            {options.map(o=> <option key={o} value={o}>{o}</option>)}
          </select>
        ) : (
          <input inputMode={numeric?'decimal':undefined} value={value} onChange={e=>onChange(e.target.value)} style={{
            flex:1, border:'none', outline:'none', background:'transparent',
            fontSize:15, fontWeight:600, color:'var(--ink)', padding:0, width:'100%',
          }}/>
        )}
        {suffix && <span style={{fontSize:13, color:'var(--muted)', fontWeight:600}}>{suffix}</span>}
        {options && <I.chev width="14" height="14" style={{color:'var(--muted)'}}/>}
      </div>
    </label>
  );
}

/* =============================================================
   TRUST STRIP
============================================================= */

function TrustStrip(){
  return (
    <section style={{padding:'48px 32px', background:'#fff', borderTop:'1px solid var(--line)', borderBottom:'1px solid var(--line)'}}>
      <div style={{maxWidth:1240, margin:'0 auto', textAlign:'center'}}>
        <div style={{fontSize:15, fontWeight:600, color:'var(--ink)', marginBottom:22}}>
          Free rate comparison across 134+ carriers
        </div>
        <div style={{display:'flex', gap:32, flexWrap:'wrap', justifyContent:'center', alignItems:'center', marginBottom:20}}>
          {[
            {t:'No signup', icon:<I.check width="14" height="14"/>},
            {t:'No credit card', icon:<I.check width="14" height="14"/>},
            {t:'No carrier commissions', icon:<I.check width="14" height="14"/>},
            {t:'Published tariff data', icon:<I.shield width="14" height="14"/>},
            {t:'Updated weekly', icon:<I.clock width="14" height="14"/>},
            {t:'12 languages', icon:<I.globe width="14" height="14"/>},
          ].map(item=>(
            <span key={item.t} style={{
              display:'inline-flex', alignItems:'center', gap:6, fontSize:14, fontWeight:500, color:'var(--body)'
            }}>
              <span style={{color:'var(--good)'}}>{item.icon}</span> {item.t}
            </span>
          ))}
        </div>
        <div style={{fontSize:13, color:'var(--muted)', display:'inline-flex', alignItems:'center', gap:12, justifyContent:'center'}}>
          <span>Operated by Global Supply KFT, Hungary</span>
          <span style={{color:'var(--line)'}}>·</span>
          <span>EU VAT: HU26179030</span>
          <span style={{color:'var(--line)'}}>·</span>
          <a href="mailto:info@rateships.com" style={{color:'var(--blue)', fontWeight:600}}>info@rateships.com</a>
        </div>
      </div>
    </section>
  );
}

/* =============================================================
   POPULAR ROUTES
============================================================= */

function PopularRoutes(){
  const routes = [
    { from:'US', fromN:'United States', to:'GB', toN:'United Kingdom', price:'$34.50', days:'2–4 days', top:'DHL Express' },
    { from:'CN', fromN:'China',         to:'US', toN:'United States',  price:'$28.90', days:'4–6 days', top:'SF Express' },
    { from:'DE', fromN:'Germany',       to:'FR', toN:'France',         price:'$12.40', days:'1–2 days', top:'DPD' },
    { from:'GB', fromN:'United Kingdom',to:'AU', toN:'Australia',      price:'$52.80', days:'5–7 days', top:'UPS' },
    { from:'JP', fromN:'Japan',         to:'US', toN:'United States',  price:'$38.70', days:'3–5 days', top:'FedEx' },
    { from:'IN', fromN:'India',         to:'AE', toN:'United Arab Em.',price:'$19.20', days:'2–3 days', top:'Aramex' },
    { from:'CA', fromN:'Canada',        to:'US', toN:'United States',  price:'$16.90', days:'1–3 days', top:'UPS' },
    { from:'BR', fromN:'Brazil',        to:'GB', toN:'Portugal',       price:'$44.10', days:'5–8 days', top:'EMS' },
  ];
  return (
    <section style={{padding:'80px 32px'}}>
      <div style={{maxWidth:1240, margin:'0 auto'}}>
        <div style={{display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:32, flexWrap:'wrap', gap:16}}>
          <div>
            <div style={{fontSize:12, fontWeight:700, color:'var(--blue)', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:10}}>Popular corridors</div>
            <h2 style={{margin:0, fontSize:'clamp(28px,3.2vw,40px)', fontWeight:800, letterSpacing:'-.02em', lineHeight:1.1}}>Popular shipping corridors</h2>
          </div>
          <a href="#" style={{fontSize:14, fontWeight:600, color:'var(--blue)'}}>Browse all 213 countries →</a>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:16}} className="routes-grid">
          {routes.map((r,i)=>(
            <a key={i} href="#" className="route-card" style={{
              display:'block', padding:18, background:'#fff',
              border:'1px solid var(--line)', borderRadius:14,
              transition:'transform .2s, box-shadow .2s, border-color .2s',
            }}>
              <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:12}}>
                <Flag code={r.from}/>
                <I.arrow width="14" height="14" style={{color:'var(--muted)'}}/>
                <Flag code={r.to}/>
              </div>
              <div style={{fontSize:15, fontWeight:700, color:'var(--ink)', letterSpacing:'-.01em'}}>{r.fromN} → {r.toN}</div>
              <div style={{display:'flex', alignItems:'baseline', gap:8, marginTop:10}}>
                <span style={{fontSize:11, color:'var(--muted)'}}>From</span>
                <span className="tnum" style={{fontSize:20, fontWeight:800, letterSpacing:'-.02em'}}>{r.price}</span>
              </div>
              <div style={{marginTop:10, paddingTop:10, borderTop:'1px solid var(--line-2)', display:'flex', justifyContent:'space-between', fontSize:12, color:'var(--muted)'}}>
                <span><I.clock width="12" height="12" style={{verticalAlign:'-2px', marginRight:4}}/>{r.days}</span>
                <span style={{fontWeight:600, color:'var(--ink-2)'}}>{r.top}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =============================================================
   LIVE RESULTS TABLE
============================================================= */

function ResultsTable(){
  const [filter, setFilter] = useState('all');
  const sorted = useMemo(()=>{
    let rows = [...CARRIERS];
    if (filter==='cheap') rows.sort((a,b)=>a.price-b.price);
    else if (filter==='fast') rows.sort((a,b)=>parseInt(a.days)-parseInt(b.days));
    else if (filter==='rated') rows.sort((a,b)=>b.rating-a.rating);
    else if (filter==='insured') rows = rows.filter(r=>r.insured);
    return rows;
  },[filter]);

  const cheapest = Math.min(...CARRIERS.map(c=>c.price));

  return (
    <section style={{padding:'72px 32px', borderTop:'1px solid var(--line)'}}>
      <div style={{maxWidth:1240, margin:'0 auto'}}>
        <SectionHead
          eyebrow="Live rates"
          title={<>Real quotes from 17 carriers for this route.</>}
          desc="No tricks, no sign-up. Rates from published carrier tariffs, updated weekly."
        />

        {/* route bar */}
        <div style={{
          display:'flex', alignItems:'center', gap:14, padding:'14px 18px',
          background:'#fff', border:'1px solid var(--line)', borderRadius:16,
          boxShadow:'var(--shadow-sm)', marginBottom:14, flexWrap:'wrap'
        }}>
          <div style={{display:'flex', alignItems:'center', gap:10}}>
            <Flag code="US"/> <span style={{fontWeight:700}}>New York, US</span>
          </div>
          <div style={{flex:'0 0 60px', height:1, background:'var(--line)', position:'relative'}}>
            <I.plane width="14" height="14" style={{position:'absolute', left:'50%', top:'-7px', transform:'translateX(-50%) rotate(90deg)', color:'var(--blue)'}}/>
          </div>
          <div style={{display:'flex', alignItems:'center', gap:10}}>
            <Flag code="GB"/> <span style={{fontWeight:700}}>London, UK</span>
          </div>
          <div style={{width:1, height:22, background:'var(--line)'}}/>
          <div style={{fontSize:13, color:'var(--muted)'}}>Package · <b style={{color:'var(--ink)'}}>2.5 kg</b> · 30 × 20 × 15 cm</div>
          <div style={{marginLeft:'auto', display:'flex', gap:8, flexWrap:'wrap'}}>
            {[
              ['all','All 17'],
              ['cheap','Cheapest'],
              ['fast','Fastest'],
              ['rated','Top rated'],
              ['insured','Insured only'],
            ].map(([k,l])=>(
              <button key={k} onClick={()=>setFilter(k)} style={{
                padding:'8px 14px', borderRadius:999, fontSize:13, fontWeight:600,
                border:'1px solid '+(filter===k?'var(--ink)':'var(--line)'),
                background: filter===k?'var(--ink)':'#fff',
                color: filter===k?'#fff':'var(--body)',
              }}>{l}</button>
            ))}
          </div>
        </div>

        {/* table */}
        <div style={{background:'#fff', border:'1px solid var(--line)', borderRadius:16, overflow:'hidden', boxShadow:'var(--shadow-sm)'}}>
          {/* header */}
          <div className="row-grid" style={{
            display:'grid', gridTemplateColumns:'2.4fr 1.4fr 1fr 1.2fr 1.2fr 1fr',
            padding:'14px 20px', fontSize:11, fontWeight:700, color:'var(--muted)',
            textTransform:'uppercase', letterSpacing:'.06em',
            background:'var(--bg)', borderBottom:'1px solid var(--line)'
          }}>
            <div>Carrier</div>
            <div>Service</div>
            <div>Transit</div>
            <div>Rating</div>
            <div>Tracking</div>
            <div style={{textAlign:'right'}}>Rate</div>
          </div>
          {sorted.map((c,i)=>(
            <Row key={c.id} c={c} isCheapest={c.price===cheapest} last={i===sorted.length-1}/>
          ))}
        </div>

        <div style={{
          marginTop:14, fontSize:13, color:'var(--muted)',
          display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10
        }}>
          <span>Showing 6 of 17 carriers for this route · <a href="#" style={{color:'var(--blue)', fontWeight:600}}>See all →</a></span>
          <span>Rates from published carrier tariffs · <a href="#" style={{color:'var(--blue)', fontWeight:600}}>Data methodology</a></span>
        </div>

        {/* Data source disclaimer */}
        <div style={{
          marginTop:16, padding:'14px 18px', background:'var(--bg)', borderRadius:12,
          border:'1px solid var(--line)', display:'flex', alignItems:'center', gap:12,
          fontSize:12, color:'var(--muted)'
        }}>
          <I.shield width="14" height="14" style={{color:'var(--blue)', flexShrink:0}}/>
          <span>Rates are estimates based on published carrier tariffs, updated weekly. Final price is confirmed by the carrier at booking. RateShips is an independent comparison tool — we take no commissions from carriers. <a href="#" style={{color:'var(--blue)', fontWeight:600}}>Learn more</a></span>
        </div>
      </div>
    </section>
  );
}

function Row({c, isCheapest, last}){
  return (
    <div className="row-grid result-row" style={{
      display:'grid', gridTemplateColumns:'2.4fr 1.4fr 1fr 1.2fr 1.2fr 1fr',
      padding:'16px 20px', alignItems:'center', cursor:'pointer',
      borderBottom: last?'none':'1px solid var(--line-2)',
      background: isCheapest?'linear-gradient(90deg, rgba(232,92,58,.04) 0%, transparent 60%)':'transparent',
      transition:'background .15s'
    }}>
      <div style={{display:'flex', alignItems:'center', gap:12, minWidth:0}}>
        <CarrierMark name={c.name} bg={c.bg} fg={c.fg} letters={c.letters}/>
        <div style={{minWidth:0}}>
          <div style={{fontWeight:700, fontSize:15, display:'flex', alignItems:'center', gap:8, flexWrap:'wrap'}}>
            {c.name}
            {c.badge && <span style={{
              fontSize:10, fontWeight:700, letterSpacing:'.04em', textTransform:'uppercase',
              padding:'3px 7px', borderRadius:4,
              background: c.badge==='Cheapest'?'var(--accent-50)': c.badge==='Best value'?'var(--warm-50)':'var(--blue-50)',
              color: c.badge==='Cheapest'?'var(--accent)': c.badge==='Best value'?'#A37A00':'var(--blue)',
            }}>{c.badge}</span>}
          </div>
          <div style={{fontSize:12, color:'var(--muted)', marginTop:2}}>{c.reviews} reviews · {c.insured?'Insured up to $100':'Basic cover'}</div>
        </div>
      </div>
      <div style={{fontSize:14, color:'var(--body)'}}>{c.service}</div>
      <div style={{display:'flex', alignItems:'center', gap:6, fontSize:14, fontWeight:600}}>
        <I.clock width="14" height="14" style={{color:'var(--muted)'}}/>
        <span className="tnum">{c.days}d</span>
      </div>
      <div style={{display:'flex', alignItems:'center', gap:6}}>
        <I.star width="14" height="14" style={{color:'var(--warm)'}}/>
        <span style={{fontWeight:700, fontSize:14}} className="tnum">{c.rating.toFixed(1)}</span>
        <span style={{fontSize:12, color:'var(--muted)'}}>/5</span>
      </div>
      <div style={{fontSize:13, color:'var(--body)', display:'flex', alignItems:'center', gap:6}}>
        <span style={{width:6, height:6, borderRadius:999, background: c.tracking==='Real-time'?'var(--good)':'var(--warm)'}}/>
        {c.tracking}
      </div>
      <div style={{textAlign:'right'}}>
        <div className="tnum" style={{fontSize:19, fontWeight:800, letterSpacing:'-.01em'}}>${c.price.toFixed(2)}</div>
        <div style={{fontSize:11, color:'var(--muted)'}}>all-in, VAT incl.</div>
      </div>
    </div>
  );
}

/* =============================================================
   TOOL CARDS
============================================================= */

function Tools(){
  return (
    <section style={{padding:'72px 32px', background:'#fff', borderTop:'1px solid var(--line)', borderBottom:'1px solid var(--line)'}}>
      <div style={{maxWidth:1240, margin:'0 auto'}}>
        <SectionHead
          eyebrow="Tools"
          title={<>More than a rate comparator.</>}
          desc="Three focused tools for the rest of your shipping workflow."
        />
        <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:20}} className="tools-grid">
          <ToolRateTable/>
          <ToolCustoms/>
          <ToolDelivery/>
        </div>
      </div>
    </section>
  );
}

function ToolCard({tint, tag, title, desc, children, cta}){
  return (
    <div style={{
      background:'var(--bg)', borderRadius:20, border:'1px solid var(--line)',
      padding:24, display:'flex', flexDirection:'column', gap:18,
      boxShadow:'var(--shadow-sm)'
    }}>
      <div style={{display:'flex', alignItems:'center', gap:10}}>
        <div style={{
          width:36, height:36, borderRadius:10, background:tint.bg, color:tint.fg,
          display:'grid', placeItems:'center'
        }}>{tint.icon}</div>
        <span style={{fontSize:11, fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.08em'}}>{tag}</span>
      </div>
      <div>
        <h3 style={{margin:'0 0 6px', fontSize:22, fontWeight:700, letterSpacing:'-.015em'}}>{title}</h3>
        <p style={{margin:0, fontSize:14, color:'var(--body)'}}>{desc}</p>
      </div>
      <div style={{
        background:'#fff', borderRadius:14, border:'1px solid var(--line)',
        padding:16, flex:1
      }}>{children}</div>
      <a href="#" style={{fontSize:14, fontWeight:600, color:'var(--ink)', display:'inline-flex', alignItems:'center', gap:6}}>
        {cta} <I.arrow width="14" height="14"/>
      </a>
    </div>
  );
}

function ToolRateTable(){
  const rows = [
    ['0.5 kg','$18.40','$22.10','$24.90'],
    ['1.0 kg','$24.60','$28.50','$31.40'],
    ['2.5 kg','$38.90','$42.80','$46.20'],
    ['5.0 kg','$61.20','$67.50','$72.10'],
    ['10 kg','$104.50','$118.20','$126.70'],
  ];
  return (
    <ToolCard
      tint={{bg:'var(--blue-50)', fg:'var(--blue)', icon:<I.doc width="18" height="18"/>}}
      tag="Rate Table"
      title="Download rate tables"
      desc="Export full CSV matrices by weight, zone, and carrier — ready for finance."
      cta="Build rate table"
    >
      <div style={{fontSize:11, fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:8, display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr'}}>
        <span>Weight</span><span>SF Exp.</span><span>DHL</span><span>FedEx</span>
      </div>
      {rows.map(r=>(
        <div key={r[0]} style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', padding:'6px 0', borderTop:'1px solid var(--line-2)', fontSize:13}} className="tnum">
          <span style={{fontWeight:600}}>{r[0]}</span>
          <span style={{color:'var(--good)', fontWeight:600}}>{r[1]}</span>
          <span>{r[2]}</span>
          <span>{r[3]}</span>
        </div>
      ))}
    </ToolCard>
  );
}

function ToolCustoms(){
  return (
    <ToolCard
      tint={{bg:'var(--accent-50)', fg:'var(--accent)', icon:<I.shield width="18" height="18"/>}}
      tag="Customs Calculator"
      title="Duty & tax, before you ship"
      desc="HS-code lookup across 213 countries, with VAT, duty and broker fees broken down."
      cta="Calculate duties"
    >
      <div style={{fontSize:12, color:'var(--muted)', marginBottom:4}}>Electronics · HS 8517.13 · US → Germany · $1,200</div>
      <div style={{display:'flex', flexDirection:'column', gap:6, marginTop:10}}>
        {[
          ['Declared value','$1,200.00'],
          ['Import duty (0%)','$0.00'],
          ['German VAT (19%)','$228.00'],
          ['Broker handling','$14.50'],
        ].map(r=>(
          <div key={r[0]} style={{display:'flex', justifyContent:'space-between', fontSize:13}}>
            <span style={{color:'var(--body)'}}>{r[0]}</span>
            <span className="tnum" style={{fontWeight:600}}>{r[1]}</span>
          </div>
        ))}
        <div style={{height:1, background:'var(--line)', margin:'6px 0'}}/>
        <div style={{display:'flex', justifyContent:'space-between'}}>
          <span style={{fontWeight:700}}>Landed cost</span>
          <span className="tnum" style={{fontWeight:800, fontSize:16}}>$1,442.50</span>
        </div>
      </div>
    </ToolCard>
  );
}

function ToolDelivery(){
  const days = [
    {d:'Mon', pct:0},{d:'Tue', pct:15},{d:'Wed', pct:62, label:'Most likely'},{d:'Thu', pct:22},{d:'Fri', pct:1}
  ];
  return (
    <ToolCard
      tint={{bg:'var(--warm-50)', fg:'#A37A00', icon:<I.clock width="18" height="18"/>}}
      tag="Delivery Estimator"
      title="When will it actually arrive?"
      desc="Not quoted transit — real delivery distribution, built from 14M+ tracked shipments."
      cta="Estimate delivery"
    >
      <div style={{fontSize:12, color:'var(--muted)', marginBottom:10}}>DHL Express · NYC → London · shipped Mon 8 AM</div>
      <div style={{display:'flex', alignItems:'flex-end', gap:8, height:90}}>
        {days.map(d=>(
          <div key={d.d} style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:6}}>
            <div style={{
              width:'100%', height: Math.max(d.pct*1.1, 3),
              background: d.pct>50?'var(--blue)': d.pct>10?'var(--blue-100)':'var(--line)',
              borderRadius:'4px 4px 2px 2px', position:'relative'
            }}>
              {d.label && <div style={{
                position:'absolute', top:-20, left:'50%', transform:'translateX(-50%)',
                fontSize:10, fontWeight:700, color:'var(--blue)', whiteSpace:'nowrap'
              }}>{d.pct}%</div>}
            </div>
            <div style={{fontSize:11, color:'var(--muted)', fontWeight:600}}>{d.d}</div>
          </div>
        ))}
      </div>
      <div style={{marginTop:12, padding:'8px 10px', background:'var(--blue-50)', borderRadius:8, fontSize:12, color:'var(--blue-700)', fontWeight:600}}>
        97.3% on-time · avg transit 2.8 days
      </div>
    </ToolCard>
  );
}

/* =============================================================
   STATS BAR
============================================================= */

function Stats(){
  const items = [
    {v:'134+',     l:'Carriers integrated', s:'Live API feeds'},
    {v:'213',      l:'Countries covered',   s:'Every UN-recognized territory'},
    {v:'35%',      l:'Average savings',     s:'vs. carrier retail rates', accent:true},
    {v:'2.1M',     l:'Rates served / day',  s:'Cached + live blended'},
  ];
  return (
    <section style={{position:'relative', color:'#fff', overflow:'hidden', isolation:'isolate'}}>
      {/* Full-bleed port image */}
      <div aria-hidden style={{
        position:'absolute', inset:0, zIndex:-2,
        backgroundImage:`url(${PORT_IMG})`, backgroundSize:'cover', backgroundPosition:'center',
      }}/>
      <div aria-hidden style={{
        position:'absolute', inset:0, zIndex:-1,
        background:'linear-gradient(180deg, rgba(15,23,42,.94) 0%, rgba(15,23,42,.85) 50%, rgba(15,23,42,.95) 100%)'
      }}/>
      <div style={{maxWidth:1320, margin:'0 auto', padding:'88px 32px'}}>
        {/* Asymmetric top: eyebrow on left, map data on right */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:32, alignItems:'flex-end', marginBottom:44}} className="stats-top">
          <div>
            <div style={{fontSize:12, fontWeight:700, color:'var(--warm)', textTransform:'uppercase', letterSpacing:'.12em', marginBottom:12}}>The network</div>
            <h2 style={{margin:0, fontSize:'clamp(32px,3.6vw,48px)', fontWeight:800, letterSpacing:'-.025em', lineHeight:1.05}}>
              The largest neutral<br/>shipping network, on tap.
            </h2>
          </div>
          <div style={{display:'flex', justifyContent:'flex-end'}}>
            <div style={{
              padding:'14px 18px', background:'rgba(255,255,255,.06)',
              border:'1px solid rgba(255,255,255,.12)', borderRadius:12,
              backdropFilter:'blur(8px)', maxWidth:320
            }}>
              <div className="mono" style={{fontSize:10, color:'rgba(255,255,255,.55)', letterSpacing:'.08em'}}>LIVE SHIPMENT FEED</div>
              <div style={{marginTop:8, display:'flex', flexDirection:'column', gap:4, fontSize:12}}>
                <div style={{display:'flex', justifyContent:'space-between', color:'rgba(255,255,255,.85)'}}><span>🇺🇸 LAX → 🇯🇵 NRT</span><span className="tnum" style={{color:'var(--warm)'}}>$42.80</span></div>
                <div style={{display:'flex', justifyContent:'space-between', color:'rgba(255,255,255,.85)'}}><span>🇩🇪 FRA → 🇦🇪 DXB</span><span className="tnum" style={{color:'var(--warm)'}}>$28.90</span></div>
                <div style={{display:'flex', justifyContent:'space-between', color:'rgba(255,255,255,.85)'}}><span>🇨🇳 PVG → 🇬🇧 LHR</span><span className="tnum" style={{color:'var(--warm)'}}>$34.50</span></div>
              </div>
            </div>
          </div>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:48}} className="stats-grid">
          {items.map((it,i)=>(
            <div key={i} style={{
              paddingLeft: i>0?28:0,
              borderLeft: i>0?'1px solid rgba(255,255,255,.14)':'none'
            }}>
              <div className="tnum" style={{
                fontSize:'clamp(36px,4vw,60px)', fontWeight:800, letterSpacing:'-.03em', lineHeight:1,
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
   HOW IT WORKS
============================================================= */

function HowItWorks(){
  const stepSVGs = [
    // Step 1: form with country flags
    <svg viewBox="0 0 220 120" width="100%" height="100%" aria-hidden>
      <rect x="10" y="10" width="200" height="100" rx="10" fill="#fff" stroke="#E6E1DA"/>
      <rect x="22" y="24" width="86" height="36" rx="6" fill="#FAF7F2"/>
      <rect x="112" y="24" width="86" height="36" rx="6" fill="#FAF7F2"/>
      <rect x="26" y="34" width="18" height="13" rx="2" fill="#3C3B6E"/>
      <rect x="44" y="34" width="18" height="13" rx="2" fill="#B22234"/>
      <text x="68" y="46" fontSize="9" fontWeight="700" fill="#0F172A" fontFamily="Inter">US</text>
      <rect x="116" y="34" width="18" height="13" rx="2" fill="#012169"/>
      <rect x="134" y="34" width="18" height="13" rx="2" fill="#C8102E"/>
      <text x="158" y="46" fontSize="9" fontWeight="700" fill="#0F172A" fontFamily="Inter">GB</text>
      <rect x="22" y="70" width="124" height="30" rx="6" fill="#FAF7F2"/>
      <text x="32" y="89" fontSize="10" fontWeight="600" fill="#6B7280" fontFamily="Inter">2.5 kg · Package</text>
      <rect x="152" y="70" width="46" height="30" rx="6" fill="#1A73E8"/>
      <text x="161" y="89" fontSize="9" fontWeight="700" fill="#fff" fontFamily="Inter">SEARCH</text>
    </svg>,
    // Step 2: rate table
    <svg viewBox="0 0 220 120" width="100%" height="100%" aria-hidden>
      <rect x="10" y="10" width="200" height="100" rx="10" fill="#fff" stroke="#E6E1DA"/>
      {[0,1,2,3].map(i=>(
        <g key={i}>
          <rect x="22" y={26+i*20} width="24" height="12" rx="3" fill={["#FFCC00","#4D148C","#351C15","#000"][i]}/>
          <text x="52" y={36+i*20} fontSize="9" fontWeight="700" fill="#0F172A" fontFamily="Inter">{["DHL","FedEx","UPS","SF Exp"][i]}</text>
          <rect x="96" y={27+i*20} width={[70,58,48,80][i]} height="4" rx="2" fill="#1A73E8" opacity={[.9,.7,.55,1][i]}/>
          <text x="176" y={36+i*20} fontSize="10" fontWeight="800" fill="#0F172A" fontFamily="JetBrains Mono">${[42.80,46.20,49.75,38.90][i]}</text>
        </g>
      ))}
      <rect x="22" y="22" width="4" height="74" fill="#E85C3A"/>
    </svg>,
    // Step 3: customs breakdown
    <svg viewBox="0 0 220 120" width="100%" height="100%" aria-hidden>
      <rect x="10" y="10" width="200" height="100" rx="10" fill="#fff" stroke="#E6E1DA"/>
      <text x="22" y="30" fontSize="10" fontWeight="700" fill="#0F172A" fontFamily="Inter">Landed cost</text>
      <text x="175" y="30" fontSize="10" fontWeight="800" fill="#0F172A" fontFamily="JetBrains Mono" textAnchor="middle">$1,442</text>
      <line x1="22" y1="40" x2="198" y2="40" stroke="#EFEAE2"/>
      {[["Value","$1,200"],["VAT 19%","$228"],["Broker","$14.50"]].map((r,i)=>(
        <g key={i}>
          <text x="22" y={55+i*17} fontSize="9" fill="#6B7280" fontFamily="Inter">{r[0]}</text>
          <text x="198" y={55+i*17} fontSize="9" fontWeight="600" fill="#0F172A" fontFamily="JetBrains Mono" textAnchor="end">{r[1]}</text>
        </g>
      ))}
      <rect x="22" y="100" width="176" height="4" rx="2" fill="#E6E1DA"/>
      <rect x="22" y="100" width="138" height="4" rx="2" fill="#118A54"/>
    </svg>,
    // Step 4: shipping label with barcode
    <svg viewBox="0 0 220 120" width="100%" height="100%" aria-hidden>
      <rect x="10" y="10" width="200" height="100" rx="10" fill="#fff" stroke="#E6E1DA"/>
      <rect x="22" y="22" width="54" height="18" rx="3" fill="#FFCC00"/>
      <text x="32" y="35" fontSize="10" fontWeight="800" fill="#D40511" fontFamily="Inter">DHL</text>
      <text x="140" y="34" fontSize="8" fontWeight="700" fill="#6B7280" fontFamily="JetBrains Mono">#RS-4429182</text>
      <line x1="22" y1="48" x2="198" y2="48" stroke="#EFEAE2"/>
      <text x="22" y="62" fontSize="9" fontWeight="700" fill="#0F172A" fontFamily="Inter">NEW YORK → LONDON</text>
      <text x="22" y="74" fontSize="8" fill="#6B7280" fontFamily="Inter">2.5 kg · Express · Arrives Thu</text>
      {/* barcode */}
      {Array.from({length:32}).map((_,i)=>(
        <rect key={i} x={22+i*5.5} y="84" width={i%3===0?3:i%2===0?1:2} height="20" fill="#0F172A"/>
      ))}
    </svg>
  ];
  const steps = [
    { n:1, t:'Tell us where',    d:'Enter origin, destination, weight and parcel type. 3 fields, no sign-up.'},
    { n:2, t:'We query every carrier', d:'134+ APIs, 213 countries, hit in parallel in under 2 seconds.'},
    { n:3, t:'Pick your rate',   d:'Sort by cheapest, fastest, or best-rated. Transit, tracking, insurance — all visible.'},
    { n:4, t:'Book & track',     d:'Pay once. We book direct with the carrier and give you a unified tracking link.'},
  ];
  return (
    <section style={{padding:'80px 32px', position:'relative', overflow:'hidden'}}>
      <div style={{maxWidth:1320, margin:'0 auto'}}>
        <div style={{marginBottom:40, maxWidth:720}}>
          <div style={{fontSize:12, fontWeight:700, color:'var(--blue)', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:12}}>How it works</div>
          <h2 style={{margin:0, fontSize:'clamp(28px,3.4vw,44px)', fontWeight:800, letterSpacing:'-.02em', lineHeight:1.05}}>Four steps. Under two minutes.</h2>
          <p style={{margin:'14px 0 0', fontSize:17, color:'var(--body)'}}>The whole flow — from quote to printed label.</p>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:20}} className="how-grid-2">
          {steps.map((s,i)=>(
            <div key={s.n} className="step-card" style={{
              background:'#fff', borderRadius:20, border:'1px solid var(--line)',
              padding:28, display:'flex', flexDirection:'column', gap:18,
              boxShadow:'var(--shadow-sm)',
              transition:'transform .2s, box-shadow .2s'
            }}>
              <div style={{display:'flex', alignItems:'center', gap:12}}>
                <div style={{
                  width:40, height:40, borderRadius:999, background:'var(--ink)', color:'#fff',
                  display:'grid', placeItems:'center', fontWeight:800, fontSize:14
                }} className="tnum">0{s.n}</div>
                <h4 style={{margin:0, fontSize:22, fontWeight:700, letterSpacing:'-.015em'}}>{s.t}</h4>
              </div>
              <p style={{margin:0, fontSize:15, color:'var(--body)', lineHeight:1.55, maxWidth:440}}>{s.d}</p>
              <div style={{
                height:180, borderRadius:14, background:'var(--bg)',
                border:'1px solid var(--line-2)', padding:16, marginTop:'auto'
              }}>
                {stepSVGs[i]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =============================================================
   COMPARISON
============================================================= */

function Comparison(){
  const oldWay = [
    '5–8 carrier websites, each with its own login',
    'Quoted rates that change at checkout',
    'No view into customs, duty or landed cost',
    'Tracking scattered across different dashboards',
    'Volume discounts gated behind sales calls',
    'Expect 2–3 business days for a custom quote',
  ];
  const rateShips = [
    'One search. 134+ carriers, ranked instantly.',
    'Live, all-in prices — what you see is what you pay.',
    'Duties, taxes and broker fees calculated upfront.',
    'Unified tracking across every carrier you book.',
    'Volume tiers unlocked automatically from shipment 1.',
    'Quote, book, and print a label in under 2 minutes.',
  ];
  return (
    <section style={{padding:'80px 32px', borderTop:'1px solid var(--line)'}}>
      <div style={{maxWidth:1240, margin:'0 auto'}}>
        <SectionHead
          eyebrow="Why RateShips"
          title={<>The old way vs. RateShips.</>}
          desc="Side by side, no hand-waving."
        />
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:20}} className="compare-grid">
          <div style={{
            background:'#fff', borderRadius:20, border:'1px solid var(--line)', padding:28,
            position:'relative'
          }}>
            <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:16}}>
              <div style={{
                width:34, height:34, borderRadius:10, background:'#F3EDE4',
                color:'#7A6A55', display:'grid', placeItems:'center'
              }}><I.x width="18" height="18"/></div>
              <div>
                <div style={{fontSize:12, fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.06em'}}>Before</div>
                <div style={{fontWeight:700, fontSize:18}}>The old way</div>
              </div>
            </div>
            {oldWay.map((r,i)=>(
              <div key={i} style={{display:'flex', gap:12, padding:'12px 0', borderTop: i>0?'1px solid var(--line-2)':'none', fontSize:14, color:'#6A6157'}}>
                <I.x width="16" height="16" style={{color:'#B8ADA0', flex:'0 0 16px', marginTop:3}}/>
                <span>{r}</span>
              </div>
            ))}
          </div>
          <div style={{
            background:'linear-gradient(180deg, #F4F8FE 0%, #fff 100%)',
            borderRadius:20, border:'1px solid var(--blue-100)', padding:28,
            boxShadow:'0 20px 40px -20px rgba(26,115,232,.2)', position:'relative'
          }}>
            <div style={{
              position:'absolute', top:20, right:20,
              padding:'4px 10px', borderRadius:999, fontSize:11, fontWeight:700,
              background:'var(--blue)', color:'#fff', letterSpacing:'.04em'
            }}>RATESHIPS</div>
            <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:16}}>
              <div style={{
                width:34, height:34, borderRadius:10, background:'var(--blue)',
                color:'#fff', display:'grid', placeItems:'center'
              }}><I.check width="18" height="18"/></div>
              <div>
                <div style={{fontSize:12, fontWeight:700, color:'var(--blue)', textTransform:'uppercase', letterSpacing:'.06em'}}>After</div>
                <div style={{fontWeight:700, fontSize:18}}>With RateShips</div>
              </div>
            </div>
            {rateShips.map((r,i)=>(
              <div key={i} style={{display:'flex', gap:12, padding:'12px 0', borderTop: i>0?'1px solid var(--blue-100)':'none', fontSize:14, color:'var(--ink-2)'}}>
                <I.check width="16" height="16" style={{color:'var(--blue)', flex:'0 0 16px', marginTop:3}}/>
                <span>{r}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =============================================================
   TESTIMONIALS
============================================================= */


/* =============================================================
   TESTIMONIALS
============================================================= */

function Testimonials(){
  const items = [
    { metric:'$42K', metricLabel:'saved in Q1 alone',
      quote:'We were paying list price with FedEx out of habit. RateShips made it obvious we had cheaper options on our most-shipped lanes.',
      name:'Maya Okonkwo', role:'Head of Logistics', company:'Merino', logoBg:'#0F172A', logoFg:'#fff', logoLetters:'MSC',
      photo:'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&q=80&auto=format&fit=crop&crop=faces',
      rating:5 },
    { metric:'28%', metricLabel:'lower cost per parcel',
      quote:'Cut 28% off our cost per parcel and got proper landed-cost estimates for EU customers. Returns dropped too — fewer duty surprises.',
      name:'Daniel Varga', role:'COO', company:'Ostra', logoBg:'#E85C3A', logoFg:'#fff', logoLetters:'OA',
      photo:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&q=80&auto=format&fit=crop&crop=faces',
      rating:5 },
    { metric:'40%', metricLabel:'faster avg. transit',
      quote:"Switched five SKUs from economy air to a regional express carrier we didn't know existed. 40% faster, same margin.",
      name:'Priya Raghavan', role:'Founder', company:'Lumen', logoBg:'#F2C94C', logoFg:'#0F172A', logoLetters:'LI',
      photo:'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&q=80&auto=format&fit=crop&crop=faces',
      rating:5 },
  ];
  return (
    <section style={{padding:'80px 32px', background:'#fff', borderTop:'1px solid var(--line)', borderBottom:'1px solid var(--line)'}}>
      <div style={{maxWidth:1320, margin:'0 auto'}}>
        <div style={{marginBottom:40, maxWidth:620}}>
          <div style={{fontSize:12, fontWeight:700, color:'var(--blue)', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:12}}>Customers</div>
          <h2 style={{margin:0, fontSize:'clamp(28px, 3.2vw, 40px)', fontWeight:800, letterSpacing:'-.02em', lineHeight:1.1}}>Savings teams can put on a board deck.</h2>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:20}} className="tools-grid">
          {items.map((t,i)=>(
            <div key={i} className="testimonial-card" style={{
              background:'var(--bg)', borderRadius:20, border:'1px solid var(--line)',
              padding:28, display:'flex', flexDirection:'column', gap:16,
              transition:'transform .2s, box-shadow .2s'
            }}>
              <div style={{display:'flex', alignItems:'baseline', gap:10, borderBottom:'1px solid var(--line-2)', paddingBottom:14}}>
                <div className="tnum" style={{fontSize:46, fontWeight:800, letterSpacing:'-.03em', color:'var(--accent)', lineHeight:1}}>{t.metric}</div>
                <div style={{fontSize:13, color:'var(--muted)', fontWeight:500}}>{t.metricLabel}</div>
              </div>
              <div style={{display:'flex', gap:3, color:'var(--warm)'}}>
                {Array.from({length:t.rating}).map((_,k)=> <I.star key={k} width="16" height="16"/>)}
              </div>
              <p style={{margin:0, fontSize:15, color:'var(--ink-2)', lineHeight:1.6}}>"{t.quote}"</p>
              <div style={{display:'flex', alignItems:'center', gap:12, marginTop:'auto', paddingTop:14, borderTop:'1px solid var(--line-2)'}}>
                <img src={t.photo} alt={t.name} style={{width:44, height:44, borderRadius:999, objectFit:'cover', background:'var(--line)'}}/>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontWeight:700, fontSize:14}}>{t.name}</div>
                  <div style={{fontSize:12, color:'var(--muted)'}}>{t.role}</div>
                </div>
                <div style={{display:'flex', alignItems:'center', gap:6}}>
                  <div style={{width:28, height:28, borderRadius:6, background:t.logoBg, color:t.logoFg, display:'grid', placeItems:'center', fontSize:10, fontWeight:800}}>{t.logoLetters}</div>
                  <span style={{fontSize:12, fontWeight:600, color:'var(--ink-2)'}}>{t.company}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =============================================================
   THREE WAYS TO USE RATESHIPS
============================================================= */

function ThreeTools(){
  const tools = [
    {
      icon: <I.search width="24" height="24"/>,
      iconBg: 'var(--blue-50)', iconColor: 'var(--blue)',
      badge: null,
      title: 'Compare rates',
      stat: '134+',
      statLabel: 'carriers',
      desc: 'Enter origin, destination and weight — see every carrier side by side with transit time, tracking, and all-in pricing.',
      features: ['134+ carriers across 213 countries', 'Filter by price, speed, or carrier', 'Real published tariff data', 'Updated weekly from carrier rate cards'],
      cta: 'Start comparing', ctaHref: '#calc',
      variant: 'default',
    },
    {
      icon: <I.shield width="24" height="24"/>,
      iconBg: 'var(--accent-50)', iconColor: 'var(--accent)',
      badge: 'MOST USED',
      title: 'Calculate duties',
      stat: '213',
      statLabel: 'countries',
      desc: 'Know the exact landed cost before you ship — duty, VAT/GST, broker fees, and de minimis thresholds for every destination.',
      features: ['HS-code lookup for classification', 'VAT/GST rates for all countries', 'De minimis thresholds ($800 US, €150 EU, £135 UK)', 'Trade agreement preferences (USMCA, CPTPP, RCEP)'],
      cta: 'Calculate duties', ctaHref: '/en/tools/duty-calculator',
      variant: 'featured',
    },
    {
      icon: <I.clock width="24" height="24"/>,
      iconBg: 'var(--warm-50)', iconColor: '#A37A00',
      badge: null,
      title: 'Estimate delivery',
      stat: '45K+',
      statLabel: 'routes',
      desc: 'Predict when your package will actually arrive — based on carrier transit data, not marketing promises.',
      features: ['Transit times for express, standard, economy', 'Compare speed across carriers', 'Factor in customs clearance time', 'Coverage for all 213 countries'],
      cta: 'Estimate delivery', ctaHref: '/en/tools/delivery-estimator',
      variant: 'default',
    },
  ];

  return (
    <section style={{padding:'80px 32px'}}>
      <div style={{maxWidth:1240, margin:'0 auto'}}>
        <SectionHead eyebrow="Three tools, one platform" title={<>Everything you need to ship internationally.</>} desc="Free for everyone. No signup required. No carrier commissions."/>
        <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:20}} className="tools-grid">
          {tools.map((t,i)=>(
            <div key={t.title} className="card-hover" style={{
              background: t.variant==='featured'?'var(--ink)':'#fff',
              color: t.variant==='featured'?'#fff':'var(--ink)',
              borderRadius:20, border:'1px solid '+(t.variant==='featured'?'var(--ink)':'var(--line)'),
              padding:28, position:'relative',
              boxShadow: t.variant==='featured'?'0 20px 40px -10px rgba(15,23,42,.3)':'var(--shadow-sm)',
              display:'flex', flexDirection:'column', gap:16,
              transition:'transform .25s, box-shadow .25s'
            }}>
              {t.badge && (
                <div style={{position:'absolute', top:-12, left:28, padding:'4px 10px', borderRadius:999, fontSize:11, fontWeight:700, background:'var(--warm)', color:'var(--ink)', letterSpacing:'.04em'}}>{t.badge}</div>
              )}

              <div style={{display:'flex', alignItems:'center', gap:12}}>
                <div style={{
                  width:48, height:48, borderRadius:14,
                  background: t.variant==='featured'?'rgba(255,255,255,.1)':t.iconBg,
                  color: t.variant==='featured'?'var(--warm)':t.iconColor,
                  display:'grid', placeItems:'center'
                }}>{t.icon}</div>
                <div>
                  <h3 style={{margin:0, fontSize:20, fontWeight:700}}>{t.title}</h3>
                </div>
              </div>

              <div style={{display:'flex', alignItems:'baseline', gap:6}}>
                <span className="tnum" style={{fontSize:40, fontWeight:800, letterSpacing:'-.03em', lineHeight:1, color: t.variant==='featured'?'var(--warm)':'var(--blue)'}}>{t.stat}</span>
                <span style={{fontSize:14, color: t.variant==='featured'?'rgba(255,255,255,.6)':'var(--muted)'}}>{t.statLabel}</span>
              </div>

              <p style={{margin:0, fontSize:14, color: t.variant==='featured'?'rgba(255,255,255,.7)':'var(--body)', lineHeight:1.55}}>{t.desc}</p>

              <div style={{display:'flex', flexDirection:'column', gap:10, flex:1}}>
                {t.features.map(f=>(
                  <div key={f} style={{display:'flex', gap:10, fontSize:13}}>
                    <I.check width="15" height="15" style={{color: t.variant==='featured'?'var(--warm)':'var(--blue)', flex:'0 0 15px', marginTop:2}}/>
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <a href={t.ctaHref} className="btn-press" style={{
                display:'block', width:'100%', padding:'12px', borderRadius:12, fontWeight:600, fontSize:14, textAlign:'center',
                background: t.variant==='featured'?'var(--warm)':'var(--ink)',
                color: t.variant==='featured'?'var(--ink)':'#fff',
                textDecoration:'none'
              }}>{t.cta}</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =============================================================
   FAQ
============================================================= */

function FAQ(){
  const faqs = [
    {q:'Which carriers does RateShips compare?', a:'134+ as of April 2026 — including DHL Express, FedEx, UPS, USPS, SF Express, EMS, Aramex, TNT, GLS, DPD, La Poste, PostNL, Japan Post, Australia Post, Correos, and over 110 regional and specialist couriers. We add 3–5 new carriers each month.'},
    {q:'How are rates negotiated and discounted?', a:'We pool volume across our customer base and pass negotiated rates back automatically. Pro and Enterprise accounts unlock tier-based discounts as their shipment count grows — no separate contract needed per carrier.'},
    {q:'Are the rates on RateShips live or cached?', a:'Both. High-frequency routes (top 5,000 lanes) are refreshed every 8–12 seconds. Long-tail routes are priced on demand against the carrier API with a 2–4 second response time.'},
    {q:'Do you cover customs, duties and taxes?', a:'Yes — our Customs Calculator covers 213 countries with HS-code lookup, VAT/GST calculation, duty rates, and estimated broker fees. You get a landed-cost figure before you ship, not a surprise at the border.'},
    {q:'Can I integrate RateShips into my own storefront or ERP?', a:'Yes. We have REST and GraphQL APIs, pre-built plugins for Shopify, WooCommerce, BigCommerce, Magento, NetSuite and SAP, and webhooks for tracking updates. Enterprise plans include a dedicated solutions engineer.'},
    {q:'How accurate are the delivery estimates?', a:'Our Delivery Estimator is built on 14M+ tracked shipments over the last 18 months. We report actual delivery distributions — not carrier-quoted transit — with median, p90, and on-time percentage per lane.'},
    {q:'Is my package insured?', a:'Every booked shipment includes $100 of base cover. You can top up to the declared value on checkout. Claims are handled by RateShips — you never chase a carrier directly.'},
    {q:'What if I don\'t see my preferred carrier?', a:'Tell us and we\'ll prioritize. Most regional carriers go live within 30 days of a customer request. Enterprise customers can request a private carrier integration with SLA.'},
  ];
  const [open, setOpen] = useState(0);
  return (
    <section style={{padding:'80px 32px', background:'#fff', borderTop:'1px solid var(--line)', borderBottom:'1px solid var(--line)'}}>
      <div style={{maxWidth:920, margin:'0 auto'}}>
        <SectionHead
          eyebrow="FAQ"
          title={<>Questions, answered.</>}
          desc={null}
        />
        <div style={{borderRadius:16, overflow:'hidden', background:'#fff', border:'1px solid var(--line)', boxShadow:'var(--shadow-sm)'}}>
          {faqs.map((f,i)=>{
            const isOpen = open===i;
            return (
              <div key={i} style={{borderTop: i>0?'1px solid var(--line-2)':'none', position:'relative', background:isOpen?'var(--bg)':'#fff', transition:'background .2s'}}>
                {isOpen && <div style={{position:'absolute', top:0, bottom:0, left:0, width:3, background:'var(--blue)'}}/>}
                <button onClick={()=>setOpen(isOpen?-1:i)} style={{
                  width:'100%', padding:'20px 24px', display:'flex', alignItems:'center', gap:16,
                  textAlign:'left', background:'transparent'
                }}>
                  <span style={{flex:1, fontSize:16, fontWeight:600, color:'var(--ink)'}}>{f.q}</span>
                  <span style={{
                    width:28, height:28, borderRadius:999, display:'grid', placeItems:'center',
                    background: isOpen?'var(--blue)':'var(--bg)', color: isOpen?'#fff':'var(--muted)',
                    transition:'all .2s'
                  }}>
                    <I.chev width="14" height="14" style={{transform: isOpen?'rotate(180deg)':'none', transition:'transform .25s'}}/>
                  </span>
                </button>
                <div style={{
                  maxHeight: isOpen?400:0, overflow:'hidden',
                  transition:'max-height .35s cubic-bezier(.2,.7,.3,1)'
                }}>
                  <div style={{padding:'0 24px 22px', fontSize:14.5, color:'var(--body)', lineHeight:1.65, maxWidth:780}}>
                    {f.a}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{textAlign:'center', marginTop:24, fontSize:14, color:'var(--muted)'}}>
          Still have a question? <a href="#" style={{color:'var(--blue)', fontWeight:600}}>Chat with our team →</a>
        </div>
      </div>
    </section>
  );
}

/* =============================================================
   TRANSPARENCY & TRUST
============================================================= */

function Transparency(){
  return (
    <section style={{padding:'80px 32px', background:'#fff', borderTop:'1px solid var(--line)', borderBottom:'1px solid var(--line)'}}>
      <div style={{maxWidth:1240, margin:'0 auto'}}>
        <SectionHead eyebrow="Why trust RateShips" title="Transparent by design." desc="We publish how we work so you can verify what we show you."/>

        <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:16}} className="tools-grid">
          {[
            { icon:<I.shield width="20" height="20"/>, color:'var(--blue)', bg:'var(--blue-50)',
              t:'Registered company', d:'Global Supply KFT, Kutasó, Hungary. EU VAT: HU26179030. Not a shell — a real legal entity.' },
            { icon:<I.target width="20" height="20"/>, color:'var(--accent)', bg:'var(--accent-50)',
              t:'Published methodology', d:'Our data sourcing process is documented on our Data Methodology page. Read exactly how we aggregate rates.' },
            { icon:<I.scale width="20" height="20"/>, color:'var(--good)', bg:'var(--good-50)',
              t:'Zero carrier commissions', d:'We don\'t take money from carriers. Every comparison is neutral — we have no financial incentive to rank one carrier above another.' },
            { icon:<I.globe width="20" height="20"/>, color:'#A37A00', bg:'var(--warm-50)',
              t:'Open rate sources', d:'Rates come from published carrier tariffs and customs authority databases. Updated weekly. No scraped or estimated data.' },
          ].map((item,i)=>(
            <div key={i} style={{
              background:'var(--bg)', borderRadius:16, border:'1px solid var(--line)',
              padding:24, display:'flex', flexDirection:'column', gap:14
            }}>
              <div style={{
                width:40, height:40, borderRadius:10, background:item.bg, color:item.color,
                display:'grid', placeItems:'center'
              }}>{item.icon}</div>
              <h3 style={{margin:0, fontSize:16, fontWeight:700, letterSpacing:'-.01em'}}>{item.t}</h3>
              <p style={{margin:0, fontSize:13, color:'var(--body)', lineHeight:1.55}}>{item.d}</p>
            </div>
          ))}
        </div>

        {/* Contact strip */}
        <div style={{
          marginTop:32, padding:'20px 28px', background:'var(--bg)', borderRadius:14,
          border:'1px solid var(--line)', display:'flex', alignItems:'center', gap:20, flexWrap:'wrap'
        }}>
          <div style={{flex:1, minWidth:200}}>
            <div style={{fontWeight:700, fontSize:15}}>Questions about our data or methodology?</div>
            <div style={{fontSize:13, color:'var(--muted)', marginTop:4}}>We respond within 24 hours. Real people, not bots.</div>
          </div>
          <a href="mailto:info@rateships.com" style={{
            padding:'10px 20px', borderRadius:10, background:'var(--ink)', color:'#fff',
            fontWeight:600, fontSize:14, display:'inline-flex', alignItems:'center', gap:8, whiteSpace:'nowrap'
          }}>info@rateships.com <I.arrow width="14" height="14"/></a>
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
    <section style={{padding:'96px 32px', position:'relative', overflow:'hidden'}}>
      <div aria-hidden style={{
        position:'absolute', inset:0,
        background:`radial-gradient(800px 400px at 20% 30%, rgba(26,115,232,.14), transparent 60%),
                    radial-gradient(800px 400px at 80% 70%, rgba(232,92,58,.08), transparent 60%)`,
      }}/>
      <div style={{position:'relative', maxWidth:900, margin:'0 auto', textAlign:'center'}}>
        <div style={{
          display:'inline-flex', alignItems:'center', gap:8,
          padding:'6px 14px', borderRadius:999, background:'var(--blue-50)',
          color:'var(--blue)', fontSize:12, fontWeight:700, letterSpacing:'.04em',
          textTransform:'uppercase'
        }}>
          <I.spark width="12" height="12"/> Free forever · No signup required
        </div>
        <h2 style={{
          margin:'20px 0 18px', fontSize:'clamp(36px, 5vw, 60px)',
          lineHeight:1.04, letterSpacing:'-.025em', fontWeight:800
        }}>
          Compare rates before<br/>you <span style={{color:'var(--blue)'}}>overpay.</span>
        </h2>
        <p style={{fontSize:18, color:'var(--body)', margin:'0 0 28px', maxWidth:580, marginLeft:'auto', marginRight:'auto'}}>
          One search across 134+ carriers in 213 countries. No commitment, no credit card, no account needed.
        </p>
        <div style={{display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap'}}>
          <a href="#calc" style={{
            padding:'14px 24px', borderRadius:12, background:'var(--ink)', color:'#fff',
            fontWeight:700, fontSize:15, display:'inline-flex', alignItems:'center', gap:8,
          }}>Compare rates now <I.arrow width="16" height="16"/></a>
          <a href="mailto:info@rateships.com" style={{
            padding:'14px 24px', borderRadius:12, background:'#fff', color:'var(--ink)',
            fontWeight:600, fontSize:15, border:'1px solid var(--line)'
          }}>Contact us — info@rateships.com</a>
        </div>
      </div>
    </section>
  );
}

/* =============================================================
   FOOTER + NEWSLETTER
============================================================= */

function Footer(){
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const cols = [
    {title:'Product', links:['Rate comparison','Rate tables','Customs calculator','Delivery estimator','API & webhooks','Changelog']},
    {title:'Carriers', links:['DHL Express','FedEx','UPS','SF Express','EMS Worldwide','Aramex','All 134 carriers →']},
    {title:'Resources', links:['Shipping guides','Country profiles (213)','HS-code lookup','Incoterms 2026','Help center','Status page']},
    {title:'Company', links:['About','Careers (we\'re hiring)','Community','Press','Partners','Contact']},
  ];
  return (
    <footer style={{background:'var(--ink)', color:'#fff', padding:'72px 32px 32px'}}>
      <div style={{maxWidth:1240, margin:'0 auto'}}>
        {/* Newsletter */}
        <div style={{
          background:'rgba(255,255,255,.04)', borderRadius:20,
          border:'1px solid rgba(255,255,255,.08)',
          padding:'28px 32px', marginBottom:48,
          display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:32, alignItems:'center'
        }} className="newsletter-grid">
          <div>
            <div style={{fontSize:12, fontWeight:700, color:'var(--warm)', textTransform:'uppercase', letterSpacing:'.06em'}}>The Freight Brief</div>
            <h3 style={{margin:'8px 0 6px', fontSize:22, fontWeight:700, letterSpacing:'-.015em'}}>Carrier rate changes, in your inbox.</h3>
            <p style={{margin:0, fontSize:14, color:'rgba(255,255,255,.65)'}}>
              Monthly digest of fuel-surcharge shifts, peak-season forecasts, and new carrier launches. Subscribe to shipping rate updates.
            </p>
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

        {/* Cols */}
        <div style={{display:'grid', gridTemplateColumns:'1.2fr repeat(4, 1fr)', gap:32}} className="footer-cols">
          <div>
            <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:14}}>
              <div style={{
                width:28, height:28, borderRadius:8,
                background:'linear-gradient(135deg, var(--blue), #2F88FF)',
                display:'grid', placeItems:'center'
              }}><I.ship width="16" height="16"/></div>
              <span style={{fontWeight:800, fontSize:17, letterSpacing:'-.01em'}}>RateShips</span>
            </div>
            <p style={{fontSize:13, color:'rgba(255,255,255,.55)', margin:'0 0 16px', lineHeight:1.6, maxWidth:260}}>
              The neutral shipping rate comparison platform. We're not a carrier — we work for you.
            </p>
            <div style={{display:'flex', gap:10}}>
              <a href="#" style={{width:32, height:32, borderRadius:8, background:'rgba(255,255,255,.06)', display:'grid', placeItems:'center', color:'rgba(255,255,255,.7)'}}><I.twitter width="14" height="14"/></a>
              <a href="#" style={{width:32, height:32, borderRadius:8, background:'rgba(255,255,255,.06)', display:'grid', placeItems:'center', color:'rgba(255,255,255,.7)'}}><I.linkedin width="14" height="14"/></a>
            </div>
          </div>
          {cols.map(c=>(
            <div key={c.title}>
              <div style={{fontSize:13, fontWeight:700, marginBottom:14}}>{c.title}</div>
              <div style={{display:'flex', flexDirection:'column', gap:8}}>
                {c.links.map(l=>(
                  <a key={l} href="#" style={{fontSize:13, color:'rgba(255,255,255,.6)'}}>{l}</a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop:40, paddingTop:20, borderTop:'1px solid rgba(255,255,255,.08)',
          display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16,
          fontSize:12, color:'rgba(255,255,255,.45)'
        }}>
          <div>© 2026 Global Supply KFT · 134 carriers · 213 countries · Updated weekly</div>
          <div style={{display:'flex', gap:20}}>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
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
    <div style={{marginBottom:36, maxWidth:720}}>
      {eyebrow && <div style={{
        fontSize:12, fontWeight:700, color:'var(--blue)',
        textTransform:'uppercase', letterSpacing:'.1em', marginBottom:12
      }}>{eyebrow}</div>}
      <h2 style={{
        margin:0, fontSize:'clamp(28px, 3.2vw, 40px)', fontWeight:800,
        letterSpacing:'-.02em', lineHeight:1.1, color:'var(--ink)'
      }}>{title}</h2>
      {desc && <p style={{margin:'14px 0 0', fontSize:17, color:'var(--body)', maxWidth:620}}>{desc}</p>}
    </div>
  );
}

/* =============================================================
   RESPONSIVE STYLES (injected)
============================================================= */

function ResponsiveCSS(){
  return (
    <style>{`
      @keyframes floaty {
        0%,100% { transform: translateY(0) rotate(var(--rot, 0deg)); }
        50% { transform: translateY(-8px) rotate(var(--rot, 0deg)); }
      }
      .hero-float { animation: floaty 6s ease-in-out infinite; }
      .hero-img-a { --rot: 4deg; }
      .hero-img-b { --rot: -6deg; animation-delay: -2s; }
      .hero-badge { --rot: 3deg; animation-delay: -4s; }

      /* Hover effects */
      .route-card:hover { transform: translateY(-2px); box-shadow: 0 10px 24px -8px rgba(15,23,42,.12); border-color: var(--blue-100) !important; }
      .testimonial-card:hover { transform: translateY(-3px); box-shadow: 0 14px 30px -10px rgba(15,23,42,.12); }
      .pricing-card:hover { transform: translateY(-4px); }
      a[href]:hover { opacity: .92; }

      /* Mobile sticky CTA — desktop hidden */
      .mobile-sticky-cta { display: none; }

      @media (max-width: 960px) {
        .desktop-only { display: none !important; }
        .mobile-sticky-cta { display: flex !important; }
        body { padding-bottom: 72px; }
        .footer-badges { grid-template-columns: 1fr !important; }
        .routes-grid { grid-template-columns: 1fr 1fr !important; }
        .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        .hero-img-a, .hero-img-b, .hero-badge { display: none !important; }
        .tools-grid { grid-template-columns: 1fr !important; }
        .tools-grid > * { transform: none !important; grid-row: auto !important; }
        .stats-grid { grid-template-columns: 1fr 1fr !important; gap: 28px !important; }
        .stats-grid > div { padding-left: 0 !important; border-left: none !important; }
        .stats-top { grid-template-columns: 1fr !important; }
        .steps-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
        .steps-line { display: none; }
        .how-grid { grid-template-columns: 1fr !important; }
        .step-row { transform: none !important; max-width: 100% !important; grid-template-columns: 56px 1fr auto !important; padding: 16px !important; gap: 14px !important; }
        .compare-grid { grid-template-columns: 1fr !important; }
        .footer-cols { grid-template-columns: 1fr 1fr !important; gap: 28px !important; }
        .newsletter-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
        .testimonial-card { transform: none !important; }
        .row-grid { grid-template-columns: 1.8fr 1fr !important; gap: 8px 16px !important; padding: 14px 16px !important; }
        .row-grid > *:nth-child(2), .row-grid > *:nth-child(3), .row-grid > *:nth-child(4), .row-grid > *:nth-child(5) {
          font-size: 12px !important;
        }
        .row-grid > *:nth-child(2) { grid-column: 1 / 2; }
        .row-grid > *:nth-child(3) { grid-column: 1 / 2; }
        .row-grid > *:nth-child(4) { grid-column: 1 / 2; }
        .row-grid > *:nth-child(5) { grid-column: 1 / 2; }
        .row-grid > *:nth-child(6) { grid-row: 1 / 3; grid-column: 2 / 3; text-align: right; align-self: center; }
      }
      @media (max-width: 560px) {
        section { padding-left: 20px !important; padding-right: 20px !important; }
        .stats-grid { grid-template-columns: 1fr 1fr !important; }
        .footer-cols { grid-template-columns: 1fr 1fr !important; }
      }
    `}</style>
  );
}

/* =============================================================
   MOBILE STICKY CTA
============================================================= */

function MobileStickyCTA(){
  const [visible, setVisible] = useState(false);
  useEffect(()=>{
    const onScroll = ()=> setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, {passive:true});
    return ()=> window.removeEventListener('scroll', onScroll);
  },[]);
  return (
    <div className="mobile-sticky-cta" style={{
      position:'fixed', bottom:0, left:0, right:0, zIndex:50,
      padding:'10px 14px calc(10px + env(safe-area-inset-bottom))',
      background:'rgba(255,255,255,.95)', backdropFilter:'saturate(1.2) blur(10px)',
      borderTop:'1px solid var(--line)',
      boxShadow:'0 -8px 24px rgba(15,23,42,.08)',
      display:'flex', alignItems:'center', gap:10,
      transform: visible?'translateY(0)':'translateY(110%)',
      transition:'transform .3s cubic-bezier(.2,.7,.3,1)',
    }}>
      <div style={{flex:1, minWidth:0}}>
        <div style={{fontSize:11, color:'var(--muted)', fontWeight:600}}>Cheapest NYC → London</div>
        <div style={{fontSize:15, fontWeight:800, letterSpacing:'-.01em', display:'flex', alignItems:'baseline', gap:6}}>
          <span className="tnum">$34.50</span>
          <span style={{fontSize:12, fontWeight:500, color:'var(--muted)'}}>· 17 carriers</span>
        </div>
      </div>
      <a href="#calc" style={{
        padding:'12px 18px', borderRadius:999, background:'var(--blue)', color:'#fff',
        fontWeight:700, fontSize:14, whiteSpace:'nowrap', display:'inline-flex', alignItems:'center', gap:6,
        boxShadow:'0 6px 14px -4px rgba(26,115,232,.55)'
      }}>Compare now <I.arrow width="14" height="14"/></a>
    </div>
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
      <TrustStrip/>
      <ResultsTable/>
      <PopularRoutes/>
      <Tools/>
      <Stats/>
      <HowItWorks/>
      <Comparison/>
      <Testimonials/>
      <ThreeTools/>
      <FAQ/>
      <Transparency/>
      <FinalCTA/>
      <MobileStickyCTA/>
    </>
  );
}

