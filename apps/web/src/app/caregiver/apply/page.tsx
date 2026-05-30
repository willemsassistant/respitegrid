const steps = [
  'Create account and profile draft',
  'Declare skills, language, and hourly rate',
  'Set work radius and availability blocks',
  'Hand off identity and background-check workflows',
];

export default function CaregiverApplyPage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-16 lg:px-10">
      <div className="rounded-3xl bg-white p-10 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          Caregiver portal
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
          Caregiver onboarding foundation
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          The MVP will keep onboarding explicit and ops-led: build profile,
          declare skills, then route identity and background verification
          through specialist vendors instead of pretending to automate trust
          from scratch.
        </p>
        <ol className="mt-8 space-y-4">
          {steps.map((step, index) => (
            <li
              key={step}
              className="rounded-2xl bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700 ring-1 ring-slate-200"
            >
              <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
