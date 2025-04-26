export default function Testimonials() {
  return (
    <>
      <section
        id="testimonials"
        className="py-20 px-6 bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              What Our{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Users Say
              </span>
            </h2>
            <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
              Hear from professionals who have transformed their careers with
              our AI-powered roadmaps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Alex Johnson',
                role: 'Senior Developer',
                image: 'https://picsum.photos/id/1012/100/100',
                quote:
                  'The AI career roadmap helped me transition from a junior to senior developer in just 18 months. The skill recommendations were spot on!',
              },
              {
                name: 'Sarah Chen',
                role: 'Product Manager',
                image: 'https://picsum.photos/id/1027/100/100',
                quote:
                  'I was stuck in my career until I found this platform. The personalized roadmap showed me exactly what skills I needed to develop to make the jump to product management.',
              },
              {
                name: 'Michael Rodriguez',
                role: 'Data Scientist',
                image: 'https://picsum.photos/id/1025/100/100',
                quote:
                  'As someone transitioning from academia to tech, this tool was invaluable. It helped me identify the most relevant skills to focus on and saved me months of research.',
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">"{testimonial.quote}"</p>
                <div className="mt-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
