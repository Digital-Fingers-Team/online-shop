export function StatCard({ label, value }: { label: string; value: string | number }) {
  return <div className="card p-6"><p className="text-sm font-semibold text-slate-500">{label}</p><p className="mt-2 text-3xl font-black">{value}</p></div>;
}
