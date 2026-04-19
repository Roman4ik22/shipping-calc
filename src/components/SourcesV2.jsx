"use client";
import React from "react";

const carriers = [
  {name:'DHL Express', status:'Verified', url:'https://www.dhl.com/global-en/home/our-divisions/express.html'},
  {name:'FedEx', status:'Verified', url:'https://www.fedex.com/en-us/shipping.html'},
  {name:'UPS', status:'Verified', url:'https://www.ups.com/us/en/shipping.page'},
  {name:'USPS', status:'Verified', url:'https://www.usps.com/international/mail-shipping-services.htm'},
  {name:'Royal Mail', status:'Verified', url:'https://www.royalmail.com/sending/international'},
  {name:'Japan Post', status:'Verified', url:'https://www.post.japanpost.jp/int/index_en.html'},
  {name:'Australia Post', status:'Verified', url:'https://auspost.com.au/sending/send-overseas'},
  {name:'Canada Post', status:'Verified', url:'https://www.canadapost-postescanada.ca/cpc/en/personal/sending/letters-mail/international.page'},
  {name:'Deutsche Post / DHL Paket', status:'Verified', url:'https://www.deutschepost.de/en/home.html'},
  {name:'La Poste (France)', status:'Verified', url:'https://www.laposte.fr/envoyer-colis'},
  {name:'PostNL', status:'Verified', url:'https://www.postnl.nl/en/'},
  {name:'Swiss Post', status:'Verified', url:'https://www.post.ch/en'},
  {name:'Singapore Post', status:'Verified', url:'https://www.singpost.com/'},
  {name:'Korea Post', status:'Verified', url:'https://www.epost.go.kr/main.RetrieveMainPage.comm'},
  {name:'China Post', status:'Verified', url:'http://english.chinapost.com.cn/'},
  {name:'India Post', status:'Verified', url:'https://www.indiapost.gov.in/'},
  {name:'Correos (Spain)', status:'Verified', url:'https://www.correos.es/en/'},
  {name:'Poste Italiane', status:'Verified', url:'https://www.poste.it/'},
  {name:'Bpost (Belgium)', status:'Verified', url:'https://www.bpost.be/en'},
  {name:'PostNord', status:'Verified', url:'https://www.postnord.se/en'},
  {name:'An Post (Ireland)', status:'Verified', url:'https://www.anpost.com/'},
  {name:'Posti (Finland)', status:'Verified', url:'https://www.posti.fi/en'},
  {name:'Correos de Mexico', status:'Verified', url:'https://www.correosdemexico.gob.mx/'},
  {name:'Correios (Brazil)', status:'Verified', url:'https://www.correios.com.br/'},
  {name:'New Zealand Post', status:'Verified', url:'https://www.nzpost.co.nz/'},
  {name:'Pos Malaysia', status:'Verified', url:'https://www.pos.com.my/'},
  {name:'Thailand Post', status:'Verified', url:'https://www.thailandpost.co.th/en/'},
  {name:'Israel Post', status:'Verified', url:'https://www.israelpost.co.il/'},
  {name:'Emirates Post', status:'Verified', url:'https://www.epg.gov.ae/'},
  {name:'Aramex', status:'Verified', url:'https://www.aramex.com/'},
  {name:'TNT (FedEx)', status:'Verified', url:'https://www.tnt.com/'},
  {name:'DPD', status:'Verified', url:'https://www.dpd.com/'},
  {name:'GLS', status:'Verified', url:'https://gls-group.com/'},
  {name:'Hermes / Evri', status:'Verified', url:'https://www.evri.com/'},
  {name:'Yamato Transport', status:'Verified', url:'https://www.kuronekoyamato.co.jp/en/'},
  {name:'SF Express', status:'Verified', url:'https://www.sf-express.com/'},
  {name:'Pos Indonesia', status:'Estimated', url:'https://www.posindonesia.co.id/en'},
  {name:'Turkey PTT', status:'Estimated', url:'https://www.ptt.gov.tr/'},
  {name:'South Africa Post', status:'Estimated', url:'https://www.postoffice.co.za/'},
  {name:'Philippine Postal Corp', status:'Estimated', url:'https://phlpost.gov.ph/'},
];

