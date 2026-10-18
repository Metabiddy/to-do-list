import Link from "next/link";

// This file lives at app/about/page.tsx → the URL is /about
export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-12">
      <div className="mx-auto max-w-lg">
        <h1 className="mb-4 text-3xl font-bold text-slate-900">About</h1>
        <p className="mb-6 text-slate-700">
          This is a simple to-do app built while learning Next.js, React,
          TypeScript and Tailwind CSS.
        </p>
        {/* Link navigates without a full browser refresh */}
        <Link href="/" className="text-teal-700 underline hover:text-teal-800">
          Back to to-dos
        </Link>
      </div>
    </main>
  );
}
