"use client";

import { Check } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface Step {
  id: number;
  title: string;
  description?: string;
}

interface ProductFormStepperProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
  onStepClick?: (stepId: number) => void;
}

export function ProductFormStepper({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
}: ProductFormStepperProps) {
  return (
    <div className="w-full bg-white rounded-lg border border-slate-200 p-6 overflow-hidden">
      <div className="flex items-center justify-between overflow-x-auto pb-4 scrollbar-hide">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          const isClickable = isCompleted || isCurrent;

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              {/* Step Circle + Label */}
              <button
                type="button"
                onClick={() => isClickable && onStepClick?.(step.id)}
                disabled={!isClickable}
                className={cn(
                  'flex flex-col items-center gap-2 transition-all',
                  isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                )}
              >
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all',
                  isCompleted ? 'bg-emerald-500 text-white' :
                  isCurrent ? 'bg-rose-500 text-white ring-4 ring-rose-100' :
                  'bg-slate-100 text-slate-400'
                )}>
                  {isCompleted ? <Check className="h-5 w-5" /> : step.id}
                </div>
                <div className="text-center">
                  <p className={cn(
                    'text-xs font-medium',
                    isCurrent ? 'text-rose-600' :
                    isCompleted ? 'text-slate-900' :
                    'text-slate-400'
                  )}>
                    {step.title}
                  </p>
                </div>
              </button>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className={cn(
                  'flex-1 h-0.5 mx-2 mb-8 transition-all',
                  completedSteps.includes(step.id) ? 'bg-emerald-500' : 'bg-slate-200'
                )} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
