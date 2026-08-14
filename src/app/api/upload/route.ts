import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import prisma from '@/lib/db';
import { checkRateLimit } from '@/lib/rate-limit';

const ALLOWED_EXTENSIONS = new Set(['.pdf', '.jpg', '.jpeg', '.png', '.webp', '.dcm', '.zip']);
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB limit per document

export async function POST(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, 'patient-document-upload', 10, 60 * 1000);
    if (!rateCheck.isAllowed && rateCheck.response) {
      return rateCheck.response;
    }

    const formData = await req.formData().catch(() => null);
    if (!formData) {
      return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
    }

    const file = formData.get('file') as File | null;
    const leadId = formData.get('lead_id') as string | null;
    const bookingId = formData.get('booking_id') as string | null;
    const notes = formData.get('notes') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!leadId) {
      return NextResponse.json({ error: 'Missing patient lead ID' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 15 MB limit' }, { status: 400 });
    }

    const originalName = file.name || 'medical_report.pdf';
    const ext = path.extname(originalName).toLowerCase();

    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { error: 'Invalid file format. Allowed: PDF, JPG, PNG, WEBP, DICOM, ZIP' },
        { status: 400 }
      );
    }

    // Prepare private storage directory outside /public
    const storageDir = path.join(process.cwd(), 'storage', 'medical_documents');
    await fs.mkdir(storageDir, { recursive: true });

    const fileId = crypto.randomUUID();
    const safeFilename = `${fileId}${ext}`;
    const targetFilePath = path.join(storageDir, safeFilename);

    // Write file to disk
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(targetFilePath, buffer);

    // Save record to database
    const docRecord = await prisma.medical_documents.create({
      data: {
        document_id: fileId,
        lead_id: leadId,
        booking_id: bookingId || null,
        file_name: originalName,
        file_path: targetFilePath,
        file_type: file.type || 'application/octet-stream',
        file_size: file.size,
        notes: notes ? notes.substring(0, 1000) : null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        document_id: docRecord.document_id,
        file_name: docRecord.file_name,
        file_size: docRecord.file_size,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[UPLOAD_API] Document upload exception:', error);
    return NextResponse.json({ error: 'Failed to save medical document' }, { status: 500 });
  }
}
