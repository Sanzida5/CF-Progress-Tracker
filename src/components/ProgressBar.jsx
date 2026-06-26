export default function ProgressBar({ value, max, label }) {
  const safeMax = Number(max) || 1;
  const percent = Math.min(100, Math.round((Number(value) / safeMax) * 100));

  return (
    <div className="progress-wrap">
      <div className="progress-row">
        <span>{label}</span>
        <strong>{percent}%</strong>
      </div>
      <div className="progress-track" aria-label={`${label}: ${percent}%`}>
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
