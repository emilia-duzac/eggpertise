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
