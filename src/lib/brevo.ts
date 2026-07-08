import nodemailer from 'nodemailer'

// ---------------------------------------------------------------------------
// Brand colors & constants
// ---------------------------------------------------------------------------

const BRAND = {
  darkGreen: '#283106',
  sage: '#777F5C',
  sienna: '#9C6146',
  white: '#FFFFFF',
  antiqueWhite: '#EBE6CC',
  darkCoffee: '#2C241C',
} as const

const LOGO_MARK = `Hel<span style="color:${BRAND.sienna}">o</span>ra`

// ---------------------------------------------------------------------------
// Transporter
// ---------------------------------------------------------------------------

type Transporter = nodemailer.Transporter

let _transporter: Transporter | null = null

function isConfigured(): boolean {
  return !!(
    process.env.BREVO_SMTP_USER &&
    process.env.BREVO_SMTP_PASS &&
    process.env.BREVO_FROM_EMAIL
  )
}

function getTransporter(): Transporter {
  if (_transporter) return _transporter

  if (!isConfigured()) {
    throw new Error(
      '[Brevo] SMTP credentials not configured. ' +
      'Set BREVO_SMTP_USER, BREVO_SMTP_PASS, and BREVO_FROM_EMAIL.'
    )
  }

  _transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false, // STARTTLS
    auth: {
      user: process.env.BREVO_SMTP_USER,
      pass: process.env.BREVO_SMTP_PASS,
    },
  })

  return _transporter
}

// ---------------------------------------------------------------------------
// Generic send
// ---------------------------------------------------------------------------

/**
 * Sends an HTML email via Brevo (SMTP).
 *
 * If Brevo credentials are not configured the call is silently skipped
 * with a `console.warn` — this allows the app to run without email in
 * development.
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
): Promise<void> {
  if (!isConfigured()) {
    console.warn(
      '[Brevo] Skipping email — SMTP not configured. ' +
      `Would have sent to ${to} with subject "${subject}".`
    )
    return
  }

  const transporter = getTransporter()

  await transporter.sendMail({
    from: process.env.BREVO_FROM_NAME
      ? `"${process.env.BREVO_FROM_NAME}" <${process.env.BREVO_FROM_EMAIL}>`
      : process.env.BREVO_FROM_EMAIL!,
    to,
    subject,
    html,
  })
}

// ---------------------------------------------------------------------------
// HTML templates
// ---------------------------------------------------------------------------

function emailShell(innerHtml: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Helora</title>
</head>
<body style="margin:0; padding:0; background-color:${BRAND.antiqueWhite}; font-family:'Inter',Arial,Helvetica,sans-serif; -webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.antiqueWhite}; padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%;">
          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <span style="font-family:Georgia,'Times New Roman',serif; font-size:32px; color:${BRAND.darkGreen}; font-weight:700; letter-spacing:-0.5px;">
                Hel<span style="color:${BRAND.sienna};">o</span>ra
              </span>
            </td>
          </tr>
          <!-- Card -->
          <tr>
            <td>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.white}; border-radius:16px; box-shadow:0 2px 12px rgba(0,0,0,0.04); overflow:hidden;">
                <tr>
                  <td style="padding:40px 32px; border-top:3px solid ${BRAND.sage};">
                    ${innerHtml}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:24px; padding-bottom:8px;">
              <p style="margin:0; font-size:12px; color:${BRAND.sage}; line-height:1.6;">
                Cuidar é a nossa essência.<br />
                <span style="opacity:0.7;">Este e-mail foi enviado automaticamente pela Helora.</span>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function detailRow(label: string, value: string): string {
  return `
  <tr>
    <td style="padding:8px 0; border-bottom:1px solid ${BRAND.antiqueWhite};">
      <span style="font-size:12px; text-transform:uppercase; letter-spacing:0.5px; color:${BRAND.sage}; font-weight:600;">${label}</span><br />
      <span style="font-size:15px; color:${BRAND.darkCoffee}; margin-top:2px; display:inline-block;">${value}</span>
    </td>
  </tr>`
}

// ---------------------------------------------------------------------------
// Appointment Confirmation
// ---------------------------------------------------------------------------

export interface AppointmentEmailData {
  patientName: string
  patientEmail: string
  professionalName: string
  serviceName: string
  date: string
  time: string
}

/**
 * Sends a branded appointment confirmation email.
 */
