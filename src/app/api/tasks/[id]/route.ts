import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import ActivityLog from '@/models/ActivityLog';

// This handles "Updating" (editing or moving a task)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    
    const oldTask = await Task.findById(id);
    if (!oldTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const updatedTask = await Task.findByIdAndUpdate(id, body, { new: true });

    // If we moved the task to a new column, log it in history!
    if (oldTask.status !== updatedTask.status) {
      const statusNames: Record<string, string> = {
        todo: 'To Do',
        'in-progress': 'In Progress',
        done: 'Done'
      };
      
      await ActivityLog.create({
        taskId: id,
        action: 'status_changed',
        details: `"${updatedTask.title}" moved from ${statusNames[oldTask.status]} to ${statusNames[updatedTask.status]}`,
      });
    }

    return NextResponse.json(updatedTask);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

// This handles "Deleting" a task
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const deletedTask = await Task.findByIdAndDelete(id);
    
    // Log that we deleted it
    if (deletedTask) {
      await ActivityLog.create({
        taskId: id,
        action: 'deleted',
        details: `Task deleted: ${deletedTask.title}`,
      });
    }

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}