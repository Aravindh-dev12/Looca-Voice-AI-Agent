import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/user/mode - Switch between personal and company mode
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { mode, organizationId } = body;

    if (!mode || !['personal', 'company'].includes(mode)) {
      return NextResponse.json(
        { error: 'Invalid mode. Must be "personal" or "company"' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        members: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // If switching to company mode, verify they have access
    if (mode === 'company') {
      const targetOrgId = organizationId || user.activeOrgId;
      
      if (!targetOrgId) {
        return NextResponse.json(
          { error: 'No organization specified' },
          { status: 400 }
        );
      }

      const hasAccess = user.members.some(m => m.organizationId === targetOrgId);
      if (!hasAccess) {
        return NextResponse.json(
          { error: 'You do not have access to this organization' },
          { status: 403 }
        );
      }

      // Update user's mode and active org
      await prisma.user.update({
        where: { id: user.id },
        data: {
          mode: 'company',
          activeOrgId: targetOrgId,
        },
      });

      return NextResponse.json({
        success: true,
        mode: 'company',
        organizationId: targetOrgId,
        redirectUrl: '/company/dashboard',
      });
    }

    // Switch to personal mode
    await prisma.user.update({
      where: { id: user.id },
      data: {
        mode: 'personal',
        activeOrgId: null,
      },
    });

    return NextResponse.json({
      success: true,
      mode: 'personal',
      redirectUrl: '/dashboard',
    });

  } catch (error) {
    console.error('Mode switch error:', error);
    return NextResponse.json(
      { error: 'Failed to switch mode' },
      { status: 500 }
    );
  }
}

// GET /api/user/mode - Get current mode and available organizations
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        mode: true,
        activeOrgId: true,
        members: {
          select: {
            role: true,
            organization: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      mode: user.mode,
      activeOrgId: user.activeOrgId,
      organizations: user.members.map(m => ({
        id: m.organization.id,
        name: m.organization.name,
        slug: m.organization.slug,
        role: m.role,
      })),
      hasCompanyAccess: user.members.length > 0,
    });

  } catch (error) {
    console.error('Get mode error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mode' },
      { status: 500 }
    );
  }
}
