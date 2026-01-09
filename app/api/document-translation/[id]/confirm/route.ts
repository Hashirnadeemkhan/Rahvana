// POST /api/translation/[id]/confirm
// User accepts the translation

import { NextRequest, NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

function getStorageSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase credentials not configured');
  }
  return createSupabaseClient(supabaseUrl, serviceRoleKey);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getStorageSupabase();

    // Check if document exists and is in TRANSLATED state
    const { data: existing, error: checkError } = await supabase
      .from('translation_documents')
      .select('status, translated_file_path')
      .eq('id', id)
      .single();

    if (checkError || !existing) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    if (existing.status !== 'TRANSLATED') {
      return NextResponse.json(
        { error: `Cannot confirm. Current status: ${existing.status}. Must be TRANSLATED.` },
        { status: 400 }
      );
    }

    if (!existing.translated_file_path) {
      return NextResponse.json(
        { error: 'No translated file available' },
        { status: 400 }
      );
    }

    // Update status to USER_CONFIRMED
    const { data: updated, error: updateError } = await supabase
      .from('translation_documents')
      .update({
        status: 'USER_CONFIRMED',
        user_confirmed_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to confirm translation' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      status: updated.status,
      message: 'Translation confirmed successfully. Awaiting admin verification.',
    });
  } catch (error) {
    console.error('Confirm error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}