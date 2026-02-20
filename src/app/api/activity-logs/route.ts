import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ActivityLog from '@/models/ActivityLog';
import { getToken } from 'next-auth/jwt';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || !token.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only fetch logs where the userId matches the logged-in user
    const logs = await ActivityLog.find({ userId: token.sub }).sort({ createdAt: -1 }).limit(50);
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || !token.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    // Attach the user's ID to the new log before saving
    const newLog = await ActivityLog.create({ ...body, userId: token.sub });
    return NextResponse.json(newLog, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create log' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || !token.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only delete logs that belong to the logged-in user
    await ActivityLog.deleteMany({ userId: token.sub });
    return NextResponse.json({ message: 'Logs cleared successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to clear logs' }, { status: 500 });
  }
}