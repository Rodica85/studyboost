import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  // Check auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check upload limit
  const FREE_UPLOAD_LIMIT = 2;
  const { data: profile } = await supabase
    .from("profiles")
    .select("upload_count, is_premium")
    .eq("id", user.id)
    .single();

  const uploadCount = profile?.upload_count ?? 0;
  const isPremium = profile?.is_premium ?? false;

  if (!isPremium && uploadCount >= FREE_UPLOAD_LIMIT) {
    return NextResponse.json(
      { error: "Free upload limit reached. Upgrade to Premium to continue." },
      { status: 403 }
    );
  }

  // Get file from form data
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "Only PDF files are accepted" }, { status: 400 });
  }

  if (file.size > 50 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 50MB)" }, { status: 413 });
  }

  try {
    // Extract text from PDF
    const buffer = Buffer.from(await file.arrayBuffer());
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdf = require("pdf-parse");
    const pdfData = await pdf(buffer);

    if (pdfData.text.trim().length < 100) {
      return NextResponse.json(
        { error: "PDF appears empty or is image-based. Text-based PDFs work best." },
        { status: 422 }
      );
    }

    // Increment upload count
    await supabase
      .from("profiles")
      .update({ upload_count: uploadCount + 1 })
      .eq("id", user.id);

    return NextResponse.json({
      filename: file.name,
      pageCount: pdfData.numpages,
      textLength: pdfData.text.length,
      text: pdfData.text,
    });
  } catch {
    return NextResponse.json(
      { error: "Could not read this PDF. Please try another file." },
      { status: 422 }
    );
  }
}
