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
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
}

/**
 * Returns the URL escaped for an href attribute, or "#" when it is not an
 * http(s) or mailto link (for example `javascript:`). A protocol-relative URL
 * (`//host/path`, as Contentful sometimes returns) is taken as https.
 */
export function safeHref(url: string): string {
  const value = url.trim();
  const absolute = value.startsWith("//") ? `https:${value}` : value;

  if (/^(https?:|mailto:)/i.test(absolute)) {
    return escapeHtml(absolute);
  }

  // Not silent: a dead link in an email is hard to notice otherwise.
  console.warn("safeHref rejected a URL:", value.slice(0, 80));
  return "#";
}

/**
 * Percent-encodes a URL once. Decoding first makes it safe to call on a URL
 * that is already encoded, which would otherwise be encoded twice (`%20` into
 * `%2520`) and break the download.
 */
export function toSafeUrl(url: string): string {
  try {
    return encodeURI(decodeURI(url));
  } catch {
    // Malformed escape sequence: leave it for safeHref to judge.
    return url;
  }
}
