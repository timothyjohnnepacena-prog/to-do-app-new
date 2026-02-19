import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ActivityLog from '@/models/ActivityLog';

// This handles "Reading" the history logs
export async function GET() {
  try {
    await dbConnect();
    // We get the newest logs first, up to 50 of them
    const logs = await ActivityLog.find({}).sort({ createdAt: -1 }).limit(50);
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}

// This handles "Deleting" all history logs (Clear All button)
export async function DELETE() {
  try {
    await dbConnect();
    await ActivityLog.deleteMany({});
    return NextResponse.json({ message: 'All logs cleared' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to clear logs' }, { status: 500 });
  }
}