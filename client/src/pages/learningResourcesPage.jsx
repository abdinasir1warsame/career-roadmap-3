import { useState } from 'react';
import {
  PlayCircle,
  BookOpen,
  CheckCircle,
  Film,
  Book,
  ArrowRight,
} from 'lucide-react';
import VideoCard from '../components/learningResourcesComponents/learningVideos';

import BookSection from '../components/learningResourcesComponents/learningBook';
import VideoSection from '../components/learningResourcesComponents/learningVideos';

function LearningResources() {
  const [activeTab, setActiveTab] = useState('videos');

  const videos = [
    {
      id: 1,
      title: 'Advanced React Patterns',
      image: 'https://picsum.photos/id/1/600/400',
      description:
        'Learn advanced React patterns to build scalable applications with better architecture.',
      skills: ['React Hooks', 'Context API', 'Custom Hooks', 'Performance '],
      stage: 'Stage 2: Intermediate React Development',
      milestones: [
        'Implement a custom hook for data fetching',
        'Build a component using the Context API',
        'Optimize rendering with useMemo and useCallback',
        'Create a higher-order component',
      ],
    },
    {
      id: 2,
      title: 'State Management with Redux',
      image: 'https://picsum.photos/id/2/600/400',
      description:
        'Master Redux for global state management in large-scale React applications.',
      skills: ['Redux', 'Redux Toolkit', 'Middleware', 'Async Actions'],
      stage: 'Stage 2: Intermediate React Development',
      milestones: [
        'Set up a Redux store',
        'Create reducers and actions',
        'Implement async actions with thunks',
        'Connect Redux to React components',
      ],
    },
    {
      id: 3,
      title: 'Building Responsive UIs with Tailwind',
      image: 'https://picsum.photos/id/3/600/400',
      description:
        'Learn how to create beautiful, responsive user interfaces using Tailwind CSS.',
      skills: [
        'Tailwind CSS',
        'Responsive Design',
        'Custom Utilities',
        'Dark Mode',
      ],
      stage: 'Stage 2: Frontend Styling',
      milestones: [
        'Create a responsive navigation bar',
        'Implement a dark/light mode toggle',
        'Build a responsive grid layout',
        'Customize Tailwind theme',
      ],
    },
  ];

  const books = [
    {
      id: 1,
      title: 'React Design Patterns and Best Practices',
      authors: ['Carlos Santana Roldán'],
      description:
        'Build modular applications with React using design patterns and the latest features of React 16.',
      image: 'https://picsum.photos/id/4/400/600',
      previewLink: 'https://example.com/book1',
      categories: ['React', 'JavaScript', 'Web Development'],
    },
    {
      id: 2,
      title: 'Learning TypeScript',
      authors: ['Josh Goldberg'],
      description:
        'Enhance your JavaScript applications by introducing TypeScript and type-checking.',
      image: 'https://picsum.photos/id/5/400/600',
      previewLink: 'https://example.com/book2',
      categories: ['TypeScript', 'JavaScript', 'Programming'],
    },
    {
      id: 3,
      title: 'Full Stack Development with Next.js',
      authors: ['Tomasz Łakomy', 'Adam Boduch'],
      description:
        'Build full-stack web applications with React, Node.js, and Next.js.',
      image: 'https://picsum.photos/id/6/400/600',
      previewLink: 'https://example.com/book3',
      categories: ['Next.js', 'React', 'Full Stack'],
    },
  ];

  // Tab component stays here
  const Tab = ({ name, label, icon, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`px-6 py-3 font-medium text-md flex items-center gap-2 transition-all duration-300 ${
        isActive
          ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg'
          : 'text-gray-400 hover:text-gray-200'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 sm:p-6">
      <div className="w-full">
        {/* Tabs */}
        <div className="mb-6 border-b border-gray-700">
          <div className="flex text-">
            <Tab
              name="videos"
              label="Video Courses"
              icon={<Film size={18} />}
              isActive={activeTab === 'videos'}
              onClick={() => setActiveTab('videos')}
            />
            <Tab
              name="books"
              label="Book Resources"
              icon={<Book size={18} />}
              isActive={activeTab === 'books'}
              onClick={() => setActiveTab('books')}
            />
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1  gap-6">
          {activeTab === 'videos' && <VideoSection />}

          {activeTab === 'books' && <BookSection books={books} />}
        </div>
      </div>
    </div>
  );
}

export default LearningResources;
