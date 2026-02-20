import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import { getToken } from 'next-auth/jwt';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    // We use token.sub because it is the guaranteed unique User ID
    if (!token || !token.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tasks = await Task.find({ userId: token.sub }).sort({ createdAt: -1 });
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
      console.log("POST TASK REJECTED: Missing token.sub (User ID)", token);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const newTask = await Task.create({ ...body, userId: token.sub });
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("POST TASK CRASH:", error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}