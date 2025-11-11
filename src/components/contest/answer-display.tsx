import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import { HTMLAttributes } from 'react';
import ReactMarkdown from 'react-markdown';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const DynamicSyntaxHighlighter = dynamic(() => import('react-syntax-highlighter').then(mod => mod.Prism), { ssr: false });

interface AnswerDisplayProps {
  content: string;
  className?: HTMLAttributes<HTMLDivElement>['className'];
}

export default function AnswerDisplay({ content, className }: AnswerDisplayProps) {
  const { resolvedTheme } = useTheme();
  const syntaxTheme = resolvedTheme === 'dark' ? oneDark : oneLight;

  return (
    <div className={`w-full max-w-none text-sm prose prose-sm ${className}`}>
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
  );
}
