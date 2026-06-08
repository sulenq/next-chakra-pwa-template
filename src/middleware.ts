import { NextRequest, NextResponse } from "next/server";

import {
  IMAGE_REMOTE_PATTERNS,
  TAWK_DOMAINS,
  TINYMCE_DOMAINS,
} from "@/constants/csp";

export function middleware(request: NextRequest) {
  const nonce = crypto.randomUUID();

  const isDev = process.env.NODE_ENV === "development";

  // Build per-directive allowlists from typed constants
  const imgSrc = [
    "'self'",
    "data:",
    "blob:",
    ...IMAGE_REMOTE_PATTERNS.map((p) => `${p.protocol}://${p.hostname}`),
    ...TAWK_DOMAINS.img,
    ...TINYMCE_DOMAINS.img,
  ].join(" ");

  const connectSrc = [
    "'self'",
    "https:",
    "ws:",
    ...TAWK_DOMAINS.connect,
    ...TINYMCE_DOMAINS.connect,
  ].join(" ");

  // Tawk.to + TinyMCE script domains are added as host-based fallback for
  // browsers that don't honour 'strict-dynamic'. Modern browsers will allow
  // them via strict-dynamic trust propagation anyway.
  const scriptSrc = [
    "'self'",
    `'nonce-${nonce}'`,
    "'strict-dynamic'",
    ...TAWK_DOMAINS.script,
    ...TINYMCE_DOMAINS.script,
    isDev ? "'unsafe-eval' 'unsafe-inline'" : "",
  ]
    .filter(Boolean)
    .join(" ");

  // style-src: 'unsafe-inline' is kept as a risk-accepted finding (#4).
  // Chakra UI v3 / Emotion and Tawk.to widget both inject dynamic <style> elements
  // without nonce support. Keeping style-src as 'self' 'unsafe-inline' without nonces
  // prevents style blocks and hydration mismatches.
  const styleSrc = ["'self'", "'unsafe-inline'"].join(" ");

  const frameSrc = [...TAWK_DOMAINS.frame].join(" ");

  const csp = [
    `default-src 'self'`,
    `script-src ${scriptSrc}`,
    `style-src ${styleSrc}`,
    `img-src ${imgSrc}`,
    `font-src 'self' data:`,
    `connect-src ${connectSrc}`,
    `frame-src ${frameSrc}`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'self'`,
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("Content-Security-Policy", csp);

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};