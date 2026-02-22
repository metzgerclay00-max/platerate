import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "FREE-";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// POST - Generate a new reward code
// GET - List reward codes for a restaurant
// PATCH - Mark a code as redeemed
export async function POST(request) {
  try {
    const { restaurant_id, feedback_id } = await request.json();

    if (!restaurant_id) {
      return NextResponse.json({ error: "restaurant_id is required" }, { status: 400 });
    }

    // Check if restaurant has rewards enabled
    const { data: restaurant, error: restError } = await supabase
      .from("restaurants")
      .select("reward_enabled, reward_text")
      .eq("id", restaurant_id)
      .single();

    if (restError || !restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    if (!restaurant.reward_enabled) {
      return NextResponse.json({ enabled: false, message: "Rewards not enabled" });
    }

    // Generate unique code (retry up to 5 times if collision)
    let code = null;
    let attempts = 0;
    while (!code && attempts < 5) {
      const candidate = generateCode();
      const { data: existing } = await supabase
        .from("reward_codes")
        .select("id")
        .eq("code", candidate)
        .single();

      if (!existing) {
        code = candidate;
      }
      attempts++;
    }

    if (!code) {
      return NextResponse.json({ error: "Failed to generate unique code" }, { status: 500 });
    }

    const { data: reward, error: insertError } = await supabase
      .from("reward_codes")
      .insert({
        restaurant_id,
        feedback_id: feedback_id || null,
        code,
        reward_text: restaurant.reward_text || "Free drink of your choice",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error creating reward:", insertError);
      return NextResponse.json({ error: "Failed to create reward" }, { status: 500 });
    }

    return NextResponse.json({
      enabled: true,
      code: reward.code,
      reward_text: reward.reward_text,
      created_at: reward.created_at,
    });
  } catch (err) {
    console.error("Reward API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurant_id = searchParams.get("restaurant_id");
    const status = searchParams.get("status");

    if (!restaurant_id) {
      return NextResponse.json({ error: "restaurant_id is required" }, { status: 400 });
    }

    let query = supabase
      .from("reward_codes")
      .select("*")
      .eq("restaurant_id", restaurant_id)
      .order("created_at", { ascending: false });

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    const { data: rewards, error } = await query;

    if (error) {
      return NextResponse.json({ error: "Failed to fetch rewards" }, { status: 500 });
    }

    const stats = {
      total: rewards.length,
      active: rewards.filter((r) => r.status === "active").length,
      redeemed: rewards.filter((r) => r.status === "redeemed").length,
      expired: rewards.filter((r) => r.status === "expired").length,
    };

    return NextResponse.json({ rewards, stats });
  } catch (err) {
    console.error("Reward GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { code, status } = await request.json();

    if (!code || !status) {
      return NextResponse.json({ error: "code and status are required" }, { status: 400 });
    }

    const updateData = { status };
    if (status === "redeemed") {
      updateData.redeemed_at = new Date().toISOString();
    }

    const { data: reward, error } = await supabase
      .from("reward_codes")
      .update(updateData)
      .eq("code", code)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to update reward" }, { status: 500 });
    }

    return NextResponse.json({ reward });
  } catch (err) {
    console.error("Reward PATCH error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
