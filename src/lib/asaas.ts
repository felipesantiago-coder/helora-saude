// Asaas Payment Service — server-side only
// Uses Asaas REST API v3 via fetch (no SDK dependency)

export interface CreatePaymentParams {
  customerName: string;
  customerEmail: string;
  customerCpf: string;
  customerPhone: string;
  value: number;
  description: string;
  externalReference: string; // appointment ID
  dueDate: string; // YYYY-MM-DD
  billingType: 'PIX' | 'CREDIT_CARD' | 'BOLETO';
  installmentCount?: number; // for credit card
  creditCardToken?: string; // for credit card
}

export interface AsaasPayment {
  id: string;
  status: string; // PENDING, RECEIVED, CONFIRMED, OVERDUE, REFUNDED, etc.
  value: number;
  billingType: string;
  invoiceUrl: string;
  pixQrCode?: string;
  pixEncodedImage?: string;
  bankSlipUrl?: string;
  externalReference: string;
  dueDate: string;
  customer: string; // customer ID in Asaas
}

interface AsaasCustomer {
  id: string;
  name: string;
  email: string;
  cpfCnpj?: string;
  phone?: string;
}

function getBaseUrl(): string {
  const env = process.env.ASAAS_ENV || 'sandbox';
  return env === 'production'
    ? 'https://api.asaas.com/v3'
    : 'https://sandbox.asaas.com/v3';
}

function getApiKey(): string {
  const key = process.env.ASAAS_API_KEY;
  if (!key) {
    throw new Error(
      'ASAAS_API_KEY is not configured. Please set the environment variable to use Asaas payment services.'
    );
  }
  return key;
}

function getHeaders(): HeadersInit {
  return {
    'access_token': getApiKey(),
    'Content-Type': 'application/json',
  };
}

async function asaasFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...(options?.headers as Record<string, string> | undefined),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Asaas API error [${response.status}]: ${body} — ${endpoint}`
    );
  }

  return response.json() as Promise<T>;
}

/**
 * Creates a new customer in Asaas, or returns the existing one if a customer
 * with the given email already exists.
 */
export async function createCustomer(data: {
  name: string;
  email: string;
  cpf?: string;
  phone?: string;
}): Promise<{ id: string }> {
  // Try to find existing customer by email first
  try {
    const searchResponse = await asaasFetch<{
      data: AsaasCustomer[];
      hasMore: boolean;
      total: number;
    }>(`/customers?email=${encodeURIComponent(data.email)}`);

    if (searchResponse.total > 0 && searchResponse.data.length > 0) {
      return { id: searchResponse.data[0].id };
    }
  } catch {
    // If search fails, proceed to create a new customer
  }

  // Create new customer
  const body: Record<string, string> = {
    name: data.name,
    email: data.email,
  };

  if (data.cpf) {
    body.cpfCnpj = data.cpf;
  }

  if (data.phone) {
    body.phone = data.phone;
  }

  const customer = await asaasFetch<AsaasCustomer>('/customers', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return { id: customer.id };
}

/**
 * Creates a payment charge in Asaas.
 */
export async function createPayment(
  params: CreatePaymentParams
): Promise<AsaasPayment> {
  // First, ensure the customer exists in Asaas
  const customer = await createCustomer({
    name: params.customerName,
    email: params.customerEmail,
    cpf: params.customerCpf,
    phone: params.customerPhone,
  });

  const body: Record<string, unknown> = {
    customer: customer.id,
    billingType: params.billingType,
    value: params.value,
    description: params.description,
    externalReference: params.externalReference,
    dueDate: params.dueDate,
  };

  if (params.billingType === 'CREDIT_CARD') {
    if (params.creditCardToken) {
      body.creditCardToken = params.creditCardToken;
    }
    if (params.installmentCount && params.installmentCount > 1) {
      body.installmentCount = params.installmentCount;
    }
  }

  const payment = await asaasFetch<AsaasPayment>('/payments', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return payment;
}

/**
 * Retrieves a payment by its Asaas ID.
 */
export async function getPayment(id: string): Promise<AsaasPayment> {
  return asaasFetch<AsaasPayment>(`/payments/${id}`);
}

/**
 * Retrieves the PIX QR code data for a given payment.
 */
export async function getPixQrCode(
  paymentId: string
): Promise<{ payload: string; encodedImage: string }> {
  return asaasFetch<{ payload: string; encodedImage: string }>(
    `/payments/${paymentId}/pixQrCode`
  );
}

/**
 * Verifies an incoming webhook payload.
 *
 * Basic validation: ensures the payload has an `event` property and an `id`
 * (or nested object with `id`) to confirm it looks like a legitimate Asaas
 * webhook event.
 *
 * For production use, you should also verify the HMAC signature using
 * ASAAS_WEBHOOK_SECRET if available.
 */
export function verifyWebhook(
  payload: unknown,
  _signature: string | null
): boolean {
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  const obj = payload as Record<string, unknown>;

  // Must have an event type
  if (typeof obj.event !== 'string' || obj.event.length === 0) {
    return false;
  }

  // Must have an id at the top level or nested in the event object
  if (
    typeof obj.id !== 'string' &&
    typeof (obj.payment as Record<string, unknown>)?.id !== 'string'
  ) {
    return false;
  }

  return true;
}