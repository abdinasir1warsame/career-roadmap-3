import React, { useState, useEffect } from 'react';
import { Combobox } from '@headlessui/react';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { UserAuth } from '../context/authContext';

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

function SettingsPage({ activeSection = 'account' }) {
  const { user } = UserAuth();
  const userId = user?.uid;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Career Personalization state
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

          setFormData({
            targetRoles: careerGoals.targetRoles || [],
            detailedAspiration: careerGoals.detailedAspiration || '',
            experienceLevel: careerGoals.experienceLevel || '',
            objectives: careerGoals.objectives || '',
          });

          setRolesInput((careerGoals.targetRoles || []).join(', '));
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

  // Render the appropriate settings section
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'account':
        return (
          <AccountSettings
            accountInfo={accountInfo}
            setAccountInfo={setAccountInfo}
          />
        );
      case 'preferences':
        return <PreferencesSettings />;
      case 'career':
        return (
          <CareerSettings
            formData={formData}
            setFormData={setFormData}
            rolesInput={rolesInput}
            setRolesInput={setRolesInput}
            errors={errors}
            submitting={submitting}
            setSubmitting={setSubmitting}
            setErrors={setErrors}
            userId={userId}
          />
        );
      case 'privacy':
        return <PrivacySettings />;
      case 'danger':
        return (
          <DangerZoneSettings
            deleteConfirmation={deleteConfirmation}
            setDeleteConfirmation={setDeleteConfirmation}
          />
        );
      default:
        return (
          <AccountSettings
            accountInfo={accountInfo}
            setAccountInfo={setAccountInfo}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}{' '}
          Settings
        </h1>

        <div className="bg-gray-800/60 backdrop-blur-md border border-blue-500/30 rounded-xl shadow-lg shadow-blue-500/10 overflow-hidden">
          {renderActiveSection()}
        </div>
      </div>
    </div>
  );
}

// Sub-components for each settings section
function AccountSettings({ accountInfo, setAccountInfo }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAccountInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    // Add password update logic here
    console.log('Updating password...');
  };

  return (
    <div className="p-6">
      <div className="space-y-4">
        <InputField
          label="Email Address"
          placeholder="your.email@example.com"
          value={accountInfo.email}
          onChange={handleChange}
          name="email"
          disabled
        />
        <InputField
          label="Username"
          placeholder="username"
          value={accountInfo.username}
          onChange={handleChange}
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
            onChange={handleChange}
            name="currentPassword"
          />
          <InputField
            label="New Password"
            type="password"
            placeholder="••••••••"
            value={accountInfo.newPassword}
            onChange={handleChange}
            name="newPassword"
          />
          <InputField
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            value={accountInfo.confirmPassword}
            onChange={handleChange}
            name="confirmPassword"
          />
          <button
            onClick={handlePasswordUpdate}
            className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md shadow-blue-500/20"
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}

function PreferencesSettings() {
  const [preferences, setPreferences] = useState({
    darkMode: true,
    notifications: true,
    language: 'English',
    timezone: 'UTC',
  });

  const togglePreference = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-6">
      <div className="space-y-6">
        <Toggle
          label="Dark Mode"
          checked={preferences.darkMode}
          onChange={() => togglePreference('darkMode')}
        />
        <Toggle
          label="Email Notifications"
          checked={preferences.notifications}
          onChange={() => togglePreference('notifications')}
        />

        <div className="pt-4 border-t border-gray-700">
          <label className="block text-gray-300 text-sm mb-2">Language</label>
          <select
            className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            value={preferences.language}
            onChange={(e) =>
              setPreferences((prev) => ({ ...prev, language: e.target.value }))
            }
          >
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
          </select>
        </div>

        <div className="pt-4 border-t border-gray-700">
          <label className="block text-gray-300 text-sm mb-2">Time Zone</label>
          <select
            className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            value={preferences.timezone}
            onChange={(e) =>
              setPreferences((prev) => ({ ...prev, timezone: e.target.value }))
            }
          >
            <option>UTC</option>
            <option>EST</option>
            <option>PST</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function CareerSettings({
  formData,
  setFormData,
  rolesInput,
  setRolesInput,
  errors,
  submitting,
  setSubmitting,
  setErrors,
  userId,
}) {
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

  const handleSubmit = async (e) => {
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

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit}>
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
                  target: { name: 'experienceLevel', value: e.target.value },
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
                target: { name: 'detailedAspiration', value: e.target.value },
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
  );
}

function PrivacySettings() {
  const [privacySettings, setPrivacySettings] = useState({
    twoFactor: false,
    dataSharing: true,
  });

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="mb-6">
          <Toggle
            label="Two-Factor Authentication"
            checked={privacySettings.twoFactor}
            onChange={() =>
              setPrivacySettings((prev) => ({
                ...prev,
                twoFactor: !prev.twoFactor,
              }))
            }
          />
          <p className="text-gray-400 text-sm mt-2">
            Secure your account with 2FA. We'll ask for a verification code in
            addition to your password when you sign in.
          </p>
        </div>

        <div className="pt-4 border-t border-gray-700">
          <Toggle
            label="Data Sharing"
            checked={privacySettings.dataSharing}
            onChange={() =>
              setPrivacySettings((prev) => ({
                ...prev,
                dataSharing: !prev.dataSharing,
              }))
            }
          />
          <p className="text-gray-400 text-sm mt-2">
            Allow us to use your data to improve our AI recommendations.
          </p>
        </div>
      </div>
    </div>
  );
}

function DangerZoneSettings({ deleteConfirmation, setDeleteConfirmation }) {
  const handleAccountDeletion = (e) => {
    e.preventDefault();
    if (deleteConfirmation === 'DELETE') {
      // Add account deletion logic here
      console.log('Deleting account...');
    }
  };

  return (
    <div className="p-6">
      <div className="bg-gray-800/40 border border-red-500/30 rounded-xl p-6">
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
}

// Reusable components
function InputField({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  name,
  error,
  disabled = false,
}) {
  return (
    <div className="mb-4">
      <label className="block text-gray-300 text-sm mb-2">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className={`w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
          disabled ? 'opacity-70 cursor-not-allowed' : ''
        }`}
        value={value}
        onChange={onChange}
        name={name}
        disabled={disabled}
      />
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between w-full">
      <span className="text-gray-300 text-sm">{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={onChange}
        />
        <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );
}

export default SettingsPage;
