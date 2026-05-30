import Link from 'next/link';

const pillars = [
  'Trusted short-shift respite coverage',
  'Explainable caregiver matching',
  'Backup coverage with human oversight',
];

const portals = [
  {
    href: '/family/intake',
    label: 'Family portal',
    description:
      'Create care recipient profiles, request coverage, and review caregiver shortlists.',
  },
  {
    href: '/caregiver/apply',
    label: 'Caregiver portal',
    description:
      'Apply, upload skills, set availability, and review job offers.',
  },
  {
    href: '/admin/ops',
    label: 'Admin portal',
    description:
      'Review approvals, inspect risk, understand match explanations, and manually intervene.',
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-6 py-16 lg:px-10">
      <section className="grid gap-10 rounded-3xl bg-white p-10 shadow-sm ring-1 ring-slate-200 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            RespiteGrid MVP
          </p>
          <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-slate-950">
            Flexible, trusted respite care with explainable matching and backup
            coverage.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            The first checkpoint focuses on an ops-led marketplace foundation:
            family intake, caregiver onboarding, deterministic matching, and
            admin oversight in one auditable platform.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            {portals.map((portal) => (
              <Link
                key={portal.href}
                href={portal.href}
                className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Open {portal.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-mist p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">
            Core promise
          </p>
          <ul className="mt-4 space-y-4 text-base text-slate-700">
            {pillars.map((pillar) => (
              <li
                key={pillar}
                className="rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200"
              >
                {pillar}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {portals.map((portal) => (
          <article
            key={portal.href}
            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              Portal
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">
              {portal.label}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {portal.description}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
