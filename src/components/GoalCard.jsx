import ProgressBar from './ProgressBar.jsx';

export default function GoalCard({ goal, onUpdateGoal, onDeleteGoal }) {
  const percent = Math.min(100, Math.round((Number(goal.current) / Number(goal.target || 1)) * 100));
  const isComplete = percent >= 100 || goal.status === 'Completed';

  function changeCurrent(event) {
    onUpdateGoal(goal.id, {
      current: Number(event.target.value),
      status: Number(event.target.value) >= Number(goal.target) ? 'Completed' : 'Active'
    });
  }

  return (
    <article className={`goal-card ${isComplete ? 'completed' : ''}`}>
      <div className="goal-top">
        <div>
          <h3>{goal.title}</h3>
          <p className="muted small-text">Deadline: {goal.deadline || 'Not set'}</p>
        </div>
        <span className="pill">{isComplete ? 'Completed' : goal.status}</span>
      </div>

      <ProgressBar value={goal.current} max={goal.target} label={`${goal.current}/${goal.target} ${goal.unit}`} />

      <div className="goal-actions">
        <label>
          Current progress
          <input type="number" value={goal.current} min="0" onChange={changeCurrent} />
        </label>
        <button className="danger-btn" onClick={() => onDeleteGoal(goal.id)}>Delete</button>
      </div>
    </article>
  );
}
