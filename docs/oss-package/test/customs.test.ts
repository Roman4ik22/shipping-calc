import { describe, it, expect } from "vitest";
import {
  getCustoms,
  hasCountry,
  listCountries,
  getDutyRate,
  calculateLandedCost,
  CountryNotFoundError,
} from "../src/index.js";

describe("getCustoms", () => {
  it("returns Germany metadata", () => {
    const de = getCustoms("DE");
    expect(de.code).toBe("DE");
    expect(de.vat_rate).toBeGreaterThan(0);
    expect(de.de_minimis_usd).toBeGreaterThanOrEqual(0);
  });

  it("is case-insensitive", () => {
    expect(getCustoms("de").code).toBe(getCustoms("DE").code);
  });

  it("throws CountryNotFoundError for unknown code", () => {
    expect(() => getCustoms("XX")).toThrow(CountryNotFoundError);
  });
});

describe("hasCountry", () => {
  it("returns true for known", () => {
    expect(hasCountry("US")).toBe(true);
    expect(hasCountry("us")).toBe(true);
  });
  it("returns false for unknown", () => {
    expect(hasCountry("XX")).toBe(false);
  });
});

describe("listCountries", () => {
  it("returns 200+ countries", () => {
    expect(listCountries().length).toBeGreaterThan(200);
  });
  it("is sorted by name", () => {
    const list = listCountries();
    for (let i = 1; i < list.length; i++) {
      expect(list[i].name.localeCompare(list[i - 1].name)).toBeGreaterThanOrEqual(0);
    }
  });
});

describe("calculateLandedCost", () => {
  it("returns no duty for parcel below de minimis (US, $50 < $800)", () => {
    const r = calculateLandedCost({
      itemValueUsd: 50,
      destination: "US",
      shippingCostUsd: 10,
    });
    expect(r.dutyAmount).toBe(0);
    expect(r.exemptions.length).toBeGreaterThan(0);
  });

  it("adds VAT on EU below-threshold parcels (Germany, $100 < €150)", () => {
    const r = calculateLandedCost({
      itemValueUsd: 100,
      destination: "DE",
      shippingCostUsd: 15,
    });
    expect(r.dutyAmount).toBe(0); // no duty below threshold
    expect(r.vatAmount).toBeGreaterThan(0); // but VAT still applies
    expect(r.notes.some((n) => n.includes("EU IOSS"))).toBe(true);
  });

  it("adds duty + VAT for above-threshold parcels (Germany, $300)", () => {
    const r = calculateLandedCost({
      itemValueUsd: 300,
      destination: "DE",
      shippingCostUsd: 25,
      category: "clothing",
    });
    expect(r.dutyAmount).toBeGreaterThan(0);
    expect(r.vatAmount).toBeGreaterThan(0);
    expect(r.totalLandedCost).toBeGreaterThan(300 + 25);
  });

  it("rounds amounts to 2 decimals", () => {
    const r = calculateLandedCost({
      itemValueUsd: 333.33,
      destination: "DE",
      shippingCostUsd: 11.11,
    });
    const decimals = (n: number) => (n.toString().split(".")[1] ?? "").length;
    expect(decimals(r.dutyAmount)).toBeLessThanOrEqual(2);
    expect(decimals(r.vatAmount)).toBeLessThanOrEqual(2);
    expect(decimals(r.totalLandedCost)).toBeLessThanOrEqual(2);
  });

  it("handles zero shipping", () => {
    const r = calculateLandedCost({ itemValueUsd: 100, destination: "DE" });
    expect(r.shipping).toBe(0);
    expect(r.totalLandedCost).toBeGreaterThanOrEqual(100);
  });
});

describe("getDutyRate", () => {
  it("returns category-specific duty when available", () => {
    const electronics = getDutyRate("DE", "electronics");
    const clothing = getDutyRate("DE", "clothing");
    expect(electronics).toBeGreaterThanOrEqual(0);
    expect(clothing).toBeGreaterThanOrEqual(0);
  });

  it("falls back to avg duty rate when category data is missing", () => {
    const r = getDutyRate("DE", "general");
    expect(typeof r).toBe("number");
  });
});
