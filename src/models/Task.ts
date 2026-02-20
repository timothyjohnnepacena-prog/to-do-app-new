import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    status: { 
      type: String, 
      enum: ['todo', 'in-progress', 'done'], 
      default: 'todo' 
    },
    priority: { type: Number, default: 0 },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

// HARD RESET: This forces Next.js to destroy the old memory of this model and use the newest version!
if (mongoose.models.Task) {
  delete mongoose.models.Task;
}

export default mongoose.model<ITask>('Task', TaskSchema);