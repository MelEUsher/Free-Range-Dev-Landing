export const CSP_NONCE_PLACEHOLDER = "'nonce-${nonce}'";

const cspHeaderValue = `default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self'; script-src 'self' ${CSP_NONCE_PLACEHOLDER};`;

export const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: cspHeaderValue,
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
];

export function buildCspWithNonce(nonce) {
  return cspHeaderValue.replaceAll(
    CSP_NONCE_PLACEHOLDER,
    `'nonce-${nonce}'`,
  );
}
