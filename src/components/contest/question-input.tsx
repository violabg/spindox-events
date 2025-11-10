'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { QuestionType } from '@/prisma/enums';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import { Controller, useFormContext } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { QuestionDisplay } from './question-display';

const DynamicSyntaxHighlighter = dynamic(() => import('react-syntax-highlighter').then(mod => mod.Prism), { ssr: false });

interface Answer {
  id: string;
  content: string;
}

interface AnswerDisplayProps {
  content: string;
}

function AnswerDisplay({ content }: AnswerDisplayProps) {
  const { theme } = useTheme();
  const syntaxTheme = theme === 'dark' ? oneDark : oneLight;

  return (
    <div className="w-full max-w-none text-sm prose prose-sm">
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

interface QuestionInputProps {
  questionId: string;
  title: string;
  content: string;
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICES';
  answers: Answer[];
  disabled?: boolean;
  showCorrectAnswers?: boolean;
  correctAnswerIds?: string[];
}

export function QuestionInput({
  questionId,
  title,
  content,
  type,
  answers,
  disabled = false,
  showCorrectAnswers = false,
  correctAnswerIds = [],
}: QuestionInputProps) {
  const { control } = useFormContext();

  if (type === QuestionType.SINGLE_CHOICE) {
    return (
      <QuestionDisplay title={title} content={content}>
        <Controller
          name={`answers.${questionId}.answerIds`}
          control={control}
          render={({ field, fieldState }) => (
            <>
              <RadioGroup
                value={Array.isArray(field.value) && field.value.length ? field.value[0] : undefined}
                onValueChange={val => field.onChange(val ? [val] : [])}
                className="space-y-1"
              >
                {answers.map(answer => {
                  const selected = Array.isArray(field.value) && field.value[0] === answer.id;
                  const isCorrect = correctAnswerIds.includes(answer.id);
                  let containerClass = '';
                  if (showCorrectAnswers) {
                    if (isCorrect) containerClass = 'bg-green-600 hover:bg-green-700 text-white';
                    else if (selected) containerClass = 'bg-red-600 hover:bg-red-700 text-white';
                  }
                  return (
                    <div
                      key={answer.id}
                      className={`w-full flex items-center space-x-3 px-2 py-3 rounded-md cursor-pointer ${containerClass} border border-input p-3 shadow-xs outline-none has-data-[state=checked]:border-primary/50`}
                    >
                      <RadioGroupItem value={answer.id} id={answer.id} disabled={disabled} className="mt-1" />
                      <Label htmlFor={answer.id} className="flex-1 text-sm cursor-pointer">
                        <AnswerDisplay content={answer.content} />
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
              {fieldState.error?.message && <p className="mt-1 text-destructive text-sm">{String(fieldState.error.message)}</p>}
            </>
          )}
        />
      </QuestionDisplay>
    );
  }

  // Multiple choices
  return (
    <QuestionDisplay title={title} content={content}>
      <div className="mb-2">
        <div className="text-muted-foreground text-sm">Multiple answers allowed</div>
      </div>
      <div className="space-y-3">
        {answers.map(answer => (
          <Controller
            key={answer.id}
            name={`answers.${questionId}.answerIds`}
            control={control}
            render={({ field, fieldState }) => {
              const isChecked = Array.isArray(field.value) && field.value.includes(answer.id);
              const isCorrect = correctAnswerIds.includes(answer.id);
              let containerClass = '';
              if (showCorrectAnswers) {
                if (isCorrect) containerClass = 'bg-green-600 hover:bg-green-700 text-white';
                else if (isChecked) containerClass = 'bg-red-600 hover:bg-red-700 text-white';
              }
              return (
                <>
                  <div
                    className={`w-full flex items-center space-x-3 rounded-md cursor-pointer ${containerClass} border border-input p-3 shadow-xs outline-none has-data-[state=checked]:border-primary/50`}
                  >
                    <Checkbox
                      id={answer.id}
                      checked={isChecked}
                      onCheckedChange={checked => {
                        const currentAnswers = Array.isArray(field.value) ? field.value : [];
                        const newAnswers = checked ? [...currentAnswers, answer.id] : currentAnswers.filter((id: string) => id !== answer.id);
                        field.onChange(newAnswers);
                      }}
                      disabled={disabled}
                      className="mt-1"
                    />
                    <Label htmlFor={answer.id} className="flex-1 text-sm cursor-pointer">
                      <AnswerDisplay content={answer.content} />
                    </Label>
                  </div>
                  {fieldState.error?.message && <p className="mt-1 text-destructive text-sm">{String(fieldState.error.message)}</p>}
                </>
              );
            }}
          />
        ))}
      </div>
    </QuestionDisplay>
  );
}
