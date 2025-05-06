function InterViewSection() {
  return (
    <div className="min-h-screen  text-white">
      <MockInterviewSection />
    </div>
  );
}

const MockInterviewSection = () => {
  return (
    <section className="min-h-screen relative overflow-hidden flex flex-col justify-center items-center">
      <div className="container   z-10 py-12">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-8 lg:gap-20">
          <div className="lg:w-1/2 space-y-6">
            <div className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm font-medium mb-2">
              AI-Powered Feature
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              AI-Powered{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Mock Interviews
              </span>{' '}
            </h2>
            <p className="text-lg text-slate-300">
              Practice technical interviews in real time with an intelligent
              virtual interviewer tailored to your target role and experience
              level.
            </p>

            <div className="pt-4">
              <h3 className="text-xl font-semibold text-white mb-4">
                What you get:
              </h3>

              <div className="space-y-6">
                {[
                  {
                    title: 'Fully Simulated Experience',
                    desc: 'A complete interview experience based on your job title and seniority level',
                    iconColor: 'text-blue-400',
                    bgColor: 'bg-blue-500/20',
                    path: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
                  },
                  {
                    title: 'Natural Conversation Flow',
                    desc: 'Engage with an AI interviewer that responds naturally to your answers',
                    iconColor: 'text-purple-400',
                    bgColor: 'bg-purple-500/20',
                    path: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
                  },
                  {
                    title: 'Real-time AI Feedback',
                    desc: 'Get immediate feedback after each answer to improve your responses',
                    iconColor: 'text-cyan-400',
                    bgColor: 'bg-cyan-500/20',
                    path: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
                  },
                  {
                    title: 'Detailed Summary Report',
                    desc: 'Receive a comprehensive analysis of your performance with actionable tips',
                    iconColor: 'text-green-400',
                    bgColor: 'bg-green-500/20',
                    path: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
                  },
                ].map(({ title, desc, iconColor, bgColor, path }, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-purple-500/20"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`${bgColor} p-2 rounded-lg`}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-6 w-6 ${iconColor}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={path}
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-white">
                          {title}
                        </h4>
                        <p className="text-slate-300">{desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button className="mt-8 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-medium text-white hover:opacity-90 transition-all shadow-lg shadow-blue-500/20">
              Try Mock Interview
            </button>
          </div>

          <div className="relative lg:w-1/2 mt-8 lg:mt-0">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-30 -m-4"></div>
            <div className="relative">
              <div className="relative bg-slate-800 rounded-2xl p-6 overflow-hidden border border-purple-500/20">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="ml-2 text-xs text-slate-400">
                    AI Interview Session
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold">AI</span>
                    </div>
                    <div className="bg-slate-700 rounded-lg rounded-tl-none p-3 text-sm text-slate-200">
                      <p>
                        Hello! I'm your AI interviewer today. We'll be
                        discussing your experience with React development. Could
                        you start by telling me about your most challenging
                        project?
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 justify-end">
                    <div className="bg-blue-500/20 rounded-lg rounded-tr-none p-3 text-sm text-slate-200">
                      <p>
                        My most challenging project was building a real-time
                        collaboration tool where multiple users could edit
                        documents simultaneously...
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold">You</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold">AI</span>
                    </div>
                    <div className="bg-slate-700 rounded-lg rounded-tl-none p-3 text-sm text-slate-200">
                      <p>
                        That sounds interesting! How did you handle state
                        management for multiple users editing simultaneously?
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold">FB</span>
                    </div>
                    <div className="bg-green-500/20 rounded-lg rounded-tl-none p-3 text-sm text-slate-200">
                      <p className="font-medium text-green-400">Feedback:</p>
                      <p>
                        Good start! You've identified a relevant project.
                        Consider adding specific technical challenges you
                        overcame and the technologies you used.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <span className="block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span>AI is listening...</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-700">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
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
                      AI-powered interview in progress • 05:23 elapsed
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20 text-center">
                <div className="text-2xl font-bold text-blue-400">93%</div>
                <div className="text-xs text-slate-400">Accuracy Rate</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20 text-center">
                <div className="text-2xl font-bold text-purple-400">500+</div>
                <div className="text-xs text-slate-400">Question Bank</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20 text-center">
                <div className="text-2xl font-bold text-cyan-400">24/7</div>
                <div className="text-xs text-slate-400">Availability</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InterViewSection;
