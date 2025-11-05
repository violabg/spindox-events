'use client';

import ReactMarkdown from 'react-markdown';

interface QuestionDisplayProps {
  title: string;
  content: string;
  children: React.ReactNode;
}

export function QuestionDisplay({ title, content, children }: QuestionDisplayProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <h3 className="font-semibold">{title}</h3>
        <div className="text-sm">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
