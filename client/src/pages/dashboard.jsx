import { useState } from 'react';
import {
  Route,
  MessageSquare,
  FileCheck,
  BookOpen,
  BarChart2,
  User,
  Settings,
  Home,
  ChevronDown,
  ChevronUp,
  LogOut,
} from 'lucide-react';
import { UserAuth } from '../context/authContext';
import SettingsPage from './SettingsPage';
import RoadmapComponent from '../components/roadmap/roadmap';
import InterviewPrep from './interviewPrep';
import CvReview from './cvReview';
import LearningResources from './learningResourcesPage';
import JobPage from './JobsMatchPage';
import ProfilePage from './profilePage';

function DashBoard() {
  const [activePage, setActivePage] = useState('roadmap');
  const [showProfileSubmenu, setShowProfileSubmenu] = useState(false);
  const [showMobileProfileMenu, setShowMobileProfileMenu] = useState(false);
  const { logout } = UserAuth();

  // Profile submenu items
  const profileSubmenu = [
    { id: 'dashboard', name: 'Dashboard', icon: <User size={16} /> },
    { id: 'account', name: 'Account', icon: <User size={16} /> },
    { id: 'preferences', name: 'Preferences', icon: <Settings size={16} /> },
    { id: 'career', name: 'Career', icon: <BarChart2 size={16} /> },
    { id: 'privacy', name: 'Privacy', icon: <FileCheck size={16} /> },
    { id: 'danger', name: 'Danger Zone', icon: <FileCheck size={16} /> },
  ];

  const handleProfileClick = () => {
    if (activePage.startsWith('profile/')) {
      setShowProfileSubmenu(!showProfileSubmenu);
    } else {
      setActivePage('profile/dashboard');
      setShowProfileSubmenu(true);
    }
  };

  const handleMobileProfileClick = () => {
    if (!showMobileProfileMenu) {
      setActivePage('profile/dashboard');
    }
    setShowMobileProfileMenu(!showMobileProfileMenu);
  };

  const renderPage = () => {
    if (activePage.startsWith('profile/')) {
      const section = activePage.split('/')[1];
      if (section === 'dashboard') return <ProfilePage />;
      return <SettingsPage activeSection={section} />;
    }

    switch (activePage) {
      case 'roadmap':
        return <RoadmapComponent />;
      case 'interview-prep':
        return <InterviewPrep />;
      case 'cv-review':
        return <CvReview />;
      case 'learning-resources':
        return <LearningResources />;
      case 'skills-match':
        return <JobPage />;
      case 'home':
        return <RoadmapComponent />;
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

  // Mobile navigation items
  const leftNavItems = [
    { id: 'roadmap', label: 'Roadmap', icon: Route },
    { id: 'interview-prep', label: 'Interview', icon: MessageSquare },
    { id: 'cv-review', label: 'CV Review', icon: FileCheck },
  ];

  const rightNavItems = [
    { id: 'learning-resources', label: 'Learning', icon: BookOpen },
    { id: 'skills-match', label: 'Jobs', icon: BarChart2 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const renderMobileNavItem = (item) => {
    const Icon = item.icon;
    const isActive =
      activePage === item.id ||
      (item.id === 'profile' && activePage.startsWith('profile/'));

    return (
      <button
        key={item.id}
        onClick={() =>
          item.id === 'profile'
            ? handleMobileProfileClick()
            : setActivePage(item.id)
        }
        className={`flex flex-col items-center justify-center p-1 min-w-[3.5rem] transition-all duration-300 ${
          isActive
            ? 'text-white scale-110'
            : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        <div
          className={`p-1.5 rounded-lg transition-all duration-300 ${
            isActive
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-md shadow-blue-500/20'
              : 'bg-gray-800/40'
          }`}
        >
          <Icon size={18} />
        </div>
        <span className="text-[0.65rem] mt-1 whitespace-nowrap">
          {item.label}
        </span>
        {isActive && (
          <div className="absolute bottom-0 w-1 h-1 bg-blue-400 rounded-full shadow-glow"></div>
        )}
      </button>
    );
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black text-white min-h-screen">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 -right-20 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-20 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="pb-20 md:pb-0 md:ml-20 lg:ml-64">{renderPage()}</div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/5 blur-xl rounded-t-2xl"></div>
          <nav className="bg-gray-800/60 backdrop-blur-md border-t border-blue-500/30 rounded-t-xl px-1 py-1 flex justify-between relative">
            <div className="flex justify-around flex-1 mr-8">
              {leftNavItems.map(renderMobileNavItem)}
            </div>

            <div className="absolute left-1/2 -translate-x-1/2 -top-5">
              <button
                onClick={() => setActivePage('home')}
                className="flex flex-col items-center justify-center transition-all duration-300"
              >
                <div
                  className={`p-4 rounded-full transition-all duration-300 ${
                    activePage === 'home'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-700 shadow-lg shadow-blue-500/30 animate-glow'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-md shadow-blue-500/20'
                  }`}
                >
                  <Home size={24} className="text-white" />
                </div>
                <span
                  className={`text-xs mt-1 font-medium ${
                    activePage === 'home' ? 'text-white' : 'text-gray-300'
                  }`}
                >
                  Home
                </span>
              </button>
            </div>

            <div className="flex justify-around flex-1 ml-8">
              {rightNavItems.map(renderMobileNavItem)}
            </div>
          </nav>

          {/* Mobile Profile Submenu */}
          {showMobileProfileMenu && (
            <div className="absolute bottom-full left-0 right-0 bg-gray-800/95 backdrop-blur-md border-b border-blue-500/30 p-2">
              <div className="grid grid-cols-3 gap-2">
                {profileSubmenu.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActivePage(`profile/${item.id}`);
                      setShowMobileProfileMenu(false);
                    }}
                    className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="p-1.5 text-blue-400">{item.icon}</div>
                    <span className="text-xs text-gray-200 text-center">
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed top-0 left-0 h-full w-20 lg:w-64 border border-blue-500/30 text-white font-sans transition-all duration-300 ease-in-out z-50">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 flex items-center justify-center lg:justify-start">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">AI</span>
            </div>
            <span className="hidden lg:block ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              CareerPath
            </span>
          </div>

          {/* Navigation */}
          <nav className="mt-8 flex-1 px-2">
            <NavItem
              icon={<Route size={20} />}
              text="Roadmap"
              active={activePage === 'roadmap'}
              onClick={() => setActivePage('roadmap')}
            />
            <NavItem
              icon={<MessageSquare size={20} />}
              text="Interview Prep"
              active={activePage === 'interview-prep'}
              onClick={() => setActivePage('interview-prep')}
            />
            <NavItem
              icon={<FileCheck size={20} />}
              text="CV Review"
              active={activePage === 'cv-review'}
              onClick={() => setActivePage('cv-review')}
            />
            <NavItem
              icon={<BookOpen size={20} />}
              text="Learning Resources"
              active={activePage === 'learning-resources'}
              onClick={() => setActivePage('learning-resources')}
            />
            <NavItem
              icon={<BarChart2 size={20} />}
              text="Job Match"
              active={activePage === 'skills-match'}
              onClick={() => setActivePage('skills-match')}
            />

            {/* Profile with expandable submenu */}
            <div className="mb-1">
              <div
                onClick={handleProfileClick}
                className={`flex items-center justify-between p-2 my-1 rounded-lg cursor-pointer transition-all duration-200 group ${
                  activePage.startsWith('profile/')
                    ? 'bg-gradient-to-r from-blue-900/50 to-purple-900/50 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`${
                      activePage.startsWith('profile/')
                        ? 'text-blue-400'
                        : 'text-gray-400 group-hover:text-blue-400'
                    } transition-colors duration-200`}
                  >
                    <User size={20} />
                  </div>
                  <span
                    className={`hidden lg:block ml-3 ${
                      activePage.startsWith('profile/') ? 'font-medium' : ''
                    }`}
                  >
                    Profile
                  </span>
                </div>
                <div className="hidden lg:block">
                  {showProfileSubmenu && activePage.startsWith('profile/') ? (
                    <ChevronUp size={16} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={16} className="text-gray-400" />
                  )}
                </div>
              </div>

              {/* Profile submenu */}
              {showProfileSubmenu && activePage.startsWith('profile/') && (
                <div className="ml-2 pl-6 border-l border-gray-700 mt-1 mb-2">
                  {profileSubmenu.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setActivePage(`profile/${item.id}`)}
                      className={`flex items-center p-2 my-1 rounded-lg cursor-pointer transition-all duration-200 ${
                        activePage === `profile/${item.id}`
                          ? 'bg-blue-900/20 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                      }`}
                    >
                      <div className="mr-2">{item.icon}</div>
                      <span className="text-sm">{item.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center lg:justify-start w-full p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200"
            >
              <LogOut size={20} />
              <span className="hidden lg:block ml-3">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Navigation Item Component (for sidebar)
function NavItem({ icon, text, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-center lg:justify-start p-2 my-1 rounded-lg cursor-pointer
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
      <span className={`hidden lg:block ml-3 ${active ? 'font-medium' : ''}`}>
        {text}
      </span>
      {active && (
        <div className="hidden lg:block ml-auto h-2 w-2 rounded-full bg-blue-400 animate-pulse"></div>
      )}
    </div>
  );
}

export default DashBoard;
