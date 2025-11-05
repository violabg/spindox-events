'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Controller, useFormContext } from 'react-hook-form';
import { QuestionDisplay } from './question-display';

interface Answer {
  id: string;
  content: string;
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

  if (type === 'SINGLE_CHOICE') {
    return (
      <QuestionDisplay title={title} content={content}>
        <Controller
          name={`answers.${questionId}.answerIds`}
          control={control}
          render={({ field }) => (
            <RadioGroup
              value={Array.isArray(field.value) && field.value.length ? field.value[0] : undefined}
              onValueChange={val => field.onChange(val ? [val] : [])}
              className="space-y-2"
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
                    role="button"
                    onClick={() => !disabled && field.onChange([answer.id])}
                    className={`w-full flex items-center space-x-3 px-2 rounded-md cursor-pointer ${containerClass}`}
                  >
                    <RadioGroupItem value={answer.id} id={answer.id} disabled={disabled} />
                    <span>{answer.content}</span>
                  </div>
                );
              })}
            </RadioGroup>
          )}
        />
      </QuestionDisplay>
    );
  }

  // Multiple choices
  return (
    <QuestionDisplay title={title} content={content}>
      <div className="mb-2">
        <div className="text-sm text-muted-foreground">Multiple answers allowed</div>
      </div>
      <div className="space-y-2">
        {answers.map(answer => (
          <Controller
            key={answer.id}
            name={`answers.${questionId}.answerIds`}
            control={control}
            render={({ field }) => {
              const isChecked = Array.isArray(field.value) && field.value.includes(answer.id);
              const isCorrect = correctAnswerIds.includes(answer.id);
              let containerClass = '';
              if (showCorrectAnswers) {
                if (isCorrect) containerClass = 'bg-green-600 hover:bg-green-700 text-white';
                else if (isChecked) containerClass = 'bg-red-600 hover:bg-red-700 text-white';
              }
              return (
                <div className={`w-full flex items-center space-x-3 p-2 rounded-md cursor-pointer ${containerClass}`}>
                  <Checkbox
                    id={answer.id}
                    checked={isChecked}
                    onCheckedChange={checked => {
                      const currentAnswers = Array.isArray(field.value) ? field.value : [];
                      const newAnswers = checked ? [...currentAnswers, answer.id] : currentAnswers.filter((id: string) => id !== answer.id);
                      field.onChange(newAnswers);
                    }}
                    disabled={disabled}
                  />
                  <Label htmlFor={answer.id} className="flex-1 text-sm cursor-pointer">
                    {answer.content}
                  </Label>
                </div>
              );
            }}
          />
        ))}
      </div>
    </QuestionDisplay>
  );
}
