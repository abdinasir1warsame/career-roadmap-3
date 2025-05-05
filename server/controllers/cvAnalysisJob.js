// File 3: controllers/cvAnalysisJob.js
import express from 'express';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

const router = express.Router();

const createJobSystemMessage = () =>
  new SystemMessage(`
Compare resume with job description using these metrics:
1. Keyword and Skill Match
2. Role/Title Alignment 
3. Experience Level Match
4. Industry/Domain Relevance
5. Soft Skill Signals
6. Cultural/Values Fit

RESPONSE FORMAT (STRICT JSON):
{
  "jobAnalysis": {
    "title": "string",
    "overallScore": "number",
    "metrics": [{
      "metric": "string",
      "score": "number",
      "feedback": "string"
    }],
    "strengths": "string[]",
    "improvements": "string[]",
    "missingKeywords": "string[]"
  }
}
`);

router.post('/job', express.json(), async (req, res) => {
  try {
    const { cvText, jobTitle, jobDescription } = req.body;

    if (!cvText || !jobTitle || !jobDescription) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const llm = new ChatOpenAI({
      modelName: 'gpt-3.5-turbo-1106',
      temperature: 0.7,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const response = await llm.invoke([
      createJobSystemMessage(),
      new HumanMessage(
        `JOB TITLE: ${jobTitle}\n\n` +
          `JOB DESCRIPTION:\n${jobDescription}\n\n` +
          `RESUME CONTENT:\n${cvText}\n\n` +
          `JSON ANALYSIS:`
      ),
    ]);

    let analysis;
    try {
      analysis = JSON.parse(response.content.replace(/```json|```/g, ''));
    } catch (error) {
      return res.status(500).json({ error: 'Analysis parsing failed' });
    }

    // Calculate overall score
    const total = analysis.jobAnalysis.metrics.reduce(
      (sum, m) => sum + m.score,
      0
    );
    analysis.jobAnalysis.overallScore = Math.round(
      total / analysis.jobAnalysis.metrics.length
    );

    res.json({
      success: true,
      analysis: {
        ...analysis,
        metadata: {
          model: 'gpt-3.5-turbo-1106',
          analyzedAt: new Date().toISOString(),
        },
      },
    });
  } catch (error) {
    console.error('Job analysis error:', error);
    res.status(500).json({
      error: 'Analysis failed',
      details: process.env.NODE_ENV === 'development' ? error.message : null,
    });
  }
});

export default router;
