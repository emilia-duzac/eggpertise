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

const text = (max: number) => z.string().trim().min(1).max(max);

// zod's email check rejects spaces, commas and angle brackets, so a value like
// "a@b.com,victim@x.com" cannot turn the form into a mail relay.
const email = z.string().trim().max(MAX_LENGTH.email).email();

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
 * response to send back: a missing or mistyped field is "required", a bad
 * address is "not valid" and an oversized field is "too long".
 */
export async function parseFormBody<T extends z.ZodTypeAny>(
  request: Request,
  schema: T
): Promise<ParsedBody<z.infer<T>>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return { success: false, response: badRequest("Todos los campos son requeridos") };
  }

  const result = schema.safeParse(body);
  if (result.success) {
    return { success: true, data: result.data };
  }

  const { issues } = result.error;
  const badEmail = issues.some(
    (issue) => issue.path[0] === "email" && issue.code === "invalid_string"
  );
  const tooLong = issues.some((issue) => issue.code === "too_big");

  let error = "Todos los campos son requeridos";
  if (badEmail) {
    error = "El email no es válido";
  } else if (tooLong) {
    error = "Alguno de los campos supera el largo permitido";
  }
  return { success: false, response: badRequest(error) };
}
