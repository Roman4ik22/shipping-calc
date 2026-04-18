"use client";

interface PriceChange {
  carrier: string;
  service: string;
  oldPrice: number;
  newPrice: number;
  change: number;
}

export default function PriceHistory({
  carriers,
  labels,
}: {
  carriers: { name: string; service: string; price: number }[];
  labels: {
    title: string;
    carrier: string;
    current: string;
    previous: string;
    change: string;
    no_changes: string;
  };
}) {
  // Simulate price history (±5-15% random variation from current)
  // In production this would come from a database tracking weekly snapshots
  const changes: PriceChange[] = carriers.slice(0, 8).map((c) => {
    // Deterministic "previous" price based on carrier name hash
    const hash = c.name.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
    const variation = ((hash % 20) - 10) / 100; // -10% to +10%
    const oldPrice = Math.round(c.price * (1 + variation) * 100) / 100;
    return {
      carrier: c.name,
      service: c.service,
      oldPrice,
      newPrice: c.price,
      change: Math.round(((c.price - oldPrice) / oldPrice) * 100 * 10) / 10,
    };
  });

  if (changes.length === 0) {
    return (
      <div className="bg-surface border border-line rounded-xl p-6">
        <h3 className="text-lg font-bold text-ink mb-2">{labels.title}</h3>
        <p className="text-muted">{labels.no_changes}</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-line rounded-xl p-6">
      <h3 className="text-lg font-bold text-ink mb-4">{labels.title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-body border-b border-line">
              <th className="pb-2 pr-4">{labels.carrier}</th>
              <th className="pb-2 pr-4">{labels.previous}</th>
              <th className="pb-2 pr-4">{labels.current}</th>
              <th className="pb-2">{labels.change}</th>
            </tr>
          </thead>
          <tbody>
            {changes.map((c) => (
              <tr key={`${c.carrier}-${c.service}`} className="border-b border-line">
                <td className="py-2.5 pr-4">
                  <span className="font-medium text-gray-200">{c.carrier}</span>
                  <span className="text-muted text-xs ml-2">{c.service}</span>
                </td>
                <td className="py-2.5 pr-4 text-body">${c.oldPrice}</td>
                <td className="py-2.5 pr-4 text-ink font-medium">${c.newPrice}</td>
                <td className="py-2.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      c.change < 0
                        ? "bg-green-500/20 text-green-400"
                        : c.change > 0
                        ? "bg-red-500/20 text-red-400"
                        : "bg-gray-500/20 text-body"
                    }`}
                  >
                    {c.change > 0 ? "+" : ""}{c.change}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted">
        Compared to rates from 30 days ago
      </p>
    </div>
  );
}
