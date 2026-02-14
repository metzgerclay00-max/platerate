import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// This endpoint is called from the review form when a low rating is submitted.
// In a production app, you'd use a service like Resend, SendGrid, or Supabase Edge Functions
// to send actual emails. For now, this logs the alert and could be extended with any email provider.

export async function POST(request) {
  try {
    const body = await request.json();
    const { restaurant_id, rating, comment, customer_name } = body;

    if (!restaurant_id || !rating) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Look up the restaurant to get alert_email
    const { data: restaurant, error: restError } = await supabase
      .from("restaurants")
      .select("name, alert_email")
      .eq("id", restaurant_id)
      .single();

    if (restError || !restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

    const alertEmail = restaurant.alert_email;

    if (!alertEmail) {
      return NextResponse.json({ success: true, message: "No alert email configured" });
    }

    // In production, send an email here using Resend, SendGrid, etc.
    // For now, log it. The infrastructure is ready to plug in an email provider.
    console.log(`[LOW RATING ALERT] Restaurant: ${restaurant.name}`);
    console.log(`  Rating: ${rating}/5`);
    console.log(`  Customer: ${customer_name || "Anonymous"}`);
    console.log(`  Comment: ${comment || "(no comment)"}`);
    console.log(`  Alert email: ${alertEmail}`);

    // TODO: Uncomment and configure when you add an email provider like Resend:
    //
    // await fetch("https://api.resend.com/emails", {
    //   method: "POST",
    //   headers: {
    //     "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     from: "PlateRate Alerts <alerts@yourdomain.com>",
    //     to: alertEmail,
    //     subject: `⚠️ Low Rating Alert - ${rating}/5 stars at ${restaurant.name}`,
    //     html: `
    //       <h2>New Low Rating at ${restaurant.name}</h2>
    //       <p><strong>Rating:</strong> ${rating}/5 stars</p>
    //       <p><strong>Customer:</strong> ${customer_name || "Anonymous"}</p>
    //       <p><strong>Comment:</strong> ${comment || "(no comment)"}</p>
    //       <p><a href="https://platerate-three.vercel.app/dashboard">View in Dashboard →</a></p>
    //     `,
    //   }),
    // });

    return NextResponse.json({ success: true, message: "Alert logged" });
  } catch (err) {
    console.error("Alert error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
