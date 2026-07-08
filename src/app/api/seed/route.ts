import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const db = await getDb();
    const ageRanges = [
      { name: 'crianca', label: 'Criança', minAge: 0, maxAge: 11 },
      { name: 'adolescente', label: 'Adolescente', minAge: 12, maxAge: 17 },
      { name: 'jovem_adulto', label: 'Jovem Adulto', minAge: 18, maxAge: 29 },
      { name: 'adulto', label: 'Adulto', minAge: 30, maxAge: 59 },
      { name: 'idoso', label: 'Idoso', minAge: 60, maxAge: 120 },
    ];

    for (const ar of ageRanges) {
      await db.ageRange.upsert({
        where: { name: ar.name },
        update: {},
        create: ar,
      });
    }

    const existingAdmin = await db.profile.findFirst({ where: { role: 'admin' } });
    if (!existingAdmin) {
      const admin = await db.profile.create({
        data: {
          name: 'Administradora Helora',
          email: 'admin@helora.com.br',
          passwordHash: 'helora_admin_2024',
          role: 'admin',
          status: 'approved',
          treatsAllAges: false,
          bio: 'Administração da plataforma Helora.',
        },
      });
    }

    const existingProfs = await db.profile.findMany({ where: { role: 'professional' } });
    if (existingProfs.length === 0) {
      const prof1 = await db.profile.create({
        data: {
          name: 'Dra. Marina Lopes',
          email: 'marina@helora.com.br',
          passwordHash: 'helora_prof_2024',
          role: 'professional',
          specialty: 'Psicologia Clínica',
          status: 'approved',
          treatsAllAges: true,
          bio: 'Acolho você com escuta sensível e presença genuína. Especialista em psicoterapia integrativa.',
        },
      });

      const prof2 = await db.profile.create({
        data: {
          name: 'Dr. André Bastos',
          email: 'andre@helora.com.br',
          passwordHash: 'helora_prof_2024',
          role: 'professional',
          specialty: 'Psicoterapia Corporal',
          status: 'approved',
          treatsAllAges: false,
          bio: 'Trabalho a conexão entre corpo e emoção. Cada sessão é um espaço seguro para se reconectar consigo.',
        },
      });

      const adultoRange = await db.ageRange.findUnique({ where: { name: 'adulto' } });
      const jovemRange = await db.ageRange.findUnique({ where: { name: 'jovem_adulto' } });
      const idosoRange = await db.ageRange.findUnique({ where: { name: 'idoso' } });
      const criancaRange = await db.ageRange.findUnique({ where: { name: 'crianca' } });
      const adolescenteRange = await db.ageRange.findUnique({ where: { name: 'adolescente' } });

      if (adultoRange) {
        await db.professionalAgeRange.create({
          data: { professionalId: prof2.id, ageRangeId: adultoRange.id },
        });
      }
      if (jovemRange) {
        await db.professionalAgeRange.create({
          data: { professionalId: prof2.id, ageRangeId: jovemRange.id },
        });
      }
      if (idosoRange) {
        await db.professionalAgeRange.create({
          data: { professionalId: prof2.id, ageRangeId: idosoRange.id },
        });
      }
      if (criancaRange) {
        await db.professionalAgeRange.create({
          data: { professionalId: prof1.id, ageRangeId: criancaRange.id },
        });
      }
      if (adolescenteRange) {
        await db.professionalAgeRange.create({
          data: { professionalId: prof1.id, ageRangeId: adolescenteRange.id },
        });
      }

      const svc1 = await db.service.create({
        data: {
          name: 'Primeira sessão de cuidado',
          price: 180,
          description: 'Um espaço inicial para se conhecer e entender como posso te acompanhar. Sem pressa, sem compromisso imediato.',
          duration: 50,
        },
      });
      const svc2 = await db.service.create({
        data: {
          name: 'Sessão individual',
          price: 200,
          description: 'Sessão contínua de cuidado, com foco no seu ritmo e nas suas necessidades.',
          duration: 60,
        },
      });
      const svc3 = await db.service.create({
        data: {
          name: 'Sessão de casal',
          price: 300,
          description: 'Um espaço compartilhado para reconstruir laços e fortalecer a conexão.',
          duration: 90,
        },
      });

      await db.professionalService.createMany({
        data: [
          { professionalId: prof1.id, serviceId: svc1.id },
          { professionalId: prof1.id, serviceId: svc2.id },
          { professionalId: prof1.id, serviceId: svc3.id },
          { professionalId: prof2.id, serviceId: svc1.id },
          { professionalId: prof2.id, serviceId: svc2.id },
        ],
      });

      await db.availability.createMany({
        data: [
          { professionalId: prof1.id, dayOfWeek: 1, startTime: '08:00', endTime: '17:00' },
          { professionalId: prof1.id, dayOfWeek: 2, startTime: '08:00', endTime: '17:00' },
          { professionalId: prof1.id, dayOfWeek: 3, startTime: '08:00', endTime: '17:00' },
          { professionalId: prof1.id, dayOfWeek: 4, startTime: '08:00', endTime: '17:00' },
          { professionalId: prof1.id, dayOfWeek: 5, startTime: '08:00', endTime: '12:00' },
          { professionalId: prof2.id, dayOfWeek: 2, startTime: '09:00', endTime: '18:00' },
          { professionalId: prof2.id, dayOfWeek: 3, startTime: '09:00', endTime: '18:00' },
          { professionalId: prof2.id, dayOfWeek: 4, startTime: '14:00', endTime: '20:00' },
          { professionalId: prof2.id, dayOfWeek: 5, startTime: '09:00', endTime: '18:00' },
        ],
      });
    }

    return NextResponse.json({ success: true, message: 'Dados iniciais criados com sucesso.' });
  } catch (error) {
    console.error('[API /seed POST]', error)
    return NextResponse.json({ success: false, error: 'Erro ao criar dados iniciais.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = await getDb();
    const ageRanges = await db.ageRange.findMany();
    const profiles = await db.profile.findMany();
    const services = await db.service.findMany();
    const appointments = await db.appointment.count();
    return NextResponse.json({ ageRanges, profiles, services, appointmentCount: appointments });
  } catch (error) {
    console.error('[API /seed GET]', error)
    return NextResponse.json({ error: 'Erro ao consultar dados.' }, { status: 500 });
  }
}