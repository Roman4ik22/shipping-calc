/**
 * Skeleton shown while corridor data is being prepared server-side.
 * Matches the v2 ivory theme and the actual rate-card shapes so the
 * layout doesn't shift on transition.
 *
 * Uses a horizontal-shimmer keyframe instead of a flat opacity-pulse —
 * feels closer to native loading patterns (Slack/GitHub) and reinforces
 * that data is being fetched. Honors prefers-reduced-motion.
 */
export default function CorridorLoading() {
  const shimmer: React.CSSProperties = {
    background:
      "linear-gradient(90deg, #EFEAE2 0%, #F8F5EF 50%, #EFEAE2 100%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.6s ease-in-out infinite",
  };

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-skel] { animation: none !important; }
        }
      `}</style>

      <div data-skel style={shimmer} className="h-4 rounded w-48 mb-6" />
      <div data-skel style={shimmer} className="h-12 rounded-xl w-2/3 max-w-2xl mb-3" />
      <div className="flex flex-wrap gap-3 mb-10">
        <div data-skel style={shimmer} className="h-5 rounded w-32" />
        <div data-skel style={shimmer} className="h-5 rounded w-24" />
        <div data-skel style={shimmer} className="h-5 rounded w-20" />
      </div>

      {/* Weight selector */}
      <div data-skel style={shimmer} className="h-3 rounded w-40 mb-3" />
      <div className="bg-white rounded-2xl p-5 mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {[20, 16, 16, 16, 16, 18, 18, 20, 20].map((w, i) => (
            <div key={i} data-skel style={{ ...shimmer, width: `${w * 4}px` }} className="h-10 rounded-xl" />
          ))}
        </div>
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-2">
            <div data-skel style={shimmer} className="h-3 rounded w-32" />
            <div data-skel style={shimmer} className="h-12 rounded-xl w-24" />
          </div>
          <div data-skel style={shimmer} className="h-9 rounded-full w-44" />
        </div>
      </div>

      {/* Filter / sort row */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div data-skel style={shimmer} className="h-9 rounded-full w-20" />
        <div data-skel style={shimmer} className="h-9 rounded-full w-24" />
        <div data-skel style={shimmer} className="h-9 rounded-full w-24" />
        <div data-skel style={shimmer} className="h-9 rounded-full w-20" />
        <div data-skel style={shimmer} className="ml-auto h-9 rounded-full w-32" />
      </div>

      {/* Rate cards */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex-1 space-y-2.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <div data-skel style={shimmer} className="h-5 rounded w-36" />
                  <div data-skel style={shimmer} className="h-4 rounded-full w-16" />
                  {i === 0 && <div data-skel style={shimmer} className="h-4 rounded-full w-20" />}
                </div>
                <div data-skel style={shimmer} className="h-4 rounded w-56" />
              </div>
              <div className="flex items-center gap-5">
                <div className="flex flex-col gap-1.5 items-end">
                  <div data-skel style={shimmer} className="h-3 rounded w-12" />
                  <div data-skel style={shimmer} className="h-7 rounded w-20" />
                </div>
                <div data-skel style={shimmer} className="h-10 rounded-full w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div data-skel style={shimmer} className="mt-8 h-3 rounded w-3/4 max-w-xl" />
    </div>
  );
}
