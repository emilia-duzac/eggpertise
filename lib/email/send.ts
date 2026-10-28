import { mailFrom, sendEmail } from "../resend";
import { teamInbox } from "./contact";
import type { EmailMessage } from "./types";

/** Sends a notification to the team. Throws if Resend rejects it. */
export async function sendTeamEmail(
  message: EmailMessage,
  senderName?: string
): Promise<unknown> {
  return sendEmail({
    from: mailFrom(senderName),
    to: [teamInbox()],
    replyTo: message.replyTo,
    subject: message.subject,
    html: message.html,
    text: message.text,
  });
}

/** Sends an email to the person who filled in a form. Throws if Resend rejects it. */
export async function sendClientEmail(
  to: string,
  message: EmailMessage
): Promise<unknown> {
  return sendEmail({
    from: mailFrom(),
    to: [to],
    replyTo: message.replyTo,
    subject: message.subject,
    html: message.html,
    text: message.text,
  });
}

/**
 * Sends the confirmation to the person who filled in a form. It never throws:
 * the lead is already saved and the team already notified, so a failed
 * confirmation must not turn into an error on the form. The email is built
 * inside the try for the same reason.
 */
export async function sendClientConfirmation(
  to: string,
  build: () => EmailMessage
): Promise<void> {
  try {
    await sendClientEmail(to, build());
  } catch (error) {
    // Only the domain is logged: the address is personal data.
    console.error(`Confirmation email failed for a @${to.split("@")[1]} address:`, error);
  }
}
