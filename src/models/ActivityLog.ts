import mongoose from 'mongoose';

const ActivityLogSchema = new mongoose.Schema({
  taskId: { type: String, required: true },
  action: { type: String, required: true },
  details: { type: String },
  userId: { type: String, required: true }, // This makes the log private to the user
}, { timestamps: true });

export default mongoose.models.ActivityLog || mongoose.model('ActivityLog', ActivityLogSchema);