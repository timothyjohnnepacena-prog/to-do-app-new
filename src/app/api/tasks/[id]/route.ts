import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import ActivityLog from '@/models/ActivityLog';
import { getToken } from 'next-auth/jwt';

// Note: params is a Promise in Next.js 16 and must be awaited
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || !token.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Resolve the params promise to extract the task ID
    const resolvedParams = await params;
    const taskId = resolvedParams.id;

    const body = await req.json();
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, userId: token.sub },
      body,
      { new: true }
    );

    if (!updatedTask) {
      return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });
    }

    // Log task modification
    await ActivityLog.create({
      taskId: updatedTask._id.toString(),
      action: 'Updated task',
      details: `Moved or edited "${updatedTask.title}"`,
      userId: token.sub
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || !token.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Resolve the params promise to extract the task ID
    const resolvedParams = await params;
    const taskId = resolvedParams.id;

    const deletedTask = await Task.findOneAndDelete({ _id: taskId, userId: token.sub });

    if (!deletedTask) {
      return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });
    }

    // Log task deletion
    await ActivityLog.create({
      taskId: taskId,
      action: 'Deleted task',
      details: `Removed "${deletedTask.title}"`,
      userId: token.sub
    });

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}