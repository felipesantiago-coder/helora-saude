import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { sendAppointmentReminder } from '@/lib/brevo'

// ---------------------------------------------------------------------------
// Security
// ---------------------------------------------------------------------------

/**
 * Verifies the caller is an authorised cron service.
 *
 * The cron-job.org free tier lets you set a custom HTTP header on each
 * request.  We check `x-cron-secret` header (preferred) and fall back to
 * a `?secret=` query parameter for services that only support URL params.
 *
 * If CRON_SECRET is not configured, the endpoint is disabled entirely
 * (returns 503) so it cannot be abused in development.
 */
function isAuthorised(request: NextRequest): boolean {
  const expected = process.env.CRON_SECRET
  if (!expected) return false

  // Header takes priority
  const headerSecret = request.headers.get('x-cron-secret')
  if (headerSecret) return headerSecret === expected

  // Query param fallback
  const url = new URL(request.url)
  const querySecret = url.searchParams.get('secret')
  if (querySecret) return querySecret === expected

  return false
}

// ---------------------------------------------------------------------------
// Date helpers  (America/Sao_Paulo / UTC-3)
// ---------------------------------------------------------------------------

function getTomorrowDateString(): string {
  const now = new Date()

  // Convert to America/Sao_Paulo timezone
  const sp = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)

  // "en-CA" gives "YYYY-MM-DD". Parse and add 1 day.
  const [y, m, d] = sp.split('-').map(Number)
  const tomorrow = new Date(y, m - 1, d + 1)

  const ty = tomorrow.getFullYear()
  const tm = String(tomorrow.getMonth() + 1).padStart(2, '0')
  const td = String(tomorrow.getDate()).padStart(2, '0')

  return `${ty}-${tm}-${td}`
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  // --- Auth guard ---------------------------------------------------------
  if (!process.env.CRON_SECRET) {
    return NextResponse.json(
      { error: 'CRON_SECRET is not configured. Reminder cron is disabled.' },
      { status: 503 },
    )
  }

  if (!isAuthorised(request)) {
    return NextResponse.json(
      { error: 'Unauthorised.' },
      { status: 401 },
    )
  }

  // --- Brevo check --------------------------------------------------------
  if (
    !process.env.BREVO_SMTP_USER ||
    !process.env.BREVO_SMTP_PASS ||
    !process.env.BREVO_FROM_EMAIL
  ) {
    return NextResponse.json(
      { error: 'Brevo SMTP is not configured. Cannot send reminders.' },
      { status: 503 },
    )
  }

  try {
    const db = await getDb()
    const tomorrow = getTomorrowDateString()

    // Find appointments happening tomorrow that still need a reminder
    const appointments = await db.appointment.findMany({
      where: {
        appointmentDate: tomorrow,
        reminderSent: false,
        status: {
          in: ['pending', 'confirmed'],
        },
      },
    })

    if (appointments.length === 0) {
      return NextResponse.json({
        ok: true,
        message: 'No pending reminders.',
        date: tomorrow,
        processed: 0,
      })
    }

    let sent = 0
    let failed = 0

    for (const appointment of appointments) {
      try {
        await sendAppointmentReminder({
          patientName: appointment.patientName,
          patientEmail: appointment.patientEmail,
          professionalName: appointment.professionalName,
          serviceName: appointment.serviceName,
          date: appointment.appointmentDate,
          time: appointment.appointmentTime,
        })

        // Mark as sent (even if Brevo silently skipped it,
        // we don't want to retry endlessly)
        await db.appointment.update({
          where: { id: appointment.id },
          data: {
            reminderSent: true,
            reminderSentAt: new Date(),
          },
        })

        sent++
      } catch (err) {
        console.error(
          `[Cron] Failed to send reminder for appointment ${appointment.id}:`,
          err,
        )
        failed++
      }
    }

    return NextResponse.json({
      ok: true,
      date: tomorrow,
      total: appointments.length,
      sent,
      failed,
    })
  } catch (error) {
    console.error('[Cron] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 },
    )
  }
}