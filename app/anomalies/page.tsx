import { demoAnomalies } from '@/lib/demo-data';

export default function AnomaliesPage() {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Anomaly Explorer</h2>
      {demoAnomalies.map((item) => (
        <div key={item.id} className="rounded border bg-white p-4">
          <h3 className="font-medium">{item.title}</h3>
          <p className="text-sm text-slate-700">{item.summary}</p>
          <ul className="mt-2 list-disc pl-5 text-xs text-slate-600">
            {item.explainability.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
