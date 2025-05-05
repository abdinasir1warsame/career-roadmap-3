import React, { useState } from 'react';
import RadialProgressChart from '../cvReviewComponents/radialProgressChart';
import JobComparison from './jobcomparison';

function CoreCvReview({ coreAnalysis, jobAnalysis }) {
  const { analysis } = coreAnalysis;
  const [activeTab, setActiveTab] = useState('summary');
  const [mainView, setMainView] = useState('core');

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStrengthLabel = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Strong';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Work';
  };

  const GlowButton = ({
    children,
    onClick,
    active = false,
    className = '',
  }) => {
    return (
      <button
        onClick={onClick}
        className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
          active
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
            : 'bg-gray-800 text-gray-400 hover:text-white hover:shadow-[0_0_10px_rgba(59,130,246,0.3)]'
        } ${className}`}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="min-h-screen text-white p-6">
      <div className="max-w-7xl mx-auto bg-gray-800/60 backdrop-blur-md border border-blue-500/30 rounded-xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 p-4 bg-gray-800/80 rounded-lg border border-blue-500/20">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold mb-2">Resume Strength Score</h2>
            <p className="text-gray-400">{analysis.overallPositioning}</p>
          </div>
          <div className="flex items-center">
            <RadialProgressChart
              percentage={analysis.overallScore}
              size={150}
              strokeWidth={12}
            />
            <div className="ml-4">
              <p className="text-md">
                {getStrengthLabel(analysis.overallScore)}
              </p>
              <p className="text-md text-gray-400">
                Based on comprehensive analysis
              </p>
            </div>
          </div>
        </div>

        <div className="flex space-x-4 mb-6">
          <GlowButton
            active={mainView === 'core'}
            onClick={() => setMainView('core')}
          >
            Core Evaluation
          </GlowButton>
          <GlowButton
            active={mainView === 'job'}
            onClick={() => setMainView('job')}
          >
            Job Comparison
          </GlowButton>
        </div>

        {mainView === 'core' ? (
          <div className="mt-6">
            <div className="bg-gray-800/60 backdrop-blur-md border border-blue-500/30 rounded-xl p-6 shadow-lg">
              <div className="flex flex-wrap gap-3 mb-6">
                {['summary', 'experience', 'skills', 'formatting'].map(
                  (tab) => (
                    <button
                      key={tab}
                      className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 capitalize ${
                        activeTab === tab
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                          : 'bg-gray-800 text-gray-400 hover:text-white hover:shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                      }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </button>
                  )
                )}
              </div>

              <div className="mt-4">
                {activeTab === 'summary' && (
                  <div>
                    <div className="mb-6">
                      <h3 className="text-md uppercase text-blue-400 mb-3 font-bold tracking-wider">
                        Professional Summary
                      </h3>
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-700/40 rounded-md border border-red-500/20">
                          <h4 className="text-md uppercase text-red-400 mb-2">
                            Current Summary
                          </h4>
                          <p className="text-md text-gray-300">
                            {analysis.improvementSuggestions.summary.original}
                          </p>
                        </div>
                        <div className="p-4 bg-gray-700/40 rounded-md border border-emerald-500/20">
                          <h4 className="text-md uppercase text-emerald-400 mb-2">
                            Improved Summary
                          </h4>
                          <p className="text-md text-gray-300">
                            {analysis.improvementSuggestions.summary.improved}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-md uppercase text-yellow-400 mb-3 font-bold tracking-wider">
                        Summary Writing Tips
                      </h3>
                      <ul className="space-y-2">
                        {analysis.improvementSuggestions.summary.tips.map(
                          (tip, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-yellow-400 mr-2">•</span>
                              <span className="text-md text-gray-300">
                                {tip}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'experience' && (
                  <div>
                    <div className="mb-6">
                      <h3 className="text-md uppercase text-blue-400 mb-3 font-bold tracking-wider">
                        Experience Bullet Points
                      </h3>
                      <div className="space-y-4">
                        {analysis.improvementSuggestions.experience.bullets.map(
                          (bullet, index) => (
                            <div
                              key={index}
                              className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                              <div className="p-4 bg-gray-700/40 rounded-md border border-red-500/20">
                                <h4 className="text-md uppercase text-red-400 mb-2">
                                  Current Bullet
                                </h4>
                                <p className="text-md text-gray-300">
                                  {bullet.original}
                                </p>
                              </div>
                              <div className="p-4 bg-gray-700/40 rounded-md border border-emerald-500/20">
                                <h4 className="text-md uppercase text-emerald-400 mb-2">
                                  Improved Bullet
                                </h4>
                                <p className="text-md text-gray-300">
                                  {bullet.improved}
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-md uppercase text-yellow-400 mb-3 font-bold tracking-wider">
                        Experience Writing Tips
                      </h3>
                      <ul className="space-y-2">
                        {analysis.improvementSuggestions.experience.tips.map(
                          (tip, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-yellow-400 mr-2">•</span>
                              <span className="text-md text-gray-300">
                                {tip}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'skills' && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h3 className="text-md uppercase text-red-400 mb-3 font-bold tracking-wider">
                          Missing Key Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {analysis.improvementSuggestions.skills.missing.map(
                            (skill, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-gray-700/60 border border-red-500/30 rounded-full text-md text-red-400"
                              >
                                {skill}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-md uppercase text-yellow-400 mb-3 font-bold tracking-wider">
                          Overused/Generic Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {analysis.improvementSuggestions.skills.overused.map(
                            (skill, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-gray-700/60 border border-yellow-500/30 rounded-full text-md text-yellow-400"
                              >
                                {skill}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-md uppercase text-blue-400 mb-3 font-bold tracking-wider">
                        Skills Section Tips
                      </h3>
                      <ul className="space-y-2">
                        {analysis.improvementSuggestions.skills.tips.map(
                          (tip, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-blue-400 mr-2">•</span>
                              <span className="text-md text-gray-300">
                                {tip}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'formatting' && (
                  <div>
                    <div className="mb-6">
                      <h3 className="text-md uppercase text-red-400 mb-3 font-bold tracking-wider">
                        Formatting Issues
                      </h3>
                      <ul className="space-y-2">
                        {analysis.improvementSuggestions.formatting.issues.map(
                          (issue, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-red-400 mr-2">✗</span>
                              <span className="text-md text-gray-300">
                                {issue}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-md uppercase text-blue-400 mb-3 font-bold tracking-wider">
                        Formatting Best Practices
                      </h3>
                      <ul className="space-y-2">
                        {analysis.improvementSuggestions.formatting.tips.map(
                          (tip, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-blue-400 mr-2">•</span>
                              <span className="text-md text-gray-300">
                                {tip}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-4 mt-8">
                <GlowButton className="flex-1">
                  APPLY ALL IMPROVEMENTS
                </GlowButton>
                <GlowButton className="flex-1">
                  DOWNLOAD IMPROVED RESUME
                </GlowButton>
              </div>
            </div>
          </div>
        ) : (
          <JobComparison jobComparison={jobAnalysis} />
        )}

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-1 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-gray-800/60 backdrop-blur-md border border-blue-500/30 rounded-xl p-6 h-full shadow-lg">
              <h2 className="text-xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                AI FEEDBACK
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 py-5">
                <div className="mb-6">
                  <h3 className="text-md uppercase text-emerald-400 mb-2 font-bold tracking-wider">
                    Strengths
                  </h3>
                  <ul className="space-y-2">
                    {analysis.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-emerald-400 mr-2">✓</span>
                        <span className="text-md text-gray-300">
                          {strength}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-6">
                  <h3 className="text-md uppercase text-red-400 mb-2 font-bold tracking-wider">
                    Areas to Improve
                  </h3>
                  <ul className="space-y-2">
                    {analysis.weaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-red-400 mr-2">✗</span>
                        <span className="text-md text-gray-300">
                          {weakness}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-6">
                  <h3 className="text-md uppercase text-blue-400 mb-2 font-bold tracking-wider">
                    Overall Positioning
                  </h3>
                  <p className="text-md text-gray-300 leading-relaxed">
                    {analysis.overallPositioning}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-8 text-center text-gray-500 text-md">
          <p>AI Resume Analyzer v1.0 • Powered by Advanced NLP</p>
        </footer>
      </div>
    </div>
  );
}

export default CoreCvReview;
