import { Link } from 'react-router-dom';
export default function Hero() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-10 lg:py-28 px-6 overflow-hidden">
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
                <Link
                  to={'/login'}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-purple-500/20 font-medium"
                >
                  Get Your Roadmap
                </Link>
                <a
                  href="#how-it-works"
                  className="px-6 py-3 rounded-full border border-purple-500/50 hover:bg-purple-500/10 transition-all font-medium"
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-30 -m-4"></div>
              <div className="relative bg-gray-900/80 backdrop-blur-sm p-6 rounded-2xl border border-purple-500/20">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="ml-auto text-sm text-gray-400">
                    AI Career Analysis
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      AI
                    </div>
                    <div className="bg-blue-900/40 rounded-lg p-3 border border-blue-700/30 max-w-[80%]">
                      Hello! I'm your AI career assistant. What's your current
                      role?
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <div className="bg-purple-900/40 rounded-lg p-3 border border-purple-700/30 max-w-[80%]">
                      I'm a junior web developer looking to become a full-stack
                      engineer.
                    </div>
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                      U
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      AI
                    </div>
                    <div className="bg-blue-900/40 rounded-lg p-3 border border-blue-700/30 max-w-[80%]">
                      Great! Based on market trends and your profile, I
                      recommend focusing on these technologies: React, Node.js,
                      and cloud services like AWS. Let me create your
                      personalized roadmap...
                    </div>
                  </div>
                  <div className="animate-pulse flex justify-start gap-1 ml-11">
                    <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                    <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                    <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
