import { useState } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
export default function LearningResources() {
  const [activeFilter, setActiveFilter] = useState(null);

  const toggleFilter = (filter) => {
    if (activeFilter === filter) {
      setActiveFilter(null);
    } else {
      setActiveFilter(filter);
    }
  };
  // Filter Dropdown Component
  function FilterDropdown({ name, options, isActive, onToggle }) {
    return (
      <div className="relative">
        <button
          onClick={onToggle}
          className={`
            flex items-center space-x-2 px-4 py-2 rounded-lg border 
            transition-all duration-200
            ${
              isActive
                ? 'bg-blue-900/30 border-blue-500 text-blue-400'
                : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-blue-500 hover:text-blue-400'
            }`}
        >
          <Filter size={16} />
          <span>{name}</span>
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${
              isActive ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isActive && (
          <div className="absolute mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden z-20 animate-fade-in">
            {options.map((option, index) => (
              <div
                key={index}
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer transition-colors duration-150"
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Resource Card Component
  function ResourceCard({ title, description, category, progress, image }) {
    return (
      <div className="group relative bg-gray-800/60 backdrop-blur-md rounded-lg border border-blue-500/30 shadow-lg shadow-blue-500/10 cursor-pointer hover:bg-gray-800">
        {/* Card Image */}
        <div className="h-40 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Card Content */}
        <div className="p-5">
          {/* Category Badge */}
          <div className="inline-block px-3 py-1 mb-3 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
            {category}
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold mb-2 text-white">{title}</h3>

          {/* Description */}
          <p className="text-gray-400 text-sm mb-4">{description}</p>

          {/* Progress Bar */}
          <div className="w-full h-1 bg-gray-800 rounded-full mb-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Progress Text and Button */}
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">{progress}% Complete</span>
            <button className="px-3 py-1 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-all duration-200 hover:shadow-[0_0_10px_rgba(59,130,246,0.7)] animate-pulse-slow">
              Start Learning
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Content */}
      <div className="flex-1 overflow-auto   border border-blue-500/30 shadow-lg shadow-blue-500/10 text-white font-sans">
        {/* Learning Resources Page */}
        <main className="p-6">
          {/* Page Header */}

          {/* Filters */}
          <div className="mb-8 flex flex-wrap gap-4">
            <FilterDropdown
              name="Career Stage"
              options={['Beginner', 'Intermediate', 'Advanced', 'Expert']}
              isActive={activeFilter === 'career'}
              onToggle={() => toggleFilter('career')}
            />
            <FilterDropdown
              name="Level"
              options={['Easy', 'Medium', 'Hard', 'Expert']}
              isActive={activeFilter === 'level'}
              onToggle={() => toggleFilter('level')}
            />
            <FilterDropdown
              name="Completion"
              options={['Not Started', 'In Progress', 'Completed']}
              isActive={activeFilter === 'completion'}
              onToggle={() => toggleFilter('completion')}
            />
          </div>

          {/* Resource Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <ResourceCard
              title="Machine Learning Fundamentals"
              description="Learn the core concepts of machine learning algorithms and their applications."
              category="AI"
              progress={75}
              image="https://picsum.photos/id/1/400/200"
            />
            <ResourceCard
              title="Advanced React Patterns"
              description="Master advanced React patterns and build scalable frontend applications."
              category="Frontend"
              progress={30}
              image="https://picsum.photos/id/2/400/200"
            />
            <ResourceCard
              title="Neural Networks Deep Dive"
              description="Explore the architecture and mathematics behind neural networks."
              category="AI"
              progress={10}
              image="https://picsum.photos/id/3/400/200"
            />
            <ResourceCard
              title="Cloud Infrastructure"
              description="Learn to design and implement scalable cloud infrastructure for AI applications."
              category="DevOps"
              progress={60}
              image="https://picsum.photos/id/4/400/200"
            />
            <ResourceCard
              title="Natural Language Processing"
              description="Understand how computers process and analyze human language data."
              category="AI"
              progress={45}
              image="https://picsum.photos/id/5/400/200"
            />
            <ResourceCard
              title="Data Visualization Techniques"
              description="Learn to create compelling visual representations of complex data sets."
              category="Data Science"
              progress={90}
              image="https://picsum.photos/id/6/400/200"
            />
            <ResourceCard
              title="Cybersecurity Essentials"
              description="Master the fundamentals of protecting systems and data from digital attacks."
              category="Security"
              progress={20}
              image="https://picsum.photos/id/7/400/200"
            />
            <ResourceCard
              title="Quantum Computing Basics"
              description="Introduction to quantum computing principles and applications."
              category="Emerging Tech"
              progress={5}
              image="https://picsum.photos/id/8/400/200"
            />
          </div>
        </main>
      </div>
    </>
  );
}
