import React, { useState, useEffect } from 'react';
import { UploadCloud, ScanText, BadgeCheck, FileBarChart } from 'lucide-react';

const steps = [
  {
    label: 'Uploading and reading your CV...',
    icon: <UploadCloud className="w-16 h-16 text-white animate-pulse" />,
  },
  {
    label: 'Analyzing content and structure...',
    icon: <ScanText className="w-16 h-16 text-white animate-pulse" />,
  },
  {
    label: 'Assessing skills and experience...',
    icon: <BadgeCheck className="w-16 h-16 text-white animate-pulse" />,
  },
  {
    label: 'Generating your personalized report...',
    icon: <FileBarChart className="w-16 h-16 text-white animate-pulse" />,
  },
];

function GeneralLoader() {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const totalDuration = 16000; // 16 seconds
    const totalSteps = 100;
    const intervalDuration = totalDuration / totalSteps; // 160ms

    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 1;

        // Increment step only if the progress is a multiple of 25
        if (newProgress % 25 === 0 && currentStep < steps.length - 1) {
          setCurrentStep((prevStep) =>
            Math.min(prevStep + 1, steps.length - 1)
          ); // Ensure it doesn't exceed the last index
        }

        if (newProgress >= 100) {
          clearInterval(timer);
        }

        return newProgress;
      });
    }, intervalDuration);

    return () => clearInterval(timer);
  }, [currentStep]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl bg-gray-800/60 backdrop-blur-md border border-blue-500/30 shadow-lg shadow-blue-500/10 p-6 space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">
            CV Review in Progress
          </h2>
          <p className="mt-2 text-gray-300">
            Our AI is analyzing your CV to provide personalized feedback
          </p>
        </div>

        {/* Animated Icon Center */}
        <div className="flex justify-center py-4">
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Blurred Glows */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 opacity-20 blur-xl animate-pulse"></div>
            <div
              className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 opacity-30 blur-md animate-pulse"
              style={{ animationDelay: '300ms' }}
            ></div>

            {/* Center Icon */}
            <div className="relative z-10">
              {steps[currentStep]?.icon} {/* Use optional chaining */}
            </div>

            {/* Spinner Ring */}
            <div className="absolute inset-0 rounded-full border-4 border-gray-700"></div>
            <div
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-purple-600 animate-spin"
              style={{ animationDuration: '2s' }}
            ></div>
          </div>
        </div>

        {/* Step Label */}
        <div className="text-center">
          <p className="text-lg font-medium text-gray-400">
            {steps[currentStep]?.label} {/* Use optional chaining */}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="text-center text-sm text-gray-400">
          <p>{progress}% complete</p>
        </div>

        {/* Pulsing Dots */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            ></div>
          ))}
        </div>

        <div className="text-center text-xs text-gray-500">
          <p>This may take a few moments. Please don’t close this window.</p>
        </div>
      </div>
    </div>
  );
}

export default GeneralLoader;
