import mongoose, { Schema, Document } from 'mongoose';

export interface IChef extends Document {
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  specialties: string[];
  experienceYears?: number;
}

const chefSchema = new Schema<IChef>(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    bio: { type: String, required: true },
    photoUrl: { type: String, required: true },
    specialties: { type: [String], default: [] },
    experienceYears: { type: Number },
  },
  { timestamps: true }
);

export const Chef = mongoose.model<IChef>('Chef', chefSchema);
