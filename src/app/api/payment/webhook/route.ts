import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { publishEvent } from '@/lib/ably-server'
import { sendAppointmentConfirmation } from '@/lib/brevo'

export async function POST(request: NextRequest) {
  try {
    const db = await getDb()
    const body = await request.json()
    const { event, payment } = body as {
      event?: string
      payment?: {
        id?: string
        externalReference?: string
        status?: string
        [key: string]: unknown
      }
    }

    if (!payment?.externalReference) {
      console.warn('[Webhook] Missing externalReference in payment payload.')
      return NextResponse.json({ received: true }, { status: 200 })
    }

    const appointmentId = payment.externalReference
    const paymentStatus = payment.status ?? 'UNKNOWN'

    // Look up the appointment
    const appointment = await db.appointment.findUnique({
      where: { id: appointmentId },
    })

    if (!appointment) {
      console.warn(`[Webhook] Appointment ${appointmentId} not found.`)
      return NextResponse.json({ received: true }, { status: 200 })
    }

    // Determine new appointment status
    const isPaid = paymentStatus === 'RECEIVED' || paymentStatus === 'CONFIRMED'
    const newAppointmentStatus = isPaid ? 'confirmed' : undefined

    // Build update data
    const updateData: Record<string, unknown> = {
      paymentStatus,
      paymentId: payment.id ?? appointment.paymentId,
    }

    if (newAppointmentStatus) {
      updateData.status = newAppointmentStatus
    }

    // Update the appointment
    await db.appointment.update({
      where: { id: appointmentId },
      data: updateData,
    })

    // Publish realtime event
    await publishEvent('appointments', 'payment-updated', {
      appointmentId,
      paymentStatus,
    })

    // Send confirmation email if payment confirmed
    if (isPaid) {
      try {
        await sendAppointmentConfirmation({
          patientName: appointment.patientName,
          patientEmail: appointment.patientEmail,
          professionalName: appointment.professionalName,
          serviceName: appointment.serviceName,
          date: appointment.appointmentDate,
          time: appointment.appointmentTime,
        })
      } catch (emailError) {
        console.error('[Webhook] Failed to send confirmation email:', emailError)
      }
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    // Always return 200 so Asaas doesn't retry
    console.error('[Webhook] Error processing payment webhook:', error)
    return NextResponse.json({ received: true }, { status: 200 })
  }
}