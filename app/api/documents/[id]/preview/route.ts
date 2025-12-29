// API Route: Preview Document
// GET /api/documents/[id]/preview

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { DocumentFileManager } from '@/lib/document-vault/storage-server';
import { DocumentDatabaseStorage } from '@/lib/document-vault/storage-database';

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
    const documentId = id;

    // Get document metadata
    const dbStorage = new DocumentDatabaseStorage(supabase);
    const document = await dbStorage.getDocument(documentId, user.id);

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Read file from filesystem
    const fileManager = new DocumentFileManager();
    const readResult = await fileManager.readFile(document.storagePath);

    if (!readResult.success || !readResult.buffer) {
      return NextResponse.json(
        { error: readResult.error || 'File not found' },
        { status: 404 }
      );
    }

    // Return file with inline disposition for preview
    return new NextResponse(new Uint8Array(readResult.buffer), {
      status: 200,
      headers: {
        'Content-Type': document.mimeType,
        'Content-Disposition': `inline; filename="${document.standardizedFilename}"`,
        'Content-Length': document.fileSize.toString(),
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Preview error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
