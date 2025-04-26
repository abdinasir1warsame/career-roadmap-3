import { useState, useEffect } from 'react';
import {
  Search,
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Filter,
  ChevronDown,
  X,
} from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { UserAuth } from '../../context/authContext';

function SkillsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filters, setFilters] = useState({
    location: '',
    experience: '',
    type: '',
    salary: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [userSkills, setUserSkills] = useState([]);
  const [jobListings, setJobListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = UserAuth();

  // Mock user skills (you can replace this with data from Firebase if available)
  const mockUserSkills = [
    { name: 'React', level: 90 },
    { name: 'JavaScript', level: 85 },
    { name: 'HTML', level: 80 },
    { name: 'CSS', level: 80 },
  ];

  // Fetch data from Firebase
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

        // Set user skills (you might want to get these from Firebase if available)
        setUserSkills(mockUserSkills);

        // Process and set job listings from Firebase
        if (data.relevantJobs && Array.isArray(data.relevantJobs)) {
          const processedJobs = data.relevantJobs.map((job, index) => ({
            id: index + 1,
            title: job.title,
            company: job.company,
            location: job.location,
            type: 'Full-time', // Default since not in Firebase data
            experience: '0-2 years', // Default for Junior positions
            salary: job.salary,
            skills: extractSkillsFromTitle(job.title),
            description: `Opportunity for a ${job.title} position at ${job.company} in ${job.location}.`,
            url: job.url, // Add the URL from Firebase
          }));
          setJobListings(processedJobs);
          setFilteredJobs(processedJobs);
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

  // Extract skills from job title
  const extractSkillsFromTitle = (title) => {
    const skills = ['React', 'JavaScript', 'HTML', 'CSS', 'Native'];
    return skills.filter((skill) => title.includes(skill));
  };

  // Calculate skill match percentage
  const calculateSkillMatch = (jobSkills) => {
    const matchedSkills = userSkills.filter((skill) =>
      jobSkills.includes(skill.name)
    );
    return matchedSkills.length > 0
      ? Math.round((matchedSkills.length / jobSkills.length) * 100)
      : 0;
  };

  // Get missing skills
  const getMissingSkills = (jobSkills) => {
    const userSkillNames = userSkills.map((skill) => skill.name);
    return jobSkills.filter((skill) => !userSkillNames.includes(skill));
  };

  // Get matched skills
  const getMatchedSkills = (jobSkills) => {
    const userSkillNames = userSkills.map((skill) => skill.name);
    return jobSkills.filter((skill) => userSkillNames.includes(skill));
  };

  // Filter jobs based on search term and filters
  useEffect(() => {
    if (!jobListings.length) return;

    let result = jobListings;

    if (searchTerm) {
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.skills.some((skill) =>
            skill.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    if (filters.location) {
      result = result.filter((job) =>
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.experience) {
      result = result.filter((job) =>
        job.experience.includes(filters.experience)
      );
    }

    if (filters.type) {
      result = result.filter((job) => job.type === filters.type);
    }

    if (filters.salary) {
      result = result.filter((job) => job.salary.includes(filters.salary));
    }

    setFilteredJobs(result);
  }, [searchTerm, filters, jobListings]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      experience: '',
      type: '',
      salary: '',
    });
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen text-center py-10">
        <h3 className="text-xl font-bold text-red-500 mb-2">
          Error loading jobs
        </h3>
        <p className="text-gray-400">{error}</p>
      </div>
    );
  }

  if (!jobListings.length) {
    return (
      <div className="h-screen flex justify-center items-center text-center py-10">
        <div>
          <h3 className="text-xl font-bold text-gray-400">
            No job listings available
          </h3>
          <p className="text-gray-500">
            We couldn't find any relevant jobs for your skills
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 min-h-screen p-4 md:p-6 text-white font-sans">
        {/* Selected Job Detail */}
        {selectedJob !== null && (
          <div className="mb-12 p-6 bg-gray-800/60 backdrop-blur-md rounded-2xl border border-blue-500/30 shadow-lg shadow-blue-500/10 animate-fadeIn">
            <button
              onClick={() => setSelectedJob(null)}
              className="mb-4 text-sm text-blue-400 hover:text-blue-300 flex items-center"
            >
              <ChevronDown className="transform rotate-90 mr-1" size={16} />{' '}
              Back to all jobs
            </button>

            {filteredJobs
              .filter((job) => job.id === selectedJob)
              .map((job) => (
                <div key={job.id}>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-white">
                        {job.title}
                      </h2>
                      <p className="text-lg text-gray-400">{job.company}</p>
                    </div>
                    <div className="text-sm text-gray-300 flex items-center space-x-2 mt-3 md:mt-0">
                      <MapPin size={16} />
                      <span>{job.location}</span>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4">{job.description}</p>

                  {/* Skills Match */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-blue-300 mb-2">
                      Skills Match
                    </h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-400 h-2 rounded-full"
                          style={{
                            width: `${calculateSkillMatch(job.skills)}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-300 ml-2">
                        {calculateSkillMatch(job.skills)}% Match
                      </span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm text-blue-300 mb-1">
                      Missing Skills
                    </h4>
                    <ul className="list-disc pl-5 text-sm text-gray-400">
                      {getMissingSkills(job.skills).map((skill, index) => (
                        <li key={index}>{skill}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm text-blue-300 mb-1">
                      Matched Skills
                    </h4>
                    <ul className="list-disc pl-5 text-sm text-gray-400">
                      {getMatchedSkills(job.skills).map((skill, index) => (
                        <li key={index}>{skill}</li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-colors duration-300"
                  >
                    Apply on Adzuna
                  </a>
                </div>
              ))}
          </div>
        )}

        {/* Job Listings */}
        {!selectedJob && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="p-6 bg-gray-800/60 backdrop-blur-md rounded-xl border border-blue-500/30 shadow-lg shadow-blue-500/10 cursor-pointer hover:bg-gray-800 transition-colors duration-300"
                onClick={() => setSelectedJob(job.id)}
              >
                <h2 className="text-xl font-bold text-white mb-2">
                  {job.title}
                </h2>
                <p className="inline-block px-3 py-1 mb-3 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
                  {job.company}
                </p>
                <p className="text-sm text-gray-300 mb-2">
                  <MapPin size={14} className="inline mr-1" />
                  {job.location}
                </p>
                <p className="text-sm text-gray-300 mb-2">
                  <Clock size={14} className="inline mr-1" />
                  {job.experience}
                </p>
                <p className="text-sm text-gray-300 mb-4">
                  <span className="inline mr-1">£</span>

                  {job.salary}
                </p>
                <div className="flex flex-wrap gap-2">
                  {job.skills.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 bg-blue-600/20 text-blue-300 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {job.skills.length > 3 && (
                    <span className="text-xs px-2 py-1 bg-gray-700/50 text-gray-400 rounded-full">
                      +{job.skills.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default SkillsPage;
