import { useState, useRef } from 'react';
import { db } from '../firebase';
import { collection, addDoc, setDoc, doc } from 'firebase/firestore';
import { UserAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';

import ProgressBar from '../components/roadmapFormComponents/progressbar';
import StepNavigation from '../components/roadmapFormComponents/stepNavigation';
import LoginStep from '../components/roadmapFormComponents/loginStep';
import CVUploadStep from '../components/roadmapFormComponents/cvUploadStep';
import BasicInfoStep from '../components/roadmapFormComponents/basicInfoStep';
import CareerGoalsStep from '../components/roadmapFormComponents/careerGoalStep';
import ExperienceStep from '../components/roadmapFormComponents/experienceStep';
import SkillsEducationStep from '../components/roadmapFormComponents/skillEducationStep';
import ReviewStep from '../components/roadmapFormComponents/reviewSteps';
import Loader from './roadmapFormComponents/loader';

export default function RoadmapInput() {
  const { user } = UserAuth();
  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);

  const [userOnboardingData, setUserOnboardingData] = useState({
    fullName: '',
    cv: null,
    cvSummary: '',
    age: '',
    location: '',
    employmentStatus: '',
    currentSalary: '',
    currentJob: '',
    pastJobs: ['', '', ''],
    skills: [],
    certifications: [],
    languages: [],
    enjoyment: '',
    educationLevel: '',
    fieldOfStudy: '',
    recentCourses: [],
    careerObjectives: [],
    targetRoles: [],
    detailedCareerAspiration: '',
    targetRoleExperienceLevel: '',
    bio: '', // ✅ New field
    jobTitle: '', // ✅ New field
  });

  const fileInputRef = useRef(null);
  const totalSteps = 7;
  const navigate = useNavigate();

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  const goToStep = (stepNumber) => {
    setStep(stepNumber);
    window.scrollTo(0, 0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserOnboardingData({ ...userOnboardingData, [name]: value });
  };

  const handleMultiSelect = (category, value) => {
    setUserOnboardingData((prev) => {
      const currentValues = prev[category] || [];
      if (currentValues.includes(value)) {
        return {
          ...prev,
          [category]: currentValues.filter((item) => item !== value),
        };
      } else {
        return { ...prev, [category]: [...currentValues, value] };
      }
    });
  };

  const handleFileUpload = async (file) => {
    setIsUploading(true);

    const formData = new FormData();
    formData.append('cv', file);

    try {
      const response = await fetch(
        'https://career-roadmap-3.onrender.com/api/processCv',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) throw new Error('File upload failed');

      const data = await response.json();

      setUserOnboardingData((prev) => ({
        ...prev,
        fullName: data.fullName || prev.fullName,
        age: data.age || prev.age,
        location: data.location || prev.location,
        employmentStatus: data.employmentStatus || prev.employmentStatus,
        currentSalary: data.currentSalary || prev.currentSalary,
        currentJob: data.currentJob || prev.currentJob,
        pastJobs: data.pastJobs || prev.pastJobs,
        skills: data.skills || prev.skills,
        certifications: data.certifications || prev.certifications,
        languages: data.languages || prev.languages,
        educationLevel: data.educationLevel || prev.educationLevel,
        fieldOfStudy: data.fieldOfStudy || prev.fieldOfStudy,
        recentCourses: data.recentCourses || prev.recentCourses,
        industries: data.industries || prev.industries,
        enjoyment: data.enjoyment || prev.enjoyment,
        cvSummary: JSON.stringify(data),
      }));

      setIsUploading(false);
      nextStep();
    } catch (error) {
      setIsUploading(false);
      console.error('Error uploading CV:', error);
      alert('There was an error uploading your CV. Please try again.');
    }
  };

  const handlePastJobChange = (index, value) => {
    const updatedPastJobs = [...userOnboardingData.pastJobs];
    updatedPastJobs[index] = value;
    setUserOnboardingData({ ...userOnboardingData, pastJobs: updatedPastJobs });
  };

  const handleSubmit = async () => {
    if (!user) {
      alert('You must be logged in to submit.');
      return;
    }

    setIsUploading(true);

    try {
      const submissionData = {
        personalInfo: {
          fullName: userOnboardingData.fullName || '',
          age: userOnboardingData.age || '',
          location: userOnboardingData.location || '',
          employmentStatus: userOnboardingData.employmentStatus || '',
          currentSalary: userOnboardingData.currentSalary || '',
          userId: user.uid,
          bio: userOnboardingData.bio || '', // ✅ saving bio
          jobTitle: userOnboardingData.jobTitle || '', // ✅ saving jobTitle
        },
        careerGoals: {
          objectives: userOnboardingData.careerObjectives || [],
          targetRoles: userOnboardingData.targetRoles || [],
          detailedAspiration: userOnboardingData.detailedCareerAspiration || '',
          experienceLevel: userOnboardingData.targetRoleExperienceLevel || '',
        },
        experience: {
          currentJob:
            typeof userOnboardingData.currentJob === 'string'
              ? userOnboardingData.currentJob
              : userOnboardingData.currentJob?.title || '',
          pastJobs: Array.isArray(userOnboardingData.pastJobs)
            ? userOnboardingData.pastJobs.filter(
                (job) => job && job.trim() !== ''
              )
            : [],
        },
        skillsEducation: {
          skills: userOnboardingData.skills || [],
          certifications: userOnboardingData.certifications || [],
          languages: userOnboardingData.languages || [],
          educationLevel: userOnboardingData.educationLevel || '',
          fieldOfStudy: userOnboardingData.fieldOfStudy || '',
          recentCourses: Array.isArray(userOnboardingData.recentCourses)
            ? userOnboardingData.recentCourses
            : [],
        },
        meta: {
          email: user.email,
          submittedAt: new Date(),
          cvProcessed: !!userOnboardingData.cvSummary,
        },
      };

      await setDoc(doc(db, 'userOnboarding', user.uid), submissionData);

      const apiPayload = {
        personalInfo: {
          fullName: userOnboardingData.fullName || '',
          age: userOnboardingData.age || '',
          location: userOnboardingData.location || '',
          employmentStatus: userOnboardingData.employmentStatus || '',
          currentSalary: userOnboardingData.currentSalary || '',
          userId: user.uid,
        },
        careerGoals: submissionData.careerGoals,
        skillsEducation: submissionData.skillsEducation,
      };

      const response = await fetch('https://career-roadmap-3.onrender.com/api/roadmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Roadmap generation failed');
      }

      const result = await response.json();

      if (result) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const renderForm = () => {
    switch (step) {
      case 1:
        return (
          <LoginStep
            formData={userOnboardingData}
            handleChange={handleChange}
            nextStep={nextStep}
          />
        );
      case 2:
        return (
          <CVUploadStep
            formData={userOnboardingData}
            fileInputRef={fileInputRef}
            handleFileUpload={handleFileUpload}
            prevStep={prevStep}
            nextStep={nextStep}
            setFormData={setUserOnboardingData}
            setStep={setStep}
          />
        );
      case 3:
        return (
          <BasicInfoStep
            formData={userOnboardingData}
            handleChange={handleChange}
            prevStep={prevStep}
            nextStep={nextStep}
          />
        );
      case 4:
        return (
          <ExperienceStep
            formData={userOnboardingData}
            handleChange={handleChange}
            handlePastJobChange={handlePastJobChange}
            prevStep={prevStep}
            nextStep={nextStep}
          />
        );
      case 5:
        return (
          <SkillsEducationStep
            formData={userOnboardingData}
            handleChange={handleChange}
            handleMultiSelect={handleMultiSelect}
            prevStep={prevStep}
            nextStep={nextStep}
          />
        );
      case 6:
        return (
          <CareerGoalsStep
            formData={userOnboardingData}
            handleChange={handleChange}
            handleMultiSelect={handleMultiSelect}
            prevStep={prevStep}
            nextStep={nextStep}
          />
        );
      case 7:
        return (
          <ReviewStep
            formData={userOnboardingData}
            prevStep={prevStep}
            handleSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-4 md:p-3">
      <div className="max-w-4xl mx-auto">
        <header className="mb-4 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-2">
            CareerPath Pro
          </h1>
          <p className="text-white">Let's find your perfect career match</p>
        </header>

        <ProgressBar step={step} totalSteps={totalSteps} />
        <StepNavigation
          step={step}
          totalSteps={totalSteps}
          goToStep={goToStep}
        />

        <div className="">{isUploading ? <Loader /> : renderForm()}</div>
      </div>
    </div>
  );
}
