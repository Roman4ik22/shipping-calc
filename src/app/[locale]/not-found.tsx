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
          className="px-8 py-3 bg-accent text-white font-medium rounded-full hover:bg-accent-dark transition-colors"
        >
          Go to homepage
        </Link>
        <Link
          href="/en/tools/duty-calculator"
          className="px-8 py-3 bg-card text-gray-300 font-medium rounded-2xl hover:bg-card-hover transition-colors"
        >
          Duty calculator
        </Link>
      </div>
    </div>
  );
}
