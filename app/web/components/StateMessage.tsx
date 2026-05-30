export function StateMessage({ title, description }: { title: string; description: string }) {
  return <div className="card p-10 text-center"><h2 className="text-xl font-bold">{title}</h2><p className="mt-2 text-slate-500">{description}</p></div>;
}
