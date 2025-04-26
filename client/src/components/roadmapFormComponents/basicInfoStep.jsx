const employmentOptions = [
  'Employed Full-time',
  'Employed Part-time',
  'Self-employed',
  'Freelance',
  'Unemployed',
  'Student',
];

export default function BasicInfoStep({
  formData,
  handleChange,
  prevStep,
  nextStep,
}) {
  return (
    <div className="space-y-6 bg-gray-800/60 p-6 md:p-8 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-6">
        Let's Kick Things Off
      </h2>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-white text-sm font-medium mb-2"
          >
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800/80 text-white border border-blue-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Enter Full Name"
          />
        </div>
        <div>
          <label
            htmlFor="age"
            className="block text-white text-sm font-medium mb-2"
          >
            How old are you?
          </label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800/80 text-white border border-blue-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Enter your age"
          />
        </div>

        <div>
          <label
            htmlFor="location"
            className="block text-white text-sm font-medium mb-2"
          >
            Where do you live?
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800/80 text-white border border-blue-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="City, Country"
          />
        </div>

        <div>
          <label
            htmlFor="employmentStatus"
            className="block text-white text-sm font-medium mb-2"
          >
            Employment Status
          </label>
          <select
            id="employmentStatus"
            name="employmentStatus"
            value={formData.employmentStatus}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800/80 text-white border border-blue-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="" disabled>
              Select your employment status
            </option>
            {employmentOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="currentSalary"
            className="block text-white text-sm font-medium mb-2"
          >
            Current Annual Salary
          </label>
          <input
            type="text"
            id="currentSalary"
            name="currentSalary"
            value={formData.currentSalary}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800/80 text-white border border-blue-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="e.g. $50,000"
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
