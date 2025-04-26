import React, { useEffect, useState } from 'react';

function Loader() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState(
    'Initializing AI career systems...'
  );

  useEffect(() => {
    const loadingTexts = [
      'Initializing AI career systems...',
      'Analyzing career trajectories...',
      'Processing industry demand patterns...',
      'Mapping skill development pathways...',
      'Identifying growth opportunities...',
      'Calculating optimal career moves...',
      'Generating your personalized roadmap...',
    ];

    let currentTextIndex = 0;
    const textInterval = setInterval(() => {
      currentTextIndex = (currentTextIndex + 1) % loadingTexts.length;
      setLoadingText(loadingTexts[currentTextIndex]);
    }, 3000);

    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        const newProgress = prev + (1 + Math.random() * 2);
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 200);

    return () => {
      clearInterval(textInterval);
      clearInterval(progressInterval);
    };
  }, []);

  // Career and roadmap specific icons
  const careerIcons = [
    // Briefcase icon
    <svg
      key="briefcase"
      className="career-icon"
      viewBox="0 0 24 24"
      width="100%"
      height="100%"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>,

    // Chart/growth icon
    <svg
      key="chart"
      className="career-icon"
      viewBox="0 0 24 24"
      width="100%"
      height="100%"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M23 6l-9.5 9.5-5-5L1 18"></path>
      <path d="M17 6h6v6"></path>
    </svg>,

    // Target/goal icon
    <svg
      key="target"
      className="career-icon"
      viewBox="0 0 24 24"
      width="100%"
      height="100%"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="6"></circle>
      <circle cx="12" cy="12" r="2"></circle>
    </svg>,

    // Graduation cap icon
    <svg
      key="education"
      className="career-icon"
      viewBox="0 0 24 24"
      width="100%"
      height="100%"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
    </svg>,

    // Award/achievement icon
    <svg
      key="award"
      className="career-icon"
      viewBox="0 0 24 24"
      width="100%"
      height="100%"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="7"></circle>
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
    </svg>,

    // Compass/direction icon
    <svg
      key="compass"
      className="career-icon"
      viewBox="0 0 24 24"
      width="100%"
      height="100%"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
    </svg>,

    // Map icon
    <svg
      key="map"
      className="career-icon"
      viewBox="0 0 24 24"
      width="100%"
      height="100%"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
      <line x1="8" y1="2" x2="8" y2="18"></line>
      <line x1="16" y1="6" x2="16" y2="22"></line>
    </svg>,

    // Lightbulb/idea icon
    <svg
      key="idea"
      className="career-icon"
      viewBox="0 0 24 24"
      width="100%"
      height="100%"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18h6M10 22h4M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8A6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"></path>
    </svg>,
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Career Roadmap</h1>
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 text-lg font-semibold">
            Your AI-powered career roadmap is being generated
          </p>
        </div>

        {/* Career Path Animation */}
        <div className="relative h-64 mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="career-network">
              {/* Career Nodes */}
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="career-node"
                  style={{
                    left: `${10 + i * 12}%`,
                    top: `${20 + (i % 3) * 20}%`,
                    animationDelay: `${i * 0.5}s`,
                  }}
                >
                  <div className="node-pulse"></div>
                </div>
              ))}

              {/* Career Path Connections */}
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={`path-${i}`}
                  className="career-path"
                  style={{
                    left: `${16 + i * 12}%`,
                    top: `${30 + (i % 3) * 20}%`,
                    width: `${12}%`,
                    transform: i % 2 === 0 ? 'rotate(20deg)' : 'rotate(-20deg)',
                    animationDelay: `${i * 0.5}s`,
                  }}
                ></div>
              ))}

              {/* Skill Bubbles */}
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={`skill-${i}`}
                  className="skill-bubble"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${3 + Math.random() * 4}s`,
                    opacity: 0.1 + Math.random() * 0.5,
                  }}
                ></div>
              ))}
            </div>
          </div>

          {/* Career Milestone Markers with Career Icons */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={`milestone-${i}`}
                className="milestone-marker"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${2 + Math.random() * 3}s`,
                }}
              >
                {careerIcons[i % careerIcons.length]}
              </div>
            ))}
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center mb-6">
          <p className="text-white text-lg font-medium">{loadingText}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-4 mb-6 overflow-hidden shadow-[0_0_10px_rgba(79,70,229,0.3)]">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${loadingProgress}%` }}
          ></div>
        </div>

        {/* Loading Percentage */}
        <div className="text-center">
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 text-xl font-bold">
            {Math.floor(loadingProgress)}%
          </p>
        </div>
      </div>

      {/* SVG Gradients */}
      <svg width="0" height="0">
        <defs>
          <linearGradient
            id="gradient-stroke"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#9333ea" />
          </linearGradient>
          <linearGradient id="gradient-fill" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#9333ea" />
          </linearGradient>
        </defs>
      </svg>

      <style>
        {`
          .career-network {
            position: relative;
            width: 100%;
            height: 100%;
          }
          
          .career-node {
            position: absolute;
            width: 12px;
            height: 12px;
            background: linear-gradient(to right, #2563eb, #9333ea);
            border-radius: 50%;
            animation: nodeGlow 4s infinite;
            box-shadow: 0 0 10px rgba(147, 51, 234, 0.5);
            z-index: 10;
          }
          
          .node-pulse {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: linear-gradient(to right, rgba(37, 99, 235, 0.4), rgba(147, 51, 234, 0.4));
            animation: nodeRipple 4s infinite;
          }
          
          .career-path {
            position: absolute;
            height: 3px;
            background: linear-gradient(90deg, #2563eb, #9333ea);
            animation: pathGlow 5s infinite;
            box-shadow: 0 0 8px rgba(147, 51, 234, 0.4);
            z-index: 5;
          }
          
          .skill-bubble {
            position: absolute;
            width: 6px;
            height: 6px;
            background: linear-gradient(to right, #2563eb, #9333ea);
            border-radius: 50%;
            animation: bubbleFloat 4s infinite linear;
            box-shadow: 0 0 5px rgba(147, 51, 234, 0.3);
          }
          
          .milestone-marker {
            position: absolute;
            width: 20px;
            height: 20px;
            color: white;
            animation: markerPulse 3s infinite;
            filter: drop-shadow(0 0 5px rgba(147, 51, 234, 0.8));
          }
          
          .career-icon {
            color: white;
            stroke: url(#gradient-stroke);
            filter: drop-shadow(0 0 3px rgba(147, 51, 234, 0.8));
          }
          
          .icon-outline {
            fill: none;
            stroke: url(#gradient-stroke);
            stroke-width: 1.5;
          }
          
          .road-path {
            stroke: url(#gradient-stroke);
            animation: roadGlow 3s infinite;
          }
          
          .milestone-dot {
            fill: url(#gradient-fill);
            animation: dotPulse 2s infinite;
          }
          
          .circuit-path {
            stroke: url(#gradient-stroke);
            stroke-dasharray: 20;
            stroke-dashoffset: 20;
            animation: circuitDash 3s infinite;
          }
          
          @keyframes nodeGlow {
            0%, 100% {
              transform: scale(1);
              box-shadow: 0 0 10px rgba(147, 51, 234, 0.5);
            }
            50% {
              transform: scale(1.3);
              box-shadow: 0 0 15px rgba(147, 51, 234, 0.8);
            }
          }
          
          @keyframes nodeRipple {
            0% {
              transform: scale(1);
              opacity: 0.8;
            }
            100% {
              transform: scale(3);
              opacity: 0;
            }
          }
          
          @keyframes pathGlow {
            0%, 100% {
              opacity: 0.6;
              box-shadow: 0 0 8px rgba(147, 51, 234, 0.4);
            }
            50% {
              opacity: 1;
              box-shadow: 0 0 15px rgba(147, 51, 234, 0.7);
            }
          }
          
          @keyframes roadGlow {
            0%, 100% {
              opacity: 0.7;
              stroke-width: 1.5;
            }
            50% {
              opacity: 1;
              stroke-width: 2;
            }
          }
          
          @keyframes dotPulse {
            0%, 100% {
              opacity: 0.7;
              r: 1;
            }
            50% {
              opacity: 1;
              r: 1.5;
            }
          }
          
          @keyframes bubbleFloat {
            0% {
              transform: translateY(0) translateX(0) scale(1);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              transform: translateY(-60px) translateX(20px) scale(1.5);
              opacity: 0;
            }
          }
          
          @keyframes markerPulse {
            0%, 100% {
              transform: scale(1);
              opacity: 0.7;
            }
            50% {
              transform: scale(1.2);
              opacity: 1;
            }
          }
          
          @keyframes circuitDash {
            0% {
              stroke-dashoffset: 20;
            }
            50% {
              stroke-dashoffset: 0;
            }
            100% {
              stroke-dashoffset: -20;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Loader;
