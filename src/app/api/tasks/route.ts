import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import ActivityLog from '@/models/ActivityLog';

// This handles "Reading" (getting all tasks)
export async function GET() {
  try {
    await dbConnect();
    const tasks = await Task.find({}).sort({ createdAt: -1 });
    return NextResponse.json(tasks);
  } catch (error) {
    // 👇 We are adding this line so the terminal yells the real error at us!
    console.error("🚨 THE REAL DATABASE ERROR IS:", error); 
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

// This handles "Creating" (saving a new task)
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const newTask = await Task.create({
      title: body.title,
      status: body.status || 'todo',
      description: body.description || '',
    });

    // Save a memory in our history log!
    await ActivityLog.create({
      taskId: newTask._id.toString(),
      action: 'created',
      details: `Task created: ${newTask.title}`,
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}