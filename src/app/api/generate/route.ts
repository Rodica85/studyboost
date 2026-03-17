import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

const SYSTEM_PROMPT = `You are an expert study assistant. You will receive text extracted from a PDF document. Analyze it and produce exactly this JSON structure (no other text, just valid JSON):

{
  "summary": "A 300-500 word summary of the document",
  "keyPoints": ["point 1", "point 2", ...],
  "examQuestions": [
    {
      "type": "multiple_choice",
      "question": "...",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "answer": "B",
      "explanation": "..."
    },
    {
      "type": "short_answer",
      "question": "...",
      "answer": "..."
    },
    {
      "type": "true_false",
      "question": "...",
      "answer": "True",
      "explanation": "..."
    }
  ],
  "flashcards": [
    {"front": "What is X?", "back": "X is..."}
  ],
  "references": ["Reference 1", "Reference 2"],
  "draftWork": "A 500-1000 word draft essay based on the content"
}

Rules:
- Generate 5-15 key points
- Generate 10-20 exam questions (mix of multiple choice, short answer, true/false)
- Generate 10-30 flashcards
- Extract all references found in the document. If none found, return empty array
- Return ONLY valid JSON, no markdown fences, no extra text`;

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { text, filename } = await request.json();

  if (!text || text.length < 100) {
    return NextResponse.json({ error: "Text too short to process" }, { status: 400 });
  }

  // Truncate to ~30k tokens worth of text (roughly 120k chars)
  const truncatedText = text.slice(0, 120000);

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8000,
      temperature: 0.3,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Here is the document "${filename}":\n\n${truncatedText}`,
        },
      ],
    });

    const responseText = message.content[0].type === "text" ? message.content[0].text : "";

    // Parse JSON from response
    const result = JSON.parse(responseText);

    return NextResponse.json(result);
  } catch (error) {
    console.error("AI generation failed:", error);
    return NextResponse.json(
      { error: "Failed to generate study materials. Please try again." },
      { status: 500 }
    );
  }
}
