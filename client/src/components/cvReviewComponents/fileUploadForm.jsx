import React, { useState, useRef, useEffect } from 'react';
import { UserAuth } from '../../context/authContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import CvLoader from './cvloader';

const FileUploadForm = ({ onAnalysisComplete }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [showJobForm, setShowJobForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = UserAuth();
  const userId = user?.uid;

  useEffect(() => {
    const fetchTargetRole = async () => {
      if (!userId) {
        setTimeout(() => setInitialLoading(false), 100); // delay fallback case too
        return;
      }

      try {
        const docRef = doc(db, 'userOnboarding', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const targetRoles = docSnap.data()?.careerGoals?.targetRoles || [];
          if (targetRoles.length > 0) {
            setJobTitle(targetRoles[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching target role:', error);
      } finally {
        // ✅ Add 1 second delay before hiding the spinner
        setTimeout(() => setInitialLoading(false), 100);
      }
    };

    fetchTargetRole();
  }, [userId]);

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || loading) return;

    setLoading(true);
    setError(null);

    try {
      // Step 1: Extract text from CV
      const formData = new FormData();
      formData.append('cv', file);

      const extractResponse = await fetch(
        'https://career-roadmap-3.onrender.com/api/extract-cv/extract',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!extractResponse.ok) {
        throw new Error('Failed to upload CV');
      }

      const { text: cvText } = await extractResponse.json();

      // Step 2: Prepare analysis requests
      const analysisPromises = [];

      // Core analysis (always runs)
      analysisPromises.push(
        fetch('https://career-roadmap-3.onrender.com/api/analyze/core', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cvText, jobTitle }),
        }).then((res) => {
          if (!res.ok) throw new Error('Core analysis failed');
          return res.json();
        })
      );

      // Job comparison (only if description exists)
      if (jobTitle && jobDescription) {
        analysisPromises.push(
          fetch('https://career-roadmap-3.onrender.com/api/compare/job', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cvText, jobTitle, jobDescription }),
          }).then((res) => {
            if (!res.ok) throw new Error('Job analysis failed');
            return res.json();
          })
        );
      }

      // Step 3: Process results
      const results = await Promise.all(analysisPromises);

      // Pass results to parent component
      if (onAnalysisComplete) {
        onAnalysisComplete({
          coreAnalysis: results[0],
          jobAnalysis: results[1] || null,
        });
      }
    } catch (error) {
      console.error('Analysis Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Show loader during initial loading
  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show loader during analysis
  if (loading) {
    return <CvLoader />;
  }

  // Show form only after initial loading is complete
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-gray-800/60 backdrop-blur rounded-2xl p-8 shadow-lg border border-blue-500/20">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Section */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Upload Your Resume
            </h2>
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition ${
                isDragging
                  ? 'border-blue-400 bg-blue-900/20'
                  : file
                  ? 'border-green-400 bg-green-900/10'
                  : 'border-gray-600 hover:border-blue-500 hover:bg-blue-900/10'
              } cursor-pointer`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.docx,.txt"
              />
              {file ? (
                <div className="flex flex-col items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-green-400 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <p className="text-white font-semibold">{file.name}</p>
                  <p className="text-gray-400 text-sm mt-1">Click to change</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-blue-400 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-white font-semibold">
                    Drag & drop your resume or click to browse
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Supports: PDF, DOCX, TXT
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Job Comparison Section */}
          <div className="bg-gray-800/40 rounded-xl p-5 border border-blue-500/20">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Compare with a Job Description
                </span>
                <span className="text-sm text-gray-400 ml-2">(Optional)</span>
              </h3>
            </div>

            <p className="text-gray-400 text-sm mb-4">
              {jobTitle ? (
                <>
                  Using <span className="text-blue-400">{jobTitle}</span> from
                  your profile. Add a description for better comparison.
                </>
              ) : (
                'Add a job description to compare your resume against specific requirements.'
              )}
            </p>

            {!showJobForm ? (
              <button
                type="button"
                onClick={() => setShowJobForm(true)}
                className="w-full py-2.5 rounded-lg bg-gray-700/60 hover:bg-gray-700/80 text-blue-400 transition border border-blue-500/30"
              >
                {jobTitle ? 'Add Job Description' : '+ Add Job Details'}
              </button>
            ) : (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full bg-gray-700/80 border border-blue-500/30 text-white rounded-lg p-3 outline-none focus:border-blue-400 transition text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Job Description
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the full job description here..."
                    rows={8}
                    className="w-full bg-gray-700/80 border border-blue-500/30 text-white rounded-lg p-3 outline-none focus:border-blue-400 transition text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    The more detailed the description, the better the analysis.
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowJobForm(false);
                      setJobDescription('');
                    }}
                    className="text-sm text-gray-400 hover:text-gray-300 px-4 py-2 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-400 text-sm p-3 bg-red-900/20 rounded-lg">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!file || loading}
            className={`w-full py-3.5 rounded-xl font-medium transition-all ${
              !file
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 shadow-lg hover:shadow-blue-500/20'
            } ${loading ? 'animate-pulse' : ''}`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Analyzing...
              </span>
            ) : (
              'Analyze My Resume'
            )}
          </button>

          <p className="text-gray-500 text-xs text-center">
            Your resume will be analyzed for strengths and areas of improvement.
            {jobTitle && (
              <>
                {' '}
                Compared against{' '}
                <span className="text-blue-400">{jobTitle}</span> role.
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};

export default FileUploadForm;
