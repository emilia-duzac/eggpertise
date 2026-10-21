import { Resend, type CreateEmailOptions } from "resend";

let client: Resend | undefined;

// Built on first use rather than at import time: the constructor throws when
// the key is missing, which would fail `next build` for a variable that is only
// needed once an email is actually sent.
function getClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set");
  }

  client ??= new Resend(apiKey);
  return client;
}

/**
 * Builds the `from` header. The domain can be overridden with MAIL_DOMAIN so a
 * verified subdomain (e.g. mail.eggpertise.com) can send while the root domain
 * is still registered with another Resend account.
 */
export function mailFrom(name = "EggPertise"): string {
  const domain = process.env.MAIL_DOMAIN || "eggpertise.com";
  return `${name} <noreply@${domain}>`;
}

/**
 * Sends an email and throws when Resend rejects it.
 *
 * The SDK reports API failures (invalid key, unverified domain, ...) in the
 * `error` field of its result instead of throwing, so without this check a
 * rejected email is indistinguishable from a delivered one.
 */
export async function sendEmail(options: CreateEmailOptions) {
  const { data, error } = await getClient().emails.send(options);

  if (error) {
    throw new Error(`Resend rejected the email: ${error.name}: ${error.message}`);
  }

  return data;
}
