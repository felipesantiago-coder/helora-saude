import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const professionalId = searchParams.get('professionalId');

    if (!professionalId) {
      return NextResponse.json({ error: 'Profissional é necessário.' }, { status: 400 });
    }

    const availability = await db.availability.findMany({
      where: { professionalId, active: true },
      select: { dayOfWeek: true, startTime: true, endTime: true },
    });

    const dayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

    const result = availability.map((a) => ({
      dayOfWeek: a.dayOfWeek,
      dayName: dayNames[a.dayOfWeek],
      startTime: a.startTime,
      endTime: a.endTime,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('[API /availability]', error)
    return NextResponse.json({ error: 'Erro ao buscar disponibilidade.' }, { status: 500 });
  }
}