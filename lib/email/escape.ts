const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/**
 * Escapes text coming from a form before it goes into an email. Everything a
 * visitor typed must pass through here: the emails are HTML, so an unescaped
 * name or message could inject markup into the team's inbox.
 */
export function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
}

/**
 * Returns the URL escaped for an href attribute, or "#" when it is not an
 * http(s) or mailto link (for example `javascript:`).
 */
export function safeHref(url: unknown): string {
  const value = String(url ?? "").trim();
  return /^(https?:|mailto:)/i.test(value) ? escapeHtml(value) : "#";
}
