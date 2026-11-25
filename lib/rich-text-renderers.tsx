import { BLOCKS, INLINES, MARKS } from "@contentful/rich-text-types";

// Professional renderers for Rich Text with enhanced styling
export const renderOptions = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node: any, children: any) => (
      <p className="mb-6 leading-7 text-foreground/90 text-base">{children}</p>
    ),
    [BLOCKS.HEADING_1]: (node: any, children: any) => (
      <h1 className="text-4xl font-serif font-bold mb-8 mt-12 text-foreground border-b-2 border-primary/20 pb-4">
        {children}
      </h1>
    ),
    [BLOCKS.HEADING_2]: (node: any, children: any) => (
      <h2 className="text-3xl font-serif font-bold mb-6 mt-10 text-foreground border-b border-primary/10 pb-3">
        {children}
      </h2>
    ),
    [BLOCKS.HEADING_3]: (node: any, children: any) => (
      <h3 className="text-2xl font-semibold mb-4 mt-8 text-foreground">
        {children}
      </h3>
    ),
    [BLOCKS.HEADING_4]: (node: any, children: any) => (
      <h4 className="text-xl font-semibold mb-3 mt-6 text-foreground">
        {children}
      </h4>
    ),
    [BLOCKS.HEADING_5]: (node: any, children: any) => (
      <h5 className="text-lg font-semibold mb-2 mt-4 text-foreground">
        {children}
      </h5>
    ),
    [BLOCKS.HEADING_6]: (node: any, children: any) => (
      <h6 className="text-base font-semibold mb-2 mt-3 text-foreground">
        {children}
      </h6>
    ),
    [BLOCKS.UL_LIST]: (node: any, children: any) => (
      <ul className="list-none mb-6 space-y-3 pl-0">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (node: any, children: any) => (
      <ol className="list-none mb-6 space-y-3 pl-0 counter-reset: list-counter">
        {children}
      </ol>
    ),
    [BLOCKS.LIST_ITEM]: (node: any, children: any) => (
      <li className="flex items-start leading-7 text-foreground/90">
        <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-3 mr-4"></span>
        <span className="flex-1 [&_p]:mb-0">{children}</span>
      </li>
    ),
    [BLOCKS.QUOTE]: (node: any, children: any) => (
      <blockquote className="border-l-4 border-primary bg-primary/5 pl-6 pr-6 py-4 my-8 italic text-foreground/80 rounded-r-lg">
        <div className="text-primary text-2xl mb-2">&quot;</div>
        <div className="text-lg leading-relaxed">{children}</div>
        <div className="text-primary text-2xl text-right">&quot;</div>
      </blockquote>
    ),
    [BLOCKS.HR]: () => (
      <div className="my-12 flex items-center justify-center">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
        <div className="mx-4 w-2 h-2 bg-primary rounded-full"></div>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
      </div>
    ),
    [INLINES.HYPERLINK]: (node: any, children: any) => (
      <a
        href={node.data.uri}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors duration-200 underline decoration-2 underline-offset-2 hover:decoration-primary/60"
      >
        {children}
        <svg
          className="ml-1 w-3 h-3 opacity-70"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </a>
    ),
  },
  renderMark: {
    [MARKS.BOLD]: (text: any) => (
      <strong className="font-bold text-foreground">{text}</strong>
    ),
    [MARKS.ITALIC]: (text: any) => (
      <em className="italic text-foreground/90">{text}</em>
    ),
    [MARKS.UNDERLINE]: (text: any) => (
      <u className="underline decoration-2 underline-offset-2 decoration-primary/60">
        {text}
      </u>
    ),
    [MARKS.CODE]: (text: any) => (
      <code className="bg-muted/50 border border-border px-2 py-1 rounded-md text-sm font-mono text-foreground">
        {text}
      </code>
    ),
  },
};
