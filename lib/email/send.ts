import { mailFrom, sendEmail } from "../resend";
import type { EmailMessage } from "./types";

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
    const message = build();
    await sendEmail({
      from: mailFrom(),
      to: [to],
      replyTo: message.replyTo,
      subject: message.subject,
      html: message.html,
      text: message.text,
    });
  } catch (error) {
    console.error(`Confirmation email failed for ${to}:`, error);
  }
}
