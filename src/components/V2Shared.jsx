"use client";

import React from "react";
const { useState } = React;

/* === ICONS === */
export const I = {
  ship:(p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M2 20s2 1 4 1 3-1 4-1 2 1 4 1 3-1 4-1 4-1 4-1"/><path d="M4 18L3 12h18l-1 6"/><path d="M12 4v8M8 8h8"/></svg>,
  arrow:(p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>,
  check:(p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 6L9 17l-5-5"/></svg>,
  x:(p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M18 6L6 18M6 6l12 12"/></svg>,
  chev:(p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 9l6 6 6-6"/></svg>,
  shield:(p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 2l8 3v7c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5l8-3z"/><path d="M9 12l2 2 4-4"/></svg>,
  star:(p)=> <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2l3 7 7 .6-5.3 4.7 1.7 7-6.4-3.9L5.6 21.4l1.7-7L2 9.6 9 9z"/></svg>,
  search:(p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>,
  globe:(p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/></svg>,
  box:(p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/></svg>,
  clock:(p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>,
  bolt:(p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/></svg>,
  tag:(p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20.59 13.41L13 21a2 2 0 01-2.83 0l-7-7A2 2 0 012.59 13V4a2 2 0 012-2h9a2 2 0 011.41.59l7 7a2 2 0 010 2.83z"/><circle cx="7" cy="7" r="1.2"/></svg>,
  pin:(p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  mail:(p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4L12 13 2 4"/></svg>,
  book:(p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>,
  scale:(p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3v18M5 8h14M3 14l3-7 3 7M15 14l3-7 3 7"/><path d="M3 14a3 3 0 006 0M15 14a3 3 0 006 0"/></svg>,
  spark:(p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></svg>,
  menu:(p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 12h18M3 6h18M3 18h18"/></svg>,
  twitter:(p)=> <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  linkedin:(p)=> <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 11.01-4.12 2.06 2.06 0 01-.01 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/></svg>,
};

/* === NAV === */
export function Nav({active}){
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = [
    {href:'/v2', label:'Rates'},
    {href:'/v2/customs', label:'Tools'},
    {href:'/v2/carriers', label:'Carriers'},
    {href:'/v2/guides', label:'Guides'},
    {href:'/v2/about', label:'About'},
    {href:'/v2/blog', label:'Blog'},
  ];
  return (
    <header style={{position:'sticky', top:0, zIndex:40, background:'rgba(250,247,242,.85)', backdropFilter:'saturate(1.2) blur(10px)', borderBottom:'1px solid var(--line)'}}>
      <div style={{maxWidth:1240, margin:'0 auto', padding:'14px 32px', display:'flex', alignItems:'center', gap:32}}>
        <a href="/v2" style={{display:'flex', alignItems:'center', gap:10}}>
          <div style={{width:28, height:28, borderRadius:8, background:'linear-gradient(135deg, var(--blue), #2F88FF)', display:'grid', placeItems:'center', color:'#fff', boxShadow:'0 4px 10px rgba(26,115,232,.28)'}}><I.ship width="16" height="16"/></div>
          <span style={{fontWeight:800, fontSize:17, letterSpacing:'-.01em'}}>RateShips</span>
        </a>
        <nav style={{display:'flex', gap:28, fontSize:14, color:'var(--body)', fontWeight:500}} className="desktop-only">
          {links.map(l=>(
            <a key={l.href} href={l.href} style={{color: active===l.label?'var(--ink)':'var(--body)'}}>{l.label}</a>
          ))}
        </nav>
        <div style={{marginLeft:'auto', display:'flex', alignItems:'center', gap:14}}>
          <a href="mailto:info@rateships.com" style={{fontSize:13, fontWeight:500, color:'var(--muted)'}} className="desktop-only">info@rateships.com</a>
          <a href="/v2" style={{padding:'9px 16px', borderRadius:999, background:'var(--ink)', color:'#fff', fontSize:14, fontWeight:600}}>Compare rates — free</a>
          <button onClick={()=>setMobileOpen(!mobileOpen)} className="mobile-only" style={{display:'none', background:'none', border:'none'}}>
            {mobileOpen ? <I.x width={24} height={24}/> : <I.menu width={24} height={24}/>}
          </button>
        </div>
      </div>
    </header>
  );
}

/* === SECTION HEAD === */
export function SectionHead({eyebrow, title, desc}){
  return (
    <div style={{marginBottom:40, maxWidth:720}}>
      {eyebrow && <div style={{fontSize:12, fontWeight:700, color:'var(--blue)', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:12}}>{eyebrow}</div>}
      <h2 style={{margin:0, fontSize:'clamp(28px, 3.2vw, 40px)', fontWeight:800, letterSpacing:'-.02em', lineHeight:1.1}}>{title}</h2>
      {desc && <p style={{margin:'14px 0 0', fontSize:17, color:'var(--body)', maxWidth:620}}>{desc}</p>}
    </div>
  );
}

/* === FOOTER === */
export function Footer(){
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const cols = [
    {title:'Product', links:[['Rate comparison','/v2'],['Customs calculator','/v2/customs'],['Delivery estimator','/v2/tools/delivery'],['All tools','/v2/tools']]},
    {title:'Carriers', links:[['DHL Express','/v2/carriers/dhl'],['FedEx','/v2/carriers/fedex'],['UPS','/v2/carriers/ups'],['EMS','/v2/carriers/ems'],['All 134 carriers →','/v2/carriers']]},
    {title:'Resources', links:[['Shipping guides','/v2/guides'],['Blog','/v2/blog'],['Data methodology','/v2/methodology'],['FAQ','/v2/faq']]},
    {title:'Company', links:[['About','/v2/about'],['Community','/v2/about#community'],['Contact','/v2/contact'],['Privacy','/v2/privacy'],['Terms','/v2/terms']]},
  ];
  return (
    <footer style={{background:'var(--ink)', color:'#fff', padding:'72px 32px 32px'}}>
      <div style={{maxWidth:1240, margin:'0 auto'}}>
        {/* Newsletter */}
        <div style={{background:'rgba(255,255,255,.04)', borderRadius:20, border:'1px solid rgba(255,255,255,.08)', padding:'28px 32px', marginBottom:48, display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:32, alignItems:'center'}} className="newsletter-grid">
          <div>
            <div style={{fontSize:12, fontWeight:700, color:'var(--warm)', textTransform:'uppercase', letterSpacing:'.06em'}}>Stay updated</div>
            <h3 style={{margin:'8px 0 6px', fontSize:22, fontWeight:700, letterSpacing:'-.015em'}}>Shipping rate updates, in your inbox.</h3>
            <p style={{margin:0, fontSize:14, color:'rgba(255,255,255,.65)'}}>Subscribe to shipping rate updates.</p>
          </div>
          <form onSubmit={e=>{e.preventDefault();setSent(true);}} style={{display:'flex', gap:8}}>
            <input type="email" required placeholder="you@company.com" value={email} onChange={e=>setEmail(e.target.value)} style={{flex:1, padding:'12px 16px', borderRadius:10, border:'1px solid rgba(255,255,255,.12)', background:'rgba(255,255,255,.05)', color:'#fff', fontSize:14, outline:'none'}}/>
            <button type="submit" style={{padding:'12px 18px', borderRadius:10, background:'var(--warm)', color:'var(--ink)', fontSize:14, fontWeight:700, whiteSpace:'nowrap', border:'none', cursor:'pointer'}}>{sent?'Subscribed ✓':'Subscribe'}</button>
          </form>
        </div>
        {/* Cols */}
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
                {c.links.map(([label,href])=>(
                  <a key={label} href={href} style={{fontSize:13, color:'rgba(255,255,255,.6)'}}>{label}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{marginTop:40, paddingTop:20, borderTop:'1px solid rgba(255,255,255,.08)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16, fontSize:12, color:'rgba(255,255,255,.45)'}}>
          <div>© 2026 Global Supply KFT · 134 carriers · 213 countries · Updated weekly</div>
          <div style={{display:'flex', gap:20}}>
            <a href="/v2/privacy">Privacy</a>
            <a href="/v2/terms">Terms</a>
            <a href="/v2/contact">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* === RESPONSIVE CSS === */
export function ResponsiveCSS(){
  return (
    <style>{`
      @media (max-width: 960px) {
        .desktop-only { display: none !important; }
        .hero-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        .tools-grid, .quote-grid, .press-grid, .team-grid { grid-template-columns: 1fr !important; }
        .stats-grid { grid-template-columns: 1fr 1fr !important; gap: 24px !important; }
        .two-col, .careers-grid, .compare-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        .footer-cols { grid-template-columns: 1fr 1fr !important; gap: 28px !important; }
        .newsletter-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
        .logos-grid { grid-template-columns: 1fr 1fr 1fr !important; }
        .disc-grid { grid-template-columns: 1fr !important; text-align: center; }
      }
      @media (max-width: 560px) {
        section { padding-left: 20px !important; padding-right: 20px !important; }
        .stats-grid { grid-template-columns: 1fr !important; }
        .logos-grid { grid-template-columns: 1fr 1fr !important; }
      }
    `}</style>
  );
}
