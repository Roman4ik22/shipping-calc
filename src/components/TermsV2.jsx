"use client";
import React from "react";

export default function TermsPage(){
  return (
    <>
      <section style={{padding:'72px 32px 48px', borderBottom:'1px solid var(--line)'}}><div style={{maxWidth:800, margin:'0 auto'}}>
        <div style={{fontSize:12, fontWeight:700, color:'var(--blue)', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:12}}>Legal</div>
        <h1 style={{margin:'0 0 8px', fontSize:40, fontWeight:800, letterSpacing:'-.02em'}}>Terms of Service</h1>
        <p style={{fontSize:14, color:'var(--muted)'}}>Last updated: March 2026 · Global Supply KFT</p>
      </div></section>

      <section style={{padding:'48px 32px 96px'}}><div style={{maxWidth:800, margin:'0 auto', fontSize:15, color:'var(--body)', lineHeight:1.7}}>
        <h2 style={{fontSize:22, fontWeight:700, color:'var(--ink)', margin:'32px 0 12px'}}>1. Service Description</h2>
        <p>RateShips is a free informational service for comparing international shipping costs. We provide estimated prices based on publicly available carrier rate cards. The service is intended for informational purposes only.</p>

        <h2 style={{fontSize:22, fontWeight:700, color:'var(--ink)', margin:'32px 0 12px'}}>2. Accuracy of Information</h2>
        <p>All prices, delivery times, and customs information are approximate estimates. We do not guarantee the accuracy, completeness, or timeliness of the data presented. Actual rates may vary depending on the carrier, package dimensions, surcharges, and other factors.</p>

        <h2 style={{fontSize:22, fontWeight:700, color:'var(--ink)', margin:'32px 0 12px'}}>3. No Carrier Affiliation</h2>
        <p>RateShips is not affiliated with, partnered with, or an agent of any carriers or courier services. We do not sell shipping services or process shipments. All trademarks and carrier names belong to their respective owners.</p>

        <h2 style={{fontSize:22, fontWeight:700, color:'var(--ink)', margin:'32px 0 12px'}}>4. Disclaimer of Warranties</h2>
        <p>The service is provided "as is" without any warranties of any kind. We are not liable for any losses arising from the use of information from our website. The user is responsible for verifying current rates and conditions directly with the chosen carrier before shipping.</p>

        <h2 style={{fontSize:22, fontWeight:700, color:'var(--ink)', margin:'32px 0 12px'}}>5. User Responsibility</h2>
        <p>Users are responsible for independently verifying all rates, rules, and restrictions with the carrier before arranging a shipment. RateShips is not responsible for decisions made based on the information presented on the site.</p>

        <h2 style={{fontSize:22, fontWeight:700, color:'var(--ink)', margin:'32px 0 12px'}}>6. Changes to Terms</h2>
        <p>We reserve the right to modify these terms at any time. Continued use of the service after changes are made constitutes acceptance of the updated terms.</p>

        <div style={{marginTop:40, padding:'20px 24px', background:'var(--bg)', borderRadius:14, border:'1px solid var(--line)', fontSize:14}}>
          <b>Operator:</b> Global Supply KFT · Toldi utca 4, Kutasó, Hungary 3066 · EU VAT: HU26179030<br/>
          <b>Contact:</b> <a href="mailto:info@rateships.com" style={{color:'var(--blue)', fontWeight:600}}>info@rateships.com</a>
        </div>
      </div></section>
    </>
  );
}
