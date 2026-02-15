import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * Alert endpoint for low ratings (1-2 stars)
 *
 * This endpoint is triggered from the review form when a customer submits
 * a low rating. It looks up the restaurant and sends an alert to the
 * configured alert_email address.
 *
 * In production, you would integrate with an email service like:
 * - Resend (https://resend.com)
 * - SendGrid (https://sendgrid.com)
 * - Supabase Edge Functions
 * - AWS SES
 */

export async function POST(request) {
  try {
    const body = await request.json();
    const { restaurant_id, rating, comment, customer_name } = body;

    // Validate required fields
    if (!restaurant_id || rating === null || rating === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: restaurant_id and rating' },
        { status: 400 }
      );
    }

    // Look up the restaurant to get alert_email
    const { data: restaurant, error: restError } = await supabase
      .from('restaurants')
      .select('name, alert_email')
      .eq('id', restaurant_id)
      .single();

    if (restError || !restaurant) {
      console.error('Restaurant lookup error:', restError);
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    const alertEmail = restaurant.alert_email;

    // If no alert email configured, silently succeed
    if (!alertEmail) {
      console.log(`[ALERT] No alert email configured for restaurant: ${restaurant.name}`);
      return NextResponse.json(
        { success: true, message: 'No alert email configured' },
        { status: 200 }
      );
    }

    // Log the alert for monitoring
    console.log(`\n[LOW RATING ALERT] ${new Date().toISOString()}`);
    console.log(`  Restaurant: ${restaurant.name} (ID: ${restaurant_id})`);
    console.log(`  Rating: ${rating}/5`);
    console.log(`  Customer: ${customer_name || 'Anonymous'}`);
    console.log(`  Comment: ${comment || '(no comment)'}`);
    console.log(`  Alert recipient: ${alertEmail}\n`);

    /**
     * PRODUCTION EMAIL SETUP
     *
     * Uncomment and configure one of these email providers:
     */

    // Option 1: Using Resend (https://resend.com)
    /*
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'PlateRate Alerts <alerts@platerate.app>',
        to: alertEmail,
        subject: `Alert: ${rating}/5 star review at ${restaurant.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px;">
            <h2 style="color: #dc2626;">Low Rating Alert</h2>
            <p>A customer left a low rating at your restaurant:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 8px; font-weight: bold; background: #f3f4f6;">Rating</td>
                <td style="padding: 8px;">${rating} / 5 stars</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; background: #f3f4f6;">Customer</td>
                <td style="padding: 8px;">${customer_name || 'Anonymous'}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; background: #f3f4f6; vertical-align: top;">Feedback</td>
                <td style="padding: 8px;">${comment || '(no comment provided)'}</td>
              </tr>
            </table>
            <p>
              <a href="https://platerate.app/dashboard/feedback" style="color: #2563eb; text-decoration: none;">
                View feedback in dashboard →
              </a>
            </p>
          </div>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const error = await emailResponse.text();
      console.error('Resend API error:', error);
      throw new Error('Failed to send email via Resend');
    }
    */

    // Option 2: Using SendGrid (https://sendgrid.com)
    /*
    const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: alertEmail }] }],
        from: { email: 'alerts@platerate.app', name: 'PlateRate' },
        subject: `Alert: ${rating}/5 star review at ${restaurant.name}`,
        content: [{
          type: 'text/html',
          value: `
            <h2>Low Rating Alert</h2>
            <p><strong>Rating:</strong> ${rating}/5</p>
            <p><strong>Customer:</strong> ${customer_name || 'Anonymous'}</p>
            <p><strong>Feedback:</strong> ${comment || '(none)'}</p>
          `,
        }],
      }),
    });

    if (!emailResponse.ok) {
      throw new Error('Failed to send email via SendGrid');
    }
    */

    // For now, the alert is logged. In production, uncomment one of the email integrations above.

    return NextResponse.json(
      { success: true, message: 'Alert recorded and logged' },
      { status: 200 }
    );
  } catch (err) {
    console.error('Alert endpoint error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