const customsSources = [
  {country:'United States', authority:'U.S. CBP / USITC', url:'https://hts.usitc.gov/'},
  {country:'United Kingdom', authority:'UK HMRC Trade Tariff', url:'https://www.trade-tariff.service.gov.uk/'},
  {country:'European Union', authority:'EU TARIC', url:'https://ec.europa.eu/taxation_customs/dds2/taric/'},
  {country:'Germany', authority:'Zoll', url:'https://www.zoll.de/'},
  {country:'France', authority:'Douanes', url:'https://www.douane.gouv.fr/'},
  {country:'Canada', authority:'CBSA', url:'https://www.cbsa-asfc.gc.ca/'},
  {country:'Australia', authority:'ABF', url:'https://www.abf.gov.au/'},
  {country:'Japan', authority:'Japan Customs', url:'https://www.customs.go.jp/english/'},
  {country:'South Korea', authority:'Korea Customs Service', url:'https://www.customs.go.kr/english/'},
  {country:'China', authority:'GACC', url:'http://english.customs.gov.cn/'},
  {country:'India', authority:'CBIC', url:'https://www.cbic.gov.in/'},
  {country:'Brazil', authority:'Receita Federal', url:'https://www.gov.br/receitafederal/'},
  {country:'Mexico', authority:'SAT / Aduanas', url:'https://www.sat.gob.mx/'},
  {country:'Switzerland', authority:'BAZG', url:'https://www.bazg.admin.ch/'},
  {country:'Singapore', authority:'Singapore Customs', url:'https://www.customs.gov.sg/'},
  {country:'New Zealand', authority:'NZ Customs', url:'https://www.customs.govt.nz/'},
  {country:'UAE', authority:'Federal Customs Authority', url:'https://www.fca.gov.ae/'},
  {country:'Israel', authority:'Israel Tax Authority', url:'https://taxes.gov.il/english/'},
  {country:'Thailand', authority:'Thai Customs', url:'https://www.customs.go.th/'},
  {country:'Malaysia', authority:'Royal Malaysian Customs', url:'https://www.customs.gov.my/'},
];

const tradeAgreements = [
  {name:'USMCA', members:'United States, Canada, Mexico'},
  {name:'UK-EU TCA', members:'United Kingdom, European Union'},
  {name:'EU Single Market', members:'27 EU member states'},
  {name:'EFTA', members:'Switzerland, Norway, Iceland, Liechtenstein'},
  {name:'RCEP', members:'15 Asia-Pacific nations'},
  {name:'CPTPP', members:'11 Pacific nations'},
  {name:'Mercosur', members:'Brazil, Argentina, Uruguay, Paraguay'},
  {name:'ASEAN', members:'10 Southeast Asian nations'},
];

