import Link from "next/link";

export default function Footer() {
  return (
    // border-t creates the thin line on top, py-8 adds vertical padding
    <footer className="bg-navy border-t border-zinc-800 py-8">
      {/* flex-col on mobile, flex-row on larger screens */}
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        
        {/* 1. Brand & Copyright */}
        <div className="text-ice-blue text-sm">
          © {new Date().getFullYear()} Docket<span className="text-vibrant-blue">.</span> All rights reserved.
        </div>

        {/* 2. Navigation Links */}
        <div className="flex items-center gap-6 text-sm font-medium text-ice-blue">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
        </div>

      </div>
    </footer>
  );
}