import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, updates } = body;
  if (!userId || !updates) return NextResponse.json({ error: 'Missing' }, { status: 400 });

  const allowed = ['name','emojiTag','academicScore','sportsScore','clubs','email'];
  const data = {};
  for (const k of Object.keys(updates)) {
    if (allowed.includes(k) && k !== 'clubs') data[k] = updates[k];
  }

  // update basic fields
  // @ts-ignore
  const user = await prisma.user.update({ where: { id: userId }, data });

  // handle clubs: replace existing with provided array
  if (Array.isArray(updates.clubs)) {
    await prisma.userClub.deleteMany({ where: { userId } });
    const clubCreates = updates.clubs.map((c) => ({ userId, clubName: c }));
    if (clubCreates.length) await prisma.userClub.createMany({ data: clubCreates });
  }

  const refreshed = await prisma.user.findUnique({ where: { id: userId }, include: { clubs: true } });
  return NextResponse.json({ success: true, user: refreshed });
}
