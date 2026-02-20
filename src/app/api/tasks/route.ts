export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import ActivityLog from '@/models/ActivityLog';
import { getToken } from 'next-auth/jwt';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || !token.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch tasks sorted by priority and creation date
    const tasks = await Task.find({ userId: token.sub }).sort({ priority: 1, createdAt: -1 });
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
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
    const newTask = await Task.create({ ...body, userId: token.sub });

    await ActivityLog.create({
      taskId: newTask._id.toString(),
      action: 'Created task',
      details: `Added "${newTask.title}"`,
      userId: token.sub
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}