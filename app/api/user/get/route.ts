import { NextResponse } from "next/server";

// 🔹 Mock users with clubs
const mockUsers = [
  {
    id: "u1",
    name: "Alice",
    email: "alice@college.edu",
    studentId: "S1001",
    collegeId: "123",
    role: "student",
    emojiTag: "🏅",
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
    clubs: ["123::sports"],
  },
];

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const user = mockUsers.find((u) => u.id === userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user });
}
