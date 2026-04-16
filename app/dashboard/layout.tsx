import Link from 'next/link';
import { getSession } from '@/app/lib/session';
import { redirect } from 'next/navigation';
import { logout } from '@/app/actions/auth';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Law App</h1>
          <p className="text-gray-400 text-sm mt-2">
            {session.role.charAt(0).toUpperCase() + session.role.slice(1)} Dashboard
          </p>
        </div>

        <nav className="mt-8 space-y-2 px-4">
          <Link
            href={`/dashboard/${session.role}`}
            className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Dashboard
          </Link>

          {session.role === 'lawyer' && (
            <>
              <Link
                href="/dashboard/lawyer/cases"
                className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Cases
              </Link>
              <Link
                href="/dashboard/lawyer/clients"
                className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Clients
              </Link>
            </>
          )}

          {session.role === 'client' && (
            <>
              <Link
                href="/dashboard/client/cases"
                className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                My Cases
              </Link>
            </>
          )}

          {session.role === 'employee' && (
            <>
              <Link
                href="/dashboard/employee/tasks"
                className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Tasks
              </Link>
            </>
          )}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <div className="mb-4">
            <p className="text-sm text-gray-400">Logged in as</p>
            <p className="font-semibold">{session.email}</p>
          </div>
          <form
            action={async () => {
              'use server';
              await logout();
            }}
          >
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Logout
            </button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}
