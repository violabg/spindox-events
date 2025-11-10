'use client';

import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const DynamicSyntaxHighlighter = dynamic(() => import('react-syntax-highlighter').then(mod => mod.Prism), { ssr: false });

interface QuestionDisplayProps {
  title: string;
  content: string;
  children: React.ReactNode;
}

export function QuestionDisplay({ title, content, children }: QuestionDisplayProps) {
  const { theme } = useTheme();
  const syntaxTheme = theme === 'dark' ? oneDark : oneLight;

  return (
    <div className="bg-background/5 p-4 border border-border rounded-md">
      <div className="mb-4">
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>

      <div className="mb-4 max-w-none text-muted-foreground text-sm prose">
        <ReactMarkdown
          components={{
            // use `any` here because react-markdown's types for components differ
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            code: (props: any) => {
              const { inline, className, children: codeChildren } = props;
              const classAttr = className || '';
              const match = /language-(\w+)/.exec(classAttr);
              const code = String(codeChildren || '');

              if (!inline && match) {
                return (
                  <DynamicSyntaxHighlighter
                    style={syntaxTheme}
                    language={match[1]}
                    PreTag="div"
                    wrapLongLines={true}
                    wrapLines={true}
                    // ensure code blocks wrap on small screens
                    codeTagProps={{
                      style: {
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        overflowWrap: 'anywhere',
                      },
                    }}
                    {...props}
                  >
                    {code.replace(/\n$/, '')}
                  </DynamicSyntaxHighlighter>
                );
              }

              return (
                <code className={className} {...props}>
                  {codeChildren}
                </code>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      <div className="pt-4 border-border border-t">{children}</div>
    </div>
  );
}
