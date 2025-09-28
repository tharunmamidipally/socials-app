import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { adminEmail, collegeId, studentId } = await req.json();

  if (!adminEmail || !collegeId || !studentId) {
    return NextResponse.json({ error: "Missing" }, { status: 400 });
  }

  // 🔹 Mock admin check (replace later with real DB/API call)
  const mockAdmins = [
    { collegeId: "123", userEmail: "admin@example.com" },
    { collegeId: "456", userEmail: "college@domain.com" },
  ];

  const admin = mockAdmins.find(
    (a) => a.collegeId === collegeId && a.userEmail === adminEmail
  );

  if (!admin) {
    return NextResponse.json({ error: "Not admin" }, { status: 403 });
  }

  // 🔹 Mock approve record (replace with DB insert)
  console.log("Approved:", { collegeId, studentId });

  // 🔹 Mock user update (replace with DB update)
  console.log("Updated role for student:", studentId);

  return NextResponse.json({ success: true });
}
