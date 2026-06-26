import React from 'react';
import { ratings, topics } from '../utils/seedData.js';

const initialForm = {
  name: '',
  link: '',
  rating: 800,
  topic: 'Implementation',
  status: 'Solved',
  solvedDate: new Date().toISOString().slice(0, 10),
  notes: ''
};

export default function ProblemForm({ onAddProblem }) {
  const [form, setForm] = React.useState(initialForm);
  const [error, setError] = React.useState('');

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim()) {
      setError('Problem name is required.');
      return;
    }

    if (form.link && !form.link.startsWith('http')) {
      setError('Problem link should start with http or https.');
      return;
    }

    onAddProblem({
      ...form,
      id: crypto.randomUUID(),
      rating: Number(form.rating),
      solvedDate: form.status === 'To Solve' ? '' : form.solvedDate
    });

    setForm(initialForm);
    setError('');
  }

  return (
    <form className="panel form-grid" onSubmit={handleSubmit}>
      <div className="section-title full-span">
        <div>
          <p className="eyebrow">Track practice</p>
          <h2>Add a new problem</h2>
        </div>
      </div>

      {error && <div className="alert full-span">{error}</div>}

      <label className="full-span">
        Problem name
        <input name="name" value={form.name} onChange={updateField} placeholder="Example: A. Dragons" />
      </label>

      <label className="full-span">
        Problem link
        <input name="link" value={form.link} onChange={updateField} placeholder="https://codeforces.com/problemset/problem/..." />
      </label>

      <label>
        Rating
        <select name="rating" value={form.rating} onChange={updateField}>
          {ratings.map((rating) => (
            <option value={rating} key={rating}>{rating}</option>
          ))}
        </select>
      </label>

      <label>
        Topic
        <select name="topic" value={form.topic} onChange={updateField}>
          {topics.map((topic) => (
            <option value={topic} key={topic}>{topic}</option>
          ))}
          <option value="Simulation">Simulation</option>
        </select>
      </label>

      <label>
        Status
        <select name="status" value={form.status} onChange={updateField}>
          <option>Solved</option>
          <option>Revision</option>
          <option>To Solve</option>
        </select>
      </label>

      <label>
        Solved date
        <input type="date" name="solvedDate" value={form.solvedDate} onChange={updateField} disabled={form.status === 'To Solve'} />
      </label>

      <label className="full-span">
        Notes
        <textarea name="notes" value={form.notes} onChange={updateField} placeholder="What did you learn? What should you revise?" rows="4" />
      </label>

      <div className="button-row full-span">
        <button type="submit" className="primary-btn">Add problem</button>
        <button type="button" className="ghost-btn" onClick={() => setForm(initialForm)}>Clear</button>
      </div>
    </form>
  );
}
