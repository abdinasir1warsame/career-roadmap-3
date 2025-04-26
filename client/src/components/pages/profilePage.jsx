import React, { useState, useEffect } from 'react';
import { Search, X, Save, Edit } from 'lucide-react';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { UserAuth } from '../../context/authContext';

function ProfilePage() {
  const { user } = UserAuth();
  const [profileData, setProfileData] = useState(null);
  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedBio, setExpandedBio] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    jobTitle: '',
    bio: '',
    skills: [],
  });

  const maxBioLength = 330;

  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribeProfile = onSnapshot(
      doc(db, 'userOnboarding', user.uid),
      (doc) => {
        if (doc.exists()) {
          setProfileData(doc.data());
          // Initialize edit form with current data
          setEditForm({
            fullName: doc.data().personalInfo?.fullName || '',
            jobTitle: doc.data().personalInfo?.jobTitle || '',
            bio: doc.data().personalInfo?.bio || '',
            skills: doc.data().skillsEducation?.skills || [],
          });
        }
      }
    );

    const unsubscribeRoadmap = onSnapshot(
      doc(db, 'userRoadmap', user.uid),
      (doc) => {
        if (doc.exists()) {
          setRoadmapData(doc.data());
          setLoading(false);
        }
      }
    );

    return () => {
      unsubscribeProfile();
      unsubscribeRoadmap();
    };
  }, [user?.uid]);

  const toggleBio = () => setExpandedBio(!expandedBio);
  const toggleEdit = () => setIsEditing(!isEditing);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillsChange = (e, index) => {
    const newSkills = [...editForm.skills];
    newSkills[index] = e.target.value;
    setEditForm((prev) => ({
      ...prev,
      skills: newSkills,
    }));
  };

  const addSkill = () => {
    setEditForm((prev) => ({
      ...prev,
      skills: [...prev.skills, ''],
    }));
  };

  const removeSkill = (index) => {
    const newSkills = [...editForm.skills];
    newSkills.splice(index, 1);
    setEditForm((prev) => ({
      ...prev,
      skills: newSkills,
    }));
  };

  const saveProfile = async () => {
    try {
      const userRef = doc(db, 'userOnboarding', user.uid);
      await updateDoc(userRef, {
        'personalInfo.fullName': editForm.fullName,
        'personalInfo.jobTitle': editForm.jobTitle,
        'personalInfo.bio': editForm.bio,
        'skillsEducation.skills': editForm.skills.filter(
          (skill) => skill.trim() !== ''
        ),
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const truncateBio = (bio) => {
    if (!bio) return '';
    return bio.length > maxBioLength
      ? bio.substring(0, maxBioLength) + '...'
      : bio;
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-auto min-h-screen bg-gray-800/60 backdrop-blur-md border border-blue-500/30 shadow-lg shadow-blue-500/10 text-white font-sans p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!profileData || !roadmapData) {
    return (
      <div className="flex-1 overflow-auto min-h-screen bg-gray-800/60 backdrop-blur-md border border-blue-500/30 shadow-lg shadow-blue-500/10 text-white font-sans p-6 flex items-center justify-center">
        <p>No profile data found</p>
      </div>
    );
  }

  // Calculate progress data
  const totalMilestones =
    roadmapData.roadmap?.reduce(
      (total, stage) => total + (stage.milestones?.length || 0),
      0
    ) || 0;
  const completion =
    totalMilestones > 0
      ? Math.round(
          ((roadmapData.completedMilestones?.length || 0) / totalMilestones) *
            100
        )
      : 0;
  const completedStages =
    roadmapData.roadmap?.filter((stage) =>
      stage.milestones?.every((m) =>
        roadmapData.completedMilestones?.includes(m)
      )
    ).length || 0;

  const displayBio = expandedBio
    ? profileData.personalInfo?.bio || ''
    : truncateBio(profileData.personalInfo?.bio || '');

  const shouldShowReadMore =
    profileData.personalInfo?.bio?.length > maxBioLength;

  return (
    <>
      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-800/90 backdrop-blur-sm border-b border-gray-700 p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Edit Profile</h2>
              <button
                onClick={toggleEdit}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={editForm.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={editForm.jobTitle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={editForm.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {editForm.bio.length}/500 characters
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-300">
                      Skills
                    </label>
                    <button
                      onClick={addSkill}
                      className="text-sm text-blue-400 hover:text-blue-300"
                    >
                      + Add Skill
                    </button>
                  </div>
                  <div className="space-y-2">
                    {editForm.skills.map((skill, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="text"
                          value={skill}
                          onChange={(e) => handleSkillsChange(e, index)}
                          className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                        />
                        <button
                          onClick={() => removeSkill(index)}
                          className="ml-2 text-gray-400 hover:text-red-400 p-2"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    {editForm.skills.length === 0 && (
                      <p className="text-sm text-gray-400">
                        No skills added yet
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={toggleEdit}
                  className="px-4 py-2 border border-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveProfile}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition-colors"
                >
                  <Save size={16} className="mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto min-h-screen border border-blue-500/30 shadow-lg shadow-blue-500/10 text-white font-sans p-4">
        <div className="w-full">
          {/* Glassmorphic Profile Card */}
          <div className="bg-gray-800/60 backdrop-blur-md rounded-xl border border-gray-700 shadow-lg shadow-blue-500/10 p-6 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-600 rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-600 rounded-full opacity-20 blur-xl"></div>
            <div className="absolute top-40 right-1/4 w-60 h-60 bg-blue-600 rounded-full opacity-10 blur-xl"></div>

            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 relative z-10">
              <div className="flex flex-col items-center sm:flex-row sm:items-center">
                {/* Profile Picture with Glowing Border */}
                <div className="relative mb-4 sm:mb-0 sm:mr-6">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 blur-sm transform scale-110 animate-pulse"></div>
                  <img
                    src="https://picsum.photos/id/64/200/200"
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-2 border-blue-500/30 relative z-10"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-800 z-20"></div>
                </div>

                {/* Name and Title */}
                <div className="text-center sm:text-left">
                  <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    {profileData.personalInfo?.fullName || 'Your Name'}
                  </h1>
                  <p className="text-gray-400 text-lg">
                    {profileData.personalInfo?.jobTitle || 'Your Title'}
                  </p>
                </div>
              </div>

              {/* Edit Profile Button */}
              <button
                onClick={toggleEdit}
                className="mt-3 sm:mt-0 px-4 py-1.5 text-md font-medium bg-gray-800 border border-gray-700 rounded-full hover:border-blue-500/50 hover:shadow-[0_0_10px_rgba(59,130,246,0.7)] transition-all duration-300 mx-auto sm:mx-0 flex items-center"
              >
                <Edit size={16} className="mr-2" />
                Edit Profile
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-md mb-1">
                <span className="text-white">Career Roadmap Progress</span>
                <span className="text-blue-400 font-bold">{completion}%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                  style={{ width: `${completion}%` }}
                ></div>
              </div>
            </div>

            {/* Two Column Layout for Bio and Stats on larger screens */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Bio/Summary */}
              <div className="md:col-span-1">
                <h2 className="text-lg font-bold mb-2 text-gray-300">About</h2>
                <p className="text-gray-400 text-md">
                  {displayBio}
                  {shouldShowReadMore && (
                    <button
                      onClick={toggleBio}
                      className="text-blue-400 hover:text-blue-300 ml-1"
                    >
                      {expandedBio ? 'Show less' : 'Read more'}
                    </button>
                  )}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-2 gap-3">
                {/* Completed Modules Card */}
                <div className="bg-gray-800/80 border border-gray-700 rounded-lg p-3 hover:border-blue-500/30 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-md text-white">
                      Completed Modules
                    </span>
                    <span className="text-md font-bold px-3 py-1 mb-3 text-white rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
                      {roadmapData.completedMilestones?.length || 0}
                    </span>
                  </div>
                  <div className="mt-2 text-md text-blue-400">
                    +{completedStages} this month
                  </div>
                </div>

                {/* AI Level Card */}
                <div className="bg-gray-800/80 border border-gray-700 rounded-lg p-3 hover:border-blue-500/30 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-md text-white">Current Level</span>
                    <span className="text-sm font-bold px-2 py-1 mb-3 text-white rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
                      {roadmapData.summary?.currentLevel || 'Beginner'}
                    </span>
                  </div>
                  <div className="mt-2 text-md text-purple-400">
                    {roadmapData.summary?.nextLevel
                      ? `Next: ${roadmapData.summary.nextLevel}`
                      : 'Set your level'}
                  </div>
                </div>

                {/* Skill Gap Card */}
                <div className="bg-gray-800/80 border border-gray-700 rounded-lg p-3 hover:border-blue-500/30 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-md text-white">Skill Gap</span>
                    <span className="text-md font-bold px-3 py-1 mb-3 text-white rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
                      {100 - completion}%
                    </span>
                  </div>
                  <div className="mt-2 text-md text-green-400">
                    {completion > 0
                      ? `-${100 - completion}% remaining`
                      : '100% to go'}
                  </div>
                </div>

                {/* Network Card */}
                <div className="bg-gray-800/80 border border-gray-700 rounded-lg p-3 hover:border-blue-500/30 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-md text-white">Target Role</span>
                    <span className="text-md font-bold px-3 py-1 mb-3 text-white rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
                      {roadmapData.summary?.targetRole || 'Not set'}
                    </span>
                  </div>
                  <div className="mt-2 text-md text-blue-400">
                    {roadmapData.summary?.estimatedTimeline || 'Set timeline'}
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div>
              <h2 className="text-lg font-bold mb-3 text-gray-300">
                Top Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {profileData.skillsEducation?.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-md bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Feature Navigation - Responsive Grid */}
          <div className="mt-6 bg-gray-800/60 backdrop-blur-md rounded-xl border border-gray-700 p-4">
            <h3 className="text-lg font-bold mb-3 text-gray-300">
              Quick Access
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              <button className="flex items-center p-2 bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500/30 hover:shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-300">
                <span className="mr-2">🔍</span>
                <span className="text-md">Personalized Roadmaps</span>
              </button>
              <button className="flex items-center p-2 bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500/30 hover:shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-300">
                <span className="mr-2">📊</span>
                <span className="text-md">Skill Gap Analysis</span>
              </button>
              <button className="flex items-center p-2 bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500/30 hover:shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-300">
                <span className="mr-2">💡</span>
                <span className="text-md">Industry Insights</span>
              </button>
              <button className="flex items-center p-2 bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500/30 hover:shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-300">
                <span className="mr-2">📚</span>
                <span className="text-md">Learning Resources</span>
              </button>
              <button className="flex items-center p-2 bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500/30 hover:shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-300">
                <span className="mr-2">📈</span>
                <span className="text-md">Progress Tracking</span>
              </button>
              <button className="flex items-center p-2 bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500/30 hover:shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-300">
                <span className="mr-2">🔗</span>
                <span className="text-md">Networking</span>
              </button>
            </div>
          </div>

          {/* Recommended Next Steps - Full Width */}
          <div className="mt-6 bg-gray-800/60 backdrop-blur-md rounded-xl border border-gray-700 p-4">
            <h3 className="text-lg font-bold mb-3 text-gray-300">
              Recommended Next Steps
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="flex items-center p-3 bg-gray-800/80 rounded-lg border border-gray-700 hover:border-blue-500/30 transition-all duration-300">
                <div className="w-10 h-10 flex items-center justify-center bg-blue-600/20 rounded-lg mr-3">
                  <span>📚</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold">Advanced NLP Techniques</h4>
                  <p className="text-md text-gray-400">
                    Complete this module to reduce your skill gap by 5%
                  </p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-800/80 rounded-lg border border-gray-700 hover:border-blue-500/30 transition-all duration-300">
                <div className="w-10 h-10 flex items-center justify-center bg-purple-600/20 rounded-lg mr-3">
                  <span>🔗</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold">
                    Connect with AI Specialists
                  </h4>
                  <p className="text-md text-gray-400">
                    3 new connection opportunities in your field
                  </p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-800/80 rounded-lg border border-gray-700 hover:border-blue-500/30 transition-all duration-300">
                <div className="w-10 h-10 flex items-center justify-center bg-green-600/20 rounded-lg mr-3">
                  <span>📊</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold">
                    Complete Skill Assessment
                  </h4>
                  <p className="text-md text-gray-400">
                    Update your profile with latest capabilities
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
