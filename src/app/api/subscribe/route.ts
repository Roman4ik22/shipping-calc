import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, locale } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // If Resend API key is configured, send welcome email
    const RESEND_KEY = process.env.RESEND_API_KEY;
    if (RESEND_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "RateShips <noreply@rateships.com>",
          to: [email],
          subject:
            locale === "ru"
              ? "Добро пожаловать в RateShips!"
              : "Welcome to RateShips!",
          html:
            locale === "ru"
              ? `<h2>Спасибо за подписку!</h2><p>Вы будете получать обновления тарифов доставки и полезные советы.</p><p>— Команда RateShips</p>`
              : `<h2>Thanks for subscribing!</h2><p>You'll receive shipping rate updates and useful tips.</p><p>— The RateShips Team</p>`,
        }),
      });

      // Also add to Resend audience if configured
      const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;
      if (AUDIENCE_ID) {
        await fetch(
          `https://api.resend.com/audiences/${AUDIENCE_ID}/contacts`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${RESEND_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              unsubscribed: false,
              first_name: "",
            }),
          }
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
