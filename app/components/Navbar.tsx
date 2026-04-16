import Link from 'next/link';
import Image from 'next/image';
import { getSession } from '@/app/lib/session';
import { logout } from '@/app/actions/auth';

export async function Navbar() {
  const session = await getSession();

  return (
    <nav className="sticky top-0 z-50 border-b border-rose-100/70 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 text-xl font-extrabold tracking-tight text-slate-900">
            <Image src="/jai-logo.jpeg" alt="JAI logo" width={34} height={34} className="rounded-sm object-cover" />
            <span>
              Law<span className="text-rose-500">App</span>
            </span>
          </Link>
          <div className="hidden items-center gap-6 text-sm font-semibold text-slate-600 md:flex">
            <Link href="/about" className="transition hover:text-rose-500">
              About
            </Link>
            <Link href="/terms" className="transition hover:text-rose-500">
              Terms
            </Link>
            <Link href="/contact" className="transition hover:text-rose-500">
              Contact
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!session ? (
            <>
              <Link
                href="/login"
                className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 transition hover:text-rose-500"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-600"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                href={`/dashboard/${session.role}`}
                className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 transition hover:text-rose-500"
              >
                Dashboard
              </Link>
              <form
                action={async () => {
                  'use server';
                  await logout();
                }}
              >
                <button
                  type="submit"
                  className="rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                >
                  Logout
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
