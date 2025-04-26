import { useState, useEffect } from 'react';
import { Combobox } from '@headlessui/react';
import { Search } from 'lucide-react';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { UserAuth } from '../../context/authContext';

// Options for dropdowns
const careerAspirationOptions = [
  'Advance in my current career path',
  'Transition to a new industry',
  'Develop specialized skills',
  'Increase my earning potential',
  'Find more meaningful work',
  'Build a professional network',
  'Gain leadership experience',
];

const experienceLevels = [
  'No experience',
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert',
];

function CareerObjectiveDropdown({ selected, onChange }) {
  const [query, setQuery] = useState('');

  const filteredOptions =
    query === ''
      ? careerAspirationOptions
      : careerAspirationOptions.filter((option) =>
          option.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <Combobox value={selected} onChange={onChange}>
      <div className="relative">
        <Combobox.Input
          className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          onChange={(e) => setQuery(e.target.value)}
          displayValue={(value) => value}
          placeholder="Start typing or select an option"
        />
        {filteredOptions.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-800 py-1 text-white shadow-lg ring-1 ring-black/5 focus:outline-none">
            {filteredOptions.map((option) => (
              <Combobox.Option
                key={option}
                value={option}
                className={({ active }) =>
                  `cursor-pointer select-none py-2 px-4 ${
                    active ? 'bg-blue-600 text-white' : ''
                  }`
                }
              >
                {option}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}

function SettingsPage() {
  const [activeSection, setActiveSection] = useState('account');
  const { user } = UserAuth();
  const userId = user?.uid;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    targetRoles: [],
    detailedAspiration: '',
    experienceLevel: '',
    objectives: '',
  });
  const [rolesInput, setRolesInput] = useState('');

  // Account Info state
  const [accountInfo, setAccountInfo] = useState({
    email: '',
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Danger Zone state
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      try {
        const docRef = doc(db, 'userOnboarding', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const careerGoals = data.careerGoals || {};
          const personalInfo = data.personalInfo || {};
          const meta = data.meta || {};

          // Set career personalization data
          setFormData({
            targetRoles: careerGoals.targetRoles || [],
            detailedAspiration: careerGoals.detailedAspiration || '',
            experienceLevel: careerGoals.experienceLevel || '',
            objectives: careerGoals.objectives || '',
          });

          setRolesInput((careerGoals.targetRoles || []).join(', '));

          // Set account info data
          setAccountInfo((prev) => ({
            ...prev,
            email: meta.email || '',
            username: personalInfo.fullName || '',
          }));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // Career Personalization handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleInputChange = (e) => {
    const value = e.target.value;
    setRolesInput(value);
    setFormData((prev) => ({
      ...prev,
      targetRoles: value
        .split(',')
        .map((role) => role.trim())
        .filter(Boolean),
    }));
  };

  const handleCareerSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const newErrors = {};
    if (!formData.experienceLevel)
      newErrors.experience = 'Please select your experience level';
    if (!formData.objectives)
      newErrors.objective = 'Please select a career objective';
    if (!formData.targetRoles.length)
      newErrors.roles = 'Please specify at least one target role';
    if (!formData.detailedAspiration)
      newErrors.details = 'Please describe your career aspirations';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setSubmitting(false);
      return;
    }

    try {
      const userRef = doc(db, 'userOnboarding', userId);
      await updateDoc(userRef, {
        careerGoals: { ...formData },
        'meta.updatedAt': new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating career goals:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Account Info handlers
  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    // Add password update logic here
    console.log('Updating password...');
  };

  // Danger Zone handlers
  const handleAccountDeletion = (e) => {
    e.preventDefault();
    if (deleteConfirmation === 'DELETE') {
      // Add account deletion logic here
      console.log('Deleting account...');
    }
  };

  const Toggle = ({ label }) => (
    <div className="flex items-center justify-between w-full">
      <span className="text-gray-300 text-sm">{label}</span>
      <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
        <input type="checkbox" className="opacity-0 w-0 h-0 peer" />
        <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-700 rounded-full transition-all duration-300 before:absolute before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-blue-400 before:rounded-full before:transition-all before:duration-300 hover:bg-gray-600 peer-checked:bg-blue-900 peer-checked:before:translate-x-6 peer-checked:before:bg-blue-400"></span>
      </div>
    </div>
  );

  const InputField = ({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    name,
    error,
  }) => (
    <div className="mb-4">
      <label className="block text-gray-300 text-sm mb-2">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        value={value}
        onChange={onChange}
        name={name}
      />
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );

  const Sidebar = () => (
    <div className="w-full mb-6 lg:mb-0">
      <div className="bg-gray-800/60 backdrop-blur-md border border-blue-500/30 shadow-lg shadow-blue-500/10 rounded-xl p-4">
        <h2 className="text-xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Settings
        </h2>
        <nav className="space-y-2">
          {[
            { id: 'account', name: 'Account Info' },
            { id: 'preferences', name: 'Preferences' },
            { id: 'career', name: 'Career Personalization' },
            { id: 'privacy', name: 'Privacy & Security' },
            { id: 'danger', name: 'Danger Zone' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                activeSection === item.id
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium shadow-md shadow-blue-500/20'
                  : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
              }`}
            >
              {item.name}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );

  const AccountInfo = () => (
    <div className={`${activeSection === 'account' ? 'block' : 'hidden'}`}>
      <h3 className="text-2xl font-bold text-white mb-6">
        Account Information
      </h3>
      <div className="bg-gray-800/60 backdrop-blur-md border border-blue-500/30 shadow-lg shadow-blue-500/10 rounded-xl p-6 mb-6">
        <InputField
          label="Email Address"
          placeholder="your.email@example.com"
          value={accountInfo.email}
          onChange={handleAccountChange}
          name="email"
        />
        <InputField
          label="Username"
          placeholder="username"
          value={accountInfo.username}
          onChange={handleAccountChange}
          name="username"
        />
        <div className="pt-4 border-t border-gray-700 mt-4">
          <h4 className="text-lg font-semibold text-white mb-4">
            Change Password
          </h4>
          <InputField
            label="Current Password"
            type="password"
            placeholder="••••••••"
            value={accountInfo.currentPassword}
            onChange={handleAccountChange}
            name="currentPassword"
          />
          <InputField
            label="New Password"
            type="password"
            placeholder="••••••••"
            value={accountInfo.newPassword}
            onChange={handleAccountChange}
            name="newPassword"
          />
          <InputField
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            value={accountInfo.confirmPassword}
            onChange={handleAccountChange}
            name="confirmPassword"
          />
          <button
            onClick={handlePasswordUpdate}
            className="mt-2 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md shadow-blue-500/20"
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );

  const Preferences = () => (
    <div className={`${activeSection === 'preferences' ? 'block' : 'hidden'}`}>
      <h3 className="text-2xl font-bold text-white mb-6">Preferences</h3>
      <div className="bg-gray-800/60 backdrop-blur-md border border-blue-500/30 shadow-lg shadow-blue-500/10 rounded-xl p-6 mb-6">
        <div className="space-y-6">
          <Toggle label="Dark Mode" />
          <Toggle label="Email Notifications" />
          <Toggle label="Push Notifications" />
          <div className="pt-4 border-t border-gray-700">
            <label className="block text-gray-300 text-sm mb-2">Language</label>
            <select className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
              <option>Japanese</option>
            </select>
          </div>
          <div className="pt-4 border-t border-gray-700">
            <label className="block text-gray-300 text-sm mb-2">
              Time Zone
            </label>
            <select className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200">
              <option>UTC (Coordinated Universal Time)</option>
              <option>EST (Eastern Standard Time)</option>
              <option>CST (Central Standard Time)</option>
              <option>PST (Pacific Standard Time)</option>
              <option>JST (Japan Standard Time)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const CareerPersonalization = () => (
    <div className={`${activeSection === 'career' ? 'block' : 'hidden'}`}>
      <h3 className="text-2xl font-bold text-white mb-6">
        Career Personalization
      </h3>
      <div className="bg-gray-800/60 backdrop-blur-md border border-blue-500/30 shadow-lg shadow-blue-500/10 rounded-xl p-6 mb-6">
        <form onSubmit={handleCareerSubmit}>
          {/* Experience Level Dropdown */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm mb-2">
              Experience Level
            </label>
            <div className="relative">
              <select
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 appearance-none"
                value={formData.experienceLevel}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: 'experienceLevel',
                      value: e.target.value,
                    },
                  })
                }
              >
                <option value="" disabled className="text-gray-400">
                  Select experience level
                </option>
                {experienceLevels.map((level) => (
                  <option
                    key={level}
                    value={level}
                    className="bg-gray-800 text-white"
                  >
                    {level}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="h-5 w-5 text-blue-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            {errors.experience && (
              <p className="text-red-400 text-sm mt-1">{errors.experience}</p>
            )}
          </div>

          {/* Career Objective Dropdown */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm mb-2">
              Career Objective
            </label>
            <CareerObjectiveDropdown
              selected={formData.objectives}
              onChange={(value) =>
                handleChange({
                  target: {
                    name: 'objectives',
                    value,
                  },
                })
              }
            />
            {errors.objective && (
              <p className="text-red-400 text-sm mt-1">{errors.objective}</p>
            )}
          </div>

          {/* Target Roles Input */}
          <InputField
            label="Target Roles (comma separated)"
            placeholder="e.g., React Developer, UX Designer, Data Scientist"
            value={rolesInput}
            onChange={handleRoleInputChange}
            error={errors.roles}
          />

          {/* Detailed Aspirations */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm mb-2">
              Detailed Career Aspirations
            </label>
            <textarea
              rows={4}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              placeholder="Tell us about your long-term vision, specific milestones, or what kind of impact you'd like to make..."
              value={formData.detailedAspiration}
              onChange={(e) =>
                handleChange({
                  target: {
                    name: 'detailedAspiration',
                    value: e.target.value,
                  },
                })
              }
            />
            {errors.details && (
              <p className="text-red-400 text-sm mt-1">{errors.details}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md shadow-blue-500/20"
          >
            {submitting ? 'Saving...' : 'Save Career Preferences'}
          </button>
        </form>
      </div>
    </div>
  );

  const PrivacySecurity = () => (
    <div className={`${activeSection === 'privacy' ? 'block' : 'hidden'}`}>
      <h3 className="text-2xl font-bold text-white mb-6">Privacy & Security</h3>
      <div className="bg-gray-800/60 backdrop-blur-md border border-blue-500/30 shadow-lg shadow-blue-500/10 rounded-xl p-6 mb-6">
        <div className="mb-6">
          <Toggle label="Two-Factor Authentication" />
          <p className="text-gray-400 text-sm mt-2">
            Secure your account with 2FA. We'll ask for a verification code in
            addition to your password when you sign in.
          </p>
        </div>
        <div className="mb-6 pt-4 border-t border-gray-700">
          <Toggle label="Data Sharing" />
          <p className="text-gray-400 text-sm mt-2">
            Allow us to use your data to improve our AI recommendations.
          </p>
        </div>
        <div className="pt-4 border-t border-gray-700">
          <h4 className="text-lg font-semibold text-white mb-4">
            Active Sessions
          </h4>
          <div className="space-y-4">
            {[
              {
                device: 'MacBook Pro',
                location: 'San Francisco, CA',
                time: 'Current session',
              },
              {
                device: 'iPhone 13',
                location: 'San Francisco, CA',
                time: '2 hours ago',
              },
              {
                device: 'Windows PC',
                location: 'New York, NY',
                time: '2 days ago',
              },
            ].map((session, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg"
              >
                <div>
                  <p className="text-white text-sm font-medium">
                    {session.device}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {session.location} • {session.time}
                  </p>
                </div>
                {session.time !== 'Current session' && (
                  <button className="text-red-400 hover:text-red-300 text-sm">
                    Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const DangerZone = () => (
    <div className={`${activeSection === 'danger' ? 'block' : 'hidden'}`}>
      <h3 className="text-2xl font-bold text-white mb-6">Danger Zone</h3>
      <div className="bg-gray-800/60 backdrop-blur-md border border-red-500/30 shadow-lg shadow-red-500/10 rounded-xl p-6 mb-6">
        <h4 className="text-lg font-semibold text-white mb-4">
          Delete Account
        </h4>
        <p className="text-gray-400 mb-6">
          Once you delete your account, there is no going back. Please be
          certain.
        </p>
        <div className="mb-4">
          <label className="block text-gray-300 text-sm mb-2">
            Type "DELETE" to confirm
          </label>
          <input
            type="text"
            placeholder="DELETE"
            className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
          />
        </div>
        <button
          onClick={handleAccountDeletion}
          disabled={deleteConfirmation !== 'DELETE'}
          className={`bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md shadow-red-500/20 ${
            deleteConfirmation !== 'DELETE'
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-red-500'
          }`}
        >
          Permanently Delete Account
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className=" p-4 border border-blue-500/30 shadow-lg shadow-blue-500/10 text-white font-sans p-6">
        <div className="max-w-7xl mx-auto">
          <div className="">
            <Sidebar />
            <div className="flex-1 mt-5 mb-10">
              <AccountInfo />
              <Preferences />
              <CareerPersonalization />
              <PrivacySecurity />
              <DangerZone />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SettingsPage;
