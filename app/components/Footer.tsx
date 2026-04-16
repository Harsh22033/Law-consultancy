import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-16 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">
              Law<span className="text-rose-400">App</span>
            </h3>
            <p className="text-slate-400">
              Smart legal workflow platform for clients, lawyers, and legal operations teams.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-lg font-bold text-white">Quick Links</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/" className="transition hover:text-rose-300">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition hover:text-rose-300">
                  About
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition hover:text-rose-300">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition hover:text-rose-300">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-lg font-bold text-white">Contact</h4>
            <p className="text-slate-400">
              Email: info@lawapp.com
              <br />
              Phone: (555) 123-4567
            </p>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-800 pt-8 text-center text-slate-500">
          <p>&copy; 2024 Law App. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
