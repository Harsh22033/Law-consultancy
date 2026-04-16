import Link from 'next/link';

export const metadata = {
  title: 'Home',
};

export default function HomePage() {
  return (
    <div className="space-y-20 pb-8">
      <section
        className="relative overflow-hidden bg-slate-900 py-24 text-white"
        style={{
          backgroundImage: "linear-gradient(rgba(15,23,42,0.86), rgba(15,23,42,0.9)), url('/jai-hero-bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-rose-300">
            Jurist Artificial Intelligence Inspired
          </p>
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight md:text-6xl">
            Find the right legal support and manage every case with confidence.
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-200">
            Built for lawyers, clients, and legal staff with structured workflows, role-based
            dashboards, and modern case tracking.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/signup"
              className="rounded-md bg-rose-500 px-7 py-3 font-semibold text-white shadow-lg shadow-rose-500/30 transition hover:bg-rose-600"
            >
              Get Started
            </Link>
            <Link
              href="/about"
              className="rounded-md border border-white/40 bg-white/10 px-7 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              Learn More
            </Link>
          </div>
          <div className="mx-auto mt-12 max-w-3xl rounded-xl bg-white/95 p-4 shadow-2xl">
            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
              <select className="rounded-md border border-slate-200 px-4 py-3 text-slate-700 outline-none ring-rose-200 focus:ring">
                <option>What legal help do you need?</option>
                <option>Family Law</option>
                <option>Corporate Law</option>
                <option>Criminal Defense</option>
                <option>Property Law</option>
              </select>
              <button className="rounded-md bg-rose-500 px-6 py-3 font-semibold text-white transition hover:bg-rose-600">
                Find Lawyers
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center text-3xl font-bold text-slate-900 md:text-4xl">
          How LawApp works
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-rose-100 bg-white p-7 shadow-sm">
            <p className="text-sm font-bold text-rose-500">STEP 1</p>
            <h3 className="mt-2 text-xl font-bold text-slate-900">Share your legal needs</h3>
            <p className="mt-2 text-slate-600">
              Pick a category and add your case details so we can structure your request clearly.
            </p>
          </div>
          <div className="rounded-xl border border-rose-100 bg-white p-7 shadow-sm">
            <p className="text-sm font-bold text-rose-500">STEP 2</p>
            <h3 className="mt-2 text-xl font-bold text-slate-900">Connect with the right lawyer</h3>
            <p className="mt-2 text-slate-600">
              Review specialists and move forward with a lawyer who matches your legal scenario.
            </p>
          </div>
          <div className="rounded-xl border border-rose-100 bg-white p-7 shadow-sm">
            <p className="text-sm font-bold text-rose-500">STEP 3</p>
            <h3 className="mt-2 text-xl font-bold text-slate-900">Manage everything in dashboard</h3>
            <p className="mt-2 text-slate-600">
              Track status, coordinate tasks, and keep all case activity in one place.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Why choose LawApp?</h2>
            <ul className="mt-6 space-y-4 text-slate-700">
              <li className="rounded-lg bg-rose-50 p-4">
                Cost-efficient legal process and better case visibility.
              </li>
              <li className="rounded-lg bg-rose-50 p-4">
                Role-based dashboards for clients, lawyers, and employees.
              </li>
              <li className="rounded-lg bg-rose-50 p-4">
                Secure and structured collaboration from intake to resolution.
              </li>
            </ul>
          </div>
          <div
            role="img"
            aria-label="Team discussing legal case"
            className="h-80 w-full rounded-2xl bg-cover bg-center shadow-xl"
            style={{
              backgroundImage: "url('/jai-support.jpeg')",
            }}
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center text-3xl font-bold text-slate-900">Top rated attorneys</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              name: 'Sarah Jenkins',
              specialty: 'Family Law',
              rating: '5.0',
              reviews: '85 reviews',
              image:
                'https://randomuser.me/api/portraits/women/44.jpg',
            },
            {
              name: 'James Carter',
              specialty: 'Corporate Law',
              rating: '4.9',
              reviews: '120 reviews',
              image:
                'https://randomuser.me/api/portraits/men/32.jpg',
            },
            {
              name: 'David Ross',
              specialty: 'Criminal Defense',
              rating: '4.8',
              reviews: '200 reviews',
              image:
                'https://randomuser.me/api/portraits/men/85.jpg',
            },
          ].map((lawyer) => (
            <div key={lawyer.name} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div
                  className="h-12 w-12 rounded-full bg-cover bg-center"
                  style={{ backgroundImage: `url('${lawyer.image}')` }}
                />
                <div>
                  <p className="font-bold text-slate-900">{lawyer.name}</p>
                  <p className="text-sm text-rose-500">{lawyer.specialty}</p>
                </div>
              </div>
              <p className="mt-4 text-sm font-semibold text-amber-600">
                {lawyer.rating} ({lawyer.reviews})
              </p>
              <button className="mt-5 w-full rounded-md border border-rose-500 px-4 py-2 font-semibold text-rose-500 transition hover:bg-rose-500 hover:text-white">
                View Profile
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-slate-900 px-6 py-12 text-center text-white md:px-10">
          <h2 className="text-3xl font-extrabold">Ready to simplify legal operations?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-300">
            Create an account and start managing legal cases with a faster, cleaner workflow.
          </p>
          <div className="mt-7 flex justify-center gap-4">
            <Link
              href="/signup"
              className="rounded-md bg-rose-500 px-6 py-3 font-semibold text-white transition hover:bg-rose-600"
            >
              Create Account
            </Link>
            <Link
              href="/contact"
              className="rounded-md border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Contact Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
