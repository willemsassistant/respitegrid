const checklist = [
  'Family account and contact method',
  'Care recipient mobility and cognitive context',
  'Emergency contact and access instructions',
  'Visit request details for matching and risk scoring',
];

export default function FamilyIntakePage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-16 lg:px-10">
      <div className="rounded-3xl bg-white p-10 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          Family portal
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
          Family intake foundation
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          This route is the first dev checkpoint for the family flow: capture
          the minimum non-medical data required to book a safe respite window
          and produce an explainable caregiver shortlist.
        </p>
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {checklist.map((item) => (
            <li
              key={item}
              className="rounded-2xl bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700 ring-1 ring-slate-200"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
