import { StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";
import { z } from "zod";

// Upper bounds for what a visitor can send. The values end up in the leads
// sheet, in Resend and in the email HTML, so nothing should be unbounded.
const MAX_LENGTH = {
  name: 100,
  company: 150,
  country: 80,
  phone: 40,
  email: 254, // RFC 5321 limit for an address
  message: 5000,
  slug: 200,
} as const;

export const ERROR_REQUIRED = "Todos los campos son requeridos";
export const ERROR_INVALID_EMAIL = "El email no es válido";
export const ERROR_TOO_LONG = "Alguno de los campos supera el largo permitido";

const text = (max: number) => z.string().trim().min(1).max(max);

// zod's email check rejects spaces, commas and angle brackets, so a value like
// "a@b.com,victim@x.com" cannot turn the form into a mail relay.
const email = z.string().trim().min(1).max(MAX_LENGTH.email).email();

export const contactSchema = z.object({
  nombre: text(MAX_LENGTH.name),
  email,
  empresa: text(MAX_LENGTH.company),
  pais: text(MAX_LENGTH.country),
  mensaje: text(MAX_LENGTH.message),
});

export const fichaSchema = z.object({
  nombre: text(MAX_LENGTH.name),
  apellido: text(MAX_LENGTH.name),
  email,
  telefono: text(MAX_LENGTH.phone),
  pais: text(MAX_LENGTH.country),
  productoSlug: text(MAX_LENGTH.slug),
});

export const technicalInfoSchema = z.object({
  email,
  telefono: text(MAX_LENGTH.phone),
  pais: text(MAX_LENGTH.country),
  empresa: text(MAX_LENGTH.company),
  productoSlug: text(MAX_LENGTH.slug),
});

type ParsedBody<T> =
  | { success: true; data: T }
  | { success: false; response: NextResponse };

const badRequest = (error: string) =>
  NextResponse.json({ error }, { status: StatusCodes.BAD_REQUEST });

/**
 * Reads and validates the JSON body of a form. On failure it returns the 400
 * response to send back: a missing, empty or mistyped field is "required", an
 * oversized one is "too long" and a bad address is "not valid".
 */
export async function parseFormBody<T extends z.ZodTypeAny>(
  request: Request,
  schema: T
): Promise<ParsedBody<z.infer<T>>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return { success: false, response: badRequest(ERROR_REQUIRED) };
  }

  const result = schema.safeParse(body);
  if (result.success) {
    return { success: true, data: result.data };
  }

  // A field can break several rules at once (an empty email is also not an
  // email): the most basic problem is the one worth reporting.
  const codes = result.error.issues.map((issue) => issue.code);
  let error = ERROR_INVALID_EMAIL;
  if (codes.includes("invalid_type") || codes.includes("too_small")) {
    error = ERROR_REQUIRED;
  } else if (codes.includes("too_big")) {
    error = ERROR_TOO_LONG;
  }
  return { success: false, response: badRequest(error) };
}
