export function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="kpi">
      <strong>{value}</strong>
      <span>{label}</span>
      <div style={{ marginTop: 8, color: 'var(--muted)', fontSize: 12 }}>{hint}</div>
    </div>
  );
}
