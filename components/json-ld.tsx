/**
 * Renders a Schema.org block for search engines. Escaping "<" keeps content
 * coming from Contentful from breaking out of the script tag.
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
