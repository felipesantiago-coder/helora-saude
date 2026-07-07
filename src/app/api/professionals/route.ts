import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

function calculateAge(birthDateStr: string): number {
  const today = new Date();
  const birth = new Date(birthDateStr + 'T12:00:00');
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get('serviceId');
    const birthDate = searchParams.get('birthDate');

    if (serviceId) {
      const professionals = await db.professionalService
        .findMany({
          where: { serviceId },
          include: {
            professional: {
              select: {
                id: true,
                name: true,
                specialty: true,
                bio: true,
                treatsAllAges: true,
                status: true,
              },
            },
          },
        })
        .then((ps) =>
          ps
            .filter((p) => p.professional.status === 'approved')
            .map((p) => p.professional)
        );

      let filtered = professionals;

      if (birthDate) {
        const age = calculateAge(birthDate);
        const allAgeRanges = await db.ageRange.findMany();
        const matchingRange = allAgeRanges.find((ar) => age >= ar.minAge && age <= ar.maxAge);

        if (matchingRange) {
          const profAgeRanges = await db.professionalAgeRange.findMany({
            where: { ageRangeId: matchingRange.id },
            select: { professionalId: true },
          });
          const profIdsInRange = new Set(profAgeRanges.map((p) => p.professionalId));
          filtered = professionals.filter((p) => p.treatsAllAges || profIdsInRange.has(p.id));
        }
      }

      return NextResponse.json(filtered);
    }

    const showAll = searchParams.get('all') === 'true';
    const profiles = await db.profile.findMany({
      where: { role: 'professional', ...(showAll ? {} : { status: 'approved' }) },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(profiles);
  } catch {
    return NextResponse.json({ error: 'Erro ao buscar profissionais.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 });
    }

    const db = await getDb();
    const updated = await db.profile.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Erro ao atualizar profissional.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await getDb();
    const { name, email, password, specialty, treatsAllAges, ageRangeIds } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Nome, e-mail e senha são necessários.' }, { status: 400 });
    }

    const existing = await db.profile.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Este e-mail já está cadastrado.' }, { status: 409 });
    }

    const profile = await db.profile.create({
      data: {
        name,
        email,
        passwordHash: password,
        role: 'professional',
        specialty: specialty || '',
        status: 'pending',
        treatsAllAges: treatsAllAges || false,
      },
    });

    if (ageRangeIds && ageRangeIds.length > 0) {
      await db.professionalAgeRange.createMany({
        data: ageRangeIds.map((ageRangeId: string) => ({
          professionalId: profile.id,
          ageRangeId,
        })),
      });
    }

    return NextResponse.json(profile, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Erro ao criar profissional.' }, { status: 500 });
  }
}