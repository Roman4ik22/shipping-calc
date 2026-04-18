"use client";
import { I, SectionHead } from "./V2Shared";
import React, { useState } from "react";

const sections = [
  { title:'Getting started', items:[
    {q:'What is RateShips?', a:'RateShips is a free international shipping rate comparison platform. We aggregate published tariff data from 134+ carriers across 213 countries so you can compare rates, estimate customs duties, and predict delivery times — all in one place.'},
    {q:'Do I need to create an account?', a:'No. All tools are free and work without signup. Just enter your shipment details and compare rates instantly.'},
    {q:'How is RateShips free?', a:'We plan to offer premium features (bulk comparison, API access, rate alerts) as paid plans in the future. The core rate comparison, customs calculator, and delivery estimator are free forever.'},
    {q:'Which carriers do you compare?', a:'134+ carriers including DHL Express, FedEx, UPS, EMS, USPS, Royal Mail, SF Express, Aramex, DPD, TNT, and 124 more regional and postal carriers.'},
  ]},
  { title:'Rate data', items:[
    {q:'Where do your rates come from?', a:'From published carrier tariff schedules and official rate cards. We reference carrier websites, tariff PDFs, and partner data-sharing agreements. We do not scrape or estimate rates.'},
    {q:'How often are rates updated?', a:'Weekly. Our team verifies rate changes every week against published carrier tariffs and updates the database.'},
    {q:'Why might rates differ from the carrier\'s website?', a:'Carrier websites may show rates after login-specific discounts, promotional pricing, or surcharges that vary by account. Our rates are based on published standard tariffs.'},
    {q:'Do rates include fuel surcharges?', a:'Rates shown are base rates from published tariffs. Fuel surcharges, remote area fees, and other variable charges may apply at booking. We note this in our rate comparison results.'},
  ]},
  { title:'Customs & duties', items:[
    {q:'How accurate is the customs calculator?', a:'Our calculator uses data from official customs authority tariff databases (US HTSUS, EU TARIC, UK Trade Tariff, etc.). It provides estimates — final duty is determined by the destination customs authority at clearance.'},
    {q:'Do you cover all 213 countries?', a:'Yes. We have duty and VAT/GST data for all 213 countries and territories. Coverage depth varies — major trade destinations have more detailed HS-code level data.'},
    {q:'What about trade agreements?', a:'We cover major preferential trade agreements including USMCA, EU FTAs, CPTPP, and RCEP. If your shipment qualifies, reduced duty rates are shown.'},
  ]},
  { title:'About the company', items:[
    {q:'Who is behind RateShips?', a:'RateShips is operated by Global Supply KFT, a company registered in Hungary (EU VAT: HU26179030). Our small team is based in Hungary with remote collaborators.'},
    {q:'How can I contact you?', a:'Email info@rateships.com. We respond within 24 hours. You can also report data errors or suggest carriers through our contact page.'},
    {q:'Can I suggest a carrier to add?', a:'Yes! Email us at info@rateships.com with the carrier name and region. We typically integrate new carriers within 30 days.'},
  ]},
];

export default function FAQPage(){
  const [openSection, setOpenSection] = useState(0);
  const [openItem, setOpenItem] = useState(0);

  return (
    <>
      <section style={{padding:'72px 32px 48px', borderBottom:'1px solid var(--line)', position:'relative'}}>
        <div aria-hidden style={{position:'absolute', inset:0, background:'radial-gradient(800px 400px at 40% -10%, rgba(26,115,232,.08), transparent 60%)'}}/>
        <div style={{position:'relative', maxWidth:1240, margin:'0 auto'}}>
          <h1 style={{margin:'0 0 18px', fontSize:'clamp(40px,5vw,64px)', lineHeight:1.02, letterSpacing:'-.03em', fontWeight:800}}>
            Questions, <span style={{color:'var(--blue)'}}>answered.</span>
          </h1>
          <p style={{fontSize:19, color:'var(--body)', maxWidth:600}}>Everything about rate comparison, customs duties, and how we work.</p>
        </div>
      </section>

      <section style={{padding:'64px 32px 96px'}}>
        <div style={{maxWidth:900, margin:'0 auto'}}>
          {sections.map((s,si)=>(
            <div key={si} style={{marginBottom:40}}>
              <h2 style={{fontSize:20, fontWeight:800, marginBottom:16, color:'var(--ink)'}}>{s.title}</h2>
              <div style={{border:'1px solid var(--line)', borderRadius:16, overflow:'hidden', background:'#fff'}}>
                {s.items.map((item,ii)=>{
                  const isOpen = openSection===si && openItem===ii;
                  return (
                    <div key={ii} style={{borderTop: ii>0?'1px solid var(--line)':'none'}}>
                      <button onClick={()=>{setOpenSection(si);setOpenItem(isOpen?-1:ii);}} style={{width:'100%', padding:'20px 24px', display:'flex', alignItems:'center', gap:16, textAlign:'left', background:isOpen?'var(--bg)':'#fff', border:'none', cursor:'pointer', transition:'background .15s'}}>
                        <span style={{flex:1, fontSize:15, fontWeight:600, color:'var(--ink)'}}>{item.q}</span>
                        <I.chev width={18} height={18} style={{color:'var(--muted)', transform:isOpen?'rotate(180deg)':'none', transition:'transform .2s'}}/>
                      </button>
                      {isOpen && <div style={{padding:'0 24px 20px', fontSize:14.5, color:'var(--body)', lineHeight:1.65, maxWidth:720}}>{item.a}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div style={{textAlign:'center', marginTop:32, padding:'28px', background:'var(--bg)', borderRadius:16, border:'1px solid var(--line)'}}>
            <p style={{margin:'0 0 12px', fontSize:16, fontWeight:700}}>Still have a question?</p>
            <p style={{margin:'0 0 16px', fontSize:14, color:'var(--body)'}}>We respond within 24 hours.</p>
            <a href="mailto:info@rateships.com" style={{padding:'12px 24px', borderRadius:12, background:'var(--ink)', color:'#fff', fontWeight:600, fontSize:14, display:'inline-flex', alignItems:'center', gap:8}}>info@rateships.com <I.arrow width={14} height={14}/></a>
          </div>
        </div>
      </section>
    </>
  );
}
