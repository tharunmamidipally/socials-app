import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const collegeId = url.searchParams.get('collegeId');
  if (!collegeId) return NextResponse.json({ error: 'collegeId required' }, { status: 400 });

  const users = await prisma.user.findMany({ where: { collegeId, role: 'student' } });
  const academicTop = users.slice().sort((a,b)=>b.academicScore - a.academicScore).slice(0,30);
  const sportsTop = users.slice().sort((a,b)=>b.sportsScore - a.sportsScore).slice(0,30);
  const combinedTop = users.slice().sort((a,b)=> (b.academicScore + b.sportsScore) - (a.academicScore + a.sportsScore)).slice(0,30);

  return NextResponse.json({ academicTop, sportsTop, combinedTop });
}
