/**
 * Generates a public, embeddable project key (safe to ship in a <script> tag).
 * Uses the Web Crypto API available in Node 24 and the Next.js runtimes.
 */
export function generatePublicKey(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  const base64Url = btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  return `pk_${base64Url}`;
}
