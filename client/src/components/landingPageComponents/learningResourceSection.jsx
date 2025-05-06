import React from 'react';

function LearningResourceSection() {
  return (
    <div className="min-h-screen flex justify-center items-center text-white font-sans">
      <section className="min-h-screen flex flex-col md:flex-row items-center justify-center  overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container  z-10 flex flex-col md:flex-row items-center gap-8 lg:gap-20">
          <div className="lg:w-1/2 space-y-6 md:pr-8">
            <div className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm font-medium mb-2">
              AI-Powered Feature
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Curated{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Learning Resources
              </span>{' '}
            </h2>
            <p className="text-lg text-slate-300">
              Access personalized content to accelerate your growth, tailored
              specifically to your career path and learning style.
            </p>

            <div className="space-y-4 pt-4">
              {/* Feature 1 */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">
                    Short, Engaging Videos
                  </h3>
                  <p className="text-slate-300">
                    Tailored to your current skills and goals, our bite-sized
                    videos make learning efficient and enjoyable.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">
                    Relevant Reading Recommendations
                  </h3>
                  <p className="text-slate-300">
                    Discover articles, books, and guides perfectly matched to
                    your learning stage and interests.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">
                    Saved to Your Profile
                  </h3>
                  <p className="text-slate-300">
                    All resources are automatically saved so you can pick up
                    right where you left off, anytime.
                  </p>
                </div>
              </div>
            </div>

            <button className="mt-8 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 focus:ring-2 focus:ring-purple-500/50 focus:outline-none">
              Explore Learning Resources
            </button>
          </div>

          <div className="lg:w-1/2 flex-1 relative">
            <div className="relative w-full ">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-30 -m-4"></div>
              <div className="bg-gray-800/60 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 shadow-xl shadow-purple-500/5">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-white">
                    Your Learning Path
                  </h3>
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                    <div className="w-2 h-2 rounded-full bg-pink-400"></div>
                  </div>
                </div>

                <div className="w-full h-2 bg-gray-700 rounded-full mb-6">
                  <div className="h-full w-3/4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
                </div>

                <div className="bg-gray-900/80 rounded-xl p-4 mb-4 border border-gray-700">
                  <div className="aspect-video bg-gray-800 rounded-lg mb-3 overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <h4 className="font-medium text-white">
                    Advanced Data Structures for ML Engineers
                  </h4>
                  <p className="text-gray-400 text-sm mt-1">
                    12 min • Recommended for your skill level
                  </p>
                </div>

                <div className="bg-gray-900/80 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-white">
                        The Future of AI in Career Development
                      </h4>
                      <p className="text-gray-400 text-sm mt-1">
                        15 min read • Trending in your field
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LearningResourceSection;
