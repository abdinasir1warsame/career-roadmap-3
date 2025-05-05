import { useState, useEffect, useRef } from 'react';
import InterviewPrepForm from '../components/interviewPrepForm';

function InterviewPrep() {
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [userAnswer, setUserAnswer] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, isAiThinking, isAiSpeaking]);

  const startInterview = async (role, experienceLevel) => {
    setInterviewStarted(true);
    setIsAiThinking(true);

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
          if (data.strengths && data.weaknesses && data.improvementTips) {
            setChatHistory([
              ...updatedHistory,
              {
                type: 'ai',
                content: "Interview complete! Here's your performance summary:",
              },
              {
                type: 'ai',
                content: `Strengths:\n${data.strengths.join(
                  '\n'
                )}\n\nAreas for Improvement:\n${data.weaknesses.join(
                  '\n'
                )}\n\nTips:\n${data.improvementTips.join('\n')}`,
              },
            ]);
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

  return (
    <>
      {!interviewStarted ? (
        <InterviewPrepForm onStartInterview={startInterview} />
      ) : (
        <div className="min-h-screen   flex flex-col items-center justify-center px-6">
          <div className="w-full w-full h-[95vh]  flex flex-col relative overflow-hidden rounded-xl bg-gray-800/60 backdrop-blur-md border border-blue-500/30 shadow-lg shadow-blue-500/10">
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
                    Question {currentQuestionNumber} of 15
                  </div>
                </div>
              )}

              {interviewComplete && (
                <div className="p-4 md:p-6 bg-[rgba(16,18,27,0.4)] backdrop-blur-[10px] border-t border-white/10 rounded-b-2xl sticky bottom-0 z-10">
                  <button
                    className="w-full bg-gradient-to-r from-cyan-400 to-purple-500 text-white border-none rounded-lg py-3 px-6 text-base font-semibold cursor-pointer transition-all duration-300 shadow-[0_0_15px_rgba(0,243,255,0.5)] hover:shadow-[0_0_25px_rgba(0,243,255,0.7)] hover:-translate-y-0.5 active:translate-y-0.5"
                    onClick={saveReport}
                  >
                    Save Report
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default InterviewPrep;
