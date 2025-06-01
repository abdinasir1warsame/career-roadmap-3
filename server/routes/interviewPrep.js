import express from 'express';
import { getFirestore } from 'firebase-admin/firestore';
import { admin, db } from '../firebase.js'; // Adjust import path as needed
import { v4 as uuidv4 } from 'uuid';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

const router = express.Router();

// Initialize OpenAI client with GPT-4o model
const llm = new ChatOpenAI({
  modelName: 'gpt-4o', // Updated to use GPT-4o as in the MockInterviewAI project
  temperature: 0.7,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// Helper function to extract JSON from OpenAI responses
const extractJSON = (content) => {
  const jsonAttempts = [
    () => {
      try {
        return JSON.parse(content);
      } catch (e) {
        return null;
      }
    },
    () => {
      try {
        const jsonMatch = content.match(/```(?:json)?\n([\s\S]*?)\n```/);
        if (jsonMatch) return JSON.parse(jsonMatch[1]);
        return null;
      } catch (e) {
        return null;
      }
    },
    () => {
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
        return null;
      } catch (e) {
        return null;
      }
    },
  ];

  for (const attempt of jsonAttempts) {
    const result = attempt();
    if (result) return result;
  }
  return null;
};

// Generate interview questions based on role and experience level
const generateInterviewQuestions = async (role, experienceLevel) => {
  try {
    const response = await llm.invoke([
      new SystemMessage(
        `Generate 15 interview questions for a ${experienceLevel} ${role} position. ` +
          `First question must ask about candidate's background and career choice. ` +
          `Second question should be about motivation. Next 12 technical questions. ` +
          `Last question should invite candidate to ask questions. ` +
          `Return as JSON array: ["Q1", "Q2", ..., "Q15"].`
      ),
      new HumanMessage(
        `Create interview questions for ${experienceLevel} ${role} as JSON array.`
      ),
    ]);

    const questions = extractJSON(response.content);
    if (Array.isArray(questions) && questions.length === 15) {
      return questions;
    }
    throw new Error('Invalid question format');
  } catch (error) {
    console.error('Question generation failed:', error);
    return [
      'Can you tell me about yourself and why you chose this career path?',
      'What interests you most about software engineering?',
      'Explain the virtual DOM concept in React',
      'How do you handle state management in large applications?',
      'Describe your experience with REST API design',
      'What testing strategies do you typically employ?',
      'How do you optimize application performance?',
      'Describe your experience with cloud platforms',
      'Explain authentication vs authorization',
      'How do you ensure code maintainability?',
      'Describe a challenging technical problem you solved',
      'What CI/CD tools have you worked with?',
      'How do you approach database schema design?',
      'What coding best practices are most important to you?',
      'Do you have any questions for us?',
    ];
  }
};

// Generate introduction message
router.post('/generateIntroduction', express.json(), async (req, res) => {
  try {
    const { role, experienceLevel } = req.body;

    if (!role || !experienceLevel) {
      return res
        .status(400)
        .json({ error: 'Role and experience level are required' });
    }

    const introResponse = await llm.invoke([
      new SystemMessage(
        `Create professional interview introduction for ${experienceLevel} ${role} position. ` +
          `Include: 1. Greeting 2. Your name as interviewer 3. Request for candidate introduction ` +
          `4. First question about background. Combine into one natural paragraph. ` +
          `Example: "Welcome! I'm Alex, your interviewer today. Could you start by telling me about your background in software engineering and what motivated you to pursue this career?"`
      ),
      new HumanMessage(`Generate interview introduction with first question.`),
    ]);

    res.json({ introduction: introResponse.content });
  } catch (error) {
    console.error('Introduction generation failed:', error);
    res.status(500).json({
      error: 'Failed to generate introduction',
      details:
        process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Generate questions endpoint
router.post('/generateQuestions', express.json(), async (req, res) => {
  try {
    const { role, experienceLevel } = req.body;

    if (!role || !experienceLevel) {
      return res
        .status(400)
        .json({ error: 'Role and experience level are required' });
    }

    const questions = await generateInterviewQuestions(role, experienceLevel);
    res.json({ questions });
  } catch (error) {
    console.error('Question generation failed:', error);
    res.status(500).json({
      error: 'Failed to generate questions',
      details:
        process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Start interview session
router.post('/start', express.json(), async (req, res) => {
  try {
    const { role, experienceLevel } = req.body;

    if (!role || !experienceLevel) {
      return res
        .status(400)
        .json({ error: 'Role and experience level are required' });
    }

    const questions = await generateInterviewQuestions(role, experienceLevel);
    const sessionId = uuidv4();

    const interviewSession = {
      sessionId,
      role,
      experienceLevel,
      totalQuestions: 15,
      currentQuestionNumber: 1,
      answeredQuestions: 0,
      status: 'active',
      startTime: admin.firestore.FieldValue.serverTimestamp(),
      questions,
      history: [],
    };

    await db
      .collection('interviewSessions')
      .doc(sessionId)
      .set(interviewSession);

    const introResponse = await llm.invoke([
      new SystemMessage(
        `Create professional interview introduction for ${experienceLevel} ${role} position. ` +
          `Include: 1. Greeting 2. Your name as interviewer 3. Request for candidate introduction ` +
          `4. First question about background. Combine into one natural paragraph. ` +
          `Example: "Welcome! I'm Alex, your interviewer today. Could you start by telling me about your background in software engineering and what motivated you to pursue this career?"`
      ),
      new HumanMessage(`Generate interview introduction with first question.`),
    ]);

    res.json({
      sessionId,
      questionNumber: 1,
      introduction: introResponse.content,
    });
  } catch (error) {
    console.error('Interview start failed:', error);
    res.status(500).json({
      error: 'Failed to start interview',
      details:
        process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Generate response to user's answer
router.post('/generateResponse', express.json(), async (req, res) => {
  try {
    const { sessionId, questionNumber, answer } = req.body;

    if (!sessionId || !questionNumber || !answer) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get the session data from Firestore
    const sessionDoc = await db
      .collection('interviewSessions')
      .doc(sessionId)
      .get();

    if (!sessionDoc.exists) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const sessionData = sessionDoc.data();
    const currentQuestion = sessionData.questions[questionNumber - 1];
    const isLastQuestion = questionNumber === sessionData.totalQuestions;

    const response = await llm.invoke([
      new SystemMessage(
        `You are an interviewer for a ${sessionData.role} position. Respond ONLY as JSON: {response: string, nextQuestion?: string, questionNumber?: number}. 
        1. Acknowledge the candidate's answer briefly (1-2 sentences).
        2. If not last question, include the next question in the same response.`
      ),
      new HumanMessage(
        `Question: ${currentQuestion}\nAnswer: ${answer}\nGenerate interviewer response.`
      ),
    ]);

    let responseData = extractJSON(response.content);

    if (!responseData) {
      responseData = {
        response: isLastQuestion
          ? 'Thank you for your answer. This concludes our interview.'
          : "Thanks for your answer! Let's move to the next question.",
      };

      if (!isLastQuestion) {
        responseData.nextQuestion = sessionData.questions[questionNumber];
        responseData.questionNumber = questionNumber + 1;
      }
    }

    // Combine acknowledgment and next question if exists
    let fullResponse = responseData.response;
    const alreadyHasQuestion = fullResponse.trim().endsWith('?');

    if (!alreadyHasQuestion && responseData.nextQuestion) {
      fullResponse += `\n\n${responseData.nextQuestion}`;
    }

    res.json({ response: fullResponse });
  } catch (error) {
    console.error('Response generation failed:', error);
    res.status(500).json({
      error: 'Failed to generate response',
      details:
        process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Process user's answer and generate feedback for each question
router.post('/answer', express.json(), async (req, res) => {
  try {
    const { sessionId, questionNumber, answer } = req.body;

    if (!sessionId || !questionNumber || !answer) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const sessionRef = db.collection('interviewSessions').doc(sessionId);
    const sessionDoc = await sessionRef.get();

    if (!sessionDoc.exists) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const sessionData = sessionDoc.data();
    const currentQuestion = sessionData.questions[questionNumber - 1];
    const isLastQuestion = questionNumber === sessionData.totalQuestions;

    // Generate AI response
    const response = await llm.invoke([
      new SystemMessage(
        `You are an interviewer for a ${sessionData.role} position. Respond ONLY as JSON: {response: string, nextQuestion?: string, questionNumber?: number}. 
        1. Acknowledge the candidate's answer briefly (1-2 sentences).
        2. If not last question, include the next question in the same response.`
      ),
      new HumanMessage(
        `Question: ${currentQuestion}\nAnswer: ${answer}\nGenerate interviewer response.`
      ),
    ]);

    let responseData = extractJSON(response.content);

    if (!responseData) {
      responseData = {
        response: isLastQuestion
          ? 'Thank you for your answer. This concludes our interview.'
          : "Thanks for your answer! Let's move to the next question.",
      };

      if (!isLastQuestion) {
        responseData.nextQuestion = sessionData.questions[questionNumber];
        responseData.questionNumber = questionNumber + 1;
      }
    }

    // Generate feedback for this question
    const feedbackPrompt = `Analyze this interview Q&A for a ${sessionData.experienceLevel} ${sessionData.role}:

Question: ${currentQuestion}
Answer: ${answer}

Provide feedback in JSON format:
{
  "aiFeedback": "Constructive feedback on the answer (2-3 sentences)",
  "idealAnswer": "What an ideal answer might include (2-3 sentences)",
  "rating": "strong" | "good" | "needs_improvement"
}

Consider:
- Technical accuracy and depth
- Communication clarity
- Use of specific examples
- Relevance to the role and experience level`;

    let questionFeedback = {};

    try {
      const feedbackResponse = await llm.invoke([
        new SystemMessage(feedbackPrompt),
        new HumanMessage('Generate question feedback'),
      ]);

      questionFeedback = extractJSON(feedbackResponse.content) || {
        aiFeedback: 'Good response overall.',
        idealAnswer: 'Consider providing more specific examples.',
        rating: 'good',
      };
    } catch (error) {
      console.error(
        `Error generating feedback for question ${questionNumber}:`,
        error
      );
      questionFeedback = {
        aiFeedback: 'Good response overall.',
        idealAnswer: 'Consider providing more specific examples.',
        rating: 'good',
      };
    }

    // Combine acknowledgment and next question if exists
    let fullResponse = responseData.response;
    const alreadyHasQuestion = fullResponse.trim().endsWith('?');

    if (!alreadyHasQuestion && responseData.nextQuestion) {
      fullResponse += `\n\n${responseData.nextQuestion}`;
    }

    // Create history entry with feedback
    const historyEntry = {
      questionNumber,
      question: currentQuestion,
      answer,
      interviewerResponse: responseData.response,
      feedback: questionFeedback,
    };

    // Update session in Firestore
    const updateData = {
      history: admin.firestore.FieldValue.arrayUnion(historyEntry),
      answeredQuestions: admin.firestore.FieldValue.increment(1),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (!isLastQuestion) {
      updateData.currentQuestionNumber = questionNumber + 1;
    } else {
      updateData.status = 'completed';
      updateData.endTime = admin.firestore.FieldValue.serverTimestamp();
    }

    await sessionRef.update(updateData);

    if (isLastQuestion) {
      const summary = await generateInterviewSummary(sessionId, sessionData);
      return res.json({
        response: fullResponse,
        interviewComplete: true,
        ...summary,
        questionFeedback: sessionData.history
          .map((entry) => ({
            questionNumber: entry.questionNumber,
            question: entry.question,
            userAnswer: entry.answer,
            aiFeedback: entry.feedback?.aiFeedback || 'Good response overall.',
            idealAnswer:
              entry.feedback?.idealAnswer ||
              'Consider providing more specific examples.',
            rating: entry.feedback?.rating || 'good',
          }))
          .concat([
            {
              questionNumber: questionNumber,
              question: currentQuestion,
              userAnswer: answer,
              aiFeedback: questionFeedback.aiFeedback,
              idealAnswer: questionFeedback.idealAnswer,
              rating: questionFeedback.rating,
            },
          ]),
      });
    }

    res.json({
      response: fullResponse,
      questionNumber: questionNumber + 1,
    });
  } catch (error) {
    console.error('Answer processing failed:', error);
    res.status(500).json({
      error: 'Failed to process answer',
      details:
        process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Generate interview summary
async function generateInterviewSummary(sessionId, sessionData) {
  const qaHistory = sessionData.history
    .map(
      (entry) =>
        `Q${entry.questionNumber}: ${entry.question}\nA: ${entry.answer}`
    )
    .join('\n\n');

  try {
    const summaryResponse = await llm.invoke([
      new SystemMessage(
        `Analyze interview for ${sessionData.role} position and provide JSON feedback: ` +
          `{strengths: string[], weaknesses: string[], improvementTips: string[], overallFeedback: string}`
      ),
      new HumanMessage(`Interview Q&A:\n${qaHistory}\n\nGenerate feedback.`),
    ]);

    const summaryData = extractJSON(summaryResponse.content) || {
      strengths: ['Good technical knowledge'],
      weaknesses: ['Needs more detailed examples'],
      improvementTips: ['Practice behavioral interview questions'],
      overallFeedback:
        'You demonstrated good understanding throughout the interview. Your responses showed relevant experience for the role. To strengthen future interviews, consider providing more specific examples and metrics from your work. Overall, you communicated clearly and showed enthusiasm for the role.',
    };

    await db
      .collection('interviewSessions')
      .doc(sessionId)
      .update({ summary: summaryData });
    return summaryData;
  } catch (error) {
    console.error('Summary generation failed:', error);
    return {
      strengths: ['Strong foundational knowledge'],
      weaknesses: ['Could improve communication clarity'],
      improvementTips: ['Practice explaining technical concepts'],
      overallFeedback:
        'You demonstrated good understanding throughout the interview. Your responses showed relevant experience for the role. To strengthen future interviews, consider providing more specific examples and metrics from your work. Overall, you communicated clearly and showed enthusiasm for the role.',
    };
  }
}

// Generate summary endpoint
router.post('/generateSummary', express.json(), async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    // Get the session data from Firestore
    const sessionDoc = await db
      .collection('interviewSessions')
      .doc(sessionId)
      .get();

    if (!sessionDoc.exists) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const sessionData = sessionDoc.data();
    const summary = await generateInterviewSummary(sessionId, sessionData);

    // Get question feedback from history
    const questionFeedback = sessionData.history.map((entry) => ({
      questionNumber: entry.questionNumber,
      question: entry.question,
      userAnswer: entry.answer,
      aiFeedback: entry.feedback?.aiFeedback || 'Good response overall.',
      idealAnswer:
        entry.feedback?.idealAnswer ||
        'Consider providing more specific examples.',
      rating: entry.feedback?.rating || 'good',
    }));

    res.json({
      ...summary,
      questionFeedback,
    });
  } catch (error) {
    console.error('Summary generation failed:', error);
    res.status(500).json({
      error: 'Failed to generate summary',
      details:
        process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

export default router;
