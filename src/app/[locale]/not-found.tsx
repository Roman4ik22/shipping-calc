import Link from "next/link";

export const metadata = {
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center">
      <h1 className="text-8xl font-bold text-muted mb-4">404</h1>
      <h2 className="text-2xl font-bold text-ink mb-4">Page not found</h2>
      <p className="text-body mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/en"
          className="px-8 py-3 bg-[#1A73E8] text-white btn-press font-semibold rounded-full hover:bg-[#1558B8] transition-colors shadow-[0_4px_10px_rgba(26,115,232,.28)] card-hover"
        >
          Go to homepage
        </Link>
        <Link
          href="/en/tools/duty-calculator"
          className="px-8 py-3 bg-surface text-ink border border-line font-semibold rounded-full hover:bg-line transition-colors card-hover"
        >
          Duty calculator
        </Link>
      </div>
      <div className="mt-12">
        <p className="text-sm text-muted mb-4">Popular pages:</p>
        <div className="flex flex-wrap justify-center gap-3 text-sm">
          <Link href="/en/shipping/united-states-to-germany" className="text-body hover:text-ink transition-colors">US → Germany</Link>
          <Link href="/en/shipping/united-states-to-united-kingdom" className="text-body hover:text-ink transition-colors">US → UK</Link>
          <Link href="/en/shipping/china-to-united-states" className="text-body hover:text-ink transition-colors">China → US</Link>
          <Link href="/en/carriers" className="text-body hover:text-ink transition-colors">All carriers</Link>
          <Link href="/en/guide" className="text-body hover:text-ink transition-colors">Country guides</Link>
        </div>
      </div>
    </div>
  );
}
