import { useState } from 'react';
import {
  Home,
  BookOpen,
  BarChart2,
  Settings,
  User,
  LogOut,
  Route,
} from 'lucide-react';
import LearningResources from './learningResourcesPage';
import SkillsPage from './skillsPage';
import ProfilePage from './profilePage';
import SettingsPage from './settingsPage';
import { Link } from 'react-router-dom';
import RoadmapComponent from '../roadmap/roadmap';
import { UserAuth } from '../../context/authContext';

function DashBoard() {
  const [activePage, setActivePage] = useState('roadmap');

  const { logout } = UserAuth();

  const renderPage = () => {
    switch (activePage) {
      case 'roadmap':
        return <RoadmapComponent />;
      case 'learning-resources':
        return <LearningResources />;
      case 'skills-match':
        return <SkillsPage />; // Pass jobData to SkillsPage
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <RoadmapComponent />;
    }
  };
  const handleLogout = async () => {
    try {
      await logout();
      console.log('User logged out');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className=" bg-gradient-to-br from-gray-900 to-black text-white flex ">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 -right-20 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-20 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>
      {/* Sidebar */}
      <div className="w-20 md:w-64 bg-gray-900/80 border border-blue-500/30  text-white font-sans transition-all duration-300 ease-in-out">
        <div className="flex flex-col max-h-screen fixed w-20 md:w-64 ">
          {/* Logo */}
          <Link
            to={'/'}
            className="p-4 flex items-center justify-center md:justify-start"
          >
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">AI</span>
            </div>
            <span className="hidden md:block ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              CareerPath
            </span>
          </Link>

          {/* Navigation */}
          <nav className="mt-8 flex-1 px-2">
            <NavItem
              icon={<Route size={20} />}
              text="Roadmap"
              active={activePage === 'roadmap'}
              onClick={() => setActivePage('roadmap')}
            />
            <NavItem
              icon={<BookOpen size={20} />}
              text="Learning Resources"
              active={activePage === 'learning-resources'}
              onClick={() => setActivePage('learning-resources')}
            />
            <NavItem
              icon={<BarChart2 size={20} />}
              text="Skills Match"
              active={activePage === 'skills-match'}
              onClick={() => setActivePage('skills-match')}
            />
            <NavItem
              icon={<User size={20} />}
              text="Profile"
              active={activePage === 'profile'}
              onClick={() => setActivePage('profile')}
            />
            <NavItem
              icon={<Settings size={20} />}
              text="Settings"
              active={activePage === 'settings'}
              onClick={() => setActivePage('settings')}
            />
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center md:justify-start w-full p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200"
            >
              <LogOut size={20} />
              <span className="hidden md:block ml-3">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1  overflow-y-auto">{renderPage()}</div>
    </div>
  );
}

// Navigation Item Component
function NavItem({ icon, text, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-center md:justify-start p-2 my-1 rounded-lg cursor-pointer
        transition-all duration-200 group
        ${
          active
            ? 'bg-gradient-to-r from-blue-900/50 to-purple-900/50 text-white'
            : 'text-gray-400 hover:text-white hover:bg-gray-800'
        }`}
    >
      <div
        className={`${
          active ? 'text-blue-400' : 'text-gray-400 group-hover:text-blue-400'
        } transition-colors duration-200`}
      >
        {icon}
      </div>
      <span className={`hidden md:block ml-3 ${active ? 'font-medium' : ''}`}>
        {text}
      </span>
      {active && (
        <div className="hidden md:block ml-auto h-2 w-2 rounded-full bg-blue-400 animate-pulse"></div>
      )}
    </div>
  );
}

export default DashBoard;
