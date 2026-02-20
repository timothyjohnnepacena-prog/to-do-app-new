import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { username, password } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hashedPassword });
    return NextResponse.json({ message: "User created!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }
}