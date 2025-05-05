import express from 'express';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import { admin, db } from '../firebase.js';

dotenv.config();

const router = express.Router();

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

const fetchYoutubeResults = async (query, maxResults = 1) => {
  const response = await youtube.search.list({
    part: 'snippet',
    q: query,
    maxResults: maxResults,
    type: 'video',
  });

  return response.data.items.map((item) => ({
    title: item.snippet.title,
    videoId: item.id.videoId,
    thumbnail: item.snippet.thumbnails.medium.url,
    channelTitle: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
  }));
};

router.post('/videos', express.json(), async (req, res) => {
  const { stages, userId } = req.body;

  if (!Array.isArray(stages) || stages.length === 0) {
    return res.status(400).json({ error: 'Missing or invalid stages array' });
  }

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }

  try {
    const results = {};

    for (const stage of stages) {
      const { name, milestones, skills } = stage;
      const videos = [];

      for (const milestone of milestones) {
        const query = milestone;
        if (!query) {
          console.warn(`Milestone missing text in stage "${name}"`);
          continue;
        }

        try {
          const videoResults = await fetchYoutubeResults(query);
          if (videoResults.length > 0) {
            videos.push({
              ...videoResults[0],
              milestone: query,
            });
          }
        } catch (error) {
          console.error(`Error fetching video for "${query}":`, error.message);
        }
      }

      const stageData = {
        stageName: name,
        videos,
        milestones,
        skills,
      };

      results[name] = stageData;
    }

    // Save to Firestore
    await db.collection('learningResources').doc(userId).set(
      {
        videos: results,
        lastUpdated: new Date().toISOString(),
      },
      { merge: true }
    );

    res.json({ success: true, videos: results });
  } catch (error) {
    console.error('YouTube fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch and save videos',
      message: error.message,
    });
  }
});

export default router;
