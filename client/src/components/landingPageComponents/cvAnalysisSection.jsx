import React from 'react';

function CvAnalysisSection() {
  return (
    <div className="min-h-screen flex justify-center items-center text-white">
      {' '}
      <section className="min-h-screen flex flex-col md:flex-row items-center justify-center  overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          {' '}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>{' '}
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>{' '}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-400/20 rounded-full blur-xl"></div>{' '}
        </div>

        {/* Content container */}
        <div className="container  z-10 flex flex-col md:flex-row-reverse items-center gap-8 md:gap-20">
          {/* Left side - Feature description */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-md font-medium mb-2">
              AI-Powered Feature
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              AI-Powered{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Smart Resume & Job Match Insights
              </span>{' '}
            </h2>
            <p className="text-lg text-slate-300">
              Get instant, AI-powered feedback on your resume — whether you're
              polishing it or targeting a specific job.
            </p>

            <div className="space-y-4 mt-8">
              <h3 className="text-2xl font-semibold text-white">
                What you'll get:
              </h3>
              <ul className="space-y-3 text-lg">
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-slate-300">
                    A clear overall assessment of your resume's strength
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-slate-300">
                    Feedback on formatting, tone, summary, and achievement focus
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-slate-300">
                    A job-fit breakdown when a role is provided, including skill
                    alignment, relevance, and keyword match
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-slate-300">
                    Specific strengths, improvement suggestions, and missing
                    keywords
                  </span>
                </li>
              </ul>

              <p className="text-gray-400 italic mt-4">
                No guesswork — just actionable guidance to help you stand out.
              </p>
            </div>

            <button className="mt-8 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-purple-500/20">
              Analyze My Resume
            </button>
          </div>

          {/* Right side - Visual representation */}
          <div className="w-full lg:w-1/2 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-30 -m-4"></div>
            <div className="relative rounded-xl border border-purple-500/20 bg-gray-900/50 backdrop-blur-sm p-6 shadow-xl">
              <div className="absolute -top-3 -right-2 w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-2xl opacity-20"></div>

              {/* Resume Analysis UI */}
              <div className="space-y-10 py-5">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-medium text-white">
                    Resume Analysis
                  </h3>
                  <div className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-500/20 text-md text-white">
                    AI Processing
                  </div>
                </div>

                {/* Overall Score */}
                <div className="mt-4 mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Overall Strength</span>
                    <span className="text-white font-medium">78%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                      style={{ width: '78%' }}
                    ></div>
                  </div>
                </div>

                {/* Detailed Scores */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Formatting</span>
                    <div className="flex items-center">
                      <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden mr-2">
                        <div
                          className="h-full bg-gradient-to-r from-blue-400 to-purple-500"
                          style={{ width: '90%' }}
                        ></div>
                      </div>
                      <span className="text-gray-300 text-md">90%</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Content Quality</span>
                    <div className="flex items-center">
                      <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden mr-2">
                        <div
                          className="h-full bg-gradient-to-r from-blue-400 to-purple-500"
                          style={{ width: '75%' }}
                        ></div>
                      </div>
                      <span className="text-gray-300 text-md">75%</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Achievement Focus</span>
                    <div className="flex items-center">
                      <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden mr-2">
                        <div
                          className="h-full bg-gradient-to-r from-blue-400 to-purple-500"
                          style={{ width: '65%' }}
                        ></div>
                      </div>
                      <span className="text-gray-300 text-md">65%</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Keyword Optimization</span>
                    <div className="flex items-center">
                      <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden mr-2">
                        <div
                          className="h-full bg-gradient-to-r from-blue-400 to-purple-500"
                          style={{ width: '82%' }}
                        ></div>
                      </div>
                      <span className="text-gray-300 text-md">82%</span>
                    </div>
                  </div>
                </div>

                {/* Suggestions */}
                <div className="mt-6 p-3 rounded-lg bg-gray-800/50 border border-purple-500/10">
                  <h4 className="text-md font-medium text-white mb-2">
                    Key Suggestions:
                  </h4>
                  <ul className="text-md text-gray-400 space-y-1">
                    <li className="flex items-start gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      <span>
                        Add more quantifiable achievements to your experience
                        section
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      <span>
                        Consider adding "data analysis" and "project management"
                        keywords
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      <span>
                        Strengthen your professional summary with
                        industry-specific language
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CvAnalysisSection;
