import { useEffect, useState } from 'react';
import { fetchItems } from '../api.js';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItems('-8000.app.github.dev/api/activities/').then(setActivities).then(() => setStatus('ready')).catch((reason) => {
      setError(reason.message);
      setStatus('error');
    });
  }, []);

  if (status === 'loading') return <p className="muted">Loading activity...</p>;
  if (status === 'error') return <p className="alert alert-danger">{error}</p>;
  return <section><div className="section-heading"><div><p className="eyebrow">Movement log</p><h1>Recent activity</h1></div><span className="count-badge">{activities.length} sessions</span></div><div className="table-shell"><table className="table align-middle mb-0"><thead><tr><th>Member</th><th>Activity</th><th>Duration</th><th>Points</th></tr></thead><tbody>{activities.map((activity) => <tr key={activity._id}><td>{activity.user?.name || activity.user || 'Unknown member'}</td><td className="text-capitalize">{activity.type}</td><td>{activity.duration} min</td><td><strong className="points">+{activity.points}</strong></td></tr>)}</tbody></table></div></section>;
}

export default Activities;
