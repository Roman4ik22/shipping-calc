// Convert ISO 3166-1 alpha-2 country code to flag emoji
export function countryFlag(code: string): string {
  const codePoints = [...code.toUpperCase()].map(
    (c) => 0x1f1e6 + c.charCodeAt(0) - 65
  );
  return String.fromCodePoint(...codePoints);
}
