import React from 'react';

function CareerRoadmapSection() {
  return (
    <div className="min-h-screen w-full  text-white overflow-hidden">
      <section className="min-h-screen w-full flex items-center justify-center  relative">
        {/* Content container */}
        <div className="container  h-full flex flex-col md:flex-row items-center gap-8 lg:gap-20 py-4">
          {/* Left Side */}
          <div className="w-full md:w-1/2 space-y-4 md:space-y-5">
            <header className="mb-14 space-y-5 pr-20">
              <div className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm font-medium mb-2">
                AI-Powered Feature
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                AI-Powered{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  Career Roadmap
                </span>
              </h2>
              <p className="text-lg text-slate-300">
                Navigate your professional journey with precision using our
                advanced AI career mapping technology
              </p>
            </header>

            <div className="space-y-3 mt-4">
              <div className="space-y-2 md:space-y-3">
                {/* Reusable Feature Item */}
                {[
                  {
                    title: 'Custom Career Roadmap Generation',
                    desc: 'Based on your experience level, goals, and aspirations, our AI-powered coach creates a multi-stage, skill-focused development plan tailored to your target role.',
                  },
                  {
                    title: 'Dynamic Skill Milestones',
                    desc: 'Each roadmap includes concrete, trackable milestones with minimum requirements per stage to keep users progressing with clear objectives.',
                  },
                  {
                    title: 'Data-Driven Progression',
                    desc: 'Your roadmap is saved to your profile, allowing ongoing updates, tracking, and tailored recommendations.',
                  },
                  {
                    title: 'Your Journey, Visualized',
                    desc: 'Watch your career path unfold with interactive visualizations that adapt as you grow and achieve new milestones.',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 md:gap-3">
                    <div className="mt-1 w-4 h-4 md:w-5 md:h-5 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-2 w-2 md:h-3 md:w-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-medium text-sm md:text-lg">
                        {item.title}
                      </h3>
                      <p className="text-slate-300 text-md">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button className="mt-4 md:mt-6 px-5 py-2.5 md:px-6 md:py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-purple-500/20 text-sm md:text-base">
              Generate My Roadmap
            </button>
          </div>

          {/* Right Side */}
          <div className="w-full md:w-1/2 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-30 -m-4"></div>
            <div className="relative rounded-xl border border-purple-500/20 bg-gray-900/50 backdrop-blur-sm p-4 md:p-6 shadow-xl">
              <div className="absolute -top-3 -right-3 w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-2xl opacity-20"></div>

              <div className="space-y-3 md:space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-base md:text-lg font-medium text-white">
                    Career Roadmap
                  </h3>
                  <div className="px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-500/20 text-xs md:text-sm text-white">
                    AI Generated
                  </div>
                </div>

                <div className="mt-3 mb-4">
                  <div className="flex justify-between mb-1 md:mb-2">
                    <span className="text-gray-400 text-xs md:text-sm">
                      Overall Progress
                    </span>
                    <span className="text-white font-medium text-xs md:text-sm">
                      35%
                    </span>
                  </div>
                  <div className="h-1.5 md:h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                      style={{ width: '35%' }}
                    ></div>
                  </div>
                </div>

                {/* Stages */}
                {[
                  {
                    label: 'Foundation',
                    desc: 'Core skills acquisition',
                    status: 'Completed',
                    color: 'green',
                    completed: true,
                  },
                  {
                    label: 'Advancement',
                    desc: 'Specialized knowledge',
                    status: 'In Progress (70%)',
                    color: 'blue',
                    inProgress: true,
                  },
                  {
                    label: 'Expertise',
                    desc: 'Leadership & innovation',
                    status: 'Upcoming',
                    color: 'gray',
                    number: 3,
                  },
                  {
                    label: 'Mastery',
                    desc: 'Career goal achieved',
                    status: 'Upcoming',
                    color: 'gray',
                    number: 4,
                  },
                ].map((stage, idx) => (
                  <div key={idx} className="flex items-start relative">
                    <div className="relative">
                      <div
                        className={`w-[30px] h-[30px] md:w-[38px] md:h-[38px] rounded-full ${
                          stage.completed
                            ? 'bg-gradient-to-br from-blue-400 to-purple-500'
                            : stage.inProgress
                            ? 'bg-gradient-to-br from-blue-400 to-purple-500'
                            : 'bg-gray-700'
                        } flex items-center justify-center z-10`}
                      >
                        {stage.completed ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 md:h-5 md:w-5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : stage.inProgress ? (
                          <div className="w-[18px] h-[18px] md:w-[22px] md:h-[22px] rounded-full bg-gray-900 flex items-center justify-center">
                            <div className="w-[10px] h-[10px] md:w-[12px] md:h-[12px] rounded-full bg-blue-400 animate-pulse"></div>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs md:text-sm">
                            {stage.number}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="ml-3 md:ml-4">
                      <h4
                        className={`font-medium text-sm md:text-base ${
                          stage.completed || stage.inProgress
                            ? 'text-white'
                            : 'text-gray-300'
                        }`}
                      >
                        {stage.label}
                      </h4>
                      <p className="text-gray-400 text-xs md:text-sm">
                        {stage.desc}
                      </p>
                      <div
                        className={`mt-1 px-2 py-0.5 rounded-full bg-${stage.color}-500/20 text-${stage.color}-400 text-xs inline-block`}
                      >
                        {stage.status}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Current Focus Area */}
                <div className="mt-4 p-2 md:p-3 rounded-lg bg-gray-800/50 border border-purple-500/10">
                  <h4 className="text-xs md:text-sm font-medium text-white mb-1 md:mb-2">
                    Current Focus:
                  </h4>
                  {[
                    ['Advanced Data Analysis', 65],
                    ['Team Leadership', 40],
                    ['Industry Certification', 85],
                  ].map(([label, progress], i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-xs md:text-sm text-gray-300">
                        {label}
                      </span>
                      <div className="w-16 md:w-20 h-1 md:h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-400 to-purple-500"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Decorations */}
            <div className="absolute -top-4 -left-4 w-8 h-8 md:w-12 md:h-12 rounded-lg border border-purple-500/20 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 md:h-6 md:w-6 text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M9 19l3 3m0 0l3-3m-3 3V10m0 0l3 3m-3-3l-3 3m12-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="absolute -bottom-3 right-8 md:right-12 w-7 h-7 md:w-10 md:h-10 rounded-full border border-blue-500/20 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 md:h-5 md:w-5 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CareerRoadmapSection;
