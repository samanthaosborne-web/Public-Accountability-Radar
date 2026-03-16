interface Props {
  params: { id: string };
}

export default function RecordPage({ params }: Props) {
  return (
    <section className="rounded-lg border bg-white p-6">
      <h2 className="text-xl font-semibold">Record detail: {params.id}</h2>
      <p className="mt-2 text-sm text-slate-700">Raw and normalised fields with provenance links will render here.</p>
    </section>
  );
}
