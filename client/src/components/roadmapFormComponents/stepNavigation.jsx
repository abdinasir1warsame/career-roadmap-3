export default function StepNavigation({ step, totalSteps, goToStep }) {
  return (
    <div className="flex justify-center mb-4">
      {[...Array(totalSteps)].map((_, i) => (
        <button
          key={i}
          onClick={() => goToStep(i + 1)}
          className={`w-3 h-3 mx-1 rounded-full transition-all duration-300 ${
            step === i + 1
              ? 'bg-gradient-to-b from-blue-600 to-purple-600 scale-125'
              : 'bg-gray-300'
          }`}
          aria-label={`Go to step ${i + 1}`}
        />
      ))}
    </div>
  );
}
