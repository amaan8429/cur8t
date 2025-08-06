import React from 'react';
import { PiCheckCircle } from 'react-icons/pi';
import { Step } from './types';

interface Props {
  currentStep: Step;
}

const steps: Step[] = ['upload', 'analyze', 'preview', 'create', 'complete'];
const stepLabels: Record<Step, string> = {
  upload: 'Upload',
  analyze: 'Analyze',
  preview: 'Preview',
  create: 'Create',
  complete: 'Complete',
};

export function BookmarkImporterSteps({ currentStep }: Props) {
  return (
    <div className="flex items-center justify-center space-x-4">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-all duration-200 ${
              currentStep === step
                ? 'bg-primary text-primary-foreground shadow-lg scale-110'
                : index < steps.indexOf(currentStep)
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted text-muted-foreground'
            }`}
          >
            {index < steps.indexOf(currentStep) ? (
              <PiCheckCircle className="h-5 w-5" />
            ) : (
              index + 1
            )}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`h-1 w-16 rounded-full transition-all duration-300 ${
                index < steps.indexOf(currentStep) ? 'bg-primary' : 'bg-muted'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
