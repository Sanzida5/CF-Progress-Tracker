import React from 'react';
import EmptyState from './EmptyState.jsx';
import { ratings, topics } from '../utils/seedData.js';

export default function ProblemTable({ problems, onDeleteProblem, onStatusChange }) {
  const [query, setQuery] = React.useState('');
  const [rating, setRating] = React.useState('All');
  const [topic, setTopic] = React.useState('All');
  const [status, setStatus] = React.useState('All');

  const filteredProblems = problems.filter((problem) => {
    const matchesQuery = `${problem.name} ${problem.notes}`.toLowerCase().includes(query.toLowerCase());
    const matchesRating = rating === 'All' || Number(problem.rating) === Number(rating);
    const matchesTopic = topic === 'All' || problem.topic === topic;
    const matchesStatus = status === 'All' || problem.status === status;
    return matchesQuery && matchesRating && matchesTopic && matchesStatus;
  });

  return (
    <section className="panel">
      <div className="section-title">
        <div>
          <p className="eyebrow">Problem bank</p>
          <h2>Practice list</h2>
        </div>
        <span className="pill">{filteredProblems.length} shown</span>
      </div>

      <div className="filter-grid">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name or note" />
        <select value={rating} onChange={(event) => setRating(event.target.value)}>
          <option>All</option>
          {ratings.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select value={topic} onChange={(event) => setTopic(event.target.value)}>
          <option>All</option>
          {topics.map((item) => <option key={item}>{item}</option>)}
          <option>Simulation</option>
        </select>
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option>All</option>
          <option>Solved</option>
          <option>Revision</option>
          <option>To Solve</option>
        </select>
      </div>

      {filteredProblems.length === 0 ? (
        <EmptyState title="No problems found" description="Try changing your filters or add a new Codeforces problem." />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Problem</th>
                <th>Rating</th>
                <th>Topic</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.map((problem) => (
                <tr key={problem.id}>
                  <td>
                    <a href={problem.link || '#'} target="_blank" rel="noreferrer">{problem.name}</a>
                    {problem.notes && <p className="muted small-text">{problem.notes}</p>}
                  </td>
                  <td>{problem.rating}</td>
                  <td><span className="tag">{problem.topic}</span></td>
                  <td>
                    <select className="status-select" value={problem.status} onChange={(event) => onStatusChange(problem.id, event.target.value)}>
                      <option>Solved</option>
                      <option>Revision</option>
                      <option>To Solve</option>
                    </select>
                  </td>
                  <td>{problem.solvedDate || '-'}</td>
                  <td><button className="danger-btn" onClick={() => onDeleteProblem(problem.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
