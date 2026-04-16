import { redirect } from 'next/navigation';
import { getSession } from '@/app/lib/session';

interface Task {
  id: string;
  title: string;
  status: 'pending' | 'completed';
  assigned_to: string;
}

export default async function EmployeeDashboard() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/tasks`, {
    headers: {
      Authorization: `Bearer ${session.apiToken}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    return <div className="rounded-lg bg-red-50 p-4 text-red-800">Failed to load tasks.</div>;
  }

  const tasks = (await response.json()) as Task[];
  const pendingTasks = tasks.filter((t) => t.status === 'pending').length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <div className="space-y-8">
      <div className="rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 p-8 text-white shadow-lg">
        <h1 className="text-3xl font-extrabold">Employee Dashboard</h1>
        <p className="mt-2 text-rose-100">Organize your workload and complete tasks on time</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="rounded-xl border border-rose-100 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold uppercase text-slate-500">Total Tasks</h3>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">{tasks.length}</p>
        </div>
        <div className="rounded-xl border border-rose-100 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold uppercase text-slate-500">Pending Tasks</h3>
          <p className="mt-2 text-3xl font-extrabold text-amber-600">{pendingTasks}</p>
        </div>
        <div className="rounded-xl border border-rose-100 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold uppercase text-slate-500">Completed</h3>
          <p className="mt-2 text-3xl font-extrabold text-emerald-600">{completedTasks}</p>
        </div>
        <div className="rounded-xl border border-rose-100 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold uppercase text-slate-500">Completion Rate</h3>
          <p className="mt-2 text-3xl font-extrabold text-slate-700">{completionRate}%</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-rose-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-xl font-bold text-slate-900">Your Tasks</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Task Title
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-rose-50/40">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{task.title}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        task.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button className="rounded-md border border-rose-500 px-3 py-1.5 font-semibold text-rose-500 transition hover:bg-rose-500 hover:text-white">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-rose-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold text-slate-900">Activity Summary</h2>
        <div className="space-y-2 text-slate-600">
          <p>Total tasks assigned: {tasks.length}</p>
          <p>Completion rate: {completionRate}%</p>
        </div>
      </div>
    </div>
  );
}
