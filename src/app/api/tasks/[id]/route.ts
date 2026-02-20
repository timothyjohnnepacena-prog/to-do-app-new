import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import { getToken } from 'next-auth/jwt';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || !token.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const updatedTask = await Task.findOneAndUpdate(
      { _id: params.id, userId: token.sub },
      body,
      { new: true }
    );

    if (!updatedTask) {
      return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });
    }
    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("PUT TASK CRASH:", error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || !token.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const deletedTask = await Task.findOneAndDelete({ _id: params.id, userId: token.sub });

    if (!deletedTask) {
      return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error("DELETE TASK CRASH:", error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}