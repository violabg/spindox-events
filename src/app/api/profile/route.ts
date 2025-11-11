import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { ageRange = null, companyName = null, jobTitle = null, firstName = null, lastName = null, name = null } = body;

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ageRange: ageRange || null,
        companyName: companyName || null,
        jobTitle: jobTitle || null,
        firstName: firstName || null,
        lastName: lastName || null,
        name: name,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error updating profile', err);
    return NextResponse.json({ success: false, error: 'Failed to update profile' }, { status: 500 });
  }
}
