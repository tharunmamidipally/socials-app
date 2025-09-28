import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function POST(req: Request) {
  const { adminEmail, collegeId, studentId } = await req.json();
  if (!adminEmail || !collegeId || !studentId) return NextResponse.json({ error: 'Missing' }, { status: 400 });

  const admin = await prisma.collegeAdmin.findFirst({ where: { collegeId, userEmail: adminEmail } });
  if (!admin) return NextResponse.json({ error: 'Not admin' }, { status: 403 });

  // create approved record
  await prisma.approvedUser.create({ data: { collegeId, studentId } }).catch(()=>null);

  // update any pending user with that studentId
  const user = await prisma.user.findFirst({ where: { collegeId, studentId } });
  if (user) {
    await prisma.user.update({ where: { id: user.id }, data: { role: 'student' } });
  }

  return NextResponse.json({ success: true });
}
