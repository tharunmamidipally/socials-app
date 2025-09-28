import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId, clubId } = await req.json();

  if (!userId || !clubId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // 🔹 Mock users (replace with real DB/API later)
  const mockUsers = [
    { id: "u1", collegeId: "123" },
    { id: "u2", collegeId: "456" },
  ];

  const user = mockUsers.find((u) => u.id === userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // 🔹 Extract collegeId from clubId format: "collegeId::clubName"
  const [collegeId] = (clubId || "").split("::");
  if (user.collegeId !== collegeId) {
    return NextResponse.json({ hasAccess: false });
  }

  // 🔹 Mock user-club memberships
  const mockUserClubs = [
    { userId: "u1", clubName: "123::tech" },
    { userId: "u2", clubName: "456::music" },
  ];

  const has = mockUserClubs.find(
    (c) => c.userId === userId && c.clubName === clubId
  );

  return NextResponse.json({ hasAccess: !!has });
}
