import { NextRequest, NextResponse } from "next/server";
import { upsertProfile, addToList, trackEvent } from "@/lib/klaviyo";

const VALID_TYPES = ["restarter", "ghost", "loneWolf", "burner"];
const KLAVIYO_LIST_ID = process.env.KLAVIYO_LIST_ID || "";

export async function POST(req: NextRequest) {
  let body: { email?: string; resultType?: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { email, resultType } = body;

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  if (!resultType || !VALID_TYPES.includes(resultType)) {
    return NextResponse.json(
      { error: "Invalid result type" },
      { status: 400 }
    );
  }

  try {
    const profileId = await upsertProfile(email, resultType);

    if (KLAVIYO_LIST_ID) {
      await addToList(profileId, KLAVIYO_LIST_ID);
    }

    await trackEvent(email, resultType);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Klaviyo error:", err);
    return NextResponse.json(
      { error: "Email capture failed" },
      { status: 500 }
    );
  }
}
