import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../../context/authContext'; // Adjust the path if needed
import { useEffect } from 'react';

export default function Hero() {
  const navigate = useNavigate();
  const { user, loading } = UserAuth();

  const handleClick = () => {
    if (loading) return; // prevent early redirect
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="h-screen lg:h-[90vh] relative flex justify-center items-center py-10 lg:py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/id/1/1200/800')] bg-cover opacity-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl opacity-20"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Your{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  AI-Powered
                </span>{' '}
                Career Journey
              </h1>
              <p className="mt-6 text-lg text-gray-300">
                Discover your personalized career roadmap with our advanced AI
                technology. Input your skills, experience, and goals to receive
                a tailored path to success.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={handleClick}
                  disabled={loading}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-purple-500/20 font-medium"
                >
                  Get Your Roadmap
                </button>
                <a
                  href="#how-it-works"
                  className="px-6 py-3 rounded-full border border-purple-500/50 hover:bg-purple-500/10 transition-all font-medium"
                >
                  Learn More
                </a>
              </div>
            </div>

            {/* AI Chat Box */}
            {/* Right column - Visual element */}
            <div className="relative hidden lg:block">
              {/* 3D-like UI card stack with gradient borders */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-30 -m-4"></div>
              <div className="relative">
                {/* Card 2 (middle) */}
                <div className="absolute top-4 -right-2 w-full h-[420px] bg-gray-800/50 rounded-2xl border border-purple-500/20 transform rotate-3"></div>

                {/* Card 1 (foreground) - Main feature showcase */}
                <div className="relative w-full h-[420px] bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-purple-500/20 overflow-hidden">
                  {/* Card header */}
                  <div className="p-6 border-b border-gray-700/50">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="text-xs text-gray-400">
                        Career Analysis Dashboard
                      </div>
                    </div>
                  </div>

                  {/* Card content - Career dashboard mockup */}
                  <div className="p-6">
                    {/* User profile section */}
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                        JD
                      </div>
                      <div className="ml-4">
                        <div className="text-white font-medium">Jane Doe</div>
                        <div className="text-gray-400 text-sm">
                          Senior Developer
                        </div>
                      </div>
                      <div className="ml-auto">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                          Premium
                        </span>
                      </div>
                    </div>

                    {/* Career progress bar */}
                    <div className="mb-6">
                      <div className="flex justify-between text-xs text-gray-400 mb-2">
                        <span>Career Progress</span>
                        <span>68%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full w-[68%] bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
                      </div>
                    </div>

                    {/* Skills analysis */}
                    <div className="mb-6">
                      <div className="text-sm text-white mb-3">
                        Skills Analysis
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {/* Skill 1 */}
                        <div className="bg-gray-700/50 rounded-lg p-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-300">Leadership</span>
                            <span className="text-blue-400">Advanced</span>
                          </div>
                          <div className="h-1 w-full bg-gray-600 rounded-full overflow-hidden">
                            <div className="h-full w-[85%] bg-blue-400 rounded-full"></div>
                          </div>
                        </div>

                        {/* Skill 2 */}
                        <div className="bg-gray-700/50 rounded-lg p-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-300">Technical</span>
                            <span className="text-purple-400">Expert</span>
                          </div>
                          <div className="h-1 w-full bg-gray-600 rounded-full overflow-hidden">
                            <div className="h-full w-[92%] bg-purple-400 rounded-full"></div>
                          </div>
                        </div>

                        {/* Skill 3 */}
                        <div className="bg-gray-700/50 rounded-lg p-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-300">Communication</span>
                            <span className="text-blue-400">Advanced</span>
                          </div>
                          <div className="h-1 w-full bg-gray-600 rounded-full overflow-hidden">
                            <div className="h-full w-[78%] bg-blue-400 rounded-full"></div>
                          </div>
                        </div>

                        {/* Skill 4 */}
                        <div className="bg-gray-700/50 rounded-lg p-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-300">Strategy</span>
                            <span className="text-blue-400">Intermediate</span>
                          </div>
                          <div className="h-1 w-full bg-gray-600 rounded-full overflow-hidden">
                            <div className="h-full w-[65%] bg-blue-400 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recommended next steps */}
                    <div>
                      <div className="text-sm text-white mb-3">
                        Recommended Next Steps
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                          <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mr-3">
                            <svg
                              className="w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <span className="text-xs text-gray-300">
                            Complete Leadership Assessment
                          </span>
                        </div>
                        <div className="flex items-center p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                          <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 mr-3">
                            <svg
                              className="w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path
                                fillRule="evenodd"
                                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <span className="text-xs text-gray-300">
                            Review Strategic Planning Course
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* End AI Chat Box */}
          </div>
        </div>
      </section>
    </>
  );
}
