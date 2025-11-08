import { NextResponse } from "next/server";
import { z } from "next/dist/compiled/zod";

import { enforceRateLimit } from "@/lib/rate-limit";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  message: z.string().trim().min(1).max(1000),
});

type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

const SECURITY_HEADERS: Record<string, string> = {
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' https://formspree.io; frame-src https://www.youtube.com https://www.tiktok.com;",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy":
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  "X-Content-Type-Options": "nosniff",
};

const JSON_SUCCESS = { ok: true };
const JSON_INVALID = { ok: false, error: "Invalid input" };

const respond = (body: Record<string, unknown>, init?: ResponseInit) => {
  const response = NextResponse.json(body, init);
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
};

const methodNotAllowed = () =>
  respond(
    { ok: false, error: "Method not allowed" },
    { status: 405, headers: { Allow: "POST" } }
  );

export const GET = methodNotAllowed;
export const HEAD = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
export const OPTIONS = methodNotAllowed;

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const clientIp = extractClientIp(request);
  const limitResult = enforceRateLimit(clientIp);

  if (!limitResult.success) {
    return respond(
      { ok: false, error: "Too many requests" },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil(
            Math.max(0, limitResult.reset - Date.now()) / 1000
          ).toString(),
        },
      }
    );
  }

  const payload = await parsePayload(request);
  if (!payload) {
    return respond(JSON_INVALID, { status: 400 });
  }

  try {
    await deliverMessage(payload);
  } catch (error) {
    console.error("Failed to deliver support message", error);
    return respond(
      { ok: false, error: "Unable to send message right now" },
      { status: 500 }
    );
  }

  return respond(JSON_SUCCESS);
}

const extractClientIp = (request: Request) => {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }
  const realIp = request.headers.get("x-real-ip");
  return realIp ?? "unknown";
};

const parsePayload = async (
  request: Request
): Promise<ContactPayload | null> => {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";

  let raw: Record<string, unknown> | null = null;
  if (contentType.includes("application/json") || !contentType) {
    raw = await parseJsonBody(request);
  } else if (
    contentType.includes("multipart/form-data") ||
    contentType.includes("application/x-www-form-urlencoded")
  ) {
    raw = await parseFormBody(request);
  }

  if (!raw) {
    return null;
  }

  const result = contactSchema.safeParse(raw);
  return result.success ? result.data : null;
};

const parseJsonBody = async (request: Request) => {
  try {
    const data = await request.json();
    if (typeof data !== "object" || data === null) {
      return null;
    }
    return data as Record<string, unknown>;
  } catch {
    return null;
  }
};

const parseFormBody = async (request: Request) => {
  try {
    const formData = await request.formData();
    const getValue = (key: string) => {
      const value = formData.get(key);
      if (typeof value === "string") {
        return value;
      }
      if (value instanceof File) {
        return value.name;
      }
      return "";
    };

    return {
      name: getValue("name"),
      email: getValue("email"),
      message: getValue("message"),
    };
  } catch {
    return null;
  }
};

/**
 * Sends form submissions via Resend when available, otherwise logs locally.
 */
const deliverMessage = async (payload: ContactPayload) => {
  const supportEmail = process.env.SUPPORT_EMAIL;
  const resendApiKey = process.env.RESEND_API_KEY;

  if (resendApiKey && supportEmail) {
    await sendWithResend(payload, resendApiKey, supportEmail);
    return;
  }

  console.log("[contact-form] stub delivery", {
    supportEmail,
    payload,
  });
};

const sendWithResend = async (
  payload: ContactPayload,
  apiKey: string,
  supportEmail: string
) => {
  const textBody = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    "",
    payload.message,
  ].join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `Free Range Dev <${supportEmail}>`,
      to: [supportEmail],
      reply_to: payload.email,
      subject: `New contact from ${payload.name}`,
      text: textBody,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Resend delivery failed: ${
        errorText || `status ${response.status}`
      }`
    );
  }
};
