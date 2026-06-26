export function VerticalBarChart({ title, items }) {
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <section className="panel">
      <div className="section-title">
        <h2>{title}</h2>
      </div>
      <div className="vertical-chart">
        {items.map((item) => {
          const height = Math.max(8, (item.value / max) * 100);
          return (
            <div className="bar-column" key={item.label} title={`${item.label}: ${item.value}`}>
              <div className="bar-frame">
                <div className="bar" style={{ height: `${height}%` }} />
              </div>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function HorizontalBarChart({ title, items }) {
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <section className="panel">
      <div className="section-title">
        <h2>{title}</h2>
      </div>
      <div className="horizontal-chart">
        {items.map((item) => {
          const width = Math.max(4, (item.value / max) * 100);
          return (
            <div className="hbar-row" key={item.label}>
              <span>{item.label}</span>
              <div className="hbar-track">
                <div className="hbar-fill" style={{ width: `${width}%` }} />
              </div>
              <strong>{item.value}</strong>
            </div>
          );
        })}
      </div>
    </section>
  );
}
