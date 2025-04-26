export default function ReviewStep({ formData, prevStep, handleSubmit }) {
  return (
    <div className="space-y-6 bg-gray-800/60 p-6 md:p-8 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-6">
        Review Your Information
      </h2>

      <div className="bg-gray-800/80 p-6 rounded-lg border border-blue-500/30">
        <h3 className="text-lg font-medium text-white mb-4">
          Personal Information
        </h3>
        <div className="grid grid-cols-2 gap-4 text-white text-sm mb-6">
          <div>
            <p className="font-medium">Full Name</p>
            <p>{formData.fullName || 'Not provided'}</p>
          </div>
          <div>
            <p className="font-medium">Age</p>
            <p>{formData.age || 'Not provided'}</p>
          </div>
          <div>
            <p className="font-medium">Location</p>
            <p>{formData.location || 'Not provided'}</p>
          </div>
          <div>
            <p className="font-medium">Employment Status</p>
            <p>{formData.employmentStatus || 'Not provided'}</p>
          </div>
        </div>

        <h3 className="text-lg font-medium text-white mb-4 mt-8">
          Career Goals
        </h3>
        <div className="space-y-4 text-white text-sm mb-6">
          <div>
            <p className="font-medium">Career Objectives</p>
            <p>
              {formData.careerObjectives
                ? Array.isArray(formData.careerObjectives)
                  ? formData.careerObjectives.join(', ')
                  : formData.careerObjectives
                : 'Not provided'}
            </p>
          </div>
          <div>
            <p className="font-medium">Experience Level</p>
            <p>{formData.targetRoleExperienceLevel || 'Not provided'}</p>
          </div>
          <div>
            <p className="font-medium">Target Roles</p>
            <p>
              {formData.targetRoles?.length > 0
                ? formData.targetRoles.join(', ')
                : 'Not provided'}
            </p>
          </div>
          <div>
            <p className="font-medium">Detailed Aspirations</p>
            <p>{formData.detailedCareerAspiration || 'Not provided'}</p>
          </div>
        </div>

        <h3 className="text-lg font-medium text-white mb-4 mt-8">Experience</h3>
        <div className="space-y-4 text-white text-sm mb-6">
          <div>
            <p className="font-medium">Current Job</p>
            <p>{formData.currentJob?.title || 'Not provided'}</p>
            {formData.currentJob?.company && (
              <p className="text-gray-400">at {formData.currentJob.company}</p>
            )}
          </div>
          <div>
            <p className="font-medium">Past Jobs</p>
            {formData.pastJobs?.filter((job) => job).length > 0 ? (
              <ul className="list-disc pl-5">
                {formData.pastJobs
                  .filter((job) => job)
                  .map((job, index) => (
                    <li key={index}>{job}</li>
                  ))}
              </ul>
            ) : (
              <p>Not provided</p>
            )}
          </div>
        </div>

        <h3 className="text-lg font-medium text-white mb-4 mt-8">
          Skills & Education
        </h3>
        <div className="space-y-4 text-white text-sm">
          <div>
            <p className="font-medium">Skills</p>
            <p>
              {formData.skills?.length > 0
                ? formData.skills.join(', ')
                : 'Not provided'}
            </p>
          </div>
          <div>
            <p className="font-medium">Languages</p>
            <p>
              {formData.languages?.length > 0
                ? formData.languages.join(', ')
                : 'Not provided'}
            </p>
          </div>
          <div>
            <p className="font-medium">Education Level</p>
            <p>{formData.educationLevel || 'Not provided'}</p>
          </div>
          <div>
            <p className="font-medium">Field of Study</p>
            <p>{formData.fieldOfStudy || 'Not provided'}</p>
          </div>
        </div>
      </div>

      <div className="flex space-x-4 pt-6">
        <button
          type="button"
          onClick={prevStep}
          className="w-1/2 py-3 px-6 text-white font-medium rounded-lg border border-blue-500/30 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="w-1/2 py-3 px-6 text-white font-medium rounded-lg bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-lg shadow-green-500/30 transition-all duration-300"
        >
          Generate My Roadmap
        </button>
      </div>
    </div>
  );
}
