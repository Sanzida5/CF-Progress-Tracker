import React from 'react';
import ProblemForm from './components/ProblemForm.jsx';
import ProblemTable from './components/ProblemTable.jsx';
import StatCard from './components/StatCard.jsx';
import ProgressBar from './components/ProgressBar.jsx';
import GoalCard from './components/GoalCard.jsx';
import EmptyState from './components/EmptyState.jsx';
import { HorizontalBarChart, VerticalBarChart } from './components/ChartBars.jsx';
import { ratings, topics } from './utils/seedData.js';
import { loadState, resetState, saveGoals, saveProblems, saveProfile } from './utils/storage.js';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '▦' },
  { id: 'problems', label: 'Problems', icon: '✓' },
  { id: 'add', label: 'Add Problem', icon: '+' },
  { id: 'goals', label: 'Goals', icon: '◎' },
  { id: 'analytics', label: 'Analytics', icon: '↗' },
  { id: 'profile', label: 'Profile', icon: '👤' }
];

function getInitialView() {
  const hash = window.location.hash.replace('#', '');
  return navItems.some((item) => item.id === hash) ? hash : 'dashboard';
}

export default function App() {
  const initialState = React.useMemo(() => loadState(), []);
  const [problems, setProblems] = React.useState(initialState.problems);
  const [goals, setGoals] = React.useState(initialState.goals);
  const [profile, setProfile] = React.useState(initialState.profile);
  const [view, setView] = React.useState(getInitialView);
  const [toast, setToast] = React.useState('');

  React.useEffect(() => saveProblems(problems), [problems]);
  React.useEffect(() => saveGoals(goals), [goals]);
  React.useEffect(() => saveProfile(profile), [profile]);

  React.useEffect(() => {
    document.body.dataset.theme = profile.theme || 'dark';
  }, [profile.theme]);

  React.useEffect(() => {
    function handleHashChange() {
      setView(getInitialView());
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  React.useEffect(() => {
    if (!toast) return;
    const timeoutId = setTimeout(() => setToast(''), 2500);
    return () => clearTimeout(timeoutId);
  }, [toast]);

  function navigate(target) {
    window.location.hash = target;
    setView(target);
  }

  function addProblem(problem) {
    setProblems((current) => [problem, ...current]);
    setToast('Problem added successfully.');
    navigate('problems');
  }

  function deleteProblem(problemId) {
    setProblems((current) => current.filter((problem) => problem.id !== problemId));
    setToast('Problem deleted.');
  }

  function changeProblemStatus(problemId, status) {
    setProblems((current) =>
      current.map((problem) =>
        problem.id === problemId
          ? {
              ...problem,
              status,
              solvedDate: status === 'To Solve' ? '' : problem.solvedDate || new Date().toISOString().slice(0, 10)
            }
          : problem
      )
    );
  }

  function addGoal(goal) {
    setGoals((current) => [{ ...goal, id: crypto.randomUUID(), status: 'Active' }, ...current]);
    setToast('Goal added successfully.');
  }

  function updateGoal(goalId, updates) {
    setGoals((current) => current.map((goal) => (goal.id === goalId ? { ...goal, ...updates } : goal)));
  }

  function deleteGoal(goalId) {
    setGoals((current) => current.filter((goal) => goal.id !== goalId));
    setToast('Goal deleted.');
  }

  function updateProfile(updates) {
    setProfile((current) => ({ ...current, ...updates }));
  }

  function resetDemoData() {
    resetState();
    const fresh = loadState();
    setProblems(fresh.problems);
    setGoals(fresh.goals);
    setProfile(fresh.profile);
    setToast('Demo data restored.');
  }

  const stats = getStats(problems, profile);
  const pageTitle = navItems.find((item) => item.id === view)?.label || 'Dashboard';

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">CF</div>
          <div>
            <h1>Progress Tracker</h1>
            <p>Codeforces practice dashboard</p>
          </div>
        </div>

        <nav className="nav-list" aria-label="Main navigation">
          {navItems.map((item) => (
            <button key={item.id} className={view === item.id ? 'active' : ''} onClick={() => navigate(item.id)}>
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-card">
          <p className="eyebrow">Rating goal</p>
          <h2>{profile.currentRating} → {profile.targetRating}</h2>
          <ProgressBar value={profile.currentRating} max={profile.targetRating} label="Current progress" />
        </div>
      </aside>

      <main className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</p>
            <h1>{pageTitle}</h1>
          </div>
          <div className="topbar-actions">
            <button className="ghost-btn" onClick={() => updateProfile({ theme: profile.theme === 'dark' ? 'light' : 'dark' })}>
              {profile.theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
            <button className="primary-btn" onClick={() => navigate('add')}>Add problem</button>
          </div>
        </header>

        {toast && <div className="toast">{toast}</div>}

        {view === 'dashboard' && (
          <Dashboard
            stats={stats}
            problems={problems}
            goals={goals}
            profile={profile}
            onNavigate={navigate}
          />
        )}

        {view === 'problems' && (
          <ProblemTable problems={problems} onDeleteProblem={deleteProblem} onStatusChange={changeProblemStatus} />
        )}

        {view === 'add' && <ProblemForm onAddProblem={addProblem} />}

        {view === 'goals' && (
          <GoalsPage goals={goals} onAddGoal={addGoal} onUpdateGoal={updateGoal} onDeleteGoal={deleteGoal} />
        )}

        {view === 'analytics' && <AnalyticsPage problems={problems} stats={stats} />}

        {view === 'profile' && (
          <ProfilePage
            profile={profile}
            problems={problems}
            goals={goals}
            onUpdateProfile={updateProfile}
            onResetData={resetDemoData}
          />
        )}
      </main>
    </div>
  );
}

function Dashboard({ stats, problems, goals, profile, onNavigate }) {
  const recentProblems = [...problems]
    .filter((problem) => problem.status !== 'To Solve')
    .sort((a, b) => (b.solvedDate || '').localeCompare(a.solvedDate || ''))
    .slice(0, 5);

  return (
    <div className="stack">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Welcome back, {profile.name}</p>
          <h2>Build consistency, solve smarter, and reach {profile.targetRating} rating.</h2>
          <p className="muted">Track solved problems, revise weak topics, and prepare your next contest practice plan from one React dashboard.</p>
          <div className="button-row">
            <button className="primary-btn" onClick={() => onNavigate('add')}>Log today’s problem</button>
            <button className="ghost-btn" onClick={() => onNavigate('analytics')}>View analytics</button>
          </div>
        </div>
        <div className="hero-score">
          <span>Current rating</span>
          <strong>{profile.currentRating}</strong>
          <p>Target: {profile.targetRating}</p>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard label="Solved" value={stats.solvedCount} hint="Accepted or completed" icon="✓" />
        <StatCard label="Revision" value={stats.revisionCount} hint="Need another attempt" icon="↻" />
        <StatCard label="Daily target" value={`${stats.todaySolved}/${profile.dailyTarget}`} hint="Solved today" icon="☀" />
        <StatCard label="Current streak" value={`${stats.streak} days`} hint="Consecutive practice" icon="🔥" />
      </section>

      <section className="grid-two">
        <div className="panel">
          <div className="section-title">
            <div>
              <p className="eyebrow">Recent activity</p>
              <h2>Latest solved problems</h2>
            </div>
            <button className="ghost-btn" onClick={() => onNavigate('problems')}>See all</button>
          </div>
          {recentProblems.length === 0 ? (
            <EmptyState title="No activity yet" description="Add a solved problem to start your practice history." />
          ) : (
            <div className="activity-list">
              {recentProblems.map((problem) => (
                <article key={problem.id} className="activity-item">
                  <div>
                    <h3>{problem.name}</h3>
                    <p className="muted small-text">{problem.topic} • {problem.rating} • {problem.solvedDate}</p>
                  </div>
                  <span className="pill">{problem.status}</span>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="panel">
          <div className="section-title">
            <div>
              <p className="eyebrow">Goals</p>
              <h2>Active targets</h2>
            </div>
            <button className="ghost-btn" onClick={() => onNavigate('goals')}>Manage</button>
          </div>
          <div className="mini-goals">
            {goals.slice(0, 3).map((goal) => (
              <ProgressBar key={goal.id} value={goal.current} max={goal.target} label={goal.title} />
            ))}
          </div>
        </div>
      </section>

      <WeeklySummary problems={problems} />
    </div>
  );
}

function GoalsPage({ goals, onAddGoal, onUpdateGoal, onDeleteGoal }) {
  const [form, setForm] = React.useState({ title: '', target: 10, current: 0, unit: 'problems', deadline: '' });

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function submitGoal(event) {
    event.preventDefault();
    if (!form.title.trim()) return;
    onAddGoal({ ...form, target: Number(form.target), current: Number(form.current) });
    setForm({ title: '', target: 10, current: 0, unit: 'problems', deadline: '' });
  }

  return (
    <div className="stack">
      <form className="panel form-grid" onSubmit={submitGoal}>
        <div className="section-title full-span">
          <div>
            <p className="eyebrow">Plan ahead</p>
            <h2>Create a new goal</h2>
          </div>
        </div>
        <label className="full-span">
          Goal title
          <input name="title" value={form.title} onChange={updateField} placeholder="Example: Solve 50 greedy problems" />
        </label>
        <label>
          Target
          <input type="number" name="target" min="1" value={form.target} onChange={updateField} />
        </label>
        <label>
          Current
          <input type="number" name="current" min="0" value={form.current} onChange={updateField} />
        </label>
        <label>
          Unit
          <select name="unit" value={form.unit} onChange={updateField}>
            <option>problems</option>
            <option>rating</option>
            <option>days</option>
            <option>contests</option>
          </select>
        </label>
        <label>
          Deadline
          <input type="date" name="deadline" value={form.deadline} onChange={updateField} />
        </label>
        <div className="button-row full-span">
          <button className="primary-btn" type="submit">Add goal</button>
        </div>
      </form>

      <section className="goal-grid">
        {goals.length === 0 ? (
          <EmptyState title="No goals yet" description="Create a rating or practice target to track progress." />
        ) : (
          goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} onUpdateGoal={onUpdateGoal} onDeleteGoal={onDeleteGoal} />
          ))
        )}
      </section>
    </div>
  );
}

function AnalyticsPage({ problems, stats }) {
  const ratingItems = ratings.map((rating) => ({
    label: rating,
    value: problems.filter((problem) => problem.status === 'Solved' && Number(problem.rating) === rating).length
  }));

  const topicItems = Object.entries(
    problems
      .filter((problem) => problem.status === 'Solved')
      .reduce((acc, problem) => ({ ...acc, [problem.topic]: (acc[problem.topic] || 0) + 1 }), {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([label, value]) => ({ label, value }));

  const weakTopics = getWeakTopics(problems);

  return (
    <div className="stack">
      <section className="stats-grid">
        <StatCard label="Completion rate" value={`${stats.completionRate}%`} hint="Solved vs total tracked" icon="◉" />
        <StatCard label="Average rating" value={stats.averageRating} hint="Solved problems only" icon="Σ" />
        <StatCard label="To solve" value={stats.toSolveCount} hint="Backlog problems" icon="□" />
        <StatCard label="Topics practiced" value={stats.topicCount} hint="Unique solved topics" icon="◇" />
      </section>

      <section className="grid-two">
        <VerticalBarChart title="Solved by rating" items={ratingItems} />
        <HorizontalBarChart title="Solved by topic" items={topicItems.length ? topicItems : [{ label: 'No solved topics', value: 0 }]} />
      </section>

      <section className="grid-two">
        <WeeklySummary problems={problems} />
        <div className="panel">
          <div className="section-title">
            <div>
              <p className="eyebrow">Focus area</p>
              <h2>Weak topic detector</h2>
            </div>
          </div>
          <p className="muted">Topics appear here when they have revision/backlog problems or very low solved count.</p>
          <div className="weak-list">
            {weakTopics.map((topic) => (
              <div className="weak-item" key={topic.label}>
                <div>
                  <h3>{topic.label}</h3>
                  <p className="muted small-text">Solved: {topic.solved} • Need work: {topic.needsWork}</p>
                </div>
                <span className="pill">Practice next</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ProfilePage({ profile, problems, goals, onUpdateProfile, onResetData }) {
  function handleChange(event) {
    const { name, value } = event.target;
    const numericFields = ['currentRating', 'targetRating', 'dailyTarget'];
    onUpdateProfile({ [name]: numericFields.includes(name) ? Number(value) : value });
  }

  function exportCsv() {
    const header = ['Name', 'Link', 'Rating', 'Topic', 'Status', 'Solved Date', 'Notes'];
    const rows = problems.map((problem) => [
      problem.name,
      problem.link,
      problem.rating,
      problem.topic,
      problem.status,
      problem.solvedDate,
      problem.notes
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cf-progress-export.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="stack">
      <section className="panel form-grid">
        <div className="section-title full-span">
          <div>
            <p className="eyebrow">Account</p>
            <h2>Profile settings</h2>
          </div>
        </div>
        <label>
          Name
          <input name="name" value={profile.name} onChange={handleChange} />
        </label>
        <label>
          Codeforces handle
          <input name="handle" value={profile.handle} onChange={handleChange} />
        </label>
        <label>
          Current rating
          <input type="number" name="currentRating" value={profile.currentRating} onChange={handleChange} />
        </label>
        <label>
          Target rating
          <input type="number" name="targetRating" value={profile.targetRating} onChange={handleChange} />
        </label>
        <label>
          Daily problem target
          <input type="number" name="dailyTarget" value={profile.dailyTarget} onChange={handleChange} />
        </label>
        <label>
          Favorite language
          <input name="favoriteLanguage" value={profile.favoriteLanguage} onChange={handleChange} />
        </label>
        <div className="button-row full-span">
          <button type="button" className="primary-btn" onClick={exportCsv}>Export problems CSV</button>
          <button type="button" className="ghost-btn" onClick={window.print}>Print dashboard</button>
          <button type="button" className="danger-btn" onClick={onResetData}>Reset demo data</button>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard label="Tracked problems" value={problems.length} hint="Total records" icon="▣" />
        <StatCard label="Active goals" value={goals.filter((goal) => goal.status !== 'Completed').length} hint="Still in progress" icon="◎" />
        <StatCard label="Language" value={profile.favoriteLanguage} hint="Main CP language" icon="{}" />
        <StatCard label="Handle" value={profile.handle} hint="Codeforces username" icon="@" />
      </section>
    </div>
  );
}

function WeeklySummary({ problems }) {
  const weeklyItems = getWeeklySolved(problems);
  return <VerticalBarChart title="Last 7 days solved" items={weeklyItems} />;
}

function getStats(problems, profile) {
  const solvedProblems = problems.filter((problem) => problem.status === 'Solved');
  const revisionProblems = problems.filter((problem) => problem.status === 'Revision');
  const toSolveProblems = problems.filter((problem) => problem.status === 'To Solve');
  const today = new Date().toISOString().slice(0, 10);
  const solvedRatings = solvedProblems.map((problem) => Number(problem.rating)).filter(Boolean);
  const averageRating = solvedRatings.length
    ? Math.round(solvedRatings.reduce((sum, rating) => sum + rating, 0) / solvedRatings.length)
    : 0;
  const topicCount = new Set(solvedProblems.map((problem) => problem.topic)).size;

  return {
    solvedCount: solvedProblems.length,
    revisionCount: revisionProblems.length,
    toSolveCount: toSolveProblems.length,
    todaySolved: solvedProblems.filter((problem) => problem.solvedDate === today).length,
    streak: getStreak(solvedProblems),
    completionRate: problems.length ? Math.round((solvedProblems.length / problems.length) * 100) : 0,
    averageRating,
    topicCount,
    ratingProgress: Math.round((Number(profile.currentRating) / Number(profile.targetRating || 1)) * 100)
  };
}

function getStreak(solvedProblems) {
  const solvedDates = new Set(solvedProblems.map((problem) => problem.solvedDate).filter(Boolean));
  let streak = 0;
  const cursor = new Date();

  while (solvedDates.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function getWeeklySolved(problems) {
  const result = [];
  for (let index = 6; index >= 0; index -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - index);
    const key = date.toISOString().slice(0, 10);
    result.push({
      label: date.toLocaleDateString(undefined, { weekday: 'short' }),
      value: problems.filter((problem) => problem.status === 'Solved' && problem.solvedDate === key).length
    });
  }
  return result;
}

function getWeakTopics(problems) {
  const topicMap = new Map();

  [...topics, 'Simulation'].forEach((topic) => {
    topicMap.set(topic, { label: topic, solved: 0, needsWork: 0 });
  });

  problems.forEach((problem) => {
    const current = topicMap.get(problem.topic) || { label: problem.topic, solved: 0, needsWork: 0 };
    if (problem.status === 'Solved') current.solved += 1;
    if (problem.status !== 'Solved') current.needsWork += 1;
    topicMap.set(problem.topic, current);
  });

  return [...topicMap.values()]
    .filter((item) => item.needsWork > 0 || item.solved < 2)
    .sort((a, b) => b.needsWork - a.needsWork || a.solved - b.solved)
    .slice(0, 5);
}
