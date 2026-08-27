import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { connectDatabase } from './config/database.js';
import { Activity, Team, User, Workout } from './models.js';

const app = express();
const port = Number(process.env.PORT) || 8000;
const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName ? `https://${codespaceName}-8000.app.github.dev` : `http://localhost:${port}`;

app.use(express.json());
app.use((_request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Headers', 'Content-Type');
  response.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  if (_request.method === 'OPTIONS') { response.sendStatus(204); return; }
  next();
});

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

app.get('/api/users', async (_request, response) => {
  response.json(await User.find().populate('team', 'name').select('-password').sort({ name: 1 }));
});

app.post('/api/users', async (request, response) => {
  const user = await User.create(request.body);
  const userObject = user.toObject();
  delete (userObject as { password?: string }).password;
  response.status(201).json(userObject);
});

app.get('/api/teams', async (_request, response) => {
  response.json(await Team.find().populate('members', 'name email fitnessLevel').sort({ name: 1 }));
});

app.post('/api/teams', async (request, response) => {
  const team = await Team.create(request.body);
  response.status(201).json(team);
});

app.patch('/api/teams/:id', async (request, response) => {
  const team = await Team.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true });
  if (!team) { response.status(404).json({ error: 'Team not found' }); return; }
  response.json(team);
});

app.get('/api/activities', async (request, response) => {
  const filter: Record<string, string> = {};
  if (typeof request.query.user === 'string') filter.user = request.query.user;
  response.json(await Activity.find(filter).populate('user', 'name email').sort({ completedAt: -1 }));
});

app.post('/api/activities', async (request, response) => {
  const { type, duration, distance, user } = request.body;
  const points = Number(request.body.points) || Math.round(Number(duration) * 2 + Number(distance || 0));
  const activity = await Activity.create({ type, duration, distance, user, points });
  response.status(201).json(await activity.populate('user', 'name email'));
});

app.get('/api/leaderboard', async (_request, response) => {
  const leaderboard = await Activity.aggregate([
    { $group: { _id: '$user', points: { $sum: '$points' }, activities: { $sum: 1 } } },
    { $sort: { points: -1 } },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
    { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
    { $project: { _id: 0, user: { _id: '$user._id', name: '$user.name' }, points: 1, activities: 1 } },
  ]);
  response.json(leaderboard.map((entry, index) => ({ rank: index + 1, ...entry })));
});

app.get('/api/workouts', async (request, response) => {
  const filter: Record<string, string> = {};
  if (typeof request.query.level === 'string') filter.level = request.query.level;
  response.json(await Workout.find(filter).sort({ level: 1, title: 1 }));
});

app.post('/api/workouts', async (request, response) => {
  const workout = await Workout.create(request.body);
  response.status(201).json(workout);
});

app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  if (error instanceof mongoose.Error.ValidationError) { response.status(400).json({ error: error.message }); return; }
  if (error instanceof mongoose.Error.CastError) { response.status(400).json({ error: 'Invalid resource id' }); return; }
  if ((error as { code?: number }).code === 11000) { response.status(409).json({ error: 'A user with that email already exists' }); return; }
  console.error(error);
  response.status(500).json({ error: 'Internal server error' });
});

connectDatabase().catch((error: Error) => console.error('Database unavailable:', error.message));
app.listen(port, () => console.log(`OctoFit API listening at ${apiBaseUrl}`));

export default app;
