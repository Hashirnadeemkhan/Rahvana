// POST /api/document-translation/upload
// User uploads original Urdu document for translation
import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Get Supabase client with service role key for storage and database operations
function getStorageSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase credentials not configured");
  }
  return createSupabaseClient(supabaseUrl, serviceRoleKey);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const userEmail = formData.get("userEmail") as string;
    const userName = formData.get("userName") as string;
    const userNotes = formData.get("userNotes") as string | undefined;

    // Validate required fields
    if (!file || !userEmail || !userName) {
      return NextResponse.json(
        { error: "Missing required fields: file, userEmail, userName" },
        { status: 400 }
      );
    }

    // Validate file type (PDF only)
    if (!file.type.includes("pdf")) {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File size exceeds 50MB limit` },
        { status: 400 }
      );
    }

    // Extract document type from file name
    const fileName = file.name;
    const documentType = fileName.split("_")[0].toLowerCase();

    // Validate document type
    const allowedTypes = ["marriage", "birth", "death", "divorce"];
    if (!allowedTypes.includes(documentType)) {
      return NextResponse.json(
        { error: "Invalid document type" },
        { status: 400 }
      );
    }

    const supabase = getStorageSupabase();

    // Generate unique document ID
    const docId = crypto.randomUUID();
    const timestamp = Date.now();
    const storageFileName = `${fileName.split(".")[0]}_${userName}.pdf`;
    const storagePath = `translation-originals/${docId}/${timestamp}_${storageFileName}`;

    // Upload to Supabase Storage
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error: uploadError } = await supabase.storage
      .from("document-vault")
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload file to storage" },
        { status: 500 }
      );
    }

    // Create database record
    const { data: document, error: dbError } = await supabase
      .from("translation_documents")
      .insert({
        id: docId,
        user_email: userEmail,
        user_name: userName,
        document_type: documentType,
        original_file_path: storagePath,
        original_filename: storageFileName,
        original_file_size: file.size,
        original_mime_type: file.type,
        user_notes: userNotes,
        status: "PENDING",
        metadata: {
          upload_ip: request.headers.get("x-forwarded-for") || "unknown",
          user_agent: request.headers.get("user-agent") || "unknown",
        },
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      // Cleanup uploaded file
      await supabase.storage.from("document-vault").remove([storagePath]);
      return NextResponse.json(
        { error: "Failed to create database record" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      documentId: document.id,
      status: document.status,
      message:
        "Document uploaded successfully. Our team will review and upload the english translation shortly.",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
