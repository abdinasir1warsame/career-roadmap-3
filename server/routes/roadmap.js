import express from 'express';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { admin, db } from '../firebase.js';

dotenv.config();
const router = express.Router();

// Experience level definitions with progression
const EXPERIENCE_LEVELS = {
  'No experience': {
    min: 0,
    max: 0,
    label: '0 years (starting point)',
    next: 'Beginner',
  },
  Beginner: { min: 0, max: 2, label: '0-2 years', next: 'Intermediate' },
  Intermediate: { min: 2, max: 5, label: '2-5 years', next: 'Advanced' },
  Advanced: { min: 5, max: 10, label: '5-10 years', next: 'Expert' },
  Expert: { min: 10, max: Infinity, label: '10+ years', next: null },
};

// Enhanced job search with fallback titles
const fetchAdzunaJobs = async (primaryTitle, alternativeTitles = []) => {
  const titlesToTry = [primaryTitle, ...alternativeTitles];
  let jobs = [];

  for (const title of titlesToTry) {
    try {
      const url = `https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=${
        process.env.ADZUNA_APP_ID
      }&app_key=${
        process.env.ADZUNA_APP_KEY
      }&results_per_page=5&what=${encodeURIComponent(
        title
      )}&content-type=application/json`;

      const response = await fetch(url);
      const text = await response.text();

      if (text.startsWith('<!DOCTYPE html>') || text.startsWith('<')) {
        console.warn(`Adzuna returned HTML for ${title}`);
        continue;
      }

      const data = JSON.parse(text);
      const newJobs =
        data.results?.slice(0, 5).map((job) => ({
          title: job.title || 'Not specified',
          company: job.company?.display_name || 'Not specified',
          location: job.location?.display_name || 'Not specified',
          salary: job.salary_min
            ? `${job.salary_min}-${job.salary_max} ${
                job.salary_is_predicted ? '(estimated)' : ''
              }`
            : 'Not specified',
          url: job.redirect_url || '#',
          sourceQuery: title,
        })) || [];

      jobs = [...jobs, ...newJobs];

      if (newJobs.length > 0) break;
    } catch (error) {
      console.error(`Error fetching jobs for ${title}:`, error.message);
    }
  }

  return jobs
    .filter(
      (job, index, self) => index === self.findIndex((j) => j.url === job.url)
    )
    .slice(0, 5);
};

// Generate alternative job titles
const generateAlternativeTitles = async (llm, primaryTitle) => {
  try {
    const response = await llm.invoke([
      new SystemMessage(
        `Generate 3 alternative job titles similar to "${primaryTitle}" as a JSON array.`
      ),
      new HumanMessage(`Provide 3 alternative titles for: ${primaryTitle}`),
    ]);

    const content = response.content.replace(/```json|```/g, '');
    const parsed = JSON.parse(content);

    // Ensure it's an array
    if (Array.isArray(parsed)) {
      return parsed;
    }

    console.warn('Alternative titles response was not an array:', parsed);
    return [];
  } catch (error) {
    console.error('Error generating alternative titles:', error);
    return [];
  }
};

