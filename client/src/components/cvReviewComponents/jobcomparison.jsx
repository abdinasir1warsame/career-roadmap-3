import React, { useState, useEffect } from 'react';

const JobComparison = ({ jobComparison }) => {
  const [jobMatchData, setJobMatchData] = useState({});

  useEffect(() => {
    if (jobComparison?.analysis?.jobAnalysis) {
      setJobMatchData(jobComparison.analysis.jobAnalysis);
      console.log('Parsed jobAnalysis:', jobComparison.analysis.jobAnalysis);
    }
  }, [jobComparison]);

  // Circular progress for overall match score
  const CircularProgress = ({ percentage, size = 200 }) => {
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const validPercentage = isNaN(percentage) ? 0 : percentage;
    const offset = circumference - (validPercentage / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="rotate-[-90deg]"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="url(#progressGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="drop-shadow-[0_0_8px_rgba(59,130,246,0.7)]"
          />
          <defs>
            <linearGradient
              id="progressGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            {validPercentage}
          </span>
          <span className="text-gray-400 text-sm mt-1">Match Score</span>
        </div>
      </div>
    );
  };

  // Progress bar for metrics
  const ProgressBar = ({ percentage, label }) => {
    return (
      <div className="w-full">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-white">{label}</span>
          <span className="text-sm font-medium text-white">{percentage}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div
            className="h-2.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  // Keyword badge for missing keywords
  const KeywordBadge = ({ keyword }) => {
    return (
      <div className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-600/30 to-purple-600/30 border border-blue-500/30 text-white text-sm font-medium m-1 backdrop-blur-sm hover:shadow-[0_0_8px_rgba(59,130,246,0.7)] transition-shadow duration-300">
        {keyword}
      </div>
    );
  };

  // Glassmorphism style card
  const GlassCard = ({ title, children, className = '' }) => {
    return (
      <div
        className={`bg-gray-800/60 backdrop-blur-md border border-blue-500/30 rounded-xl p-6 ${className}`}
      >
        <h2 className="text-xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
          {title}
        </h2>
        {children}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white ">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Overall Match Score */}
          <GlassCard
            title="Overall Match Score"
            className="md:col-span-1 flex flex-col items-center justify-center"
          >
            <CircularProgress percentage={jobMatchData.overallScore} />
            <p className="text-gray-400 text-sm mt-4 text-center">
              This score represents how well your resume aligns with the job
              requirements.
            </p>
          </GlassCard>

          {/* Strengths */}
          <GlassCard title="Strengths" className="md:col-span-2">
            <ul className="space-y-2">
              {jobMatchData.strengths?.map((strength, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs mr-3 flex-shrink-0">
                    ✓
                  </span>
                  <span className="text-gray-200">{strength}</span>
                </li>
              ))}
            </ul>
          </GlassCard>

          {/* Areas for Improvement */}
          <GlassCard title="Areas for Improvement" className="md:col-span-2">
            <ul className="space-y-2">
              {jobMatchData.improvements?.map((improvement, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs mr-3 flex-shrink-0">
                    !
                  </span>
                  <span className="text-gray-200">{improvement}</span>
                </li>
              ))}
            </ul>
          </GlassCard>

          {/* Missing Keywords */}
          <GlassCard title="Missing Keywords" className="md:col-span-1">
            <div className="flex flex-wrap">
              {jobMatchData.missingKeywords?.map((keyword, index) => (
                <KeywordBadge key={index} keyword={keyword} />
              ))}
            </div>
            <p className="text-gray-400 text-xs mt-4">
              These keywords appear in the job description but are missing or
              underemphasized in your resume.
            </p>
          </GlassCard>

          {/* Metric Breakdown */}
          <GlassCard title="Metric Breakdown" className="md:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                {jobMatchData.metrics?.slice(0, 3).map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <ProgressBar
                      percentage={metric.score}
                      label={metric.metric}
                    />
                    <p className="text-gray-400 text-sm pl-1">
                      {metric.feedback}
                    </p>
                  </div>
                ))}
              </div>
              <div className="space-y-6">
                {jobMatchData.metrics?.slice(3).map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <ProgressBar
                      percentage={metric.score}
                      label={metric.metric}
                    />
                    <p className="text-gray-400 text-sm pl-1">
                      {metric.feedback}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>

        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>AI-powered analysis by CareerRocket • Updated just now</p>
        </footer>
      </div>
    </div>
  );
};

export default JobComparison;
