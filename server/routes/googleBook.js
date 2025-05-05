import express from 'express';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import { admin, db } from '../firebase.js';

dotenv.config();

const router = express.Router();

const books = google.books({
  version: 'v1',
  auth: process.env.GOOGLE_BOOKS_API_KEY,
});

// Utility to recursively remove undefined values
const removeUndefined = (obj) => JSON.parse(JSON.stringify(obj));

const fetchMostRelevantBook = async (stageName) => {
  const searchStrategies = [
    `"${stageName}"`,
    `intitle:"${stageName}"`,
    `${stageName}`,
  ];

  for (const query of searchStrategies) {
    try {
      const response = await books.volumes.list({
        q: query,
        maxResults: 3,
        printType: 'BOOKS',
        orderBy: 'relevance',
        langRestrict: 'en',
        filter: 'partial',
      });

      const item = response.data.items?.[0];
      if (item) {
        return {
          title: item.volumeInfo?.title || 'Untitled',
          authors: item.volumeInfo?.authors?.join(', ') || 'Unknown author',
          publisher: item.volumeInfo?.publisher || 'Unknown publisher',
          publishedDate: item.volumeInfo?.publishedDate || null,
          description:
            item.volumeInfo?.description || 'No description available',
          isbn: item.volumeInfo?.industryIdentifiers?.[0]?.identifier || null,
          pageCount: item.volumeInfo?.pageCount || null,
          categories: item.volumeInfo?.categories?.join(', ') || 'General',
          thumbnail:
            item.volumeInfo?.imageLinks?.thumbnail ||
            item.volumeInfo?.imageLinks?.smallThumbnail ||
            '/default-book-cover.jpg',
          previewLink: item.volumeInfo?.previewLink || null,
          infoLink: item.volumeInfo?.infoLink || null,
          searchQueryUsed: query,
        };
      }
    } catch (error) {
      console.error(
        `Search attempt failed for query "${query}":`,
        error.message
      );
      continue;
    }
  }
  return null;
};

router.post('/books', express.json(), async (req, res) => {
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

      try {
        const book = await fetchMostRelevantBook(name);
        results[name] = {
          stageName: name,
          book: book || null,
          milestones,
          skills,
          found: !!book,
        };
      } catch (error) {
        console.error(`Error processing stage "${name}":`, error.message);
        results[name] = {
          stageName: name,
          book: null,
          milestones,
          skills,
          found: false,
        };
      }
    }

    // Save to Firestore under learningResources/{userId}
    await db
      .collection('learningResources')
      .doc(userId)
      .set(
        removeUndefined({
          books: results,
          lastUpdated: new Date().toISOString(),
        }),
        { merge: true }
      );

    res.json({
      success: true,
      books: results,
      stats: {
        totalStages: stages.length,
        booksFound: Object.values(results).filter((r) => r.found).length,
      },
    });
  } catch (error) {
    console.error('Google Books fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch and save books',
      message: error.message,
    });
  }
});

export default router;
