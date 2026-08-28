import mongoose, { Schema } from 'mongoose';

export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';

export interface UserDocument extends mongoose.Document {
  name: string;
  email: string;
  password?: string;
  fitnessLevel: FitnessLevel;
  team?: mongoose.Types.ObjectId;
}

export interface TeamDocument extends mongoose.Document {
  name: string;
  description?: string;
  members: mongoose.Types.ObjectId[];
}

export interface ActivityDocument extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  type: string;
  duration: number;
  distance?: number;
  points: number;
  completedAt: Date;
}

export interface WorkoutDocument extends mongoose.Document {
  title: string;
  description: string;
  level: FitnessLevel;
  duration: number;
  exercises: string[];
}

const userSchema = new Schema<UserDocument>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, select: false },
  fitnessLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  team: { type: Schema.Types.ObjectId, ref: 'Team' },
}, { timestamps: true });

const teamSchema = new Schema<TeamDocument>({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const activitySchema = new Schema<ActivityDocument>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true, trim: true },
  duration: { type: Number, required: true, min: 1 },
  distance: { type: Number, min: 0 },
  points: { type: Number, required: true, min: 0 },
  completedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const workoutSchema = new Schema<WorkoutDocument>({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
  duration: { type: Number, required: true, min: 1 },
  exercises: { type: [String], default: [] },
}, { timestamps: true });

export const User = mongoose.model<UserDocument>('User', userSchema);
export const Team = mongoose.model<TeamDocument>('Team', teamSchema);
export const Activity = mongoose.model<ActivityDocument>('Activity', activitySchema);
export const Workout = mongoose.model<WorkoutDocument>('Workout', workoutSchema);