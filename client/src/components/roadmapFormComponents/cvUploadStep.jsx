import { useState } from 'react';
import { UserAuth } from '../../context/authContext';

export default function CVUploadStep({
  formData,
  fileInputRef,
  handleFileUpload,
  prevStep,
  nextStep,
  setFormData,
  setStep,
}) {
  const [isUploading, setIsUploading] = useState(false);
  const { logout } = UserAuth();

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploading(true);

      try {
        const formDataToSend = new FormData();
        formDataToSend.append('cv', file);

        const response = await fetch(
          'https://career-roadmap-3.onrender.com/api/processCv',
          {
            method: 'POST',
            body: formDataToSend,
          }
        );

        if (!response.ok) {
          throw new Error('CV processing failed');
        }

        const extractedData = await response.json();

        // Destructure the newly extracted fields
        const { bio, jobTitle, ...rest } = extractedData;

        // Auto-fill all fields except career aspirations
        setFormData((prev) => ({
          ...prev,
          ...rest,
          bio,
          jobTitle,
          cv: file,
          cvSummary: `Successfully extracted information from your CV`,
        }));
      } catch (error) {
        console.error('Error processing CV:', error);
        alert('Failed to process CV. Please try again or continue manually.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      console.log('User logged out');
      prevStep();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="space-y-6 bg-gray-800/60 p-6 md:p-8 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-2">CV Upload</h2>
      <p className="text-gray-400 text-sm mb-4">
        Uploading your CV helps us automatically complete parts of your roadmap
        — saving you time!
      </p>

      <div
        className="border-2 border-dashed border-blue-500/30 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500/50 transition-all duration-300"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx"
          className="hidden"
        />

        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <div className="mt-4 flex text-sm text-gray-400 justify-center">
          <p className="pl-1">Upload your CV (PDF or DOCX)</p>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Drag and drop or click to select
        </p>
      </div>

      {isUploading && (
        <div className="text-center text-blue-400">
          <p>Analyzing your CV and extracting information...</p>
        </div>
      )}

      {formData.cv && !isUploading && (
        <div className="bg-gray-800/50 p-4 rounded-lg border border-blue-500/30">
          <p className="text-white font-medium">{formData.cv.name}</p>
          <p className="text-gray-400 text-sm mt-1">
            {Math.round(formData.cv.size / 1024)} KB
          </p>
        </div>
      )}

      <div className="flex space-x-4 pt-4">
        <button
          type="button"
          onClick={handleLogout}
          className="w-1/2 py-3 px-6 text-white font-medium rounded-lg border border-blue-500/30 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
        >
          Back
        </button>
        <button
          type="button"
          onClick={nextStep}
          disabled={isUploading}
          className="w-1/2 py-3 px-6 text-white font-medium rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-500/30 transition-all duration-300"
        >
          {isUploading ? 'Processing...' : formData.cv ? 'Continue' : 'Skip'}
        </button>
      </div>
    </div>
  );
}
