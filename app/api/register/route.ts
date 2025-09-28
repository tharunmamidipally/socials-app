import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, collegeId, studentId, password, emojiTag } = body;
  if (!name || !email || !collegeId || !studentId || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const college = await prisma.college.findUnique({ where: { id: collegeId } });
  if (!college) return NextResponse.json({ error: 'College not found' }, { status: 404 });

  const domain = email.split('@')[1];
  if (!domain || !domain.toLowerCase().endsWith(college.domain.toLowerCase())) {
    return NextResponse.json({ error: 'Email domain does not match college domain' }, { status: 403 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: 'User already exists' }, { status: 409 });

  // check approved by studentId
  const approvedRec = await prisma.approvedUser.findUnique({ where: { collegeId_studentId: { collegeId, studentId } } }).catch(()=>null);
  const approved = !!approvedRec;

  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      studentId,
      passwordHash: hash,
      emojiTag: emojiTag || '🏅',
      collegeId,
      role: approved ? 'student' : 'pending'
    }
  });

  return NextResponse.json({ success: true, userId: user.id, status: user.role });
}
