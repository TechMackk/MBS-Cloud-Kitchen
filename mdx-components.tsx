import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="font-heading text-3xl font-bold text-green-deep sm:text-4xl">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-8 font-heading text-2xl font-semibold text-green-deep">
        {children}
      </h2>
    ),
    p: ({ children }) => (
      <p className="mt-4 leading-relaxed text-text/80">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="mt-4 list-disc space-y-2 pl-6 text-text/80">{children}</ul>
    ),
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    strong: ({ children }) => (
      <strong className="font-semibold text-green-deep">{children}</strong>
    ),
    ...components,
  };
}
