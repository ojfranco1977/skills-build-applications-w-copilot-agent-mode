import { useEffect, useState } from 'react';
import { fetchItems } from '../api.js';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItems('workouts').then(setWorkouts).then(() => setStatus('ready')).catch((reason) => {
      setError(reason.message);
      setStatus('error');
    });
  }, []);

  if (status === 'loading') return <p className="muted">Loading workouts...</p>;
  if (status === 'error') return <p className="alert alert-danger">{error}</p>;
  return <section><div className="section-heading"><div><p className="eyebrow">Build your rhythm</p><h1>Workouts</h1></div><span className="count-badge">{workouts.length} plans</span></div><div className="row g-3">{workouts.map((workout) => <article className="col-md-6 col-xl-4" key={workout._id}><div className="data-card workout-card"><span className="level">{workout.level}</span><h2>{workout.title}</h2><p>{workout.description}</p><footer><span>{workout.duration} min</span><span>{workout.exercises?.length || 0} exercises</span></footer></div></article>)}</div></section>;
}

export default Workouts;
