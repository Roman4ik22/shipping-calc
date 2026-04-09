/**
 * Generate images for blog posts and pages using Gemini Imagen API
 *
 * Usage: npx tsx scripts/generate-images.ts
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import path from "path";

const API_KEY = "AIzaSyAk9wdVIWbFx-xCfiCDskVtap2aWcqht-k";
const OUTPUT_DIR = path.join(__dirname, "..", "public", "img", "generated");

async function generateImage(prompt: string, filename: string): Promise<boolean> {
  if (existsSync(path.join(OUTPUT_DIR, filename))) {
    console.log(`  skip ${filename} (exists)`);
    return true;
  }

  console.log(`  Generating ${filename}...`);

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: `Generate an image: ${prompt}` },
              ],
            },
          ],
          generationConfig: {
            responseModalities: ["image", "text"],
            responseMimeType: "text/plain",
          },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.log(`  X ${filename}: ${res.status} — ${err.slice(0, 300)}`);
      return false;
    }

    const data = await res.json();
    // Find the image part in response
    const parts = data.candidates?.[0]?.content?.parts ?? [];
    const imagePart = parts.find((p: any) => p.inlineData?.mimeType?.startsWith("image/"));

    if (!imagePart) {
      console.log(`  X ${filename}: no image in response. Parts: ${parts.map((p: any) => p.text ? "text" : p.inlineData?.mimeType ?? "?").join(", ")}`);
      return false;
    }

    const ext = imagePart.inlineData.mimeType === "image/webp" ? "webp" : "png";
    const actualFilename = filename.replace(/\.\w+$/, `.${ext}`);
    writeFileSync(
      path.join(OUTPUT_DIR, actualFilename),
      Buffer.from(imagePart.inlineData.data, "base64")
    );
    console.log(`  OK ${actualFilename}`);
    return true;
  } catch (e: any) {
    console.log(`  X ${filename}: ${e.message}`);
    return false;
  }
}

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log("=== Generating Blog Images ===\n");

  const blogImages: [string, string][] = [
    [
      "Minimalist flat illustration of international shipping boxes on a conveyor belt with a world map in the background, dark blue and white color scheme, clean professional style, no text",
      "blog-cheapest-shipping.webp",
    ],
    [
      "Minimalist flat illustration of a Shopify store dashboard with shipping labels and packages ready to ship, dark background, blue accent colors, professional clean style, no text",
      "blog-shopify-shipping.webp",
    ],
    [
      "Minimalist flat illustration of an Etsy seller wrapping a handmade product for international shipping with shipping labels, dark background, warm tones, no text",
      "blog-etsy-shipping.webp",
    ],
    [
      "Minimalist flat illustration of Amazon FBA warehouse with international shipping containers and a globe, dark blue background, clean professional, no text",
      "blog-amazon-fba.webp",
    ],
    [
      "Minimalist flat illustration comparing DHL FedEx UPS delivery trucks side by side on a road, dark background, blue highlights, professional style, no text",
      "blog-carrier-comparison.webp",
    ],
    [
      "Minimalist flat illustration of Middle East cityscape with shipping containers and cargo ships in a port, dark background, warm gold and blue accents, no text",
      "blog-middle-east-ecommerce.webp",
    ],
    [
      "Minimalist flat illustration of a customs declaration form with a stamp, packages waiting for clearance, dark background, official professional style, no text",
      "blog-customs-clearance.webp",
    ],
    [
      "Minimalist flat illustration of a person tracking a package on their phone with a delivery route map, dark background, blue accents, modern clean style, no text",
      "blog-package-tracking.webp",
    ],
  ];

  for (const [prompt, filename] of blogImages) {
    await generateImage(prompt, filename);
    // Small delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 2000));
  }

  console.log("\n=== Generating Page Images ===\n");

  const pageImages: [string, string][] = [
    [
      "Aerial photograph of a busy international cargo port with colorful shipping containers stacked high, cranes loading a container ship, cinematic lighting, professional photography",
      "hero-shipping-port.webp",
    ],
    [
      "Close-up photograph of a customs officer stamping an international shipping document, official forms and cargo in background, shallow depth of field, professional photography",
      "customs-clearance-photo.webp",
    ],
    [
      "Photograph of a small business owner carefully packing a product into a shipping box at their desk, laptop showing an ecommerce dashboard, natural warm lighting, professional",
      "small-business-shipping.webp",
    ],
  ];

  for (const [prompt, filename] of pageImages) {
    await generateImage(prompt, filename);
    await new Promise((r) => setTimeout(r, 2000));
  }

  console.log("\nDone!");
}

main().catch(console.error);
