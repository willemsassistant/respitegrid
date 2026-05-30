const queues = [
  'Pending caregiver approvals',
  'High-risk visit requests needing manual review',
  'Bookings requiring backup coverage',
  'Incident reports and audit trail review',
];

export default function AdminOpsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-16 lg:px-10">
      <div className="rounded-3xl bg-white p-10 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          Admin portal
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
          Ops command surface
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          RespiteGrid’s MVP lives or dies on human oversight. This admin surface
          is where care ops reviews risk, understands why the algorithm ranked
          people the way it did, and intervenes when the marketplace gets messy.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {queues.map((queue) => (
            <div
              key={queue}
              className="rounded-2xl bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700 ring-1 ring-slate-200"
            >
              {queue}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
