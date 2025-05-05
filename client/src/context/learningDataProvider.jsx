import { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { UserAuth } from './authContext';

const LearningDataContext = createContext();

export const LearningDataProvider = ({ children }) => {
  const { user } = UserAuth();
  const [roadmapData, setRoadmapData] = useState([]);
  const [learningResources, setLearningResources] = useState({
    videos: {},
    books: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      if (!user?.uid) return;
      setLoading(true);

      try {
        // 1) Fetch user roadmap
        const rmRef = doc(db, 'userRoadmap', user.uid);
        const rmSnap = await getDoc(rmRef);
        const roadmap = rmSnap.exists()
          ? rmSnap.data().roadmap.map((stage) => ({
              name: stage.name.replace(/^Stage \d+: /, ''),
              milestones: stage.milestones,
              skills: stage.skills,
            }))
          : [];
        setRoadmapData(roadmap);

        if (roadmap.length === 0) {
          setLearningResources({ videos: {}, books: {} });
          return;
        }

        // 2) Check existing learning resources
        const lrRef = doc(db, 'learningResources', user.uid);
        const lrSnap = await getDoc(lrRef);
        const existingResources = lrSnap.exists() ? lrSnap.data() : {};

        const payload = {
          stages: roadmap,
          userId: user.uid,
        };

        let videosByStage = existingResources.videos || {};
        let booksByStage = existingResources.books || {};

        // 3) Conditionally fetch videos
        if (!Object.keys(videosByStage).length) {
          const videosRes = await fetch(
            'https://career-roadmap-3.onrender.com/api/youtube/videos',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            }
          );
          if (videosRes.ok) {
            const { videos } = await videosRes.json();
            videosByStage = videos;
          } else {
            console.error('Error fetching videos:', videosRes.statusText);
          }
        }

        // 4) Conditionally fetch books
        if (!Object.keys(booksByStage).length) {
          const booksRes = await fetch(
            'https://career-roadmap-3.onrender.com/api/google/books',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            }
          );
          if (booksRes.ok) {
            const { books } = await booksRes.json();
            booksByStage = books;
          } else {
            console.error('Error fetching books:', booksRes.statusText);
          }
        }

        // 5) Merge into ordered format
        const merged = roadmap.reduce(
          (acc, { name, milestones, skills }) => {
            acc.videos[name] = videosByStage[name] || {
              stageName: name,
              videos: [],
              milestones,
              skills,
            };
            acc.books[name] = booksByStage[name] || {
              stageName: name,
              book: null,
              milestones,
              skills,
              found: false,
            };
            return acc;
          },
          { videos: {}, books: {} }
        );

        setLearningResources(merged);
      } catch (err) {
        console.error('Error loading learning resources:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [user?.uid]);

  return (
    <LearningDataContext.Provider
      value={{ roadmapData, learningResources, loading }}
    >
      {children}
    </LearningDataContext.Provider>
  );
};

export const useLearningData = () => useContext(LearningDataContext);
