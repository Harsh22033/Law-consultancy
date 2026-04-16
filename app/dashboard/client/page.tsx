import { redirect } from 'next/navigation';
import { getSession } from '@/app/lib/session';

interface Case {
  id: string;
  title: string;
  status: 'open' | 'closed' | 'pending';
  lawyer_id: string;
  client_id: string;
}

export default async function ClientDashboard() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/cases`, {
    headers: {
      Authorization: `Bearer ${session.apiToken}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    return <div className="rounded-lg bg-red-50 p-4 text-red-800">Failed to load cases.</div>;
  }

  const cases = (await response.json()) as Case[];
  const openCases = cases.filter((c) => c.status === 'open').length;
  const pendingCases = cases.filter((c) => c.status === 'pending').length;
  const closedCases = cases.filter((c) => c.status === 'closed').length;

  return (
    <div className="space-y-8">
      <div className="rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 p-8 text-white shadow-lg">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-extrabold">Client Dashboard</h1>
            <p className="mt-2 text-rose-100">Track legal requests and stay updated on every case</p>
          </div>
          <div className="flex gap-3">
            <button className="rounded-md border border-white/40 bg-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/20">
              Find Lawyers
            </button>
            <button className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50">
              New Case
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="rounded-xl border border-rose-100 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold uppercase text-slate-500">Total Cases</h3>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">{cases.length}</p>
        </div>
        <div className="rounded-xl border border-rose-100 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold uppercase text-slate-500">Open Cases</h3>
          <p className="mt-2 text-3xl font-extrabold text-emerald-600">{openCases}</p>
        </div>
        <div className="rounded-xl border border-rose-100 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold uppercase text-slate-500">Pending</h3>
          <p className="mt-2 text-3xl font-extrabold text-amber-600">{pendingCases}</p>
        </div>
        <div className="rounded-xl border border-rose-100 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold uppercase text-slate-500">Completed</h3>
          <p className="mt-2 text-3xl font-extrabold text-slate-700">{closedCases}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-rose-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Active Conversations</h2>
          <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
            No active conversations yet. Start by messaging your assigned lawyer.
          </div>
        </div>
        <div className="rounded-xl border border-rose-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-900">My Requests</h2>
          <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
            No pending requests. You can create one from the Find Lawyers section.
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-rose-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-xl font-bold text-slate-900">Your Cases</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Case Title
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Assigned Lawyer
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cases.map((caseItem) => (
                <tr key={caseItem.id} className="hover:bg-rose-50/40">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{caseItem.title}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        caseItem.status === 'open'
                          ? 'bg-emerald-100 text-emerald-800'
                          : caseItem.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {caseItem.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{caseItem.lawyer_id}</td>
                  <td className="space-x-2 px-6 py-4 text-sm">
                    <button className="rounded-md border border-rose-500 px-3 py-1.5 font-semibold text-rose-500 transition hover:bg-rose-500 hover:text-white">
                      View Details
                    </button>
                    <button className="rounded-md bg-rose-500 px-3 py-1.5 font-semibold text-white transition hover:bg-rose-600">
                      Message Lawyer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-rose-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold text-slate-900">Recommended Lawyers</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {
              name: 'Sarah Jenkins',
              specialty: 'Family Law',
              image: 'https://randomuser.me/api/portraits/women/44.jpg',
            },
            {
              name: 'James Carter',
              specialty: 'Corporate Law',
              image: 'https://randomuser.me/api/portraits/men/32.jpg',
            },
            {
              name: 'David Ross',
              specialty: 'Criminal Defense',
              image: 'https://randomuser.me/api/portraits/men/85.jpg',
            },
          ].map((lawyer) => (
            <div key={lawyer.name} className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-full bg-cover bg-center"
                  style={{ backgroundImage: `url('${lawyer.image}')` }}
                />
                <div>
                  <p className="font-semibold text-slate-900">{lawyer.name}</p>
                  <p className="text-xs text-rose-500">{lawyer.specialty}</p>
                </div>
              </div>
              <button className="mt-3 w-full rounded-md border border-rose-500 px-3 py-1.5 text-sm font-semibold text-rose-500 transition hover:bg-rose-500 hover:text-white">
                Send Request
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
