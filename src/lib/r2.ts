import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(
      `[R2] Missing required environment variable: ${name}. ` +
      `Set it in .env or your deployment config to use Cloudflare R2 storage.`
    )
  }
  return value
}

let _client: S3Client | null = null

function getClient(): S3Client {
  if (_client) return _client

  const accountId = requireEnv('R2_ACCOUNT_ID')
  const accessKeyId = requireEnv('R2_ACCESS_KEY_ID')
  const secretAccessKey = requireEnv('R2_SECRET_ACCESS_KEY')

  _client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    // R2 requires path-style addressing
    forcePathStyle: true,
  })

  return _client
}

function getBucket(): string {
  return requireEnv('R2_BUCKET_NAME')
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generates a presigned PUT URL that allows a browser to upload a file
 * directly to R2 — no server-side proxy needed.
 *
 * @param key    - The object key in the bucket (e.g. "avatars/user-123.jpg")
 * @param contentType - MIME type of the file (e.g. "image/jpeg")
 * @returns Presigned URL valid for 15 minutes
 */
export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
): Promise<string> {
  const client = getClient()
  const bucket = getBucket()

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  })

  const url = await getSignedUrl(client, command, { expiresIn: 15 * 60 })

  return url
}

/**
 * Deletes a file from the R2 bucket.
 *
 * @param key - The object key to delete
 */
export async function deleteFile(key: string): Promise<void> {
  const client = getClient()
  const bucket = getBucket()

  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  })

  await client.send(command)
}

/**
 * Returns the public URL for a file stored in R2.
 *
 * Requires R2_PUBLIC_URL to be set (e.g. "https://files.helora.com.br").
 * If not configured, falls back to an R2 dev URL pattern.
 *
 * @param key - The object key
 */
export function getPublicUrl(key: string): string {
  const publicUrl = process.env.R2_PUBLIC_URL

  if (!publicUrl) {
    console.warn(
      '[R2] R2_PUBLIC_URL is not set. Returned URL may not be publicly accessible.'
    )
  }

  const base = publicUrl ?? ''
  return `${base.replace(/\/+$/, '')}/${key}`
}