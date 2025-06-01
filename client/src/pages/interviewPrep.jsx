import { useState, useEffect, useRef } from 'react';
import InterviewPrepForm from '../components/interviewPrepForm';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  arrayUnion,
  serverTimestamp,
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

function InterviewPrep() {
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [userAnswer, setUserAnswer] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(15);
  const [screen, setScreen] = useState('setup'); // 'setup', 'interview', 'review'
  const [interviewSummary, setInterviewSummary] = useState(null);
  const [questionFeedback, setQuestionFeedback] = useState([]);

  const chatContainerRef = useRef(null);
  const db = getFirestore();

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, isAiThinking, isAiSpeaking]);

  const startInterview = async (role, experienceLevel) => {
    setInterviewStarted(true);
    setIsAiThinking(true);
    setScreen('interview');

    try {
      const response = await fetch(
        'https://career-roadmap-3.onrender.com/api/interviewPrep/start',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            role,
            experienceLevel,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSessionId(data.sessionId);
        setCurrentQuestionNumber(data.questionNumber);
        setTotalQuestions(15); // Default to 15 questions
        setChatHistory([
          {
            type: 'ai',
            content: data.introduction,
          },
        ]);

        setIsAiThinking(false);
        setIsAiSpeaking(true);
        setTimeout(() => setIsAiSpeaking(false), 2000);
      } else {
        throw new Error(data.error || 'Failed to start interview');
      }
    } catch (error) {
      console.error('Error starting interview:', error);
      setIsAiThinking(false);
      alert(error.message);
      setInterviewStarted(false);
      setScreen('setup');
    }
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim()) return;

    const newHistory = [
      ...chatHistory,
      {
        type: 'user',
        content: userAnswer,
      },
    ];

    setChatHistory(newHistory);
    setUserAnswer('');
    setIsAiThinking(true);

    try {
      const response = await fetch(
        'https://career-roadmap-3.onrender.com/api/interviewPrep/answer',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
            questionNumber: currentQuestionNumber,
            answer: userAnswer,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const updatedHistory = [
          ...newHistory,
          {
            type: 'ai',
            content: data.response,
          },
        ];

        if (data.interviewComplete) {
          setInterviewComplete(true);

          // Store the summary and question feedback for the review screen
          if (data.strengths && data.weaknesses && data.improvementTips) {
            setInterviewSummary({
              strengths: data.strengths,
              weaknesses: data.weaknesses,
              improvementTips: data.improvementTips,
              overallFeedback:
                data.overallFeedback ||
                'You demonstrated good understanding throughout the interview. Your responses showed relevant experience for the role. To strengthen future interviews, consider providing more specific examples and metrics from your work. Overall, you communicated clearly and showed enthusiasm for the role.',
            });

            if (data.questionFeedback) {
              setQuestionFeedback(data.questionFeedback);
            }

            // Add final messages to chat history
            setChatHistory([
              ...updatedHistory,
              {
                type: 'ai',
                content:
                  "Interview complete! I've prepared a detailed review of your performance.",
              },
            ]);

            // Switch to review screen after a short delay
            setTimeout(() => {
              setScreen('review');
            }, 2000);
          }
        } else {
          setCurrentQuestionNumber(data.questionNumber);
          setChatHistory(updatedHistory);
        }

        setIsAiThinking(false);
        setIsAiSpeaking(true);
        setTimeout(() => setIsAiSpeaking(false), 2000);
      } else {
        throw new Error(data.error || 'Failed to process answer');
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      setIsAiThinking(false);
      alert(error.message);
    }
  };

  const saveReport = () => {
    alert('Report saved! (This would download a PDF in a real application)');
  };

  const startNewInterview = () => {
    setInterviewStarted(false);
    setSessionId(null);
    setCurrentQuestionNumber(1);
    setUserAnswer('');
    setIsAiThinking(false);
    setIsAiSpeaking(false);
    setInterviewComplete(false);
    setChatHistory([]);
    setInterviewSummary(null);
    setQuestionFeedback([]);
    setScreen('setup');
  };

  const VoiceSignal = () => (
    <div className="flex items-end h-8 gap-[3px]">
      <div className="w-1 bg-gradient-to-t from-cyan-400 to-purple-500 rounded-full animate-voice-bar-1"></div>
      <div className="w-1 bg-gradient-to-t from-cyan-400 to-purple-500 rounded-full animate-voice-bar-2"></div>
      <div className="w-1 bg-gradient-to-t from-cyan-400 to-purple-500 rounded-full animate-voice-bar-3"></div>
      <div className="w-1 bg-gradient-to-t from-cyan-400 to-purple-500 rounded-full animate-voice-bar-4"></div>
      <div className="w-1 bg-gradient-to-t from-cyan-400 to-purple-500 rounded-full animate-voice-bar-5"></div>
    </div>
  );

  const ThinkingDots = () => (
    <div className="flex gap-[5px] p-2">
      <div className="w-2 h-2 bg-white/70 rounded-full animate-thinking-dot-1"></div>
      <div className="w-2 h-2 bg-white/70 rounded-full animate-thinking-dot-2"></div>
      <div className="w-2 h-2 bg-white/70 rounded-full animate-thinking-dot-3"></div>
    </div>
  );

  const getRatingColor = (rating) => {
    switch (rating) {
      case 'strong':
        return 'bg-green-100 text-green-800';
      case 'good':
        return 'bg-yellow-100 text-yellow-800';
      case 'needs_improvement':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (screen === 'setup') {
    return <InterviewPrepForm onStartInterview={startInterview} />;
  }

  if (screen === 'interview') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="w-full w-full h-[95vh] flex flex-col relative overflow-hidden rounded-xl bg-gray-800/60 backdrop-blur-md border border-blue-500/30 shadow-lg shadow-blue-500/10">
          <div className="flex flex-col h-full flex-1">
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 md:p-6 pb-[22%] lg:pb-[12%] flex flex-col gap-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
              style={{ maxHeight: 'calc(100% - 220px)' }}
            >
              {chatHistory.map((message, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl max-w-[85%] animate-fade-in relative ${
                    message.type === 'ai'
                      ? 'bg-[rgba(16,18,27,0.4)] border border-white/10 self-start ml-10 shadow-[0_4px_15px_rgba(0,243,255,0.1)]'
                      : 'bg-gradient-to-br from-cyan-400/10 to-purple-500/10 border border-cyan-400/20 self-end mr-10 shadow-[0_4px_15px_rgba(0,243,255,0.1)]'
                  }`}
                >
                  {message.type === 'ai' && (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center font-bold absolute -left-11 top-0 shadow-[0_0_10px_rgba(0,243,255,0.5)]">
                      AI
                    </div>
                  )}
                  {message.type === 'user' && (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 flex items-center justify-center font-bold absolute -right-11 top-0 shadow-[0_0_10px_rgba(255,105,180,0.5)]">
                      AW
                    </div>
                  )}
                  <div className="leading-relaxed whitespace-pre-line">
                    {message.content}
                  </div>
                </div>
              ))}

              {isAiThinking && (
                <div className="p-4 rounded-xl max-w-[85%] bg-[rgba(16,18,27,0.4)] border border-white/10 self-start ml-10 shadow-[0_4px_15px_rgba(0,243,255,0.1)] animate-fade-in relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center font-bold absolute -left-11 top-0 shadow-[0_0_10px_rgba(0,243,255,0.5)]">
                    AI
                  </div>
                  <ThinkingDots />
                </div>
              )}

              {isAiSpeaking && (
                <div className="flex justify-center my-4">
                  <VoiceSignal />
                </div>
              )}
            </div>

            {!interviewComplete && (
              <div className="p-4 md:p-6 bg-[rgba(16,18,27,0.4)] backdrop-blur-[10px] border-t border-white/10 rounded-b-2xl sticky bottom-0 z-10">
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  disabled={isAiThinking || isAiSpeaking}
                  className="w-full min-h-[80px] md:min-h-[100px] bg-black/20 border border-white/10 rounded-lg text-white p-3 font-inherit resize-none mb-3 transition-all duration-300 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(0,243,255,0.3)] placeholder:text-white/50"
                />
                <div className="flex gap-3 items-center">
                  <button
                    className="w-10 h-10 rounded-full bg-black/30 border border-white/10 flex items-center justify-center cursor-pointer transition-all duration-300 text-white hover:bg-cyan-400/10 hover:border-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-black/30 disabled:hover:border-white/10"
                    disabled={isAiThinking || isAiSpeaking}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                      <line x1="12" y1="19" x2="12" y2="23"></line>
                      <line x1="8" y1="23" x2="16" y2="23"></line>
                    </svg>
                  </button>
                  <button
                    className="flex-1 bg-gradient-to-r from-cyan-400 to-purple-500 text-white border-none rounded-lg py-2 px-4 text-base font-semibold cursor-pointer transition-all duration-300 shadow-[0_0_15px_rgba(0,243,255,0.5)] hover:shadow-[0_0_25px_rgba(0,243,255,0.7)] hover:-translate-y-0.5 active:translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:translate-y-0"
                    onClick={submitAnswer}
                    disabled={
                      !userAnswer.trim() || isAiThinking || isAiSpeaking
                    }
                  >
                    Submit Answer
                  </button>
                </div>

                <div className="text-center mt-4 text-sm text-white/60">
                  Question {currentQuestionNumber} of {totalQuestions}
                </div>
              </div>
            )}

            {interviewComplete && (
              <div className="p-4 md:p-6 bg-[rgba(16,18,27,0.4)] backdrop-blur-[10px] border-t border-white/10 rounded-b-2xl sticky bottom-0 z-10">
                <button
                  className="w-full bg-gradient-to-r from-cyan-400 to-purple-500 text-white border-none rounded-lg py-3 px-6 text-base font-semibold cursor-pointer transition-all duration-300 shadow-[0_0_15px_rgba(0,243,255,0.5)] hover:shadow-[0_0_25px_rgba(0,243,255,0.7)] hover:-translate-y-0.5 active:translate-y-0.5"
                  onClick={() => setScreen('review')}
                >
                  View Detailed Feedback
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'review') {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Header */}
        <header className="bg-gray-800/80 backdrop-blur-md border-b border-blue-500/30 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">AI</span>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-white">
                    Interview Review
                  </h1>
                  <p className="text-sm text-gray-300">
                    Your performance summary and feedback
                  </p>
                </div>
              </div>
              <button
                onClick={saveReport}
                className="flex items-center space-x-2 bg-gray-700/50 hover:bg-gray-700 border border-white/10 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <span>Export Results</span>
              </button>
            </div>
          </div>
        </header>

        {/* Review Content */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-8">
            {/* Overall Summary */}
            <div className="bg-gray-800/60 backdrop-blur-md border border-blue-500/30 rounded-xl shadow-lg shadow-blue-500/10 overflow-hidden">
              <div className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-cyan-400"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Interview Complete!
                  </h2>
                  <p className="text-gray-300">
                    Here's how you performed in your mock interview
                  </p>
                </div>

                <div className="bg-gray-700/50 rounded-lg p-6">
                  <h3 className="font-semibold text-white mb-3">
                    Overall Performance Summary
                  </h3>
                  <div className="text-gray-200">
                    <p>
                      {interviewSummary?.overallFeedback ||
                        'Great job completing the interview! Your responses showed good understanding and enthusiasm for the role.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Strengths and Areas for Improvement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="bg-gray-800/60 backdrop-blur-md border border-blue-500/30 rounded-xl shadow-lg shadow-blue-500/10 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-400"
                      >
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      Strengths
                    </h3>
                  </div>
                  <ul className="space-y-2 text-gray-200">
                    {interviewSummary?.strengths?.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-400 mr-2">•</span>
                        <span>{strength}</span>
                      </li>
                    )) || (
                      <li className="flex items-start">
                        <span className="text-green-400 mr-2">•</span>
                        <span>Strong communication skills</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Areas for Improvement */}
              <div className="bg-gray-800/60 backdrop-blur-md border border-blue-500/30 rounded-xl shadow-lg shadow-blue-500/10 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-yellow-400"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      Areas for Improvement
                    </h3>
                  </div>
                  <ul className="space-y-2 text-gray-200">
                    {interviewSummary?.weaknesses?.map((weakness, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-yellow-400 mr-2">•</span>
                        <span>{weakness}</span>
                      </li>
                    )) || (
                      <li className="flex items-start">
                        <span className="text-yellow-400 mr-2">•</span>
                        <span>Could provide more specific examples</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Improvement Tips */}
            <div className="bg-gray-800/60 backdrop-blur-md border border-blue-500/30 rounded-xl shadow-lg shadow-blue-500/10 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-blue-400"
                    >
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Tips for Improvement
                  </h3>
                </div>
                <ul className="space-y-2 text-gray-200">
                  {interviewSummary?.improvementTips?.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span>{tip}</span>
                    </li>
                  )) || (
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span>
                        Practice the STAR method for behavioral questions
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Question-by-Question Feedback */}
            <div className="bg-gray-800/60 backdrop-blur-md border border-blue-500/30 rounded-xl shadow-lg shadow-blue-500/10 overflow-hidden">
              <div className="p-8">
                <h3 className="text-xl font-semibold text-white mb-6">
                  Question-by-Question Feedback
                </h3>

                <div className="space-y-8">
                  {questionFeedback?.map((feedback, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-gray-600 pl-6"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-white">
                          Question {feedback.questionNumber}
                        </h4>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            feedback.rating === 'strong'
                              ? 'bg-green-500/20 text-green-400'
                              : feedback.rating === 'good'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {feedback.rating.replace('_', ' ')}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h5 className="text-sm font-medium text-gray-300 mb-1">
                            Question:
                          </h5>
                          <p className="text-gray-400 text-sm">
                            {feedback.question}
                          </p>
                        </div>

                        <div>
                          <h5 className="text-sm font-medium text-gray-300 mb-1">
                            Your Answer:
                          </h5>
                          <p className="text-gray-400 text-sm">
                            {feedback.userAnswer}
                          </p>
                        </div>

                        <div>
                          <h5 className="text-sm font-medium text-gray-300 mb-1">
                            Feedback:
                          </h5>
                          <p className="text-gray-400 text-sm">
                            {feedback.aiFeedback}
                          </p>
                        </div>

                        <div>
                          <h5 className="text-sm font-medium text-gray-300 mb-1">
                            Ideal Answer:
                          </h5>
                          <p className="text-gray-400 text-sm">
                            {feedback.idealAnswer}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {(!questionFeedback || questionFeedback.length === 0) && (
                    <p className="text-gray-400 text-center">
                      Detailed feedback will be available here after completing
                      all questions.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={startNewInterview}
                className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-purple-500 text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 shadow-[0_0_15px_rgba(0,243,255,0.5)] hover:shadow-[0_0_25px_rgba(0,243,255,0.7)] hover:-translate-y-0.5 active:translate-y-0.5"
              >
                Start New Interview
              </button>
              <button
                onClick={saveReport}
                className="px-8 py-3 bg-transparent border border-white/20 text-white rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-white/5"
              >
                Save Report
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return null;
}

export default InterviewPrep;
