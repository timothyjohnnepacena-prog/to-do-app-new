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
      console.log("POST LOG REJECTED: Missing token.sub", token);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const newLog = await ActivityLog.create({ ...body, userId: token.sub });
    return NextResponse.json(newLog, { status: 201 });
  } catch (error) {
    console.error("POST LOG CRASH:", error);
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

    await ActivityLog.deleteMany({ userId: token.sub });
    return NextResponse.json({ message: 'Logs cleared successfully' });
  } catch (error) {
    console.error("DELETE LOG CRASH:", error);
    return NextResponse.json({ error: 'Failed to clear logs' }, { status: 500 });
  }
}