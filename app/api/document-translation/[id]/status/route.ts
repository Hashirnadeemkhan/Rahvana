// GET /api/document-translation/[id]/status
// Get document details by ID
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getStorageSupabase();

    const { data: document, error } = await supabase
      .from('translation_documents')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Generate signed URLs for file download (valid for 1 hour)
    let originalFileUrl = null;
    let translatedFileUrl = null;

    if (document.original_file_path) {
      const { data: originalUrl } = await supabase.storage
        .from('document-vault')
        .createSignedUrl(document.original_file_path, 3600);
      originalFileUrl = originalUrl?.signedUrl;
    }

    if (document.translated_file_path) {
      const { data: translatedUrl } = await supabase.storage
        .from('document-vault')
        .createSignedUrl(document.translated_file_path, 3600);
      translatedFileUrl = translatedUrl?.signedUrl;
    }

    return NextResponse.json({
      ...document,
      originalFileUrl,
      translatedFileUrl,
    });
  } catch (error) {
    console.error('Get document error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}