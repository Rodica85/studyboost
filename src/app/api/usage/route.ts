import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const FREE_UPLOAD_LIMIT = 2;

export async function GET() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("upload_count, is_premium")
    .eq("id", user.id)
    .single();

  const uploadCount = profile?.upload_count ?? 0;
  const isPremium = profile?.is_premium ?? false;
  const canUpload = isPremium || uploadCount < FREE_UPLOAD_LIMIT;

  return NextResponse.json({
    uploadCount,
    isPremium,
    canUpload,
    limit: FREE_UPLOAD_LIMIT,
  });
}
