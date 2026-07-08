import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const db = await getDb();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Informe e-mail e senha.' }, { status: 400 });
    }

    const profile = await db.profile.findUnique({ where: { email } });

    if (!profile || profile.passwordHash !== password) {
      return NextResponse.json({ error: 'E-mail ou senha não conferem. Que tal tentar novamente?' }, { status: 401 });
    }

    if (profile.status !== 'approved') {
      return NextResponse.json(
        { error: 'Sua conta ainda está em análise. Em breve entraremos em contato.' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: profile.role,
      specialty: profile.specialty,
      status: profile.status,
    });
  } catch (error) {
    console.error('[API /auth]', error)
    return NextResponse.json({ error: 'Algo deu errado. Vamos tentar juntos novamente?' }, { status: 500 });
  }
}