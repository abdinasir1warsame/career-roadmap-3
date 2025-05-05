import React, { useEffect, useState } from 'react';
import FileUploadForm from '../components/cvReviewComponents/fileUploadForm';
import CoreCvReview from '../components/cvReviewComponents/cvCoreReview';

// In your CvReview component
function CvReview() {
  const [analysisData, setAnalysisData] = useState(null);
  useEffect(() => {
    console.log(analysisData);
  }, [analysisData]);
  const handleAnalysisComplete = (results) => {
    setAnalysisData({
      coreAnalysis: results.coreAnalysis,
      jobAnalysis: results.jobAnalysis,
    });
  };

  if (!analysisData) {
    return <FileUploadForm onAnalysisComplete={handleAnalysisComplete} />;
  }

  return (
    <CoreCvReview
      coreAnalysis={analysisData.coreAnalysis}
      jobAnalysis={analysisData.jobAnalysis}
    />
  );
}
export default CvReview;
