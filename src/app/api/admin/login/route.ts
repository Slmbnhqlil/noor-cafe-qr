import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const COOKIE = "noor_admin";

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({ password: "" }));
  const expected = process.env.ADMIN_PASSWORD || "noor123";
  if (!password || password !== expected) {
    return NextResponse.json({ ok: false, error: "Şifre hatalı" }, { status: 401 });
  }
  cookies().set(COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  cookies().delete(COOKIE);
  return NextResponse.json({ ok: true });
}
