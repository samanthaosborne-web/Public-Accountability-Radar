import { Disclaimer } from '@/components/disclaimer';
import { demoAnomalies } from '@/lib/demo-data';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <Disclaimer />
      <section>
        <h2 className="mb-3 text-xl font-semibold">Latest anomalies requiring review</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {demoAnomalies.map((anomaly) => (
            <article key={anomaly.id} className="rounded-lg border bg-white p-4 shadow-sm">
              <h3 className="font-medium">{anomaly.title}</h3>
              <p className="mt-1 text-sm text-slate-700">{anomaly.summary}</p>
              <p className="mt-2 text-xs text-slate-500">Risk: {anomaly.riskLevel} · Confidence: {anomaly.confidence}/100</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
