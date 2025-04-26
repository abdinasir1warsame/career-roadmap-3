export default function ExperienceStep({
  formData,
  handleChange,
  handlePastJobChange,
  prevStep,
  nextStep,
}) {
  return (
    <div className="space-y-6 bg-gray-800/60 p-6 md:p-8 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-6">Experience</h2>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="currentJob"
            className="block text-white text-sm font-medium mb-2"
          >
            Current Job
          </label>
          <input
            type="text"
            id="currentJob"
            name="currentJob"
            value={formData.currentJob}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800/80 text-white border border-blue-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Job Title at Company"
          />
        </div>

        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Past Jobs (Most Recent First)
          </label>
          {formData.pastJobs.map((job, index) => (
            <input
              key={index}
              type="text"
              value={job}
              onChange={(e) => handlePastJobChange(index, e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/80 text-white border border-blue-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 mb-2"
              placeholder={`Past Job ${index + 1}`}
            />
          ))}
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
