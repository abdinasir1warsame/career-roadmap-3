import express from 'express';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

const router = express.Router();

// 1. Split analysis into specialized parallel tasks
const createAnalysisTasks = (cvText, jobTitle) => {
  const context = jobTitle ? `for a ${jobTitle} role` : '';

  return [
    // Task 1: Core metrics (fast)
    {
      system: new SystemMessage(`
        Score resume (0-100) on:
        - ATS Compatibility
        - Readability & Clarity
        - Keyword Relevance
        - Summary Strength
        - Achievement Quantification
        - Formatting Layout
        
        Return JSON: {scores: {metric: number}}
      `),
      human: new HumanMessage(`RESUME:\n${cvText}`),
      model: 'gpt-3.5-turbo-0125',
      timeout: 4000, // 4s timeout
    },

    // Task 2: Strengths/weaknesses (fast)
    {
      system: new SystemMessage(`
        List exactly:
        - 4 strengths
        - 4 weaknesses
        - 1 positioning statement
        
        Return JSON: {strengths: string[], weaknesses: string[], overallPositioning: string}
      `),
      human: new HumanMessage(`RESUME:\n${cvText}`),
      model: 'gpt-3.5-turbo-0125',
      timeout: 4000,
    },

    // Task 3: Improvement examples (slower but critical)
    {
      system: new SystemMessage(`
        Provide specific improvement examples for:
        1. Summary (original/improved + 3 tips)
        2. Experience (3 bullet pairs + 3 tips)
        
        Return JSON: {
          improvementSuggestions: {
            summary: {original: string, improved: string, tips: string[]},
            experience: {bullets: {original: string, improved: string}[], tips: string[]}
          }
        }
      `),
      human: new HumanMessage(`RESUME:\n${cvText}`),
      model: 'gpt-4-0125-preview', // Higher quality for examples
      timeout: 6000,
    },

    // Task 4: Technical feedback (fast)
    {
      system: new SystemMessage(`
        Analyze:
        - Missing/overused skills (3 each)
        - Formatting issues (2)
        - Section feedback (education/projects/certifications)
        
        Return JSON: {
          improvementSuggestions: {
            skills: {missing: string[], overused: string[], tips: string[]},
            formatting: {issues: string[], tips: string[]}
          },
          sectionFeedback: {
            education: string, 
            projects: string,
            certifications: string
          }
        }
      `),
      human: new HumanMessage(`RESUME:\n${cvText}`),
      model: 'gpt-3.5-turbo-0125',
      timeout: 4000,
    },
  ];
};

// 2. Execute with timeout protection
const executeWithTimeout = async (task) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), task.timeout);

  try {
    const llm = new ChatOpenAI({
      modelName: task.model,
      temperature: 0.7,
      openAIApiKey: process.env.OPENAI_API_KEY,
      configuration: { signal: controller.signal },
    });

    const response = await llm.invoke([task.system, task.human]);
    clearTimeout(timeout);
    return JSON.parse(response.content.replace(/```json|```/g, ''));
  } catch (error) {
    clearTimeout(timeout);
    console.error(`Task failed (${task.model}):`, error);
    return null; // Graceful degradation
  }
};

router.post('/core', express.json(), async (req, res) => {
  try {
    const { cvText, jobTitle } = req.body;
    if (!cvText) return res.status(400).json({ error: 'CV text required' });

    // 3. Parallel execution with error isolation
    const tasks = createAnalysisTasks(cvText, jobTitle);
    const results = await Promise.all(tasks.map(executeWithTimeout));

    // 4. Merge results with fallbacks
    const merged = {
      scores: results[0]?.scores || {},
      ...results[1], // strengths/weaknesses
      improvementSuggestions: {
        ...results[2]?.improvementSuggestions,
        ...results[3]?.improvementSuggestions,
      },
      sectionFeedback: results[3]?.sectionFeedback || {},
    };

    // 5. Calculate overall score
    const validScores = Object.values(merged.scores).filter(Number.isFinite);
    const overallScore =
      validScores.length > 0
        ? Math.round(validScores.reduce((a, b) => a + b) / validScores.length)
        : null;

    // 6. Validate required fields
    const response = {
      success: true,
      analysis: {
        ...merged,
        overallScore,
        metadata: {
          models: tasks.map((t) => t.model),
          analyzedAt: new Date().toISOString(),
        },
      },
    };

    // Ensure minimum data quality
    if (!response.analysis.strengths) response.analysis.strengths = [];
    if (!response.analysis.improvementSuggestions?.summary) {
      response.analysis.improvementSuggestions.summary = {
        original: '',
        improved: '',
        tips: [],
      };
    }

    res.json(response);
  } catch (error) {
    console.error('Controller error:', error);
    res.status(500).json({
      error: 'Analysis failed',
      details: process.env.NODE_ENV === 'development' ? error.message : null,
    });
  }
});

export default router;
