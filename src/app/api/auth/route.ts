import { NextRequest, NextResponse } from "next/server";
import { users } from "@/lib/mockData";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const found = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!found) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  }

  const { password: _pw, ...safeUser } = found;

  return NextResponse.json({ user: safeUser });
}
