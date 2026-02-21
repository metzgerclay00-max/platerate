import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
const MAX_MESSAGES_PER_REQUEST = 50;
const REVIEW_DOMAIN = 'https://getfives.ai';

/**
 * Validates and formats a phone number
 * Strips non-digits and adds +1 for US numbers without country code
 */
function formatPhoneNumber(phone) {
  // Strip all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');

  if (!digitsOnly) {
    throw new Error('Phone number contains no valid digits');
  }

  // If 10 digits (US number without country code), add +1
  if (digitsOnly.length === 10) {
    return `+1${digitsOnly}`;
  }

  // If 11 digits starting with 1 (US), use as-is with +
  if (digitsOnly.length === 11 && digitsOnly[0] === '1') {
    return `+${digitsOnly}`;
  }

  // If already has country code (11+ digits), assume valid international format
  if (digitsOnly.length >= 11) {
    return `+${digitsOnly}`;
  }

  throw new Error('Phone number must be 10 digits (US) or international format with country code');
}

/**
 * Replaces template variables in SMS template
 */
function buildMessage(template, { name, businessName, reviewLink }) {
  return template
    .replace(/{name}/g, name || 'there')
    .replace(/{business}/g, businessName || 'our restaurant')
    .replace(/{link}/g, reviewLink);
}

/**
 * Sends a single SMS via Twilio REST API using fetch
 */
