import React, { useState, useEffect } from 'react';

import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { UserAuth } from '../context/authContext';

const extractSkillsFromTitle = (title) => {
  return title.split(' ').filter((word) => word.length > 3);
};

function JobPage() {
  const [jobListings, setJobListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = UserAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return;

      try {
        setLoading(true);
        setError(null);

        const docRef = doc(db, 'userRoadmap', user.uid);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          throw new Error('No roadmap data found for this user');
        }

        const data = docSnap.data();

        if (data.relevantJobs && Array.isArray(data.relevantJobs)) {
          const processedJobs = data.relevantJobs.map((job, index) => ({
            id: index + 1,
            title: job.title,
            company: job.company,
            location: job.location,
            salary: job.salary || 'Not specified',
            skills: extractSkillsFromTitle(job.title),
            description: job.description,
            url: job.url || '#',
            logo: `https://picsum.photos/seed/${index}/200/200`,
          }));
          setJobListings(processedJobs);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 md:p-8">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
          AI Career Assistant
        </h1>
        <p className="text-gray-400 text-lg">
          Discover your next opportunity with our AI-powered job matching
        </p>
      </header>

      {/* Job Listings */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 mx-auto space-y-6">
        {jobListings.length > 0 ? (
          jobListings.map((job) => (
            <div
              key={job.id}
              className="bg-gray-800/60 backdrop-blur-md border border-blue-500/30 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:border-blue-400/50"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {job.title}
                    </h2>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1">
                      <span className="text-white font-bold">
                        {job.company}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {job.location}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 md:mt-0">
                    <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full text-white font-medium">
                      {job.salary}
                    </div>
                  </div>
                </div>

                <div className="border-t border-blue-500/30 my-4"></div>

                <p className="text-gray-400 mb-6">{job.description}</p>

                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-medium transition-all duration-300 hover:shadow-[0_0_10px_rgba(59,130,246,0.7)] hover:from-blue-500 hover:to-purple-500"
                >
                  Apply Now
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-800/60 backdrop-blur-md border border-blue-500/30 rounded-xl">
            <div className="text-gray-400 text-lg">No jobs available.</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default JobPage;
