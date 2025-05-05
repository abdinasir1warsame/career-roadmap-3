export default function ResumeAnalysisCard() {
  return (
    <>
      const ResumeAnalysisCard = () (
      <div className="bg-gray-800/60 backdrop-blur-md border border-blue-500/30 rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-4">Resume Analysis</h2>
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-white font-bold">Overall Match Score</span>
            <span className="text-white font-bold">{overallCoreScore}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2.5 rounded-full"
              style={{ width: `${overallCoreScore}%` }}
            ></div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-gray-800/60 backdrop-blur-md border border-blue-500/30 rounded-xl p-4">
            <h3 className="text-white font-bold">Strengths</h3>
            <ul className="mt-2 space-y-1 text-gray-400 text-sm">
              {coreAnalysis?.analysis?.resumeStrength?.overview
                ?.split('. ')
                .filter(Boolean)
                .map((point, index) => (
                  <li key={index}>• {point.trim()}</li>
                ))}
            </ul>
          </div>
          <div className="bg-gray-800/60 backdrop-blur-md border border-blue-500/30 rounded-xl p-4">
            <h3 className="text-white font-bold">Improvement Areas</h3>
            <ul className="mt-2 space-y-1 text-gray-400 text-sm">
              {coreAnalysis?.analysis?.improvementSuggestions?.additional?.map(
                (item, index) => (
                  <li key={index}>• {item}</li>
                )
              )}
            </ul>
          </div>
          <div className="bg-gray-800/60 backdrop-blur-md border border-blue-500/30 rounded-xl p-4">
            <h3 className="text-white font-bold">Missing Keywords</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {coreAnalysis?.analysis?.technicalEvaluation?.missingKeywords?.map(
                (keyword, index) => (
                  <span
                    key={index}
                    className="bg-gray-700 text-white text-xs px-2 py-1 rounded-xl"
                  >
                    {keyword}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
      );
    </>
  );
}
