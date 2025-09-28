import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(req: Request) {
  const { userId, clubId } = await req.json();
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  const [collegeId] = (clubId || '').split('::');
  if (user.collegeId !== collegeId) return NextResponse.json({ hasAccess: false });
  const has = await prisma.userClub.findFirst({ where: { userId, clubName: clubId } });
  return NextResponse.json({ hasAccess: !!has });
}
