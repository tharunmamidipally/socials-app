import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const collegeId = url.searchParams.get("collegeId");

  if (!collegeId) {
    return NextResponse.json({ error: "collegeId required" }, { status: 400 });
  }

  // 🔹 Mock dataset (replace later with real DB/API)
  const mockUsers = [
    { id: "u1", collegeId: "123", role: "student", academicScore: 92, sportsScore: 70 },
    { id: "u2", collegeId: "123", role: "student", academicScore: 80, sportsScore: 95 },
    { id: "u3", collegeId: "123", role: "student", academicScore: 88, sportsScore: 82 },
    { id: "u4", collegeId: "456", role: "student", academicScore: 60, sportsScore: 65 },
  ];

  // Filter by collegeId + role
  const users = mockUsers.filter(
    (u) => u.collegeId === collegeId && u.role === "student"
  );

  // Rankings
  const academicTop = [...users]
    .sort((a, b) => b.academicScore - a.academicScore)
    .slice(0, 30);

  const sportsTop = [...users]
    .sort((a, b) => b.sportsScore - a.sportsScore)
    .slice(0, 30);

  const combinedTop = [...users]
    .sort(
      (a, b) =>
        b.academicScore + b.sportsScore - (a.academicScore + a.sportsScore)
    )
    .slice(0, 30);

  return NextResponse.json({ academicTop, sportsTop, combinedTop });
}
