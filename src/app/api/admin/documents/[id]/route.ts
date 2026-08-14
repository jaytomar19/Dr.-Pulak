import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import { auth } from '@/lib/auth';
import { enforceRole } from '@/lib/rbac';
import prisma from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Authenticate staff/doctor session
    const session = await auth();
    const roleError = enforceRole(session, ['doctor', 'admin', 'staff']);
    if (roleError) return roleError;

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Document ID required' }, { status: 400 });
    }

    // 2. Fetch document record from database
    const doc = await prisma.medical_documents.findUnique({
      where: { document_id: id },
    });

    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // 3. Verify file exists on private disk
    try {
      await fs.access(doc.file_path);
    } catch {
      return NextResponse.json({ error: 'File resource unreadable on disk' }, { status: 404 });
    }

    // 4. Read binary file and return stream
    const fileBuffer = await fs.readFile(doc.file_path);

    const filenameHeader = encodeURIComponent(doc.file_name).replace(/['()]/g, escape);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': doc.file_type || 'application/octet-stream',
        'Content-Length': fileBuffer.length.toString(),
        'Content-Disposition': `inline; filename="${filenameHeader}"`,
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
      },
    });

  } catch (error) {
    console.error('[ADMIN_DOC_API] Exception serving document:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
