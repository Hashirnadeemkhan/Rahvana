// API Route: Download Document
// GET /api/documents/[id]/download
// Uses Supabase Storage (works on BOTH local AND Vercel)

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { DocumentDatabaseStorage } from '@/lib/document-vault/storage-database';
import { createClient as createClientJs } from '@supabase/supabase-js';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get document metadata
    const dbStorage = new DocumentDatabaseStorage(supabase);
    const document = await dbStorage.getDocument(id, user.id);

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Get signed URL from Supabase Storage (using service role)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const storageSupabase = createClientJs(supabaseUrl!, serviceRoleKey!);

    const { data, error } = await storageSupabase.storage
      .from('document-vault')
      .createSignedUrl(document.storagePath, 3600);

    if (error || !data) {
      // Fallback to public URL
      const publicUrl = `${supabaseUrl}/storage/v1/object/public/document-vault/${document.storagePath}`;
      return NextResponse.redirect(publicUrl);
    }

    // Redirect to signed URL
    return NextResponse.redirect(data.signedUrl);
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
