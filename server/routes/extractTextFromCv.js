// File 1: controllers/cvExtract.js
import express from 'express';
import fileUpload from 'express-fileupload';
import { extractTextFromFile } from '../utils/fileExtract.js';

const router = express.Router();

router.post('/extract', async (req, res) => {
  try {
    if (!req.files?.cv) {
      return res.status(400).json({ error: 'No CV file uploaded' });
    }

    const cvFile = req.files.cv;
    const cvText = await extractTextFromFile(cvFile.data, cvFile.name);

    res.status(200).json({
      success: true,
      fileName: cvFile.name,
      text: cvText,
      textLength: cvText.length,
      message: 'CV extraction complete',
    });
  } catch (error) {
    console.error('CV extraction error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process CV',
      details: error.message,
    });
  }
});

export default router;
