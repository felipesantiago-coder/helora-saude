import { NextRequest, NextResponse } from 'next/server'
import {
  sendEmail,
  sendAppointmentConfirmation,
  sendAppointmentReminder,
} from '@/lib/brevo'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (body.type) {
      const { type, data } = body as {
        type: 'appointment-confirmation' | 'appointment-reminder'
        data: {
          patientName: string
          patientEmail: string
          professionalName: string
          serviceName: string
          date: string
          time: string
        }
      }

      if (
        !data?.patientEmail ||
        !data?.patientName ||
        !data?.professionalName ||
        !data?.serviceName ||
        !data?.date ||
        !data?.time
      ) {
        return NextResponse.json(
          { error: 'Missing required fields in data.' },
          { status: 400 }
        )
      }

      if (type === 'appointment-confirmation') {
        await sendAppointmentConfirmation(data)
      } else if (type === 'appointment-reminder') {
        await sendAppointmentReminder(data)
      } else {
        return NextResponse.json(
          { error: `Unknown email type: ${type}` },
          { status: 400 }
        )
      }
    } else {
      const { to, subject, html } = body as {
        to?: string
        subject?: string
        html?: string
      }

      if (!to || typeof to !== 'string') {
        return NextResponse.json(
          { error: 'to is required and must be a string.' },
          { status: 400 }
        )
      }

      if (!subject || typeof subject !== 'string') {
        return NextResponse.json(
          { error: 'subject is required and must be a string.' },
          { status: 400 }
        )
      }

      if (!html || typeof html !== 'string') {
        return NextResponse.json(
          { error: 'html is required and must be a string.' },
          { status: 400 }
        )
      }

      await sendEmail(to, subject, html)
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('[Email] Failed to send email:', error)
    return NextResponse.json(
      { error: 'Failed to send email.' },
      { status: 500 }
    )
  }
}