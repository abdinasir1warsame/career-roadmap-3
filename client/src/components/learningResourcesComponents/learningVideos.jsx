import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { UserAuth } from '../../context/authContext';

function VideoSection() {
  const { user } = UserAuth();
  const [stages, setStages] = useState([]);
  const [activeStage, setActiveStage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      if (!user) return;

      setLoading(true);
      try {
        // 1) Fetch the ordered roadmap
        const rmRef = doc(db, 'userRoadmap', user.uid);
        const rmSnap = await getDoc(rmRef);
        const roadmap = rmSnap.exists()
          ? rmSnap.data().roadmap.map((stage) => ({
              name: stage.name.replace(/^Stage \d+: /, ''),
              milestones: stage.milestones,
              skills: stage.skills,
            }))
          : [];

        // 2) Fetch saved videos
        const lrRef = doc(db, 'learningResources', user.uid);
        const lrSnap = await getDoc(lrRef);
        const videosObj =
          lrSnap.exists() && lrSnap.data().videos ? lrSnap.data().videos : {};

        // 3) Build ordered stages array
        const ordered = roadmap.map(({ name, milestones, skills }) => {
          const stageData = videosObj[name] || {};
          return {
            stageName: name,
            milestones,
            skills,
            videos: stageData.videos || [],
          };
        });

        setStages(ordered);
      } catch (err) {
        console.error('Error fetching roadmap or videos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [user]);

  const handleStageChange = (index) => setActiveStage(index);

  const ProgressIndicator = () => {
    const progress =
      stages.length > 0 ? ((activeStage + 1) / stages.length) * 100 : 0;
    return (
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const StageSelector = () => (
    <div className="flex overflow-x-auto pb-2 mb-4 scrollbar-hide">
      {stages.map((stage, index) => (
        <button
          key={index}
          onClick={() => handleStageChange(index)}
          className={`px-4 py-2 mr-2 whitespace-nowrap rounded-full text-md font-medium transition-all duration-300 ${
            activeStage === index
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
              : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700/80'
          }`}
        >
          Stage {index + 1}
        </button>
      ))}
    </div>
  );

  const MilestonesSection = () => (
    <div className="bg-gray-800/60 backdrop-blur-md border border-blue-500/30 rounded-xl p-4 mb-6 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
      <h2 className="text-white font-bold text-lg mb-3 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2 text-blue-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        Stage {activeStage + 1} Milestones
      </h2>
      <ul className="space-y-2">
        {stages[activeStage]?.milestones?.map((milestone, idx) => (
          <li key={idx} className="flex items-start">
            <div className="mt-1 h-4 w-4 rounded-full flex-shrink-0 bg-gradient-to-r from-blue-500 to-purple-600"></div>
            <span className="ml-2 text-md text-white">{milestone}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!stages.length) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        No learning resources found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 sm:p-6 font-sans">
      <div className="w-full">
        <ProgressIndicator />
        <StageSelector />
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 [text-shadow:0_0_10px_rgba(59,130,246,0.5)]">
            Stage {activeStage + 1}: {stages[activeStage]?.stageName}
          </h2>
        </div>

        <MilestonesSection />

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-white">
            Learning <span className="text-blue-400">Videos</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stages[activeStage]?.videos?.map((video, idx) => (
              <div
                key={idx}
                className="relative bg-gray-800/60 backdrop-blur-md border border-blue-500/30 rounded-xl p-4 mb-4 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                  <button className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg group">
                    <div className="w-16 h-16 flex items-center justify-center bg-red-600 rounded-full group-hover:scale-110 transition-transform duration-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-white"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </button>
                </div>
                <div className="flex flex-col justify-between">
                  <h3 className="text-white font-bold text-lg mb-1">
                    {video.title}
                  </h3>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-blue-300 text-sm">
                      {video.channelTitle}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {new Date(video.publishedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-purple-900/40 rounded-lg p-2 mt-2">
                    <p className="text-xs text-blue-200 font-medium">
                      <span className="text-purple-300 font-bold">
                        Milestone:{' '}
                      </span>
                      {video.milestone}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="fixed bottom-6 right-6">
          <button className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-110">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default VideoSection;
