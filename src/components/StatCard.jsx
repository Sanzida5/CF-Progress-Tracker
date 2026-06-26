export default function StatCard({ label, value, hint, icon }) {
  return (
    <article className="stat-card">
      <div className="stat-icon" aria-hidden="true">{icon}</div>
      <div>
        <p className="muted small-text">{label}</p>
        <h3>{value}</h3>
        {hint && <p className="muted small-text">{hint}</p>}
      </div>
    </article>
  );
}
