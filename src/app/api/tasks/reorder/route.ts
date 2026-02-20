import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import ActivityLog from '@/models/ActivityLog';
import { getToken } from 'next-auth/jwt';

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || !token.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tasks, movedTaskId } = await req.json();
    
    // 1. Update the priority (order) of every task in that column all at once!
    const updates = tasks.map((t: any) => 
      Task.findOneAndUpdate(
        { _id: t._id, userId: token.sub },
        { priority: t.priority, status: t.status }
      )
    );
    await Promise.all(updates);

    // 2. Only log the specific task that the user actually dragged
    if (movedTaskId) {
       const movedTask = tasks.find((t: any) => t._id === movedTaskId);
       if(movedTask) {
         await ActivityLog.create({
           taskId: movedTaskId,
           action: 'Moved/Reordered task',
           details: `Moved to ${movedTask.status} column`,
           userId: token.sub
         });
       }
    }

    return NextResponse.json({ message: 'Reordered successfully' });
  } catch (error) {
    console.error("REORDER CRASH:", error);
    return NextResponse.json({ error: 'Failed to reorder tasks' }, { status: 500 });
  }
}