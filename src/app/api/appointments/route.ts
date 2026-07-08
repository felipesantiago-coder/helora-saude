import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const db = await getDb();
    const body = await request.json();
    const {
      serviceId,
      serviceName,
      price,
      patientName,
      patientEmail,
      patientPhone,
      patientCpf,
      patientBirthDate,
      professionalId,
      professionalName,
      appointmentDate,
      appointmentTime,
    } = body;

    if (!serviceId || !patientName || !patientEmail || !professionalId || !appointmentDate || !appointmentTime) {
      return NextResponse.json(
        { error: 'Alguns dados essenciais estão faltando. Vamos preencher juntos?' },
        { status: 400 }
      );
    }

    const appointment = await db.appointment.create({
      data: {
        serviceId,
        serviceName: serviceName || '',
        price: price || 0,
        patientName,
        patientEmail,
        patientPhone: patientPhone || '',
        patientCpf: patientCpf || '',
        patientBirthDate: patientBirthDate || '',
        professionalId,
        professionalName: professionalName || '',
        appointmentDate,
        appointmentTime,
        status: 'confirmed',
      },
    });

    return NextResponse.json({ success: true, appointmentId: appointment.id });
  } catch (error) {
    console.error('[API /appointments POST]', error)
    return NextResponse.json(
      { error: 'Algo deu errado ao criar seu agendamento. Vamos tentar juntos novamente?' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const db = await getDb();
    const appointments = await db.appointment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return NextResponse.json(appointments);
  } catch (error) {
    console.error('[API /appointments GET]', error)
    return NextResponse.json({ error: 'Erro ao buscar agendamentos.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const db = await getDb();
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 });
    }

    const updated = await db.appointment.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[API /appointments PATCH]', error)
    return NextResponse.json({ error: 'Erro ao atualizar agendamento.' }, { status: 500 });
  }
}