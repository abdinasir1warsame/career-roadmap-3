export default function Features() {
  return (
    <>
      <section
        id="features"
        className="py-20 px-6 bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center"
      >
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
          <div className="absolute top-0 -right-20 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-40 left-20 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                AI-Powered
              </span>{' '}
              Career Features
            </h2>
            <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
              Our advanced AI analyzes thousands of career paths to create a
              personalized roadmap just for you.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Personalized Roadmaps',
                description:
                  'Get a custom career path based on your skills, experience, and goals.',
                icon: '🗺️',
              },
              {
                title: 'Skill Gap Analysis',
                description:
                  'Identify the skills you need to develop to reach your career goals.',
                icon: '📊',
              },
              {
                title: 'Industry Insights',
                description:
                  'Access real-time data on industry trends and job market demands.',
                icon: '💡',
              },
              {
                title: 'Learning Resources',
                description:
                  'Curated learning materials to help you acquire the skills you need.',
                icon: '📚',
              },
              {
                title: 'Progress Tracking',
                description:
                  'Monitor your progress and adjust your roadmap as you grow.',
                icon: '📈',
              },
              {
                title: 'Networking Opportunities',
                description:
                  'Connect with professionals who have followed similar career paths.',
                icon: '🔗',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all hover:shadow-lg hover:shadow-purple-500/10 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
