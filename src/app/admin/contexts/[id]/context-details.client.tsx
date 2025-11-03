'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ContextModel } from '@/prisma/models/Context';
import { QuestionModel } from '@/prisma/models/Question';
import { AnswerModel } from '@/prisma/models/Answer';
import QuestionModal from './question.modal';
import { getContextWithQuestions } from '@/actions/contexts/get.action';

// Type for Question with its answers included (matches what we get from the database)
type QuestionWithAnswers = QuestionModel & {
  answers: AnswerModel[];
};

// Type for Context with its questions and answers included (matches what we get from the database)
type ContextWithQuestions = ContextModel & {
  questions: QuestionWithAnswers[];
};

type ContextDetailsClientProps = {
  contextId: string;
  initialContext: ContextWithQuestions;
};

export default function ContextDetailsClient({ contextId, initialContext }: ContextDetailsClientProps) {
  const [context, setContext] = useState<ContextWithQuestions>(initialContext);

  const refreshContext = async () => {
    const result = await getContextWithQuestions(contextId);
    if (result.success && result.data) {
      setContext(result.data);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Admin
            </Link>
          </Button>
        </div>
        <h1 className="text-3xl font-bold">Context Details</h1>
        <p className="text-muted-foreground">Manage context information and questions</p>
      </div>

      <div className="grid gap-6">
        {/* Context Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl font-semibold">{context.name}</span>
                <Badge variant={context.status === 'active' ? 'default' : 'secondary'}>{context.status}</Badge>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/contexts/${contextId}/edit`}>Edit Context</Link>
              </Button>
            </div>
            {context.theme && <CardDescription>Theme: {context.theme}</CardDescription>}
          </CardHeader>
          {context.description && (
            <CardContent>
              <p className="text-sm">{context.description}</p>
            </CardContent>
          )}
        </Card>

        {/* Questions Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Questions ({context.questions.length})</CardTitle>
                <CardDescription>Manage questions for this context.</CardDescription>
              </div>
              <QuestionModal contextId={contextId} onSuccess={refreshContext} />
            </div>
          </CardHeader>
          <CardContent>
            {context.questions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No questions added yet. Create your first question to get started.</div>
            ) : (
              <div className="space-y-4">
                {context.questions.map((question: QuestionWithAnswers, index: number) => (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-muted-foreground">Question {index + 1}</span>
                        </div>
                        <h4 className="font-medium mb-2">{question.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{question.content}</p>
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">Answers:</p>
                          {question.answers.map((answer: AnswerModel, answerIndex: number) => (
                            <div key={answer.id} className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground w-4">{String.fromCharCode(65 + answerIndex)}.</span>
                              <span className={`text-xs ${answer.isCorrect ? 'font-medium text-green-600' : ''}`}>
                                {answer.content}
                                {answer.isCorrect && ' ✓'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="ml-4">
                        <QuestionModal contextId={contextId} question={question} onSuccess={refreshContext} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
