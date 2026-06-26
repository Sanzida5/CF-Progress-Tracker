export default function EmptyState({ title, description }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">⌁</div>
      <h3>{title}</h3>
      <p className="muted">{description}</p>
    </div>
  );
}
