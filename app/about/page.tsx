import { Disclaimer } from '@/components/disclaimer';

export default function AboutPage() {
  return (
    <section className="space-y-4 rounded-lg border bg-white p-6">
      <h2 className="text-xl font-semibold">About and Methodology</h2>
      <Disclaimer />
      <p className="text-sm text-slate-700">
        Signals are produced from explainable rules against indexed public records from AusTender, GrantConnect,
        WA procurement publications, and WA Auditor General reports. Each signal links to source records and provides
        alternative explanations.
      </p>
    </section>
  );
}
