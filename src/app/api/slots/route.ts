import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const professionalId = searchParams.get('professionalId');
    const date = searchParams.get('date');

    if (!professionalId || !date) {
      return NextResponse.json({ error: 'Profissional e data são necessários.' }, { status: 400 });
    }

    const targetDate = new Date(date + 'T12:00:00');
    const dayOfWeek = targetDate.getDay();

    const availability = await db.availability.findFirst({
      where: {
        professionalId,
        dayOfWeek,
        active: true,
      },
    });

    if (!availability) {
      return NextResponse.json({ slots: [], message: 'Este profissional não atende neste dia.' });
    }

    const [startH, startM] = availability.startTime.split(':').map(Number);
    const [endH, endM] = availability.endTime.split(':').map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    const existingAppointments = await db.appointment.findMany({
      where: {
        professionalId,
        appointmentDate: date,
        status: { in: ['pending', 'confirmed'] },
      },
      select: { appointmentTime: true },
    });

    const bookedTimes = new Set(existingAppointments.map((a) => a.appointmentTime));

    const now = new Date();
    const isToday =
      targetDate.getFullYear() === now.getFullYear() &&
      targetDate.getMonth() === now.getMonth() &&
      targetDate.getDate() === now.getDate();
    const currentMinutes = isToday ? now.getHours() * 60 + now.getMinutes() : 0;

    const slots: string[] = [];
    for (let mins = startMinutes; mins + 60 <= endMinutes; mins += 60) {
      const h = String(Math.floor(mins / 60)).padStart(2, '0');
      const m = String(mins % 60).padStart(2, '0');
      const slot = `${h}:${m}`;

      if (isToday && mins <= currentMinutes) continue;
      if (bookedTimes.has(slot)) continue;
      slots.push(slot);
    }

    return NextResponse.json({ slots, date, professionalId });
  } catch {
    return NextResponse.json({ error: 'Algo deu errado. Vamos tentar juntos novamente?' }, { status: 500 });
  }
}