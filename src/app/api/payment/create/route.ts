import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { createPayment, getPixQrCode } from '@/lib/asaas'
import { publishEvent } from '@/lib/ably-server'

export async function POST(request: NextRequest) {
  try {
    const db = await getDb()
    const body = await request.json()
    const { appointmentId, billingType, installmentCount, creditCardToken } =
      body as {
        appointmentId?: string
        billingType?: string
        installmentCount?: number
        creditCardToken?: string
      }

    if (!appointmentId || typeof appointmentId !== 'string') {
      return NextResponse.json(
        { error: 'appointmentId is required.' },
        { status: 400 }
      )
    }

    if (!billingType || typeof billingType !== 'string') {
      return NextResponse.json(
        { error: 'billingType is required.' },
        { status: 400 }
      )
    }

    const validBillingTypes = ['PIX', 'BOLETO', 'CREDIT_CARD']
    if (!validBillingTypes.includes(billingType)) {
      return NextResponse.json(
        {
          error: `billingType must be one of: ${validBillingTypes.join(', ')}`,
        },
        { status: 400 }
      )
    }

    // Look up the appointment
    const appointment = await db.appointment.findUnique({
      where: { id: appointmentId },
    })

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found.' },
        { status: 404 }
      )
    }

    // Create the payment (createPayment handles customer creation internally)
    const payment = await createPayment({
      customerName: appointment.patientName,
      customerEmail: appointment.patientEmail,
      customerCpf: appointment.patientCpf,
      customerPhone: appointment.patientPhone,
      value: appointment.price,
      description: `Sessão: ${appointment.serviceName} — ${appointment.professionalName}`,
      externalReference: appointment.id,
      dueDate: appointment.appointmentDate,
      billingType: billingType as 'PIX' | 'CREDIT_CARD' | 'BOLETO',
      installmentCount,
      creditCardToken,
    })

    let pixQrCode: string | null = null
    let pixPayload: string | null = null

    // If PIX, fetch the QR code
    if (billingType === 'PIX' && payment.id) {
      try {
        const pix = await getPixQrCode(payment.id)
        pixQrCode = pix.encodedImage ?? null
        pixPayload = pix.payload ?? null
      } catch (pixError) {
        console.error('[Payment] Failed to fetch PIX QR code:', pixError)
      }
    }

    // Update appointment with payment info
    await db.appointment.update({
      where: { id: appointmentId },
      data: {
        paymentId: payment.id,
        paymentStatus: payment.status ?? 'PENDING',
        paymentType: billingType,
        invoiceUrl: payment.invoiceUrl ?? null,
        pixQrCode,
        pixPayload,
      },
    })

    // Publish realtime event
    await publishEvent('appointments', 'payment-created', {
      appointmentId,
      paymentStatus: payment.status ?? 'PENDING',
    })

    return NextResponse.json(
      {
        paymentId: payment.id,
        paymentStatus: payment.status,
        billingType,
        invoiceUrl: payment.invoiceUrl ?? null,
        pixQrCode,
        pixPayload,
        dueDate: payment.dueDate,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[Payment] Failed to create payment:', error)
    return NextResponse.json(
      { error: 'Failed to create payment.' },
      { status: 500 }
    )
  }
}