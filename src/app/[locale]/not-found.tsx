import Link from "next/link";

export const metadata = {
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center">
      <h1 className="text-8xl font-bold text-gray-700 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-white mb-4">Page not found</h2>
      <p className="text-gray-400 mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/en"
          className="px-8 py-3 bg-accent text-white btn-press font-medium rounded-full hover:bg-accent-dark transition-colors card-hover"
        >
          Go to homepage
        </Link>
        <Link
          href="/en/tools/duty-calculator"
          className="px-8 py-3 bg-card text-gray-300 font-medium rounded-2xl hover:bg-card-hover transition-colors card-hover"
        >
          Duty calculator
        </Link>
      </div>
      <div className="mt-12">
        <p className="text-sm text-gray-500 mb-4">Popular pages:</p>
        <div className="flex flex-wrap justify-center gap-3 text-sm">
          <Link href="/en/shipping/united-states-to-germany" className="text-gray-400 hover:text-white">US → Germany</Link>
          <Link href="/en/shipping/united-states-to-united-kingdom" className="text-gray-400 hover:text-white">US → UK</Link>
          <Link href="/en/shipping/china-to-united-states" className="text-gray-400 hover:text-white">China → US</Link>
          <Link href="/en/carriers" className="text-gray-400 hover:text-white">All carriers</Link>
          <Link href="/en/guide" className="text-gray-400 hover:text-white">Country guides</Link>
        </div>
      </div>
    </div>
  );
}
