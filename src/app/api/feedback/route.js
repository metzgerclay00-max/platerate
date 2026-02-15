import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    const { restaurant_id, rating, comment, customer_name, was_redirected, categories } = body;

    // Validate required fields
    if (!restaurant_id || rating === null || rating === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: restaurant_id and rating' },
        { status: 400 }
      );
    }

    // Validate rating is between 1-5
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Insert feedback record
    const { data, error } = await supabase
      .from('feedback')
      .insert({
        restaurant_id,
        rating,
        comment: comment || null,
        customer_name: customer_name || null,
        was_redirected: was_redirected || false,
        categories: categories && Array.isArray(categories) ? categories : [],
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to save feedback' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error('Feedback API error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
