import { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() { return []; },
          setAll() {}
        }
      }
    );

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return Response.json({ error: 'Missing userId' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('visa_security_questions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows found"
      console.error('Error fetching security questions:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ data: data || null });
  } catch (error) {
    console.error('Unexpected error fetching security questions:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() { return []; },
          setAll() {}
        }
      }
    );

    const body = await req.json();
    const { userId, questions, portalUsername } = body;

    if (!userId || !questions) {
      return Response.json({ error: 'Missing userId or questions' }, { status: 400 });
    }

    // Upsert security questions
    const { data, error } = await supabase
      .from('visa_security_questions')
      .upsert({
        user_id: userId,
        portal_username: portalUsername,
        question_1: questions.q1,
        answer_1: questions.a1,
        question_2: questions.q2,
        answer_2: questions.a2,
        question_3: questions.q3,
        answer_3: questions.a3,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving security questions:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ data });
  } catch (error) {
    console.error('Unexpected error saving security questions:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
