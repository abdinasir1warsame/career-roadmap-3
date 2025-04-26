import express from 'express';
import { OpenAI } from 'openai';
import fileUpload from 'express-fileupload'; // ← make sure this is in your server.js
import { extractTextFromFile } from '../utils/fileExtract.js';

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/', async (req, res) => {
  try {
    console.log('📥 Incoming request to /api/processCv');

    if (!req.files || !req.files.cv) {
      console.warn('❌ No file found in request');
      return res.status(400).json({ error: 'No CV file uploaded' });
    }

    const cvFile = req.files.cv;
    console.log(
      '📄 File received:',
      cvFile.name,
      '-',
      Math.round(cvFile.size / 1024),
      'KB'
    );

    const cvText = await extractTextFromFile(cvFile.data, cvFile.name);
    console.log('✅ Text extracted from CV, length:', cvText.length);

    const prompt = `
    Analyze this CV and extract the following information in JSON format. 
    Return ONLY the JSON object with no additional text or explanation.
    {
      "fullName": "extract full name",
      "jobTitle": "extract the current or most recent job title",
      "bio": "extract a short bio or summary paragraph about the person if available",
      "age": "estimate age if not provided",
      "location": "extract location",
      "employmentStatus": "employed full-time/part-time/etc",
      "currentSalary": "if available",
      "currentJob": "current job title and company",
      "pastJobs": ["array of past jobs"],
      "skills": ["array of skills"],
      "certifications": ["array of certifications"],
      "languages": ["array of languages spoken"],
      "educationLevel": "highest education level",
      "fieldOfStudy": "main field of study",
      "recentCourses": ["array of recent courses/training"],
      "enjoyment": "what the person might enjoy based on their experience"
    }

    CV Content:
    ${cvText}
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful career assistant that extracts information from CVs. Return ONLY valid JSON.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const extractedData = JSON.parse(response.choices[0].message.content);
    res.status(200).json(extractedData);
  } catch (error) {
    console.error('❌ CV processing error:', error);
    res.status(500).json({ error: 'Failed to process CV' });
  }
});

export default router;
