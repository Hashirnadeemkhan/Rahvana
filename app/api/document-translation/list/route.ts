// GET /api/translation/list?userEmail=user@example.com&limit=50&offset=0
// User lists their own documents
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('userEmail');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!userEmail) {
      return NextResponse.json(
        { error: 'userEmail parameter is required' },
        { status: 400 }
      );
    }

    const supabase = getStorageSupabase();

    const { data: documents, error, count } = await supabase
      .from('translation_documents')
      .select('*', { count: 'exact' })
      .eq('user_email', userEmail)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Query error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch documents' },
        { status: 500 }
      );
    }

    // Generate signed URLs for files
    const documentsWithUrls = await Promise.all(
      documents.map(async (doc) => {
        let originalFileUrl = null;
        let translatedFileUrl = null;

        if (doc.original_file_path) {
          const { data: originalUrl } = await supabase.storage
            .from('document-vault')
            .createSignedUrl(doc.original_file_path, 3600);
          originalFileUrl = originalUrl?.signedUrl;
        }

        if (doc.translated_file_path) {
          const { data: translatedUrl } = await supabase.storage
            .from('document-vault')
            .createSignedUrl(doc.translated_file_path, 3600);
          translatedFileUrl = translatedUrl?.signedUrl;
        }

        return {
          ...doc,
          originalFileUrl,
          translatedFileUrl,
        };
      })
    );

    return NextResponse.json({
      documents: documentsWithUrls,
      total: count || 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error('List documents error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}