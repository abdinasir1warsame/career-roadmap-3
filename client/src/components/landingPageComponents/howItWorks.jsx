export default function HowItWorks() {
  return (
    <>
      <section
        id="how-it-works"
        className="py-20 px-6 bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center"
      >
        {/* Animated background elements */}

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              How{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                It Works
              </span>
            </h2>
            <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
              Our AI-powered platform makes it easy to get your personalized
              career roadmap in just a few steps.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Share Your Profile',
                description:
                  'Tell us about your current role, skills, and experience.',
              },
              {
                step: '2',
                title: 'Define Your Goals',
                description:
                  'Let us know where you want to go in your career journey.',
              },
              {
                step: '3',
                title: 'AI Analysis',
                description:
                  'Our AI analyzes your profile and compares it with thousands of successful career paths.',
              },
              {
                step: '4',
                title: 'Get Your Roadmap',
                description:
                  'Receive a personalized roadmap with actionable steps to achieve your goals.',
              },
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20 h-full">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center font-bold text-xl mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 12H19M19 12L12 5M19 12L12 19"
                        stroke="#8B5CF6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
