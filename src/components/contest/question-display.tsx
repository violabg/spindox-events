'use client';

import React from 'react';
import AnswerDisplay from './answer-display';

interface QuestionDisplayProps {
  title: string;
  content: string;
  children: React.ReactNode;
}

export function QuestionDisplay({ title, content, children }: QuestionDisplayProps) {
  return (
    <div className="bg-background/5 p-4 border border-border rounded-md">
      <div className="mb-4">
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      <AnswerDisplay content={content} className="mb-4" />
      <div className="pt-4 border-border border-t">{children}</div>
    </div>
  );
}
