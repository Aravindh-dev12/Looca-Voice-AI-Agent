import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';

// POST /api/organization - Create new organization with enterprise plan
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, industry, email, phone, planId } = body;

    if (!name || !email || !planId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, planId' },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Generate unique slug from company name
    const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
    let slug = baseSlug;
    let counter = 1;
    
    // Ensure unique slug
    while (await prisma.organization.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Generate API key
    const apiKey = `looca_live_${randomBytes(24).toString('hex')}`;

    // Create organization with all related data in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the organization
      const organization = await tx.organization.create({
        data: {
          name,
          slug,
          industry: industry || 'other',
          email,
          phone,
          planId,
          status: 'active',
          voiceNumber: `+91-1800-${Math.floor(1000 + Math.random() * 9000)}`,
          languages: ['en', 'hi', 'ta', 'te', 'kn', 'ml'],
          settings: JSON.stringify({
            autoTranscribe: true,
            emotionDetection: true,
            proactiveInsights: true,
          }),
        },
      });

      // 2. Add user as owner member
      await tx.member.create({
        data: {
          userId: user.id,
          organizationId: organization.id,
          role: 'owner',
        },
      });

      // 3. Create API key for the organization
      await tx.apiKey.create({
        data: {
          name: 'Default Production Key',
          key: apiKey,
          organizationId: organization.id,
          createdById: user.id,
          permissions: ['read', 'write', 'admin'],
        },
      });

      // 4. Update user's active org and mode
      await tx.user.update({
        where: { id: user.id },
        data: {
          activeOrgId: organization.id,
          mode: 'company',
          role: 'enterprise',
        },
      });

      // 5. Create subscription record
      const plan = await tx.plan.findUnique({ where: { id: planId } });
      if (plan) {
        await tx.subscription.create({
          data: {
            userId: user.id,
            planId: plan.id,
            status: 'active',
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          },
        });
      }

      return { organization, apiKey };
    });

    return NextResponse.json({
      success: true,
      organization: {
        id: result.organization.id,
        name: result.organization.name,
        slug: result.organization.slug,
        voiceNumber: result.organization.voiceNumber,
      },
      apiKey: result.apiKey,
      message: 'Organization created successfully. Welcome to Looca Enterprise!',
    });

  } catch (error) {
    console.error('Organization creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create organization' },
      { status: 500 }
    );
  }
}

// GET /api/organization - Get user's organizations
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        members: {
          include: {
            organization: {
              include: {
                plan: true,
                _count: {
                  select: { apiKeys: true, members: true },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const organizations = user.members.map((member) => ({
      id: member.organization.id,
      name: member.organization.name,
      slug: member.organization.slug,
      role: member.role,
      status: member.organization.status,
      plan: member.organization.plan?.name || 'Free',
      stats: {
        apiKeys: member.organization._count.apiKeys,
        members: member.organization._count.members,
      },
    }));

    return NextResponse.json({
      organizations,
      activeOrgId: user.activeOrgId,
      mode: user.mode,
    });

  } catch (error) {
    console.error('Get organizations error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch organizations' },
      { status: 500 }
    );
  }
}
