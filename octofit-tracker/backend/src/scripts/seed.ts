import mongoose from 'mongoose';
import { Activity, Team, User, Workout } from '../models.js';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);

    console.log('Connected to octofit_db');

    await Promise.all([User.deleteMany({}), Team.deleteMany({}), Activity.deleteMany({}), Workout.deleteMany({})]);

    const users = await User.create([
      { name: 'Alex Rivera', email: 'alex@example.com', fitnessLevel: 'beginner' },
      { name: 'Jordan Lee', email: 'jordan@example.com', fitnessLevel: 'intermediate' },
      { name: 'Sam Taylor', email: 'sam@example.com', fitnessLevel: 'advanced' },
    ]);
    const team = await Team.create({ name: 'Mergington Movers', description: 'Friendly weekly fitness challenge', members: users.map((user) => user._id) });
    await User.updateMany({ _id: { $in: users.map((user) => user._id) } }, { team: team._id });
    await Activity.create([
      { user: users[0]._id, type: 'walking', duration: 30, distance: 2.5, points: 63 },
      { user: users[1]._id, type: 'running', duration: 25, distance: 4, points: 54 },
      { user: users[2]._id, type: 'strength', duration: 40, points: 80 },
    ]);
    await Workout.create([
      { title: 'Starter Circuit', description: 'A gentle full-body introduction.', level: 'beginner', duration: 20, exercises: ['Squats', 'Wall push-ups', 'Marching'] },
      { title: 'Tempo Run', description: 'Build endurance with controlled intervals.', level: 'intermediate', duration: 30, exercises: ['Warm-up', 'Intervals', 'Cool-down'] },
      { title: 'Power Session', description: 'A challenging strength-focused workout.', level: 'advanced', duration: 45, exercises: ['Burpees', 'Lunges', 'Plank'] },
    ]);

    console.log('Database seeding complete');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
