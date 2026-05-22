import { NextRequest, NextResponse } from "next/server";
import { checkIns } from "@/lib/mockData";
import { CheckIn, Mood } from "@/types";

// ─── GET /api/checkins ────────────────────────────────────────────────────────
//
// Query parameters (all optional):
//   page    – current page number, 1-indexed (default: 1)
//   limit   – records per page (default: 10)
//   userId  – filter to a single employee's check-ins
//   from    – ISO date string; include records on or after this date
//   to      – ISO date string; include records on or before this date
//
// Returns: PaginatedCheckIns

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10));
  const userId = searchParams.get("userId");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  // 1. Filter
  let result = [...checkIns];

  if (userId) {
    result = result.filter((c) => c.userId === userId);
  }
  if (from) {
    const fromDate = new Date(from);
    result = result.filter((c) => new Date(c.createdAt) >= fromDate);
  }
  if (to) {
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999); // include the full "to" day
    result = result.filter((c) => new Date(c.createdAt) <= toDate);
  }

  // 2. Sort newest first
  result.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // 3. Paginate
  const total = result.length;
  const totalPages = Math.ceil(total / limit);
  const data = result.slice((page - 1) * limit, page * limit);

  return NextResponse.json({ data, total, page, limit, totalPages });
}

// ─── POST /api/checkins ───────────────────────────────────────────────────────
//
// Body: { userId, userName, mood, rating, note? }
// Returns: { checkIn: CheckIn } with status 201

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, userName, mood, rating, note } = body;

  if (!userId || !userName || !mood || !rating) {
    return NextResponse.json(
      { error: "Missing required fields: userId, userName, mood, rating." },
      { status: 400 }
    );
  }

  const newCheckIn: CheckIn = {
    id: `ci-${crypto.randomUUID()}`,
    userId,
    userName,
    mood: mood as Mood,
    rating: Number(rating),
    note: note?.trim() || undefined,
    createdAt: new Date().toISOString(),
  };

  // Prepend so the newest record appears first on page 1
  checkIns.unshift(newCheckIn);

  return NextResponse.json({ checkIn: newCheckIn }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Query parameter 'id' is required." },
      { status: 400 }
    );
  }

  const idx = checkIns.findIndex((c) => c.id === id);

  if (idx === -1) {
    return NextResponse.json({ error: "Check-in not found." }, { status: 404 });
  }

  checkIns.splice(idx, 1);

  return NextResponse.json({ success: true });
}
