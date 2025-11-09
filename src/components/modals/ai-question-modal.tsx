'use client';

import { generateQuestion } from '@/actions/questions/generate.action';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { GenerateQuestionInputSchema, type GeneratedQuestion } from '@/lib/schemas/ai-question.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface AIQuestionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contestId: string;
  onGenerated: (question: GeneratedQuestion) => void;
}

export function AIQuestionModal({ open, onOpenChange, contestId, onGenerated }: AIQuestionModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm({
    resolver: zodResolver(GenerateQuestionInputSchema),
    defaultValues: {
      prompt: '',
      numAnswers: 4,
      isMultipleCorrect: false,
      difficulty: 'medium' as const,
      language: 'english' as const,
      generateCode: false,
      contestId,
    },
  });

  async function onSubmit(values: Record<string, unknown>) {
    setIsGenerating(true);
    try {
      const result = await generateQuestion(values);

      if (!result.success || !result.data) {
        toast.error(result.error || 'Failed to generate question');
        return;
      }

      toast.success('Question generated successfully');
      // Attach the question `type` based on the user's choice for multiple correct answers
      // So the question form can set its `type` field appropriately.
      const isMultiple = (form.getValues().isMultipleCorrect as boolean) === true;
      const generatedWithType = result.data ? { ...result.data, type: isMultiple ? 'MULTIPLE_CHOICES' : 'SINGLE_CHOICE' } : result.data;
      onGenerated(generatedWithType as GeneratedQuestion & { type?: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICES' });
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Question with AI</DialogTitle>
          <DialogDescription>Provide details about the question you want to generate</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Prompt</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the topic or subject for the question..." disabled={isGenerating} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numAnswers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Answers</FormLabel>
                  <FormControl>
                    <Select value={field.value.toString()} onValueChange={v => field.onChange(parseInt(v))}>
                      <SelectTrigger disabled={isGenerating}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[2, 3, 4, 5, 6].map(num => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} answers
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty Level</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger disabled={isGenerating}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy (100 points)</SelectItem>
                        <SelectItem value="medium">Medium (200 points)</SelectItem>
                        <SelectItem value="difficult">Difficult (300 points)</SelectItem>
                        <SelectItem value="hard">Hard (400 points)</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger disabled={isGenerating}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="italian">Italian</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isMultipleCorrect"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isGenerating} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Multiple Correct Answers</FormLabel>
                    <FormDescription>Allow more than one correct answer</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="generateCode"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isGenerating} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Generate Code Snippet</FormLabel>
                    <FormDescription>Include a relevant code example in the question</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isGenerating} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={isGenerating} className="flex-1">
                {isGenerating && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
                {isGenerating ? 'Generating...' : 'Generate'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
