import { useEffect, useState } from 'react';
import { fetchItems } from '../api.js';

function Users() {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItems('-8000.app.github.dev/api/users/').then(setUsers).then(() => setStatus('ready')).catch((reason) => {
      setError(reason.message);
      setStatus('error');
    });
  }, []);

  if (status === 'loading') return <p className="muted">Loading members...</p>;
  if (status === 'error') return <p className="alert alert-danger">{error}</p>;
  return <section><div className="section-heading"><div><p className="eyebrow">Community</p><h1>Members</h1></div><span className="count-badge">{users.length} active</span></div><div className="row g-3">{users.map((user) => <article className="col-md-6 col-xl-4" key={user._id}><div className="data-card"><div className="avatar">{user.name?.charAt(0)}</div><div><h2>{user.name}</h2><p>{user.email}</p><span className="tag">{user.fitnessLevel}</span></div></div></article>)}</div></section>;
}

export default Users;
