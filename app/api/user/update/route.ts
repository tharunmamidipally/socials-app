import { NextResponse } from "next/server";

// 🔹 Mock users and user-clubs
let mockUsers: any[] = [
  {
    id: "u1",
    name: "Alice",
    email: "alice@college.edu",
    studentId: "S1001",
    collegeId: "123",
    role: "student",
    emojiTag: "🏅",
    academicScore: 90,
    sportsScore: 80,
    clubs: ["123::tech", "123::music"],
  },
  {
    id: "u2",
    name: "Bob",
    email: "bob@college.edu",
    studentId: "S1002",
    collegeId: "123",
    role: "student",
    emojiTag: "🏆",
    academicScore: 70,
    sportsScore: 95,
    clubs: ["123::sports"],
  },
];

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, updates } = body;

  if (!userId || !updates) {
    return NextResponse.json({ error: "Missing" }, { status: 400 });
  }

  const allowed = ["name", "emojiTag", "academicScore", "sportsScore", "clubs", "email"];
  const user = mockUsers.find((u) => u.id === userId);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Update allowed fields except clubs
  for (const key of Object.keys(updates)) {
    if (allowed.includes(key) && key !== "clubs") {
      user[key] = updates[key];
    }
  }

  // Update clubs if provided
  if (Array.isArray(updates.clubs)) {
    user.clubs = updates.clubs;
  }

  return NextResponse.json({ success: true, user });
}
