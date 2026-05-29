const pillars = [
  'Trusted short-shift respite coverage',
  'Explainable caregiver matching',
  'Backup coverage with human oversight',
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-6 py-16 lg:px-10">
      <section className="grid gap-10 rounded-3xl bg-white p-10 shadow-sm ring-1 ring-slate-200 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">RespiteGrid MVP</p>
          <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-slate-950">
            Flexible, trusted respite care with explainable matching and backup coverage.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            The first checkpoint focuses on an ops-led marketplace foundation: family intake, caregiver onboarding,
            deterministic matching, and admin oversight in one auditable platform.
          </p>
        </div>
        <div className="rounded-2xl bg-mist p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">Core promise</p>
          <ul className="mt-4 space-y-4 text-base text-slate-700">
            {pillars.map((pillar) => (
              <li key={pillar} className="rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
                {pillar}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