export async function sendAppointmentConfirmation(
  data: AppointmentEmailData,
): Promise<void> {
  const innerHtml = `
  <p style="margin:0 0 24px 0; font-size:22px; font-family:Georgia,'Times New Roman',serif; color:${BRAND.darkGreen}; font-weight:700;">
    Sessão confirmada ✦
  </p>

  <p style="margin:0 0 8px 0; font-size:15px; color:${BRAND.darkCoffee}; line-height:1.7;">
    Olá, <strong>${data.patientName}</strong>! Sua sessão foi agendada com sucesso.
  </p>

  <p style="margin:0 0 28px 0; font-size:14px; color:${BRAND.sage}; line-height:1.6;">
    Estamos felizes em te receber. Aqui estão os detalhes da sua sessão:
  </p>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    ${detailRow('Profissional', data.professionalName)}
    ${detailRow('Serviço', data.serviceName)}
    ${detailRow('Data', data.date)}
    ${detailRow('Horário', data.time)}
  </table>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;">
    <tr>
      <td style="background-color:${BRAND.darkGreen}; border-radius:8px; padding:14px 24px; text-align:center;">
        <span style="color:${BRAND.white}; font-size:14px; font-weight:600; letter-spacing:0.3px;">
          ${data.date} &middot; ${data.time}
        </span>
      </td>
    </tr>
  </table>

  <p style="margin:28px 0 0 0; font-size:14px; color:${BRAND.darkCoffee}; line-height:1.7;">
    Se precisar reagendar, entre em contato conosco com antecedência.<br />
    Estamos aqui para cuidar de você. 🌿
  </p>
  `

  await sendEmail(
    data.patientEmail,
    `Sessão confirmada — ${data.serviceName} com ${data.professionalName}`,
    emailShell(innerHtml),
  )
}

// ---------------------------------------------------------------------------
// Appointment Reminder
// ---------------------------------------------------------------------------

/**
 * Sends a shorter appointment reminder email.
 */
export async function sendAppointmentReminder(
  data: AppointmentEmailData,
): Promise<void> {
  const innerHtml = `
  <p style="margin:0 0 20px 0; font-size:20px; font-family:Georgia,'Times New Roman',serif; color:${BRAND.darkGreen}; font-weight:700;">
    Lembrete de sessão ✦
  </p>

  <p style="margin:0 0 24px 0; font-size:15px; color:${BRAND.darkCoffee}; line-height:1.7;">
    Olá, <strong>${data.patientName}</strong>! Passando para lembrar que sua sessão é amanhã.
  </p>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    ${detailRow('Profissional', data.professionalName)}
    ${detailRow('Serviço', data.serviceName)}
    ${detailRow('Horário', data.time)}
  </table>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
    <tr>
      <td style="background-color:${BRAND.darkGreen}; border-radius:8px; padding:14px 24px; text-align:center;">
        <span style="color:${BRAND.white}; font-size:14px; font-weight:600; letter-spacing:0.3px;">
          ${data.date} &middot; ${data.time}
        </span>
      </td>
    </tr>
  </table>

  <p style="margin:24px 0 0 0; font-size:14px; color:${BRAND.darkCoffee}; line-height:1.7;">
    Até breve! 🌿
  </p>
  `

  await sendEmail(
    data.patientEmail,
    `Lembrete: sua sessão de ${data.serviceName} é amanhã`,
    emailShell(innerHtml),
  )
}