// Enhanced roadmap generation with minimum 4 milestones
const generateRoadmap = async (
  llm,
  { role, currentLevel, aspirations, objectives }
) => {
  const isExpert = currentLevel === 'Expert';
  const levelInfo =
    EXPERIENCE_LEVELS[currentLevel] || EXPERIENCE_LEVELS['No experience'];

  const systemPrompt = `You're a career coach creating a ${
    isExpert ? 'expert maintenance' : 'progression'
  } roadmap for ${role}. Return valid JSON only. Strictly include minimum 4 milestones per stage.`;

  const userPrompt = `Create a ${
    isExpert ? '3-stage expert' : '4-stage'
  } roadmap for a ${role} at ${currentLevel} level with:
- name: Stage focus
- description: Key objectives
- timeframe: ${isExpert ? 'Ongoing' : 'X-Y months'}
- skills: Technologies to master
- milestones: Minimum 4 concrete achievements per stage (required)

Current level: ${levelInfo.label}
Aspirations: ${aspirations}
Objectives: ${objectives}

Return JSON with this exact structure:
{
  "roadmap": [{
    "name": "Stage name",
    "description": "Stage description",
    "timeframe": "X-Y months",
    "skills": ["skill1", "skill2"],
    "milestones": [
      "milestone1", 
      "milestone2",
      "milestone3",
      "milestone4"  // Minimum 4 required
    ]
  }],
  "summary": {
    "currentLevel": "${currentLevel}",
    "targetRole": "${role}",
    "startingPoint": "${levelInfo.label}",
    "nextLevel": "${levelInfo.next || 'N/A'}",
    "estimatedTimeline": "X-Y years"
  }
}`;

  try {
    const response = await llm.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(userPrompt),
    ]);

    // Clean and parse response
    let content = response.content.trim();
    if (content.startsWith('```json')) content = content.slice(7, -3).trim();
    else if (content.startsWith('```')) content = content.slice(3, -3).trim();

    const result = JSON.parse(content);

    // Validate structure and enforce minimum milestones
    if (!result.roadmap || !result.summary) {
      throw new Error('Invalid roadmap structure');
    }

    // Process each stage to ensure minimum 4 milestones
    const processedRoadmap = result.roadmap.map((stage) => {
      let milestones = Array.isArray(stage.milestones) ? stage.milestones : [];

      // If fewer than 4 milestones, add generic ones
      while (milestones.length < 4) {
        milestones.push(`Complete ${milestones.length + 1} key objectives`);
      }

      return {
        name: stage.name || 'Unnamed Stage',
        description: stage.description || 'No description provided',
        timeframe: stage.timeframe || '3-6 months',
        skills: Array.isArray(stage.skills) ? stage.skills : ['Core skills'],
        milestones: milestones.slice(0, 6), // Keep reasonable maximum
      };
    });

    return {
      roadmap: processedRoadmap,
      summary: {
        currentLevel,
        targetRole: role,
        startingPoint: levelInfo.label,
        nextLevel: levelInfo.next || 'N/A',
        estimatedTimeline: result.summary.estimatedTimeline || '1-2 years',
      },
    };
  } catch (error) {
    console.error('Roadmap generation error:', error);

    // Fallback roadmap with guaranteed 4 milestones
    return {
      roadmap: [
        {
          name: 'Initial Learning Path',
          description: 'Start your career development journey',
          timeframe: '0-6 months',
          skills: ['Core fundamentals'],
          milestones: [
            'Complete introductory courses',
            'Build first project',
            'Master basic concepts',
            'Complete skill assessment',
          ],
        },
        {
          name: 'Intermediate Development',
          description: 'Build deeper expertise',
          timeframe: '6-12 months',
          skills: ['Advanced techniques'],
          milestones: [
            'Complete intermediate courses',
            'Build portfolio project',
            'Contribute to open source',
            'Attend industry events',
          ],
        },
      ],
      summary: {
        currentLevel,
        targetRole: role,
        startingPoint: levelInfo.label,
        nextLevel: levelInfo.next || 'Intermediate',
        estimatedTimeline: '1-2 years',
      },
    };
  }
};

// Main endpoint
router.post('/', express.json(), async (req, res) => {
  try {
    const { personalInfo, careerGoals, skillsEducation } = req.body;
    const userId = personalInfo?.userId;
    const targetRole = careerGoals?.targetRoles?.[0];
    const currentLevel = careerGoals?.experienceLevel || 'No experience';

    if (!userId || !targetRole) {
      return res.status(400).json({ error: 'Missing required user data' });
    }

    const llm = new ChatOpenAI({
      modelName: 'gpt-3.5-turbo',
      temperature: 0.7,
      openAIApiKey: process.env.OPENAI_API_KEY,
      timeout: 30000,
    });

    // Generate content in parallel
    const [alternativeTitles, roadmapResult] = await Promise.all([
      generateAlternativeTitles(llm, targetRole),
      generateRoadmap(llm, {
        role: targetRole,
        currentLevel,
        aspirations: careerGoals.detailedAspiration,
        objectives: careerGoals.objectives,
      }),
    ]);

    // Fetch jobs
    const relevantJobs = await fetchAdzunaJobs(targetRole, alternativeTitles);

    // Save to Firestore
    await db
      .collection('userRoadmap')
      .doc(userId)
      .set({
        roadmap: roadmapResult.roadmap,
        summary: {
          ...roadmapResult.summary,
          completion: 0, // Initial completion
          experienceLevels: EXPERIENCE_LEVELS,
          lastUpdated: new Date().toISOString(),
        },
        relevantJobs,
        alternativeTitles,
        completedMilestones: [], // Initial empty milestones
        userId,
      });

    res.json({
      success: true,
      roadmap: roadmapResult.roadmap,
      summary: roadmapResult.summary,
      relevantJobs,
      completion: 0,
    });
  } catch (error) {
    console.error('Roadmap generation failed:', error);
    res.status(500).json({
      error: 'Failed to generate roadmap',
      details:
        process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

export default router;
