import { useState, useEffect } from 'react';
import { Combobox } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { UserAuth } from '../../context/authContext';

// Options for dropdowns
const careerAspirationOptions = [
  'Advance in my current career path',
  'Transition to a new industry',
  'Develop specialized skills',
  'Increase my earning potential',
  'Find more meaningful work',
  'Build a professional network',
  'Gain leadership experience',
];

const experienceLevels = [
  'No experience',
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert',
];

// Career Objective Dropdown using Headless UI Combobox
function CareerObjectiveDropdown({ selected, onChange }) {
  const [query, setQuery] = useState('');

  const filteredOptions =
    query === ''
      ? careerAspirationOptions
      : careerAspirationOptions.filter((option) =>
          option.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <Combobox value={selected} onChange={onChange}>
      <div className="relative">
        <Combobox.Input
          className="w-full px-4 py-2 rounded-lg border border-blue-500/30 text-white bg-gray-700/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 hover:shadow-[0_0_10px_#3b82f6]/30"
          onChange={(e) => setQuery(e.target.value)}
          displayValue={(value) => value}
          placeholder="Start typing or select an option"
        />
        {filteredOptions.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-700 py-1 text-white shadow-lg ring-1 ring-black/5 focus:outline-none">
            {filteredOptions.map((option) => (
              <Combobox.Option
                key={option}
                value={option}
                className={({ active }) =>
                  `cursor-pointer select-none py-2 px-4 ${
                    active ? 'bg-blue-600 text-white' : ''
                  }`
                }
              >
                {option}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}

export default function CareerGoalsEditor() {
  const { user } = UserAuth();
  const userId = user?.uid;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    targetRoles: [],
    detailedAspiration: '',
    experienceLevel: '',
    objectives: '',
  });

  const [rolesInput, setRolesInput] = useState('');

  useEffect(() => {
    if (!userId) return; // Wait for user to be available

    const fetchUserData = async () => {
      try {
        const docRef = doc(db, 'userOnboarding', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const careerGoals = data.careerGoals || {};

          setFormData({
            targetRoles: careerGoals.targetRoles || [],
            detailedAspiration: careerGoals.detailedAspiration || '',
            experienceLevel: careerGoals.experienceLevel || '',
            objectives: careerGoals.objectives || '',
          });

          setRolesInput((careerGoals.targetRoles || []).join(', '));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleInputChange = (e) => {
    const value = e.target.value;
    setRolesInput(value);
    setFormData((prev) => ({
      ...prev,
      targetRoles: value
        .split(',')
        .map((role) => role.trim())
        .filter(Boolean),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const newErrors = {};
    if (!formData.experienceLevel)
      newErrors.experience = 'Please select your experience level';
    if (!formData.objectives)
      newErrors.objective = 'Please select a career objective';
    if (!formData.targetRoles.length)
      newErrors.roles = 'Please specify at least one target role';
    if (!formData.detailedAspiration)
      newErrors.details = 'Please describe your career aspirations';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setSubmitting(false);
      return;
    }

    try {
      const userRef = doc(db, 'userOnboarding', userId);
      await updateDoc(userRef, {
        careerGoals: { ...formData },
        'meta.updatedAt': new Date().toISOString(),
      });

      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();

      const response = await fetch(
        'https://career-roadmap-3.onrender.com/api/roadmap',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            personalInfo: userData.personalInfo,
            careerGoals: formData,
            skillsEducation: userData.skillsEducation,
          }),
        }
      );

      if (!response.ok) throw new Error('Roadmap generation failed');
      navigate(-1);
    } catch (error) {
      console.error('Error updating career goals:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 font-sans">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className=" h-full w-full  flex items-center justify-center p-4 font-sans">
      {/* Main container */}
      <div className="w-full max-w-3xl relative">
        {/* Go back button */}
        <button
          onClick={() => navigate(-1)}
          className="text-white text-sm underline hover:text-blue-400 mb-4 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Go Back
        </button>

        {/* Glassmorphism container */}
        <div className="bg-gray-800/60 backdrop-blur-md border border-blue-500/30 rounded-xl p-6 space-y-6 shadow-lg relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-blue-500/10 blur-xl"></div>
          <div className="absolute -bottom-10 -left-10 w-20 h-20 rounded-full bg-purple-500/10 blur-xl"></div>

          <h1 className="text-2xl font-bold text-white relative">
            Edit Your Career Goals
            <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-purple-600 mt-2 rounded-full"></div>
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Experience Level Dropdown */}
            <div className="space-y-2">
              <label className="text-white text-sm font-bold block">
                What is your experience level in your target role?
              </label>
              <div className="relative">
                <select
                  className="w-full px-4 py-2 rounded-lg border border-blue-500/30 text-white bg-gray-700/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 hover:shadow-[0_0_10px_#3b82f6]/30 appearance-none"
                  value={formData.experienceLevel}
                  onChange={(e) =>
                    handleChange({
                      target: {
                        name: 'experienceLevel',
                        value: e.target.value,
                      },
                    })
                  }
                >
                  <option value="" disabled className="text-gray-400">
                    Select experience level
                  </option>
                  {experienceLevels.map((level) => (
                    <option
                      key={level}
                      value={level}
                      className="bg-gray-800 text-white"
                    >
                      {level}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="h-5 w-5 text-blue-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              {errors.experience && (
                <p className="text-red-400 text-sm mt-1">{errors.experience}</p>
              )}
            </div>

            {/* Career Objective Dropdown */}
            <div className="space-y-2">
              <label className="text-white text-sm font-bold block">
                What is your primary career objective?
              </label>
              <CareerObjectiveDropdown
                selected={formData.objectives}
                onChange={(value) =>
                  handleChange({
                    target: {
                      name: 'objectives',
                      value,
                    },
                  })
                }
              />
              {errors.objective && (
                <p className="text-red-400 text-sm mt-1">{errors.objective}</p>
              )}
            </div>

            {/* Target Roles Input */}
            <div className="space-y-2">
              <label className="text-white text-sm font-bold block">
                What role(s) do you want to build your career roadmap for?
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-blue-500/30 text-white bg-gray-700/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 hover:shadow-[0_0_10px_#3b82f6]/30"
                placeholder="e.g., React Developer, UX Designer, Data Scientist"
                value={rolesInput}
                onChange={handleRoleInputChange}
              />
              <p className="text-xs text-gray-400 mt-1">
                Separate multiple roles with commas
              </p>
              {errors.roles && (
                <p className="text-red-400 text-sm mt-1">{errors.roles}</p>
              )}
            </div>

            {/* Detailed Aspirations */}
            <div className="space-y-2">
              <label className="text-white text-sm font-bold block">
                Describe your career aspirations in detail
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-blue-500/30 text-white bg-gray-700/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 hover:shadow-[0_0_10px_#3b82f6]/30 resize-none"
                placeholder="Tell us about your long-term vision, specific milestones, or what kind of impact you'd like to make..."
                value={formData.detailedAspiration}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: 'detailedAspiration',
                      value: e.target.value,
                    },
                  })
                }
              />
              {errors.details && (
                <p className="text-red-400 text-sm mt-1">{errors.details}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 rounded-lg font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:brightness-110 shadow-[0_0_10px_#3b82f6]/30 transition-all duration-300 mt-6 relative overflow-hidden"
            >
              <span
                className={`flex items-center justify-center ${
                  submitting ? 'opacity-0' : 'opacity-100'
                }`}
              >
                {submitting
                  ? 'Generating Roadmap...'
                  : 'Update & Generate New Roadmap'}
              </span>

              {/* Loading state */}
              {submitting && (
                <div className="absolute inset-0 flex items-center justify-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></div>
                  <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse delay-100"></div>
                  <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse delay-200"></div>
                  <span className="text-white text-sm ml-2">
                    Generating roadmap...
                  </span>
                </div>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
