const skillsOptions = [
  'Leadership',
  'Communication',
  'Problem Solving',
  'Teamwork',
  'Technical',
  'Creative',
  'Analytical',
];

const languagesOptions = [
  'English',
  'Spanish',
  'French',
  'German',
  'Chinese',
  'Japanese',
  'Arabic',
];

const educationLevelOptions = [
  'High School',
  'Associate Degree',
  "Bachelor's Degree",
  "Master's Degree",
  'PhD',
  'Professional Certification',
];

export default function SkillsEducationStep({
  formData,
  handleChange,
  handleMultiSelect,
  prevStep,
  nextStep,
}) {
  return (
    <div className="space-y-6 bg-gray-800/60 p-6 md:p-8 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-6">Skills & Education</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-white text-sm font-medium mb-3">
            Skills (Select all that apply)
          </label>
          <div className="grid grid-cols-2 gap-3">
            {skillsOptions.map((skill) => (
              <div
                key={skill}
                onClick={() => handleMultiSelect('skills', skill)}
                className={`px-4 py-3 rounded-lg border cursor-pointer transition-all duration-300 ${
                  formData.skills.includes(skill)
                    ? 'bg-blue-600/20 border-blue-500 text-white'
                    : 'border-blue-500/30 text-white hover:bg-gray-800'
                }`}
              >
                {skill}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="certifications"
            className="block text-white text-sm font-medium mb-2"
          >
            Certifications
          </label>
          <input
            type="text"
            id="certifications"
            name="certifications"
            value={formData.certifications}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800/80 text-white border border-blue-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="e.g. PMP, AWS Certified, Google Analytics"
          />
        </div>

        <div>
          <label className="block text-white text-sm font-medium mb-3">
            Languages (Select all that apply)
          </label>
          <div className="grid grid-cols-2 gap-3">
            {languagesOptions.map((language) => (
              <div
                key={language}
                onClick={() => handleMultiSelect('languages', language)}
                className={`px-4 py-3 rounded-lg border cursor-pointer transition-all duration-300 ${
                  formData.languages.includes(language)
                    ? 'bg-blue-600/20 border-blue-500 text-white'
                    : 'border-blue-500/30 text-white hover:bg-gray-800'
                }`}
              >
                {language}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="enjoyment"
            className="block text-white text-sm font-medium mb-2"
          >
            What do you enjoy most in your work?
          </label>
          <textarea
            id="enjoyment"
            name="enjoyment"
            value={formData.enjoyment}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800/80 text-white border border-blue-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Describe what aspects of work you find most fulfilling"
            rows={3}
          />
        </div>

        <div>
          <label
            htmlFor="educationLevel"
            className="block text-white text-sm font-medium mb-2"
          >
            Highest Education Level
          </label>
          <select
            id="educationLevel"
            name="educationLevel"
            value={formData.educationLevel}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800/80 text-white border border-blue-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="" disabled>
              Select your education level
            </option>
            {educationLevelOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="fieldOfStudy"
            className="block text-white text-sm font-medium mb-2"
          >
            Field of Study
          </label>
          <input
            type="text"
            id="fieldOfStudy"
            name="fieldOfStudy"
            value={formData.fieldOfStudy}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800/80 text-white border border-blue-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="e.g. Computer Science, Business Administration"
          />
        </div>

        <div>
          <label
            htmlFor="recentCourses"
            className="block text-white text-sm font-medium mb-2"
          >
            Recent Courses or Training
          </label>
          <textarea
            id="recentCourses"
            name="recentCourses"
            value={formData.recentCourses}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800/80 text-white border border-blue-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="List any recent courses, certifications, or training programs you've completed"
            rows={3}
          />
        </div>
      </div>

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
          onClick={nextStep}
          className="w-1/2 py-3 px-6 text-white font-medium rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-500/30 transition-all duration-300"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
