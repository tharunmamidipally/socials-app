import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

let mockColleges = [
  { id: "123", domain: "college.edu" },
  { id: "456", domain: "university.com" },
];

let mockApprovedUsers = [
  { collegeId: "123", studentId: "S1001" },
];

let mockUsers: any[] = [];

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, collegeId, studentId, password, emojiTag } = body;

  if (!name || !email || !collegeId || !studentId || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Check if college exists
  const college = mockColleges.find((c) => c.id === collegeId);
  if (!college) {
    return NextResponse.json({ error: "College not found" }, { status: 404 });
  }

  // Validate email domain
  const domain = email.split("@")[1];
  if (!domain || !domain.toLowerCase().endsWith(college.domain.toLowerCase())) {
    return NextResponse.json(
      { error: "Email domain does not match college domain" },
      { status: 403 }
    );
  }

  // Check if user already exists
  const existing = mockUsers.find((u) => u.email === email);
  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }

  // Check if student is pre-approved
  const approvedRec = mockApprovedUsers.find(
    (u) => u.collegeId === collegeId && u.studentId === studentId
  );
  const approved = !!approvedRec;

  // Hash password
  const hash = await bcrypt.hash(password, 10);

  // Create user
  const newUser = {
    id: `user_${Date.now()}`,
    name,
    email,
    studentId,
    passwordHash: hash,
    emojiTag: emojiTag || "🏅",
    collegeId,
    role: approved ? "student" : "pending",
  };
  mockUsers.push(newUser);

  return NextResponse.json({
    success: true,
    userId: newUser.id,
    status: newUser.role,
  });
}
