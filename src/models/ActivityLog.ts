import mongoose, { Schema, Document } from 'mongoose';

export interface IActivityLog extends Document {
  taskId: string;
  action: string;
  details?: string;
  createdAt: Date;
}

const ActivityLogSchema: Schema = new Schema(
  {
    taskId: { type: String, required: true },
    action: { type: String, required: true },
    details: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);