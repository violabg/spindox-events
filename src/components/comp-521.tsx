'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Stepper, StepperIndicator, StepperItem, StepperTrigger } from '@/components/ui/stepper';

const steps = [1, 2, 3, 4];

export default function Component() {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="space-y-8 mx-auto max-w-xl text-center">
      <div className="space-y-3">
        <Stepper value={currentStep} onValueChange={setCurrentStep}>
          {steps.map(step => (
            <StepperItem key={step} step={step} className="flex-1">
              <StepperTrigger className="flex-col items-start gap-2 w-full" asChild>
                <StepperIndicator asChild className="bg-border rounded-none w-full h-2">
                  <span className="sr-only">{step}</span>
                </StepperIndicator>
              </StepperTrigger>
            </StepperItem>
          ))}
        </Stepper>
        <div className="font-medium tabular-nums text-muted-foreground text-sm">
          Step {currentStep} of {steps.length}
        </div>
      </div>
      <div className="flex justify-center space-x-4">
        <Button variant="outline" className="w-32" onClick={() => setCurrentStep(prev => prev - 1)} disabled={currentStep === 1}>
          Prev step
        </Button>
        <Button variant="outline" className="w-32" onClick={() => setCurrentStep(prev => prev + 1)} disabled={currentStep >= steps.length}>
          Next step
        </Button>
      </div>
      <p className="mt-2 text-muted-foreground text-xs" role="region" aria-live="polite">
        Progress stepper
      </p>
    </div>
  );
}
