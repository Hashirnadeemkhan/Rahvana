// API Route: Upload Document
// POST /api/documents/upload

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  generateStandardizedFilename,
  isValidFileType,
  isValidFileSize,
  getFileExtension,
} from '@/lib/document-vault/file-utils';
import { DocumentFileManager } from '@/lib/document-vault/storage-server';
import {
  generateDocumentId,
  getNextVersionNumber,
} from '@/lib/document-vault/storage-client';
import { DocumentDatabaseStorage } from '@/lib/document-vault/storage-database';
import { calculateExpirationDate } from '@/lib/document-vault/expiration-tracker';
import { ALL_DOCUMENTS } from '@/lib/document-vault/document-definitions';
import { UploadedDocument, DocumentRole } from '@/lib/document-vault/types';

// NVC/USCIS file size limit (4MB)
const NVC_FILE_SIZE_LIMIT = 4 * 1024 * 1024;
// Python backend URL for PDF compression
const COMPRESSION_API_URL = process.env.COMPRESSION_API_URL || 'http://localhost:8000';

/**
 * Compress PDF file using Python backend
 */
async function compressPdf(buffer: Buffer, filename: string): Promise<{ success: boolean; buffer?: Buffer; error?: string }> {
  try {
    const formData = new FormData();
    const blob = new Blob([new Uint8Array(buffer)], { type: 'application/pdf' });
    formData.append('file', blob, filename);

    const response = await fetch(`${COMPRESSION_API_URL}/api/v1/compress`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Compression failed' }));
      return { success: false, error: errorData.detail || 'Compression failed' };
    }

    const compressedBlob = await response.blob();
    const compressedBuffer = Buffer.from(await compressedBlob.arrayBuffer());

    return { success: true, buffer: compressedBuffer };
  } catch (error) {
    console.error('PDF compression error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Compression failed' };
  }
}

export async function POST(request: NextRequest) {
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

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const documentDefId = formData.get('documentDefId') as string;
    const role = formData.get('role') as DocumentRole;
    const personName = formData.get('personName') as string;
    const caseId = formData.get('caseId') as string | undefined;
    const expirationDateStr = formData.get('expirationDate') as string | undefined;
    const notes = formData.get('notes') as string | undefined;

    // Validate required fields
    if (!file || !documentDefId || !role || !personName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate file type
    const fileTypeValidation = isValidFileType(file.name, file.type);
    if (!fileTypeValidation.valid) {
      return NextResponse.json(
        { error: fileTypeValidation.message },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    const fileSizeValidation = isValidFileSize(file.size, 10);
    if (!fileSizeValidation.valid) {
      return NextResponse.json(
        { error: fileSizeValidation.message },
        { status: 400 }
      );
    }

    // Find document definition
    const documentDef = ALL_DOCUMENTS.find((d) => d.id === documentDefId);
    if (!documentDef) {
      return NextResponse.json(
        { error: 'Invalid document definition' },
        { status: 400 }
      );
    }

    // Get existing documents for this definition
    const dbStorage = new DocumentDatabaseStorage(supabase);
    const existingDocs = await dbStorage.getDocumentsByDefId(documentDefId, user.id);
    const version = getNextVersionNumber(existingDocs);

    // Generate standardized filename
    const extension = getFileExtension(file.name, file.type);
    const standardizedFilename = generateStandardizedFilename({
      caseId,
      role,
      personName,
      docKey: documentDef.key,
      date: new Date(),
      version,
      originalExtension: extension,
    });

    // Generate document ID
    const documentId = generateDocumentId();

    // Save file to local filesystem
    const fileManager = new DocumentFileManager();
    const buffer = Buffer.from(await file.arrayBuffer());
    const saveResult = await fileManager.saveFile(
      buffer,
      user.id,
      documentId,
      standardizedFilename
    );

    if (!saveResult.success) {
      return NextResponse.json(
        { error: saveResult.error || 'Failed to save file' },
        { status: 500 }
      );
    }

    // Auto-compress PDF files larger than 4MB (NVC/USCIS requirement)
    let hasCompressedVersion = false;
    let compressedFilename: string | undefined;
    let compressedFileSize: number | undefined;
    let compressedStoragePath: string | undefined;

    const isPdf = file.type === 'application/pdf';
    const needsCompression = file.size > NVC_FILE_SIZE_LIMIT && isPdf;

    if (needsCompression) {
      console.log(`File ${file.name} is ${(file.size / 1024 / 1024).toFixed(2)}MB - auto-compressing for NVC/USCIS compliance...`);
      console.log(`Calling compression API at: ${COMPRESSION_API_URL}/api/v1/compress`);

      const compressionResult = await compressPdf(buffer, file.name);

      if (compressionResult.success && compressionResult.buffer) {
        // Only save compressed version if it's actually smaller
        const compressedSize = compressionResult.buffer.length;

        if (compressedSize < file.size) {
          // Generate compressed filename
          compressedFilename = standardizedFilename.replace(/\.pdf$/i, '_COMPRESSED.pdf');

          // Save compressed file
          const compressedSaveResult = await fileManager.saveFile(
            compressionResult.buffer,
            user.id,
            documentId,
            compressedFilename
          );

          if (compressedSaveResult.success) {
            hasCompressedVersion = true;
            compressedFileSize = compressedSize;
            compressedStoragePath = compressedSaveResult.storagePath;

            console.log(`Compression successful: ${(file.size / 1024 / 1024).toFixed(2)}MB -> ${(compressedSize / 1024 / 1024).toFixed(2)}MB (${((1 - compressedSize / file.size) * 100).toFixed(1)}% reduction)`);
          } else {
            console.error('Failed to save compressed file:', compressedSaveResult.error);
          }
        } else {
          console.log('Compressed file is not smaller than original, skipping compressed version');
        }
      } else {
        console.error('PDF compression failed:', compressionResult.error);
        console.error('Make sure Python backend is running at:', COMPRESSION_API_URL);
        // Continue without compressed version - original will still be saved
      }
    }

    // Calculate expiration date
    const uploadDate = new Date();
    const expirationDate = expirationDateStr
      ? new Date(expirationDateStr)
      : calculateExpirationDate(documentDef, uploadDate);

    // Create document metadata
    const uploadedDocument: UploadedDocument = {
      id: documentId,
      userId: user.id,
      documentDefId,
      originalFilename: file.name,
      standardizedFilename,
      fileSize: file.size,
      mimeType: file.type,
      storagePath: saveResult.storagePath!,
      // Compressed file info
      hasCompressedVersion,
      compressedFilename,
      compressedFileSize,
      compressedStoragePath,
      // Metadata
      uploadedAt: uploadDate,
      uploadedBy: role,
      version,
      expirationDate,
      isExpired: false,
      status: 'UPLOADED',
      notes,
    };

    // Save document metadata to database
    const savedDocument = await dbStorage.saveDocument(uploadedDocument);

    return NextResponse.json({
      success: true,
      document: savedDocument,
      message: 'Document uploaded successfully',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
