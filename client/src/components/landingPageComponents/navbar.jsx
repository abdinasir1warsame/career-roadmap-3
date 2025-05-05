import { Link } from 'react-router-dom';
export default function Navbar() {
  return (
    <>
      {' '}
      <nav className="px-6 py-4 flex justify-between items-center border-b border-purple-700/30 backdrop-blur-sm bg-black/10 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-xl font-bold">AI</span>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            CareerPath
          </span>
        </div>
        <div className="hidden md:flex gap-8 items-center">
          <a
            href="#features"
            className="hover:text-purple-400 transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="hover:text-purple-400 transition-colors"
          >
            How It Works
          </a>
          <a
            href="#testimonials"
            className="hover:text-purple-400 transition-colors"
          >
            Testimonials
          </a>
          <Link to={'/subscription'}>
            <a className="hover:text-purple-400 transition-colors">
              Subscriptions
            </a>
          </Link>
        </div>
        <Link to={'/login'}>
          <button className="px-4 py-2 rounded-full cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-purple-500/20">
            Sign Up
          </button>
        </Link>
      </nav>
    </>
  );
}
