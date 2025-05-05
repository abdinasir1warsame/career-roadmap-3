import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { UserAuth } from '../context/authContext';

function InterviewPrepForm({ onStartInterview }) {
  const { user } = UserAuth();
  const userId = user?.uid;

  const [role, setRole] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const difficulties = [
    'No Experience',
    'Beginner',
    'Intermediate',
    'Advanced',
    'Expert',
  ];

  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      try {
        const docRef = doc(db, 'userOnboarding', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const careerGoals = data.careerGoals || {};

          setRole((careerGoals.targetRoles || [''])[0]);
          setDifficulty(careerGoals.experienceLevel || '');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleDifficultySelect = (level) => {
    setDifficulty(level);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const isStartEnabled = role.trim() !== '' && difficulty !== '';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-3xl relative z-10">
        <div className="bg-gray-800/60 backdrop-blur-md border border-blue-500/30 rounded-xl shadow-lg shadow-blue-500/5 overflow-hidden">
          <div className="relative p-6 pb-4">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-2xl font-bold text-white mb-1">
                AI Interview Simulator
              </h1>
              <div className="h-1 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-3"></div>
              <p className="text-gray-400 text-md">
                Prepare for your next interview with our AI-powered assistant
              </p>
            </div>
          </div>

          <div className="p-6 pt-2">
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="role"
                  className="block text-lg text-white font-medium  mb-2"
                >
                  Interview Role
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="role"
                    value={role}
                    onChange={handleRoleChange}
                    placeholder="e.g. Software Engineer, Product Manager"
                    className="w-full px-4 py-3  bg-gray-700/50 border border-gray-600 focus:border-blue-500 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <div className="absolute right-3 top-3.5 w-1.5 h-1.5 rounded-full bg-blue-500 opacity-75"></div>
                </div>
              </div>

              <div className="relative">
                <label
                  htmlFor="difficulty"
                  className="block text-lg text-white font-medium  mb-2"
                >
                  Difficulty Level
                </label>
                <button
                  type="button"
                  onClick={toggleDropdown}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 focus:border-blue-500  rounded-lg text-left text-white focus:outline-none focus:ring-1 focus:ring-blue-500 flex justify-between items-center"
                >
                  <span className={difficulty ? 'text-white' : 'text-gray-500'}>
                    {difficulty || 'Select difficulty'}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 text-gray-400 transition-transform ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-gray-700/90 backdrop-blur-md border border-gray-600 rounded-lg shadow-lg">
                    <ul className="py-1">
                      {difficulties.map((level) => (
                        <li key={level}>
                          <button
                            type="button"
                            onClick={() => handleDifficultySelect(level)}
                            className="block w-full px-4 py-2 text-left text-white hover:bg-gray-600/50 focus:outline-none"
                          >
                            {level}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 my-5">
                <div className="bg-gray-700/30 backdrop-blur-sm rounded-lg p-3 border border-gray-600">
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5 text-blue-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                    </div>
                    <span className=" font-medium text-gray-300">
                      AI Powered
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    Advanced neural networks simulate real interviewers
                  </p>
                </div>

                <div className="bg-gray-700/30 backdrop-blur-sm rounded-lg p-3 border border-gray-600">
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5 text-purple-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className=" font-medium text-gray-300">
                      Personalized
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    Tailored to your specific role and experience
                  </p>
                </div>
              </div>

              <button
                disabled={!isStartEnabled}
                onClick={() => onStartInterview(role, difficulty)}
                className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${
                  isStartEnabled
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/20 hover:from-blue-500 hover:to-purple-500'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isStartEnabled ? (
                  <span className="flex items-center text-lg justify-center">
                    Start Interview
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                ) : (
                  'Complete Setup'
                )}
              </button>

              <p className="text-sm text-gray-500 text-center mt-4">
                Your data is processed locally and not stored
              </p>
            </div>
          </div>

          <div className="border-t border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm text-gray-500">Connected</span>
              </div>
              <span className="text-sm text-gray-500">Powered by AI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InterviewPrepForm;
