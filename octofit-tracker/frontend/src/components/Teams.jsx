import { useEffect, useState } from 'react';
import { fetchItems } from '../api.js';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItems('-8000.app.github.dev/api/teams/').then(setTeams).then(() => setStatus('ready')).catch((reason) => {
      setError(reason.message);
      setStatus('error');
    });
  }, []);

  if (status === 'loading') return <p className="muted">Loading teams...</p>;
  if (status === 'error') return <p className="alert alert-danger">{error}</p>;
  return <section><div className="section-heading"><div><p className="eyebrow">Find your people</p><h1>Teams</h1></div><span className="count-badge">{teams.length} teams</span></div><div className="row g-3">{teams.map((team) => <article className="col-md-6" key={team._id}><div className="data-card team-card"><div className="team-mark">{team.name?.charAt(0)}</div><div><h2>{team.name}</h2><p>{team.description || 'Ready for the next challenge.'}</p><span className="tag">{team.members?.length || 0} members</span></div></div></article>)}</div></section>;
}

export default Teams;
