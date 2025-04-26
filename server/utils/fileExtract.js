import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { DocxLoader } from '@langchain/community/document_loaders/fs/docx';
import fs from 'fs';
import path from 'path';

export async function extractTextFromFile(fileBuffer, fileName) {
  try {
    const fileType = fileName.split('.').pop().toLowerCase();
    const tempFilePath = path.join('./temp', fileName);

    // Ensure temp directory exists
    fs.mkdirSync('./temp', { recursive: true });

    // Write buffer to a temp file
    fs.writeFileSync(tempFilePath, fileBuffer);

    let loader;
    if (fileType === 'pdf') {
      loader = new PDFLoader(tempFilePath);
    } else if (fileType === 'docx') {
      loader = new DocxLoader(tempFilePath);
    } else {
      throw new Error('Unsupported file type');
    }

    const docs = await loader.load();

    // Cleanup temp file
    fs.unlinkSync(tempFilePath);

    return docs.map((doc) => doc.pageContent).join('\n');
  } catch (error) {
    console.error('Error extracting text:', error);
    throw error;
  }
}
