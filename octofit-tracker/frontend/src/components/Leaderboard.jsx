import { useEffect, useState } from 'react';
import { fetchItems } from '../api.js';

function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItems('leaderboard').then(setLeaders).then(() => setStatus('ready')).catch((reason) => {
      setError(reason.message);
      setStatus('error');
    });
  }, []);

  if (status === 'loading') return <p className="muted">Loading leaderboard...</p>;
  if (status === 'error') return <p className="alert alert-danger">{error}</p>;
  return <section><div className="section-heading"><div><p className="eyebrow">Friendly competition</p><h1>Leaderboard</h1></div><span className="count-badge">This week</span></div><div className="table-shell"><table className="table align-middle mb-0"><thead><tr><th>Rank</th><th>Member</th><th>Sessions</th><th>Points</th></tr></thead><tbody>{leaders.map((entry, index) => <tr key={entry.user?._id || entry._id || index}><td><span className={`rank rank-${entry.rank || index + 1}`}>{entry.rank || index + 1}</span></td><td><strong>{entry.user?.name || entry.name || 'Unknown member'}</strong></td><td>{entry.activities || entry.activityCount || 0}</td><td><strong className="points">{entry.points || 0}</strong></td></tr>)}</tbody></table></div></section>;
}

export default Leaderboard;
