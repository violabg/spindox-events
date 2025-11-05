'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Controller, useFormContext } from 'react-hook-form';

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
      <div className="space-y-2">
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-gray-600">{content}</p>
        </div>
        <Controller
          name={`answers.${questionId}.answerIds`}
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              {answers.map(answer => (
                <Button
                  key={answer.id}
                  type="button"
                  variant={Array.isArray(field.value) && field.value.includes(answer.id) ? 'default' : 'outline'}
                  className={`w-full justify-start ${
                    showCorrectAnswers
                      ? correctAnswerIds.includes(answer.id)
                        ? 'bg-green-600 hover:bg-green-700'
                        : Array.isArray(field.value) && field.value.includes(answer.id)
                          ? 'bg-red-600 hover:bg-red-700'
                          : ''
                      : ''
                  }`}
                  onClick={() => field.onChange([answer.id])}
                  disabled={disabled}
                >
                  {answer.content}
                </Button>
              ))}
            </div>
          )}
        />
      </div>
    );
  }

  // Multiple choices
  return (
    <div className="space-y-2">
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-gray-600">{content}</p>
      </div>
      <div className="space-y-2">
        {answers.map(answer => (
          <Controller
            key={answer.id}
            name={`answers.${questionId}.answerIds`}
            control={control}
            render={({ field }) => {
              const isChecked = Array.isArray(field.value) && field.value.includes(answer.id);
              return (
                <div className="flex items-center space-x-2">
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
                  <Label
                    htmlFor={answer.id}
                    className={`cursor-pointer ${
                      showCorrectAnswers
                        ? correctAnswerIds.includes(answer.id)
                          ? 'text-green-600 font-semibold'
                          : isChecked
                            ? 'text-red-600 font-semibold'
                            : ''
                        : ''
                    }`}
                  >
                    {answer.content}
                  </Label>
                </div>
              );
            }}
          />
        ))}
      </div>
    </div>
  );
}
