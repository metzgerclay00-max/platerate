import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

export async function POST(request) {
  try {
    const { feedback_id, restaurant_id } = await request.json();

    if (!feedback_id || !restaurant_id) {
      return NextResponse.json(
        { error: "feedback_id and restaurant_id are required" },
        { status: 400 }
      );
    }

    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "AI response generation is not configured. Add ANTHROPIC_API_KEY to environment variables." },
        { status: 503 }
      );
    }

    // Fetch the feedback record
    const { data: feedback, error: fbError } = await supabase
      .from("feedback")
      .select("*")
      .eq("id", feedback_id)
      .eq("restaurant_id", restaurant_id)
      .single();

    if (fbError || !feedback) {
      return NextResponse.json({ error: "Feedback not found" }, { status: 404 });
    }

    // Fetch restaurant name
    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("name")
      .eq("id", restaurant_id)
      .single();

    const businessName = restaurant?.name || "our coffee shop";
    const rating = feedback.rating;
    const reviewText = feedback.comment || "(No written review)";
    const customerName = feedback.customer_name || "a customer";
    const categories = feedback.categories?.join(", ") || "";

    // Build the prompt based on rating
    let toneGuide = "";
    if (rating <= 2) {
      toneGuide = "The customer had a poor experience. Be empathetic, apologize sincerely, acknowledge their specific concerns, and invite them back with a commitment to improvement. Do not be defensive.";
    } else if (rating === 3) {
      toneGuide = "The customer had a mixed experience. Thank them for the honest feedback, acknowledge what could be better, and highlight your commitment to excellence.";
    } else {
      toneGuide = "The customer had a great experience. Express genuine gratitude, reference specific things they enjoyed if mentioned, and warmly invite them back.";
    }

    const systemPrompt = `You are a friendly coffee shop owner writing responses to customer reviews on Google. Write warm, professional, and authentic responses. Keep responses concise (2-4 sentences). Never use generic phrases like "We appreciate your feedback" - be specific and personal. Sign off with just a first name (make one up that sounds friendly).`;

    const userPrompt = `Write a response to this ${rating}-star review for ${businessName}.

Customer: ${customerName}
Review: ${reviewText}
${categories ? `Areas mentioned: ${categories}` : ""}

${toneGuide}`;

    // Call Anthropic API
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 300,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error("Anthropic API error:", errData);
      return NextResponse.json(
        { error: "Failed to generate response. Please try again." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const aiResponse = data.content?.[0]?.text || "";

    if (!aiResponse) {
      return NextResponse.json({ error: "Empty response from AI" }, { status: 500 });
    }

    // Save to database
    const { error: updateError } = await supabase
      .from("feedback")
      .update({
        ai_response: aiResponse,
        ai_response_generated_at: new Date().toISOString(),
      })
      .eq("id", feedback_id);

    if (updateError) {
      console.error("Error saving AI response:", updateError);
      // Still return the response even if save fails
    }

    return NextResponse.json({
      response: aiResponse,
      generated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("AI Response API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
