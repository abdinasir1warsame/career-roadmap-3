import { useState } from 'react';
import { Combobox } from '@headlessui/react';

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
          className="w-full px-4 py-2 rounded-lg border border-blue-500/30 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(event) => setQuery(event.target.value)}
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

export default function CareerGoalsStep({
  formData,
  handleChange,
  handleMultiSelect,
  prevStep,
  nextStep,
}) {
  const [rolesInput, setRolesInput] = useState(
    formData.targetRoles?.join(', ') || ''
  );
  const [errors, setErrors] = useState({});

  const handleRoleInputChange = (e) => {
    const value = e.target.value;
    setRolesInput(value);

    handleChange({
      target: {
        name: 'targetRoles',
        value: value
          .split(',')
          .map((role) => role.trim())
          .filter((role) => role),
      },
    });
  };

  const handleDetailedAspirationChange = (e) => {
    handleChange({
      target: {
        name: 'detailedCareerAspiration',
        value: e.target.value,
      },
    });
  };

  const handleExperienceChange = (e) => {
    handleChange({
      target: {
        name: 'targetRoleExperienceLevel',
        value: e.target.value,
      },
    });
  };

  const handleContinue = () => {
    const newErrors = {};

    if (!formData.targetRoleExperienceLevel) {
      newErrors.experience = 'Please select your experience level.';
    }

    if (!formData.careerObjectives) {
      newErrors.objective = 'Please select a career objective.';
    }

    if (!rolesInput.trim()) {
      newErrors.roles = 'Please specify at least one target role.';
    }

    if (!formData.detailedCareerAspiration?.trim()) {
      newErrors.details = 'Please describe your career aspirations.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      nextStep();
    }
  };

  return (
    <div className="space-y-6 bg-gray-800/60 p-6 md:p-8 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-6">Career Aspirations</h2>

      <div className="space-y-6">
        {/* Experience Level Dropdown */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            What is your experience level in your target role?
          </label>
          <select
            className="w-full px-4 py-2 rounded-lg border border-blue-500/30 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.targetRoleExperienceLevel || ''}
            onChange={handleExperienceChange}
          >
            <option value="" disabled>
              Select experience level
            </option>
            {experienceLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          {errors.experience && (
            <p className="text-red-400 text-sm mt-1">{errors.experience}</p>
          )}
        </div>

        {/* Career Objective Input with Suggestions */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            What is your primary career objective?
          </label>
          <input
            type="text"
            list="career-objectives"
            name="careerObjectives"
            value={formData.careerObjectives || ''}
            onChange={handleChange}
            placeholder="Start typing or select an objective"
            className="w-full px-4 py-2 rounded-lg border border-blue-500/30 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <datalist id="career-objectives">
            <option value="Advance in my current career path" />
            <option value="Transition to a new industry" />
            <option value="Develop specialized skills" />
            <option value="Find more meaningful work" />
            <option value="Gain leadership experience" />
            <option value="Build a professional network" />
            <option value="Build a professional network" />
          </datalist>

          {errors.objective && (
            <p className="text-red-400 text-sm mt-1">{errors.objective}</p>
          )}
        </div>

        {/* Role of Interest Textarea */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            What role do you want to build your personalized career roadmap for?
          </label>
          <textarea
            rows={2}
            className="w-full px-4 py-2 rounded-lg border border-blue-500/30 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Data Scientist, UX Designer, Software Engineer"
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
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Please describe your career aspirations in more detail
          </label>
          <textarea
            rows={4}
            className="w-full px-4 py-2 rounded-lg border border-blue-500/30 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tell us about your long-term vision, specific milestones, or what kind of impact you'd like to make..."
            value={formData.detailedCareerAspiration || ''}
            onChange={handleDetailedAspirationChange}
          />
          {errors.details && (
            <p className="text-red-400 text-sm mt-1">{errors.details}</p>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex space-x-4 pt-4">
        <button
          type="button"
          onClick={prevStep}
          className="w-1/2 py-3 px-6 text-white font-medium rounded-lg border border-blue-500/30 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleContinue}
          className="w-1/2 py-3 px-6 text-white font-medium rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-500/30 transition-all duration-300"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
