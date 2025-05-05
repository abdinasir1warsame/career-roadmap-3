import React, { useState } from 'react';

function Subscriptions() {
  const [selectedTier, setSelectedTier] = useState(null);

  const tiers = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      description: 'Get started with basic career planning',
      features: [
        'Limited roadmap generation (1 per month)',
        'Basic skill assessment',
        'Career path visualization',
        'Community forum access',
      ],
      popular: false,
      buttonText: 'Get Started',
    },
    {
      id: 'starter',
      name: 'Starter',
      price: '$9',
      description: 'Expand your career planning toolkit',
      features: [
        'Unlimited roadmaps',
        'Course suggestions',
        'Skill gap analysis',
        'Learning resource recommendations',
      ],
      popular: true,
      buttonText: 'Choose Starter',
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$19',
      description: 'Accelerate your career growth',
      features: [
        'Everything in Starter',
        'Save progress',
        'Job listings',
        'Export options',
        'Monthly progress reports',
      ],
      popular: false,
      buttonText: 'Choose Pro',
    },
    {
      id: 'career-pro',
      name: 'Career Pro+',
      price: '$29',
      description: 'Comprehensive career advancement',
      features: [
        'Everything in Pro',
        'CV feedback (AI or human review)',
        'Interview Q&A preparation',
        'Priority support',
        'Personalized mentor matching',
      ],
      popular: false,
      buttonText: 'Choose Career Pro+',
    },
  ];

  const handleTierSelect = (tierId) => {
    setSelectedTier(tierId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-8 flex flex-col items-center">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 -right-20 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-20 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="w-full max-w-6xl mb-8 md:mb-12 relative z-10">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            CareerAI Assistant
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl">
            Accelerate your career with our AI-powered guidance. Choose the plan
            that fits your professional journey.
          </p>
        </div>
      </header>

      {/* Subscription Tiers */}
      <main className="w-full max-w-6xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`
                relative p-6 rounded-xl transition-all duration-300
                ${
                  selectedTier === tier.id
                    ? 'bg-gray-800/80 backdrop-blur-md border border-blue-500/50 shadow-lg shadow-blue-500/20'
                    : 'bg-gray-800/60 backdrop-blur-md border border-blue-500/30'
                }
                ${tier.popular ? 'transform md:-translate-y-2' : ''}
              `}
              onClick={() => handleTierSelect(tier.id)}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-0 right-0 mx-auto w-max px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-xs font-bold">
                  MOST POPULAR
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-xl font-bold">{tier.name}</h3>
                <div className="flex items-end mt-2">
                  <span className="text-3xl font-bold">{tier.price}</span>
                  <span className="text-gray-400 ml-1">/month</span>
                </div>
                <p className="text-gray-400 text-sm mt-2">{tier.description}</p>
              </div>

              <ul className="space-y-3 mb-6">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0"
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
                    <span className="text-sm text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`
                  w-full py-3 px-4 rounded-lg font-medium text-sm transition-all duration-300
                  ${
                    selectedTier === tier.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-600/30 transform scale-105'
                      : 'bg-gray-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:shadow-md hover:shadow-blue-600/20'
                  }
                `}
              >
                {tier.buttonText}
              </button>

              {selectedTier === tier.id && (
                <div className="absolute -inset-px rounded-xl border border-blue-500 opacity-50 pointer-events-none"></div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Features Comparison */}
      <section className="w-full max-w-6xl mt-12 md:mt-16 relative z-10">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Feature Comparison
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full bg-gray-800/60 backdrop-blur-md border border-blue-500/30 rounded-xl">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="p-4 text-left">Features</th>
                {tiers.map((tier) => (
                  <th key={tier.id} className="p-4 text-center">
                    {tier.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-700">
                <td className="p-4 text-gray-300">Roadmap Generation</td>
                <td className="p-4 text-center text-gray-300">
                  Limited (1/month)
                </td>
                <td className="p-4 text-center text-gray-300">Unlimited</td>
                <td className="p-4 text-center text-gray-300">Unlimited</td>
                <td className="p-4 text-center text-gray-300">Unlimited</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="p-4 text-gray-300">Course Suggestions</td>
                <td className="p-4 text-center">
                  <svg
                    className="h-5 w-5 text-gray-500 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </td>
                <td className="p-4 text-center">
                  <svg
                    className="h-5 w-5 text-blue-400 mx-auto"
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
                </td>
                <td className="p-4 text-center">
                  <svg
                    className="h-5 w-5 text-blue-400 mx-auto"
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
                </td>
                <td className="p-4 text-center">
                  <svg
                    className="h-5 w-5 text-blue-400 mx-auto"
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
                </td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="p-4 text-gray-300">Save Progress</td>
                <td className="p-4 text-center">
                  <svg
                    className="h-5 w-5 text-gray-500 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </td>
                <td className="p-4 text-center">
                  <svg
                    className="h-5 w-5 text-gray-500 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </td>
                <td className="p-4 text-center">
                  <svg
                    className="h-5 w-5 text-blue-400 mx-auto"
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
                </td>
                <td className="p-4 text-center">
                  <svg
                    className="h-5 w-5 text-blue-400 mx-auto"
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
                </td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="p-4 text-gray-300">Job Listings</td>
                <td className="p-4 text-center">
                  <svg
                    className="h-5 w-5 text-gray-500 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </td>
                <td className="p-4 text-center">
                  <svg
                    className="h-5 w-5 text-gray-500 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </td>
                <td className="p-4 text-center">
                  <svg
                    className="h-5 w-5 text-blue-400 mx-auto"
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
                </td>
                <td className="p-4 text-center">
                  <svg
                    className="h-5 w-5 text-blue-400 mx-auto"
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
                </td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="p-4 text-gray-300">CV Feedback</td>
                <td className="p-4 text-center">
                  <svg
                    className="h-5 w-5 text-gray-500 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </td>
                <td className="p-4 text-center">
                  <svg
                    className="h-5 w-5 text-gray-500 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </td>
                <td className="p-4 text-center">
                  <svg
                    className="h-5 w-5 text-gray-500 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </td>
                <td className="p-4 text-center">
                  <svg
                    className="h-5 w-5 text-blue-400 mx-auto"
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
                </td>
              </tr>
              <tr>
                <td className="p-4 text-gray-300">Priority Support</td>
                <td className="p-4 text-center">
                  <svg
                    className="h-5 w-5 text-gray-500 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </td>
                <td className="p-4 text-center">
                  <svg
                    className="h-5 w-5 text-gray-500 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </td>
                <td className="p-4 text-center">
                  <svg
                    className="h-5 w-5 text-gray-500 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </td>
                <td className="p-4 text-center">
                  <svg
                    className="h-5 w-5 text-blue-400 mx-auto"
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
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full max-w-6xl mt-12 md:mt-16 relative z-10">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Frequently Asked Questions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-gray-800/60 backdrop-blur-md border border-blue-500/30 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-2">
              Can I change my plan later?
            </h3>
            <p className="text-gray-300 text-sm">
              Yes, you can upgrade or downgrade your plan at any time. Changes
              will be applied to your next billing cycle.
            </p>
          </div>

          <div className="bg-gray-800/60 backdrop-blur-md border border-blue-500/30 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-2">Is there a free trial?</h3>
            <p className="text-gray-300 text-sm">
              Yes, all paid plans come with a 7-day free trial. You won't be
              charged until the trial period ends.
            </p>
          </div>

          <div className="bg-gray-800/60 backdrop-blur-md border border-blue-500/30 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-2">
              How do I cancel my subscription?
            </h3>
            <p className="text-gray-300 text-sm">
              You can cancel your subscription at any time from your account
              settings. Your plan will remain active until the end of your
              current billing period.
            </p>
          </div>

          <div className="bg-gray-800/60 backdrop-blur-md border border-blue-500/30 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-2">
              What payment methods do you accept?
            </h3>
            <p className="text-gray-300 text-sm">
              We accept all major credit cards, PayPal, and Apple Pay. All
              payments are securely processed.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full max-w-6xl mt-12 md:mt-16 mb-8 relative z-10">
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-md border border-blue-500/30 rounded-xl p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to accelerate your career?
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Join thousands of professionals who are using CareerAI to reach
            their career goals faster.
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-bold text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-105 transition-all duration-300">
            Get Started Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-6xl text-center text-gray-500 text-xs relative z-10">
        <p>© 2023 CareerAI Assistant. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="#" className="hover:text-blue-400 transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-blue-400 transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-blue-400 transition-colors">
            Contact
          </a>
        </div>
      </footer>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default Subscriptions;