export default function SourcesPage(){
  return (<>
    <section style={{padding:'72px 32px 48px', borderBottom:'1px solid var(--line)'}}><div style={{maxWidth:1240, margin:'0 auto'}}>
      <h1 style={{margin:'0 0 18px', fontSize:'clamp(36px,4vw,52px)', fontWeight:800, letterSpacing:'-.02em'}}>Data sources.</h1>
      <p style={{fontSize:19, color:'var(--body)', maxWidth:640}}>Where our shipping rate, customs, and delivery data comes from. All sources are public, official, or partner-provided. Last updated March 2026.</p>
    </div></section>

    <section style={{padding:'64px 32px 0'}}><div style={{maxWidth:1240, margin:'0 auto'}}>
      <h2 style={{fontSize:24, fontWeight:700, margin:'0 0 8px'}}>Carrier rate sources</h2>
      <p style={{fontSize:15, color:'var(--muted)', margin:'0 0 24px'}}>40 carriers with direct links to official rate pages. Most verified from published tariffs.</p>
      <div style={{background:'#fff', borderRadius:20, border:'1px solid var(--line)', overflow:'hidden'}}>
        <div style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr', padding:'12px 24px', borderBottom:'1px solid var(--line)', background:'var(--bg)'}}>
          <span style={{fontSize:12, fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.05em'}}>Carrier</span>
          <span style={{fontSize:12, fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.05em'}}>Status</span>
          <span style={{fontSize:12, fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.05em'}}>Source</span>
        </div>
        {carriers.map((c,i)=>(
          <div key={i} style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr', padding:'10px 24px', borderBottom: i < carriers.length-1 ? '1px solid var(--line-2)' : 'none', alignItems:'center'}}>
            <span style={{fontSize:14, fontWeight:600}}>{c.name}</span>
            <span style={{fontSize:12, fontWeight:600, color: c.status==='Verified' ? 'var(--good)' : '#A37A00'}}>{c.status}</span>
            <a href={c.url} target="_blank" rel="noopener noreferrer" style={{fontSize:13, color:'var(--blue)', fontWeight:500}}>Official page</a>
          </div>
        ))}
      </div>
    </div></section>

    <section style={{padding:'48px 32px 0'}}><div style={{maxWidth:1240, margin:'0 auto'}}>
      <h2 style={{fontSize:24, fontWeight:700, margin:'0 0 8px'}}>Customs data sources</h2>
      <p style={{fontSize:15, color:'var(--muted)', margin:'0 0 24px'}}>40 countries with duty rates, de minimis thresholds, and prohibited items from official customs authorities.</p>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:20}} className="two-col">
        {customsSources.map((c,i)=>(
          <div key={i} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 20px', background:'#fff', borderRadius:14, border:'1px solid var(--line)'}}>
            <div>
              <span style={{fontSize:14, fontWeight:600}}>{c.country}</span>
              <span style={{fontSize:13, color:'var(--muted)', marginLeft:8}}>{c.authority}</span>
            </div>
            <a href={c.url} target="_blank" rel="noopener noreferrer" style={{fontSize:13, color:'var(--blue)', fontWeight:500, whiteSpace:'nowrap'}}>Source</a>
          </div>
        ))}
      </div>
    </div></section>

    <section style={{padding:'48px 32px 0'}}><div style={{maxWidth:1240, margin:'0 auto'}}>
      <h2 style={{fontSize:24, fontWeight:700, margin:'0 0 24px'}}>Trade agreements</h2>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}} className="two-col">
        {tradeAgreements.map((a,i)=>(
          <div key={i} style={{padding:'16px 20px', background:'#fff', borderRadius:14, border:'1px solid var(--line)'}}>
            <span style={{fontSize:15, fontWeight:700, color:'var(--blue)'}}>{a.name}</span>
            <span style={{fontSize:13, color:'var(--body)', marginLeft:12}}>{a.members}</span>
          </div>
        ))}
      </div>
    </div></section>

    <section style={{padding:'48px 32px 96px'}}><div style={{maxWidth:1240, margin:'0 auto'}}>
      <h2 style={{fontSize:24, fontWeight:700, margin:'0 0 24px'}}>Exchange rates</h2>
      <div style={{padding:'24px 28px', background:'#fff', borderRadius:20, border:'1px solid var(--line)'}}>
        <p style={{margin:0, fontSize:15, color:'var(--body)', lineHeight:1.6}}>
          Exchange rates sourced from the <strong>European Central Bank (ECB)</strong>. Updated daily at 16:00 CET. 30+ currencies supported including USD, EUR, GBP, JPY, AUD, CAD, CHF, CNY, KRW, INR, BRL, MXN, and more.
        </p>
      </div>
    </div></section>
  </>);
}
