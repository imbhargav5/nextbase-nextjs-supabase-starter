'use client';

import type { Components } from 'react-markdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { cn } from '@/lib/utils';

const promptMarkdownComponents: Components = {
  h2: ({ children }) => (
    <h2 className="mt-6 mb-3 text-base font-semibold tracking-tight text-foreground first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-5 mb-2 text-sm font-semibold text-foreground">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="mb-3 text-sm leading-relaxed text-muted-foreground last:mb-0">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="mb-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground last:mb-0">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground last:mb-0">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-0.5">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="font-medium text-primary underline-offset-4 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  hr: () => <hr className="my-6 border-border/60" />,
  blockquote: ({ children }) => (
    <blockquote className="mb-3 border-l-2 border-primary/40 pl-4 text-sm italic text-muted-foreground">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="my-4 overflow-x-auto rounded-lg border border-border/60 chrome-scrollbar">
      <table className="w-full min-w-[20rem] border-collapse text-left text-sm">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-muted/50">{children}</thead>,
  tbody: ({ children }) => <tbody className="divide-y divide-border/60">{children}</tbody>,
  tr: ({ children }) => <tr>{children}</tr>,
  th: ({ children }) => (
    <th className="px-3 py-2 font-medium text-foreground">{children}</th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 align-top text-muted-foreground">{children}</td>
  ),
  pre: ({ children }) => (
    <pre className="chrome-scrollbar my-3 overflow-x-auto rounded-lg border border-border/60 bg-muted/35 p-3 text-xs leading-relaxed last:mb-0">
      {children}
    </pre>
  ),
  code: ({ className, children, ...props }) => {
    const isFenced = Boolean(className?.includes('language-'));

    if (isFenced) {
      return (
        <code
          className={cn('font-mono text-[0.8125rem] text-foreground', className)}
          {...props}
        >
          {children}
        </code>
      );
    }

    return (
      <code
        className="rounded-md border border-border/50 bg-muted/50 px-1.5 py-0.5 font-mono text-[0.8125rem] text-foreground"
        {...props}
      >
        {children}
      </code>
    );
  },
};

interface PromptMarkdownProps {
  content: string;
  className?: string;
}

export function PromptMarkdown({ content, className }: PromptMarkdownProps) {
  return (
    <div
      className={cn(
        'wysiwyg wysiwyg-sm max-w-none text-foreground',
        '[&_code]:break-words',
        '[&_li>p]:mb-1 [&_li>p]:last:mb-0',
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={promptMarkdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