async function sendSMSViatwilio(toPhone, messageBody) {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    throw new Error('Twilio credentials not configured');
  }

  // Encode form data
  const params = new URLSearchParams();
  params.append('To', toPhone);
  params.append('From', TWILIO_PHONE_NUMBER);
  params.append('Body', messageBody);

  // Create Basic Auth header
  const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    }
  );

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Twilio API error: ${response.status} - ${errorData}`);
  }

  const data = await response.json();
  return data.sid; // Return the Twilio message SID
}

/**
 * POST /api/sms - Send one or more SMS messages
 */
export async function POST(request) {
  const errors = [];
  let sent = 0;
  let failed = 0;

  try {
    const body = await request.json();
    const { restaurant_id, messages } = body;

    // Validate required fields
    if (!restaurant_id || !messages) {
      return NextResponse.json(
        { error: 'Missing required fields: restaurant_id and messages' },
        { status: 400 }
      );
    }

    // Validate messages is an array
    if (!Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'messages must be an array' },
        { status: 400 }
      );
    }

    // Validate array length
    if (messages.length === 0) {
      return NextResponse.json(
        { error: 'messages array cannot be empty' },
        { status: 400 }
      );
    }

    if (messages.length > MAX_MESSAGES_PER_REQUEST) {
      return NextResponse.json(
        { error: `Maximum ${MAX_MESSAGES_PER_REQUEST} messages per request` },
        { status: 400 }
      );
    }

    // Look up the restaurant
    const { data: restaurant, error: restError } = await supabase
      .from('restaurants')
      .select('id, name, slug, sms_template, sms_count_this_month')
      .eq('id', restaurant_id)
      .single();

    if (restError || !restaurant) {
      console.error('Restaurant lookup error:', restError);
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    // Validate restaurant has an SMS template
    if (!restaurant.sms_template) {
      return NextResponse.json(
        { error: 'Restaurant does not have an SMS template configured' },
        { status: 400 }
      );
    }

    const smsTemplate = restaurant.sms_template;
    const reviewLink = `${REVIEW_DOMAIN}/r/${restaurant.slug}`;
    const timestamp = new Date().toISOString();
    let updatedSmsCount = restaurant.sms_count_this_month || 0;

    // Process each message
    const smsRecords = [];

    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      let messageStatus = 'sent';
      let twilioSid = null;
      let errorMessage = null;

      try {
        // Validate message has required fields
        if (!message.phone) {
          throw new Error('Missing phone number');
        }

        // Format phone number
        const formattedPhone = formatPhoneNumber(message.phone);

        // Build the SMS message
        const smsBody = buildMessage(smsTemplate, {
          name: message.name || 'Friend',
          businessName: restaurant.name,
          reviewLink,
        });

        // Send via Twilio
        try {
          twilioSid = await sendSMSViatwilio(formattedPhone, smsBody);
          sent++;
          console.log(`[SMS] Sent to ${formattedPhone} for restaurant: ${restaurant.name}`);
        } catch (twilioError) {
          messageStatus = 'failed';
          errorMessage = twilioError.message;
          failed++;
          console.error(`[SMS] Failed to send to ${formattedPhone}:`, twilioError.message);
          errors.push({
            index: i,
            phone: message.phone,
            name: message.name || 'Unknown',
            error: errorMessage,
          });
        }

        // Prepare record for insertion
        smsRecords.push({
          restaurant_id,
          phone: message.phone,
          formatted_phone: formattedPhone,
          name: message.name || null,
          status: messageStatus,
          twilio_sid: twilioSid,
          message_body: smsBody,
          error_message: errorMessage,
          created_at: timestamp,
        });

        updatedSmsCount++;
      } catch (err) {
        messageStatus = 'failed';
        errorMessage = err.message;
        failed++;
        console.error(`[SMS] Validation error at index ${i}:`, err.message);
        errors.push({
          index: i,
          phone: message.phone || 'Invalid',
          name: message.name || 'Unknown',
          error: errorMessage,
        });

        // Still add record for failed attempts
        smsRecords.push({
          restaurant_id,
          phone: message.phone || null,
          formatted_phone: null,
          name: message.name || null,
          status: 'failed',
          twilio_sid: null,
          message_body: null,
          error_message: errorMessage,
          created_at: timestamp,
        });
      }
    }

    // Batch insert SMS records
    if (smsRecords.length > 0) {
      const { error: insertError } = await supabase
        .from('sms_messages')
        .insert(smsRecords);

      if (insertError) {
        console.error('Failed to insert SMS records:', insertError);
        // Don't fail the entire request, just log the error
        errors.push({
          error: 'Failed to log SMS records to database',
          details: insertError.message,
        });
      }
    }

    // Update restaurant's sms_count_this_month
    if (sent > 0) {
      const { error: updateError } = await supabase
        .from('restaurants')
        .update({ sms_count_this_month: updatedSmsCount })
        .eq('id', restaurant_id);

      if (updateError) {
        console.error('Failed to update SMS count:', updateError);
      }
    }

    return NextResponse.json(
      {
        success: true,
        sent,
        failed,
        total: messages.length,
        errors: errors.length > 0 ? errors : undefined,
      },
      { status: sent > 0 ? 200 : 400 }
    );
  } catch (err) {
    console.error('SMS API error:', err);
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/sms?restaurant_id=uuid - Get SMS history for a restaurant
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get('restaurant_id');

    // Validate required parameter
    if (!restaurantId) {
      return NextResponse.json(
        { error: 'Missing required parameter: restaurant_id' },
        { status: 400 }
      );
    }

    // Verify restaurant exists
    const { data: restaurant, error: restError } = await supabase
      .from('restaurants')
      .select('id')
      .eq('id', restaurantId)
      .single();

    if (restError || !restaurant) {
      console.error('Restaurant lookup error:', restError);
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    // Fetch SMS history (last 100 messages, ordered by created_at descending)
    const { data: messages, error: smsError } = await supabase
      .from('sms_messages')
      .select(
        'id, phone, formatted_phone, name, status, twilio_sid, message_body, error_message, created_at'
      )
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false })
      .limit(100);

    if (smsError) {
      console.error('SMS history query error:', smsError);
      return NextResponse.json(
        { error: 'Failed to fetch SMS history' },
        { status: 500 }
      );
    }

    // Calculate summary statistics
    const totalMessages = messages.length;
    const sentMessages = messages.filter((m) => m.status === 'sent').length;
    const failedMessages = messages.filter((m) => m.status === 'failed').length;

    return NextResponse.json(
      {
        success: true,
        restaurant_id: restaurantId,
        summary: {
          total: totalMessages,
          sent: sentMessages,
          failed: failedMessages,
        },
        messages,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('SMS GET endpoint error:', err);
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500 }
    );
  }
}
