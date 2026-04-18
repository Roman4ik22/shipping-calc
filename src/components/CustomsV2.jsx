"use client";

import React from "react";

const { useState, useMemo, useEffect, useRef } = React;

const I = {
  ship:(p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M2 20s2 1 4 1 3-1 4-1 2 1 4 1 3-1 4-1 4-1 4-1"/><path d="M4 18L3 12h18l-1 6"/><path d="M12 4v8M8 8h8"/></svg>,
  arrow:(p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>,
  check:(p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 6L9 17l-5-5"/></svg>,
  x:(p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M18 6L6 18M6 6l12 12"/></svg>,
  shield:(p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 2l8 3v7c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5l8-3z"/><path d="M9 12l2 2 4-4"/></svg>,
  search:(p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>,
  sparkle:(p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5z"/></svg>,
  hand:(p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M11 13l-3 3M7 9l-3 3 4 4 3-3M13 11l3-3M17 15l3-3-4-4-3 3"/><path d="M9 11l2 2M13 13l2 2"/></svg>,
  box:(p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/></svg>,
  globe:(p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/></svg>,
  scale:(p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3v18M5 8h14M3 14l3-7 3 7M15 14l3-7 3 7"/><path d="M3 14a3 3 0 006 0M15 14a3 3 0 006 0"/></svg>,
  refresh:(p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 12a9 9 0 0115-6.7L21 8M21 3v5h-5"/><path d="M21 12a9 9 0 01-15 6.7L3 16M3 21v-5h5"/></svg>,
  chev:(p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 9l6 6 6-6"/></svg>,
  info:(p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/></svg>,
  star:(p)=> <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2l3 7 7 .6-5.3 4.7 1.7 7-6.4-3.9L5.6 21.4l1.7-7L2 9.6 9 9z"/></svg>,
  twitter:(p)=> <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231z"/></svg>,
  linkedin:(p)=> <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 11.01-4.12 2.06 2.06 0 01-.01 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/></svg>,
};

const Flag = ({code, size=20}) => {
  const map = {US:'🇺🇸',DE:'🇩🇪',GB:'🇬🇧',CA:'🇨🇦',AU:'🇦🇺',BR:'🇧🇷',FR:'🇫🇷',IT:'🇮🇹',ES:'🇪🇸',NL:'🇳🇱',CN:'🇨🇳',JP:'🇯🇵',MX:'🇲🇽',EU:'🇪🇺'};
  return <span style={{fontSize:size, lineHeight:1, display:'inline-block'}}>{map[code]||'🌐'}</span>;
};

function Nav(){
  return (
    <header style={{position:'sticky', top:0, zIndex:40, background:'rgba(250,247,242,.85)', backdropFilter:'saturate(1.2) blur(10px)', borderBottom:'1px solid var(--line)'}}>
      <div style={{maxWidth:1240, margin:'0 auto', padding:'14px 32px', display:'flex', alignItems:'center', gap:32}}>
        <a href="Homepage.html" style={{display:'flex', alignItems:'center', gap:10}}>
          <div style={{width:28, height:28, borderRadius:8, background:'linear-gradient(135deg, var(--blue), #2F88FF)', display:'grid', placeItems:'center', color:'#fff', boxShadow:'0 4px 10px rgba(26,115,232,.28)'}}><I.ship width="16" height="16"/></div>
          <span style={{fontWeight:800, fontSize:17, letterSpacing:'-.01em'}}>RateShips</span>
        </a>
        <nav style={{display:'flex', gap:28, fontSize:14, color:'var(--body)', fontWeight:500}} className="desktop-only">
          <a href="Homepage.html">Rates</a>
          <a href="#" style={{color:'var(--ink)'}}>Customs</a>
          <a href="Homepage.html">Carriers</a>
          <a href="Homepage.html">API</a>
          <a href="Pricing.html">Pricing</a>
          <a href="About.html">About</a>
        </nav>
        <div style={{marginLeft:'auto', display:'flex', alignItems:'center', gap:14}}>
          <a href="#" style={{fontSize:14, fontWeight:500, color:'var(--body)'}} className="desktop-only">Sign in</a>
          <a href="Homepage.html#calc" style={{padding:'9px 16px', borderRadius:999, background:'var(--ink)', color:'#fff', fontSize:14, fontWeight:600}}>Get started — free</a>
        </div>
      </div>
    </header>
  );
}

/* =============================================================
   HERO with embedded calc + live result
============================================================= */

const CALC_PRESETS = {
  'electronics-us-de': {
    label:'Electronics · US → Germany',
    hs:'8471.30', hsName:'Laptops & portable computers',
    origin:'US', dest:'DE', value:1200, currency:'USD', incoterm:'DAP',
    dutyRate:0, dutyRateNote:'0% MFN (WTO IT Agreement)',
    vatRate:19, vatRateNote:'German Einfuhrumsatzsteuer',
    broker:14.50, deMinimis:150, deMinimisOk:false, agreement:null,
  },
  'apparel-cn-us': {
    label:'Apparel · China → US',
    hs:'6109.10', hsName:'T-shirts, cotton knit',
    origin:'CN', dest:'US', value:420, currency:'USD', incoterm:'DDP',
    dutyRate:16.5, dutyRateNote:'HTSUS Ch. 61 knit apparel',
    vatRate:0, vatRateNote:'No federal VAT/GST',
    broker:14.50, deMinimis:800, deMinimisOk:true, agreement:null,
  },
  'cosmetics-fr-br': {
    label:'Cosmetics · France → Brazil',
    hs:'3304.99', hsName:'Beauty preparations',
    origin:'FR', dest:'BR', value:800, currency:'EUR', incoterm:'DAP',
    dutyRate:18, dutyRateNote:'Mercosur CET',
    vatRate:25, vatRateNote:'ICMS + PIS/COFINS combined',
    broker:42.00, deMinimis:50, deMinimisOk:false, agreement:null,
  },
};

function Hero(){
  const [preset, setPreset] = useState('electronics-us-de');
  const [calculated, setCalculated] = useState(true);
  const data = CALC_PRESETS[preset];
  const dutyAmt = data.deMinimisOk ? 0 : +(data.value * data.dutyRate/100).toFixed(2);
  const dutiableBase = data.value + dutyAmt;
  const vatAmt = data.deMinimisOk ? 0 : +(dutiableBase * data.vatRate/100).toFixed(2);
  const total = +(data.value + dutyAmt + vatAmt + data.broker).toFixed(2);
  const curSymbol = data.currency==='USD'?'$':data.currency==='EUR'?'€':data.currency;

  return (
    <section style={{position:'relative', overflow:'hidden', paddingTop:72, paddingBottom:96, borderBottom:'1px solid var(--line)'}}>
      <div aria-hidden style={{position:'absolute', inset:0, zIndex:0}}>
        <div style={{position:'absolute', inset:0, background:`
          radial-gradient(1000px 500px at 85% 10%, rgba(26,115,232,.12), transparent 60%),
          radial-gradient(600px 400px at 10% 80%, rgba(232,92,58,.06), transparent 60%)`}}/>
        <div style={{position:'absolute', inset:0, backgroundImage:`
          linear-gradient(var(--line-2) 1px, transparent 1px),
          linear-gradient(90deg, var(--line-2) 1px, transparent 1px)`,
          backgroundSize:'48px 48px',
          maskImage:'linear-gradient(180deg, #000 40%, transparent 100%)'}}/>
      </div>
      <div style={{position:'relative', maxWidth:1240, margin:'0 auto', padding:'0 32px'}}>
        <div style={{maxWidth:820, marginBottom:44}}>
          <div style={{display:'inline-flex', alignItems:'center', gap:8, padding:'6px 12px 6px 8px', borderRadius:999, background:'#fff', border:'1px solid var(--line)', fontSize:12, fontWeight:600, color:'var(--ink-2)', boxShadow:'var(--shadow-sm)'}}>
            <span style={{width:6, height:6, borderRadius:999, background:'var(--good)', boxShadow:'0 0 0 3px rgba(17,138,84,.2)'}}/>
            213 countries · Customs data from official tariff databases · Updated weekly
          </div>
          <h1 style={{margin:'22px 0 18px', fontSize:'clamp(40px, 5.5vw, 72px)', lineHeight:1.02, letterSpacing:'-.03em', fontWeight:800}}>
            Know exact duties<br/><span style={{color:'var(--accent)'}}>before</span> you ship — not after.
          </h1>
          <p style={{fontSize:19, color:'var(--body)', lineHeight:1.55, maxWidth:640, margin:0}}>
            Landed-cost math in 2 seconds. Duty, VAT/GST, broker fees, de minimis thresholds, and trade-agreement preferences — all applied to the right HS code, for every destination.
          </p>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1.05fr 1fr', gap:24, alignItems:'stretch'}} className="hero-grid">
          <CalcForm preset={preset} setPreset={setPreset} onCalc={()=>setCalculated(true)}/>
          <ResultCard data={data} dutyAmt={dutyAmt} vatAmt={vatAmt} total={total} curSymbol={curSymbol}/>
        </div>
      </div>
    </section>
  );
}

function CalcForm({preset, setPreset, onCalc}){
  const d = CALC_PRESETS[preset];
  return (
    <div style={{background:'#fff', borderRadius:24, border:'1px solid var(--line)', padding:28, boxShadow:'var(--shadow-md)'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
        <div style={{fontSize:12, fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.08em'}}>Customs duty calculator</div>
        <div style={{display:'flex', gap:6}}>
          {Object.entries(CALC_PRESETS).map(([k,v])=>(
            <button key={k} onClick={()=>setPreset(k)} title={v.label} style={{
              padding:'5px 10px', borderRadius:999, fontSize:11, fontWeight:700,
              background: preset===k?'var(--ink)':'var(--bg)',
              color: preset===k?'#fff':'var(--muted)',
              border: '1px solid '+(preset===k?'var(--ink)':'var(--line)')
            }}>
              <Flag code={v.origin} size={12}/> → <Flag code={v.dest} size={12}/>
            </button>
          ))}
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
        <Field label="Origin country">
          <div style={{display:'flex', alignItems:'center', gap:10}}>
            <Flag code={d.origin} size={18}/>
            <span style={{flex:1, fontWeight:600}}>{countryName(d.origin)}</span>
            <I.chev width="14" height="14" style={{color:'var(--muted)'}}/>
          </div>
        </Field>
        <Field label="Destination country">
          <div style={{display:'flex', alignItems:'center', gap:10}}>
            <Flag code={d.dest} size={18}/>
            <span style={{flex:1, fontWeight:600}}>{countryName(d.dest)}</span>
            <I.chev width="14" height="14" style={{color:'var(--muted)'}}/>
          </div>
        </Field>

        <Field label="HS code" hint="AI-assisted" span={2}>
          <div style={{display:'flex', alignItems:'center', gap:10}}>
            <div style={{width:28, height:28, borderRadius:8, background:'var(--blue-50)', color:'var(--blue)', display:'grid', placeItems:'center', flex:'0 0 28px'}}>
              <I.search width="14" height="14"/>
            </div>
            <div style={{flex:1, minWidth:0}}>
              <div className="mono" style={{fontSize:14, fontWeight:700, color:'var(--ink)'}}>{d.hs}</div>
              <div style={{fontSize:12, color:'var(--muted)'}}>{d.hsName}</div>
            </div>
            <span style={{padding:'3px 8px', borderRadius:6, background:'var(--blue-50)', color:'var(--blue)', fontSize:10, fontWeight:800, letterSpacing:'.06em', display:'inline-flex', alignItems:'center', gap:4}}><I.sparkle width="10" height="10"/> 94% MATCH</span>
          </div>
        </Field>

        <Field label="Declared value" span={1.3}>
          <div style={{display:'flex', alignItems:'baseline', gap:6}}>
            <span style={{fontSize:18, color:'var(--muted)', fontWeight:600}}>{d.currency==='USD'?'$':d.currency==='EUR'?'€':'£'}</span>
            <span className="tnum" style={{fontSize:22, fontWeight:800, letterSpacing:'-.01em'}}>{d.value.toLocaleString()}.00</span>
          </div>
        </Field>
        <Field label="Currency" span={0.7}>
          <div style={{display:'flex', alignItems:'center', gap:8}}>
            <span style={{fontWeight:700}}>{d.currency}</span>
            <I.chev width="14" height="14" style={{color:'var(--muted)', marginLeft:'auto'}}/>
          </div>
        </Field>

        <Field label="Incoterm 2026" span={2}>
          <div style={{display:'flex', gap:8}}>
            {['EXW','DAP','DDP'].map(x=>(
              <span key={x} style={{
                flex:1, padding:'8px 10px', textAlign:'center', fontSize:13, fontWeight:700, borderRadius:8,
                background: d.incoterm===x?'var(--ink)':'#fff',
                color: d.incoterm===x?'#fff':'var(--body)',
                border:'1px solid '+(d.incoterm===x?'var(--ink)':'var(--line)')
              }}>{x}</span>
            ))}
          </div>
        </Field>
      </div>

      <button onClick={onCalc} style={{
        width:'100%', marginTop:20, padding:'16px 20px', borderRadius:12,
        background:'var(--ink)', color:'#fff', fontSize:15, fontWeight:700,
        display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8,
        boxShadow:'0 14px 28px -10px rgba(15,23,42,.35)'
      }}>
        Calculate duties <I.arrow width="16" height="16"/>
      </button>

      <div style={{marginTop:14, display:'flex', gap:18, fontSize:12, color:'var(--muted)', flexWrap:'wrap'}}>
        <span style={{display:'inline-flex', alignItems:'center', gap:6}}><I.check width="12" height="12" style={{color:'var(--good)'}}/> Free — no sign-up</span>
        <span style={{display:'inline-flex', alignItems:'center', gap:6}}><I.check width="12" height="12" style={{color:'var(--good)'}}/> Results in ≤2s</span>
        <span style={{display:'inline-flex', alignItems:'center', gap:6}}><I.check width="12" height="12" style={{color:'var(--good)'}}/> 96% accuracy SLA</span>
      </div>
    </div>
  );
}

function Field({label, hint, children, span=1}){
  return (
    <div style={{gridColumn: span===2?'1 / -1':'auto', padding:'12px 14px', background:'var(--bg)', borderRadius:10, border:'1px solid var(--line-2)'}}>
      <div style={{display:'flex', justifyContent:'space-between', fontSize:11, fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:6}}>
        <span>{label}</span>
        {hint && <span style={{color:'var(--blue)'}}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function countryName(c){
  return {US:'United States',DE:'Germany',GB:'United Kingdom',CA:'Canada',AU:'Australia',BR:'Brazil',FR:'France',CN:'China',EU:'European Union'}[c] || c;
}

function ResultCard({data, dutyAmt, vatAmt, total, curSymbol}){
  const fmt = n => curSymbol + n.toLocaleString(undefined,{minimumFractionDigits:2, maximumFractionDigits:2});
  const rows = [
    ['Declared value',           fmt(data.value),   'muted',  null],
    ['Customs duty',             fmt(dutyAmt),      'normal', data.deMinimisOk ? 'Under '+curSymbol+data.deMinimis+' de minimis — waived' : (data.dutyRate+'% · '+data.dutyRateNote)],
    [data.vatRate?'Import VAT / sales tax':'Import tax', fmt(vatAmt), 'normal', data.deMinimisOk ? 'Waived under de minimis' : (data.vatRate?data.vatRate+'% · '+data.vatRateNote:'None applicable')],
    ['Broker handling',          fmt(data.broker),  'normal', 'Standard clearance fee'],
  ];
  return (
    <div style={{background:'var(--ink)', color:'#fff', borderRadius:24, padding:28, boxShadow:'var(--shadow-lg)', position:'relative', overflow:'hidden', display:'flex', flexDirection:'column'}}>
      <div aria-hidden style={{position:'absolute', inset:0, background:`radial-gradient(400px 300px at 90% 10%, rgba(26,115,232,.25), transparent 60%)`}}/>
      <div style={{position:'relative'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10}}>
          <div style={{fontSize:11, fontWeight:700, color:'rgba(255,255,255,.55)', textTransform:'uppercase', letterSpacing:'.08em'}}>Live result</div>
          <span style={{padding:'3px 8px', borderRadius:999, background:'rgba(17,138,84,.2)', color:'#4AD991', fontSize:10, fontWeight:800, letterSpacing:'.06em', display:'inline-flex', alignItems:'center', gap:5}}>
            <span style={{width:5, height:5, borderRadius:999, background:'#4AD991'}}/> CALCULATED
          </span>
        </div>
        <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:4}}>
          <Flag code={data.origin} size={22}/>
          <span style={{fontSize:15, fontWeight:600}}>{countryName(data.origin)}</span>
          <I.arrow width="14" height="14" style={{color:'rgba(255,255,255,.5)'}}/>
          <Flag code={data.dest} size={22}/>
          <span style={{fontSize:15, fontWeight:600}}>{countryName(data.dest)}</span>
        </div>
        <div className="mono" style={{fontSize:12, color:'rgba(255,255,255,.55)'}}>HS {data.hs} · {data.hsName}</div>

        <div style={{marginTop:22, display:'flex', flexDirection:'column', gap:10}}>
          {rows.map(([l,v,t,sub],i)=>(
            <div key={i}>
              <div style={{display:'flex', justifyContent:'space-between', fontSize:14}}>
                <span style={{color: t==='muted'?'rgba(255,255,255,.5)':'rgba(255,255,255,.85)', fontWeight:500}}>{l}</span>
                <span className="tnum" style={{fontWeight:700}}>{v}</span>
              </div>
              {sub && <div style={{fontSize:11, color:'rgba(255,255,255,.45)', marginTop:2}}>{sub}</div>}
            </div>
          ))}
        </div>

        <div style={{marginTop:22, paddingTop:18, borderTop:'2px solid rgba(255,255,255,.15)'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
            <div>
              <div style={{fontSize:11, color:'rgba(255,255,255,.55)', textTransform:'uppercase', letterSpacing:'.08em', fontWeight:700}}>Total landed cost</div>
              <div style={{fontSize:11, color:'rgba(255,255,255,.45)', marginTop:2}}>{data.incoterm} · paid by {data.incoterm==='DDP'?'sender':'recipient'}</div>
            </div>
            <div className="tnum" style={{fontSize:'clamp(34px,3.8vw,44px)', fontWeight:800, letterSpacing:'-.02em', color:'var(--warm)'}}>{fmt(total)}</div>
          </div>
        </div>

        <div style={{marginTop:16, display:'flex', gap:8, flexWrap:'wrap'}}>
          <a href="#" style={{flex:1, padding:'12px 14px', borderRadius:10, background:'var(--warm)', color:'var(--ink)', fontSize:13, fontWeight:800, textAlign:'center'}}>Save as PDF →</a>
          <a href="#" style={{flex:1, padding:'12px 14px', borderRadius:10, background:'rgba(255,255,255,.08)', color:'#fff', fontSize:13, fontWeight:700, textAlign:'center', border:'1px solid rgba(255,255,255,.12)'}}>Ship this now</a>
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   FEATURE CARDS
============================================================= */

function Features(){
  const cards = [
    { icon:<I.sparkle width="22" height="22"/>, color:'var(--blue)', tintBg:'var(--blue-50)',
      title:'HS Code AI Finder', tag:'Type product · get code',
      body:'Paste "men\'s cotton crew t-shirts, 180 gsm" and get 6109.10.0012 in under a second. HS code lookup based on product description matching against the international Harmonized System classification.',
      stat:'94.2% first-match accuracy' },
    { icon:<I.hand width="22" height="22"/>,    color:'var(--accent)', tintBg:'var(--accent-50)',
      title:'Trade Agreement Detection', tag:'Preferential rates · auto-applied',
      body:'USMCA, EU FTA, CPTPP, RCEP, Mercosur, ASEAN — 47 agreements watched. We check rules-of-origin thresholds and apply the preferential rate when your shipment qualifies.',
      stat:'Up to 100% duty reduction' },
    { icon:<I.scale width="22" height="22"/>,   color:'#A37A00', tintBg:'var(--warm-50)',
      title:'De Minimis Thresholds', tag:'Low-value exemptions',
      body:'$800 US · €150 EU (IOSS) · £135 UK · CAD 40 CA · AUD 1,000 AU. We know the thresholds — and whether your Incoterm and product category actually qualify.',
      stat:'213 thresholds tracked' },
    { icon:<I.refresh width="22" height="22"/>, color:'var(--good)', tintBg:'var(--good-50)',
      title:'Real-Time Duty Rates', tag:'Synced with 213 authorities',
      body:'Every tariff change — Brexit adjustments, retaliatory US-China duties, emergency anti-dumping orders — reflected within 24 hours. Sourced directly, not scraped.',
      stat:'Refreshed daily at 02:00 UTC' },
  ];
  return (
    <section style={{padding:'96px 32px'}}>
      <div style={{maxWidth:1240, margin:'0 auto'}}>
        <div style={{marginBottom:40, maxWidth:720}}>
          <div style={{fontSize:12, fontWeight:700, color:'var(--blue)', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:12}}>What's inside</div>
          <h2 style={{margin:0, fontSize:'clamp(28px,3.2vw,40px)', fontWeight:800, letterSpacing:'-.02em', lineHeight:1.1}}>Four things the generic calculators miss.</h2>
          <p style={{margin:'14px 0 0', fontSize:17, color:'var(--body)', maxWidth:620}}>Most "customs calculators" are a duty-rate lookup bolted to a currency converter. We built the whole landed-cost stack.</p>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:20}} className="feat-grid">
          {cards.map((c,i)=>(
            <div key={c.title} className="feat-card" style={{
              background:'#fff', borderRadius:20, border:'1px solid var(--line)',
              padding:28, display:'flex', flexDirection:'column', gap:18,
              boxShadow:'var(--shadow-sm)', transition:'transform .2s, box-shadow .2s', position:'relative'
            }}>
              <div style={{position:'absolute', top:28, right:28, fontSize:11, fontWeight:800, letterSpacing:'.08em', color:'var(--muted)'}}>{String(i+1).padStart(2,'0')}</div>
              <div style={{width:52, height:52, borderRadius:14, background:c.tintBg, color:c.color, display:'grid', placeItems:'center'}}>{c.icon}</div>
              <div>
                <div style={{fontSize:11, fontWeight:700, color:c.color, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:6}}>{c.tag}</div>
                <h3 style={{margin:0, fontSize:22, fontWeight:800, letterSpacing:'-.02em'}}>{c.title}</h3>
              </div>
              <p style={{margin:0, fontSize:14.5, color:'var(--body)', lineHeight:1.6}}>{c.body}</p>
              <div style={{marginTop:'auto', paddingTop:16, borderTop:'1px dashed var(--line)', display:'flex', alignItems:'center', gap:8, fontSize:13, fontWeight:700, color:c.color}}>
                <I.check width="14" height="14"/> {c.stat}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


// Customs Duty Calculator — part 2: map, comparison, stats, testimonials
const { useState: useState2 } = React;

/* =============================================================
   WORLD COVERAGE MAP — country tiles with rates
============================================================= */

const COUNTRY_SAMPLE = [
  {code:'US', name:'United States',   duty:'0–37.5%',  vat:'—',        dm:'$800',    tone:'blue'},
  {code:'DE', name:'Germany',         duty:'0–17%',    vat:'19%',      dm:'€150',    tone:'warm'},
  {code:'GB', name:'United Kingdom',  duty:'0–25%',    vat:'20%',      dm:'£135',    tone:'blue'},
  {code:'CA', name:'Canada',          duty:'0–18%',    vat:'5–15%',    dm:'CAD 40',  tone:'accent'},
  {code:'AU', name:'Australia',       duty:'0–10%',    vat:'10%',      dm:'AUD 1,000',tone:'good'},
  {code:'FR', name:'France',          duty:'0–17%',    vat:'20%',      dm:'€150',    tone:'warm'},
  {code:'IT', name:'Italy',           duty:'0–17%',    vat:'22%',      dm:'€150',    tone:'warm'},
  {code:'ES', name:'Spain',           duty:'0–17%',    vat:'21%',      dm:'€150',    tone:'warm'},
  {code:'NL', name:'Netherlands',     duty:'0–17%',    vat:'21%',      dm:'€150',    tone:'warm'},
  {code:'JP', name:'Japan',           duty:'0–30%',    vat:'10%',      dm:'¥10,000', tone:'accent'},
  {code:'BR', name:'Brazil',          duty:'0–35%',    vat:'17–25%',   dm:'$50',     tone:'good'},
  {code:'MX', name:'Mexico',          duty:'0–35%',    vat:'16%',      dm:'$50',     tone:'good'},
  {code:'CN', name:'China',           duty:'0–50%',    vat:'13%',      dm:'¥50',     tone:'accent'},
  {code:'EU', name:'EU (27 members)', duty:'0–17%',    vat:'17–27%',   dm:'€150',    tone:'warm'},
];

const TONE_MAP = {
  blue:  {bg:'var(--blue-50)',   fg:'var(--blue)',   border:'rgba(26,115,232,.2)'},
  warm:  {bg:'var(--warm-50)',   fg:'#A37A00',       border:'rgba(163,122,0,.2)'},
  accent:{bg:'var(--accent-50)', fg:'var(--accent)', border:'rgba(232,92,58,.2)'},
  good:  {bg:'var(--good-50)',   fg:'var(--good)',   border:'rgba(17,138,84,.2)'},
};

function CoverageMap(){
  const [active, setActive] = useState2('DE');
  const focus = COUNTRY_SAMPLE.find(c=>c.code===active);
  return (
    <section style={{padding:'96px 32px', background:'#fff', borderTop:'1px solid var(--line)', borderBottom:'1px solid var(--line)'}}>
      <div style={{maxWidth:1240, margin:'0 auto'}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'start'}} className="map-grid">
          <div>
            <div style={{fontSize:12, fontWeight:700, color:'var(--accent)', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:12}}>213 countries & territories</div>
            <h2 style={{margin:0, fontSize:'clamp(28px,3.2vw,40px)', fontWeight:800, letterSpacing:'-.02em', lineHeight:1.1}}>Every destination your customers<br/>actually ship to.</h2>
            <p style={{fontSize:17, color:'var(--body)', lineHeight:1.55, margin:'18px 0 28px', maxWidth:500}}>
              Not just the G7. From Andorra to Zimbabwe — duty rates, VAT/GST, de minimis thresholds, and customs formalities indexed directly from each authority's published tariff schedule.
            </p>

            <div style={{background:'var(--bg)', borderRadius:18, border:'1px solid var(--line)', padding:24}}>
              <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:20}}>
                <Flag code={focus.code} size={28}/>
                <div>
                  <div style={{fontSize:17, fontWeight:800, letterSpacing:'-.01em'}}>{focus.name}</div>
                  <div style={{fontSize:12, color:'var(--muted)'}}>Current import regime · updated today</div>
                </div>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12}}>
                {[
                  ['Duty range', focus.duty, 'Ad valorem'],
                  ['VAT / GST', focus.vat,  'On dutiable base'],
                  ['De minimis', focus.dm,  'Value threshold'],
                ].map(([l,v,s])=>(
                  <div key={l} style={{background:'#fff', borderRadius:10, padding:'14px 14px', border:'1px solid var(--line-2)'}}>
                    <div style={{fontSize:10, fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.08em'}}>{l}</div>
                    <div className="tnum" style={{fontSize:18, fontWeight:800, margin:'4px 0 2px', letterSpacing:'-.01em'}}>{v}</div>
                    <div style={{fontSize:10.5, color:'var(--muted)'}}>{s}</div>
                  </div>
                ))}
              </div>
            </div>

            <a href="#" style={{display:'inline-flex', alignItems:'center', gap:8, marginTop:24, fontSize:14, fontWeight:700, color:'var(--blue)'}}>
              Browse all 213 country profiles <I.arrow width="14" height="14"/>
            </a>
          </div>

          <div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:10}}>
              {COUNTRY_SAMPLE.map(c=>{
                const t = TONE_MAP[c.tone];
                const on = active===c.code;
                return (
                  <button key={c.code} onClick={()=>setActive(c.code)} style={{
                    textAlign:'left', padding:14, borderRadius:12,
                    background: on?'var(--ink)':'#fff',
                    color: on?'#fff':'var(--ink)',
                    border:'1px solid '+ (on?'var(--ink)':'var(--line)'),
                    boxShadow: on?'var(--shadow-md)':'var(--shadow-sm)',
                    transition:'.15s',
                  }}>
                    <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:8}}>
                      <Flag code={c.code} size={16}/>
                      <span style={{fontSize:11, fontWeight:800, letterSpacing:'.06em'}}>{c.code}</span>
                    </div>
                    <div style={{fontSize:12, fontWeight:600, opacity:on?.8:.9, marginBottom:8, lineHeight:1.25}}>{c.name}</div>
                    <div className="tnum" style={{fontSize:11, fontWeight:700, color: on?'var(--warm)':t.fg, background: on?'rgba(255,255,255,.08)':t.bg, padding:'3px 6px', borderRadius:6, display:'inline-block'}}>
                      {c.duty}
                    </div>
                  </button>
                );
              })}
              <div style={{padding:14, borderRadius:12, background:'var(--bg)', border:'1px dashed var(--line)', display:'grid', placeItems:'center', color:'var(--muted)', fontSize:12, fontWeight:700}}>
                + 199 more
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =============================================================
   COMPARISON TABLE
============================================================= */

function Comparison(){
  const rows = [
    ['HS code auto-classification',   true,  false, 'Manual lookup'],
    ['Duty + VAT + broker fees',      true,  'Partial', 'Duty only'],
    ['Trade agreement preferences',   true,  false, 'Not applied'],
    ['De minimis threshold logic',    true,  false, 'Ignored'],
    ['Refreshed daily',               true,  'Weekly', 'Unknown'],
    ['API + bulk CSV upload',         true,  false, false],
    ['Free tier',                     '100/mo', true, true],
    ['Accuracy SLA',                  '96%', 'None', 'None'],
  ];
  const renderCell = (v, isPrimary) => {
    if (v === true)  return <I.check width="18" height="18" style={{color: isPrimary ? 'var(--good)' : 'var(--muted)'}}/>;
    if (v === false) return <I.x width="18" height="18" style={{color:'var(--muted)', opacity:.5}}/>;
    return <span style={{fontSize:13, fontWeight:700, color: isPrimary ? 'var(--ink)' : 'var(--muted)'}}>{v}</span>;
  };
  return (
    <section style={{padding:'96px 32px'}}>
      <div style={{maxWidth:1100, margin:'0 auto'}}>
        <div style={{textAlign:'center', marginBottom:48}}>
          <div style={{fontSize:12, fontWeight:700, color:'var(--good)', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:12}}>Side by side</div>
          <h2 style={{margin:0, fontSize:'clamp(28px,3.2vw,40px)', fontWeight:800, letterSpacing:'-.02em'}}>Built for commerce. Not for<br/>filling out a textbook exercise.</h2>
        </div>
        <div style={{background:'#fff', borderRadius:20, border:'1px solid var(--line)', overflow:'hidden', boxShadow:'var(--shadow-md)'}}>
          <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr 1fr 1fr', background:'var(--ink)', color:'#fff'}}>
            <div style={{padding:'22px 24px', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'rgba(255,255,255,.5)'}}>Capability</div>
            <div style={{padding:'22px 20px', textAlign:'center', fontSize:14, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', gap:8}}>
              <div style={{width:20, height:20, borderRadius:6, background:'linear-gradient(135deg, var(--blue), #2F88FF)', display:'grid', placeItems:'center'}}><I.ship width="11" height="11"/></div>
              RateShips
            </div>
            <div style={{padding:'22px 20px', textAlign:'center', fontSize:14, fontWeight:700, color:'rgba(255,255,255,.6)'}}>Carrier built-ins</div>
            <div style={{padding:'22px 20px', textAlign:'center', fontSize:14, fontWeight:700, color:'rgba(255,255,255,.6)'}}>Generic calculators</div>
          </div>
          {rows.map(([label, a, b, c], i)=>(
            <div key={i} style={{display:'grid', gridTemplateColumns:'1.4fr 1fr 1fr 1fr', alignItems:'center', borderTop: i===0?'none':'1px solid var(--line-2)', background: i%2 ? 'transparent' : 'var(--bg)'}}>
              <div style={{padding:'16px 24px', fontSize:14, fontWeight:600, color:'var(--ink)'}}>{label}</div>
              <div style={{padding:'16px 20px', textAlign:'center', background:'rgba(26,115,232,.03)'}}>{renderCell(a, true)}</div>
              <div style={{padding:'16px 20px', textAlign:'center'}}>{renderCell(b, false)}</div>
              <div style={{padding:'16px 20px', textAlign:'center'}}>{renderCell(c, false)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =============================================================
   STATS STRIP
============================================================= */

function Stats(){
  const stats = [
    ['213', 'Countries covered'],
    ['213',     'Countries & territories'],
    ['134+', 'Carriers integrated'],
    ['12', 'Languages supported'],
    ['45K+', 'Shipping routes'],
    ['Weekly', 'Data updates'],
  ];
  return (
    <section style={{padding:'64px 32px', background:'var(--ink)', color:'#fff'}}>
      <div style={{maxWidth:1240, margin:'0 auto'}}>
        <div style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:20}} className="stats-grid">
          {stats.map(([n,l])=>(
            <div key={l} style={{padding:'12px 0'}}>
              <div className="tnum" style={{fontSize:'clamp(28px, 3vw, 42px)', fontWeight:800, letterSpacing:'-.02em', color:'var(--warm)', lineHeight:1}}>{n}</div>
              <div style={{fontSize:13, color:'rgba(255,255,255,.6)', marginTop:8, fontWeight:500}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =============================================================
   TESTIMONIALS
============================================================= */

function Testimonials(){
  const useCases = [
    { title:'E-commerce seller', scenario:'Electronics from US to Germany',
      problem:'Wasn\'t sure if EU VAT applies on top of duty or only on the product value.',
      solution:'Calculator showed: 0% duty (IT Agreement) + 19% VAT on full value + broker fee = exact landed cost before shipping.',
      icon:<I.box width="20" height="20"/>, color:'var(--blue)', bg:'var(--blue-50)' },
    { title:'Gift sender', scenario:'Clothes from China to US',
      problem:'Didn\'t know the $800 de minimis threshold means no duty on small personal shipments.',
      solution:'Calculator instantly showed: $0 duty, $0 tax — package qualifies for de minimis exemption.',
      icon:<I.shield width="20" height="20"/>, color:'var(--accent)', bg:'var(--accent-50)' },
    { title:'Small business', scenario:'Cosmetics from France to Brazil',
      problem:'Brazil has complex import taxes — ICMS, PIS, COFINS on top of duty. Total cost was a mystery.',
      solution:'Full breakdown: 18% duty + ~25% combined taxes + $42 broker fee. No surprises at the border.',
      icon:<I.globe width="20" height="20"/>, color:'var(--good)', bg:'var(--good-50)' },
  ];
  return (
    <section style={{padding:'96px 32px'}}>
      <div style={{maxWidth:1240, margin:'0 auto'}}>
        <div style={{marginBottom:44, maxWidth:640}}>
          <div style={{fontSize:12, fontWeight:700, color:'var(--blue)', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:12}}>Use cases</div>
          <h2 style={{margin:0, fontSize:'clamp(28px,3.2vw,40px)', fontWeight:800, letterSpacing:'-.02em'}}>See exactly what you'll pay — before you ship.</h2>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:20}} className="quote-grid">
          {useCases.map((u,i)=>(
            <div key={i} style={{background:'#fff', border:'1px solid var(--line)', borderRadius:20, padding:28, boxShadow:'var(--shadow-sm)', display:'flex', flexDirection:'column', gap:16}}>
              <div style={{display:'flex', alignItems:'center', gap:12}}>
                <div style={{width:40, height:40, borderRadius:10, background:u.bg, color:u.color, display:'grid', placeItems:'center'}}>{u.icon}</div>
                <div>
                  <div style={{fontSize:14, fontWeight:700}}>{u.title}</div>
                  <div style={{fontSize:12, color:'var(--muted)'}}>{u.scenario}</div>
                </div>
              </div>
              <div style={{padding:'14px 16px', background:'var(--bg)', borderRadius:10, border:'1px solid var(--line-2)'}}>
                <div style={{fontSize:11, fontWeight:700, color:'var(--accent)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:6}}>Problem</div>
                <p style={{margin:0, fontSize:13, color:'var(--body)', lineHeight:1.5}}>{u.problem}</p>
              </div>
              <div style={{padding:'14px 16px', background:'var(--good-50)', borderRadius:10, border:'1px solid rgba(17,138,84,.1)'}}>
                <div style={{fontSize:11, fontWeight:700, color:'var(--good)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:6}}>Solution</div>
                <p style={{margin:0, fontSize:13, color:'var(--ink-2)', lineHeight:1.5}}>{u.solution}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


// Customs Duty Calculator — part 3: disclaimer, FAQ, CTA, footer, App
const { useState: useState3 } = React;

/* =============================================================
   LEGAL DISCLAIMER — compact, honest
============================================================= */

function Disclaimer(){
  return (
    <section style={{padding:'48px 32px', background:'var(--warm-50)', borderTop:'1px solid var(--line)', borderBottom:'1px solid var(--line)'}}>
      <div style={{maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'auto 1fr auto', gap:28, alignItems:'center'}} className="disc-grid">
        <div style={{width:56, height:56, borderRadius:16, background:'#fff', color:'#A37A00', display:'grid', placeItems:'center', boxShadow:'var(--shadow-sm)', flex:'0 0 56px'}}>
          <I.info width="26" height="26"/>
        </div>
        <div>
          <div style={{fontSize:12, fontWeight:800, color:'#A37A00', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:6}}>Good-faith estimate — not a binding determination</div>
          <p style={{margin:0, fontSize:14, color:'var(--ink-2)', lineHeight:1.55, maxWidth:720}}>
            Final duty is assessed by the destination customs authority at time of clearance and may differ based on inspection, valuation method, or origin documentation. Our calculator provides estimates based on published tariff data — it is not legal or customs advice. For shipments above $25,000 or regulated goods, consult a licensed customs broker.
          </p>
        </div>
        <a href="#" style={{padding:'10px 16px', borderRadius:10, background:'#fff', color:'var(--ink)', fontSize:13, fontWeight:700, border:'1px solid var(--line)', display:'inline-flex', alignItems:'center', gap:6, whiteSpace:'nowrap'}}>
          Accuracy methodology <I.arrow width="12" height="12"/>
        </a>
      </div>
    </section>
  );
}

/* =============================================================
   FAQ — expandable
============================================================= */

function FAQ(){
  const items = [
    { q:'Where do your duty rates come from?',
      a:'From each country\'s published tariff schedule — the US HTSUS, the EU TARIC database, the UK Integrated Online Tariff, and equivalents for other markets. We reference official customs authority data and update our database weekly.' },
    { q:'How do you determine the HS code?',
      a:'We provide an HS code lookup tool based on product descriptions mapped to the international Harmonized System classification. For complex products, we recommend verifying the code with your customs broker or the destination country\'s tariff database.' },
    { q:'Does the calculator account for trade agreements?',
      a:'We cover major preferential trade agreements including USMCA, EU FTAs, CPTPP, and RCEP. If your origin/destination pair qualifies for preferential rates, the calculator shows the reduced duty. You may need a certificate of origin to claim the preference.' },
    { q:'What if customs charges a different amount?',
      a:'Our calculations are estimates based on published tariff data. Final duty is assessed by the destination customs authority and may differ based on inspection, valuation method, or documentation. For high-value or unusual shipments, we recommend consulting a licensed customs broker.' },
    { q:'Is this calculator free?',
      a:'Yes — the customs duty calculator is free for all users with no signup required. We plan to offer advanced features (bulk calculations, API access) as part of a paid plan in the future.' },
    { q:'Do you handle regulated goods (lithium batteries, cosmetics, alcohol)?',
      a:'We show general duty rates and restrictions for common product categories. For regulated goods like lithium batteries, pharmaceuticals, or alcohol, specific import licenses may be required — consult a specialized customs broker in the destination country.' },
  ];
  const [open, setOpen] = useState3(0);
  return (
    <section style={{padding:'96px 32px', background:'#fff', borderTop:'1px solid var(--line)'}}>
      <div style={{maxWidth:900, margin:'0 auto'}}>
        <div style={{textAlign:'center', marginBottom:48}}>
          <div style={{fontSize:12, fontWeight:700, color:'var(--blue)', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:12}}>Questions we get weekly</div>
          <h2 style={{margin:0, fontSize:'clamp(28px,3.2vw,40px)', fontWeight:800, letterSpacing:'-.02em'}}>How the math actually works.</h2>
        </div>
        <div style={{display:'flex', flexDirection:'column', gap:10}}>
          {items.map((it, i)=>{
            const on = open===i;
            return (
              <div key={i} style={{background: on?'var(--bg)':'#fff', borderRadius:14, border:'1px solid '+(on?'var(--ink)':'var(--line)'), transition:'.2s', overflow:'hidden'}}>
                <button onClick={()=>setOpen(on?-1:i)} style={{width:'100%', padding:'20px 24px', display:'flex', justifyContent:'space-between', alignItems:'center', gap:16, textAlign:'left'}}>
                  <span style={{fontSize:16, fontWeight:700, color:'var(--ink)'}}>{it.q}</span>
                  <span style={{width:28, height:28, borderRadius:999, background: on?'var(--ink)':'var(--line-2)', color: on?'#fff':'var(--muted)', display:'grid', placeItems:'center', transition:'.2s', flex:'0 0 28px'}}>
                    <I.chev width="14" height="14" style={{transform: on?'rotate(180deg)':'none', transition:'.2s'}}/>
                  </span>
                </button>
                {on && <div style={{padding:'0 24px 22px', fontSize:14.5, color:'var(--body)', lineHeight:1.65, maxWidth:760}}>{it.a}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* =============================================================
   CTA
============================================================= */

function CTA(){
  return (
    <section style={{padding:'96px 32px'}}>
      <div style={{maxWidth:1100, margin:'0 auto', borderRadius:28, background:'var(--ink)', color:'#fff', padding:'72px 48px', position:'relative', overflow:'hidden'}}>
        <div aria-hidden style={{position:'absolute', inset:0, background:`
          radial-gradient(600px 400px at 85% 15%, rgba(26,115,232,.25), transparent 60%),
          radial-gradient(500px 300px at 15% 85%, rgba(232,92,58,.15), transparent 60%)`}}/>
        <div aria-hidden style={{position:'absolute', inset:0, backgroundImage:`linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)`, backgroundSize:'40px 40px', maskImage:'linear-gradient(180deg, #000, transparent)'}}/>
        <div style={{position:'relative', display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:48, alignItems:'center'}} className="cta-grid">
          <div>
            <h2 style={{margin:0, fontSize:'clamp(32px, 4vw, 52px)', fontWeight:800, letterSpacing:'-.025em', lineHeight:1.05}}>
              Your customers shouldn't learn<br/>about customs at their<br/><span style={{color:'var(--warm)'}}>front door.</span>
            </h2>
            <p style={{fontSize:17, color:'rgba(255,255,255,.7)', lineHeight:1.55, margin:'20px 0 32px', maxWidth:520}}>
              Show the all-in number at checkout. Collect duties upfront. Never hand a delivery driver an invoice surprise again.
            </p>
            <div style={{display:'flex', gap:12, flexWrap:'wrap'}}>
              <a href="Homepage.html#calc" style={{padding:'14px 22px', borderRadius:12, background:'var(--warm)', color:'var(--ink)', fontSize:15, fontWeight:800, display:'inline-flex', alignItems:'center', gap:8}}>
                Try the calculator <I.arrow width="16" height="16"/>
              </a>
              <a href="Pricing.html" style={{padding:'14px 22px', borderRadius:12, background:'rgba(255,255,255,.08)', color:'#fff', fontSize:15, fontWeight:700, border:'1px solid rgba(255,255,255,.14)'}}>See pricing</a>
            </div>
          </div>
          <div style={{background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.1)', borderRadius:18, padding:28, backdropFilter:'blur(4px)'}}>
            <div style={{fontSize:11, fontWeight:700, color:'rgba(255,255,255,.5)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:14}}>Integrations that work day one</div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
              {['Shopify','WooCommerce','BigCommerce','Magento','NetSuite','SAP','Zapier','REST API'].map(p=>(
                <div key={p} style={{padding:'10px 12px', borderRadius:8, background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', fontSize:13, fontWeight:600, display:'flex', alignItems:'center', gap:8}}>
                  <I.check width="12" height="12" style={{color:'#4AD991'}}/> {p}
                </div>
              ))}
            </div>
            <div style={{marginTop:16, padding:'12px 14px', borderRadius:10, background:'rgba(242,201,76,.12)', border:'1px solid rgba(242,201,76,.25)', fontSize:12, color:'rgba(255,255,255,.85)', display:'flex', alignItems:'center', gap:8}}>
              <I.shield width="14" height="14" style={{color:'var(--warm)'}}/> Median time-to-first-quote: <b className="tnum" style={{color:'var(--warm)', fontWeight:800}}>&nbsp;11 hours</b>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =============================================================
   FOOTER
============================================================= */

function Footer(){
  const cols = [
    ['Product', [['Live rates','Homepage.html'],['Customs calculator','Customs.html'],['Carrier comparison','Homepage.html'],['API docs','Homepage.html'],['Shopify plug-in','Homepage.html']]],
    ['Company', [['About','About.html'],['Pricing','Pricing.html'],['Careers','About.html'],['Press kit','About.html'],['Contact','About.html']]],
    ['Resources',[['HS code lookup','#'],['Country profiles','#'],['Trade agreement guide','#'],['De minimis map','#'],['Shipping blog','#']]],
    ['Legal',   [['Privacy policy','#'],['Terms of service','#'],['Accuracy SLA','#'],['DPA','#'],['Security','#']]],
  ];
  return (
    <footer style={{background:'#fff', borderTop:'1px solid var(--line)', padding:'64px 32px 32px'}}>
      <div style={{maxWidth:1240, margin:'0 auto'}}>
        <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr 1fr 1fr 1fr', gap:48}} className="ft-grid">
          <div>
            <a href="Homepage.html" style={{display:'flex', alignItems:'center', gap:10, marginBottom:16}}>
              <div style={{width:32, height:32, borderRadius:9, background:'linear-gradient(135deg, var(--blue), #2F88FF)', display:'grid', placeItems:'center', color:'#fff', boxShadow:'0 4px 10px rgba(26,115,232,.28)'}}><I.ship width="18" height="18"/></div>
              <span style={{fontWeight:800, fontSize:19, letterSpacing:'-.01em'}}>RateShips</span>
            </a>
            <p style={{margin:'0 0 20px', fontSize:13, color:'var(--muted)', lineHeight:1.55, maxWidth:320}}>
              The landed-cost engine under your checkout. We do the customs math so your customers don't get invoiced at the door.
            </p>
            <div style={{display:'flex', gap:10}}>
              {[['Twitter', <I.twitter width="15" height="15"/>],['LinkedIn', <I.linkedin width="15" height="15"/>]].map(([l,ic],i)=>(
                <a key={i} href="#" aria-label={l} style={{width:34, height:34, borderRadius:9, background:'var(--bg)', border:'1px solid var(--line)', display:'grid', placeItems:'center', color:'var(--body)'}}>{ic}</a>
              ))}
            </div>
          </div>
          {cols.map(([title, links])=>(
            <div key={title}>
              <div style={{fontSize:11, fontWeight:800, color:'var(--ink)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:16}}>{title}</div>
              <ul style={{listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:10}}>
                {links.map(([l,h])=>(
                  <li key={l}><a href={h} style={{fontSize:13.5, color:'var(--body)', fontWeight:500}}>{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{marginTop:48, paddingTop:24, borderTop:'1px solid var(--line)', display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:14, fontSize:12, color:'var(--muted)'}}>
          <div>© 2026 RateShips Inc. · Delaware, USA. All rates subject to change at the discretion of each customs authority.</div>
          <div style={{display:'flex', gap:20}}>
            <span>🌐 English (US)</span>
            <span>💳 USD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* =============================================================
   APP
============================================================= */

export default function App(){
  return (
    <>
      <Hero/>
      <Features/>
      <CoverageMap/>
      <Comparison/>
      <Stats/>
      <Testimonials/>
      <Disclaimer/>
      <FAQ/>
      <CTA/>
      <style>{`
        @media (max-width: 960px){
          .desktop-only{display:none !important}
          .hero-grid, .map-grid, .cta-grid, .feat-grid, .quote-grid{grid-template-columns:1fr !important}
          .stats-grid{grid-template-columns:repeat(3,1fr) !important}
          .ft-grid{grid-template-columns:repeat(2,1fr) !important; gap:32px !important}
          .disc-grid{grid-template-columns:1fr !important; text-align:left !important}
        }
        a:hover{opacity:.85}
        button:hover{opacity:.92}
        .feat-card:hover{transform:translateY(-2px); box-shadow:var(--shadow-md)}
      `}</style>
    </>
  );
}

