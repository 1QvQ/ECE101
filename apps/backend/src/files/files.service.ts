import { Injectable, BadRequestException } from '@nestjs/common';
import { PDFParse } from 'pdf-parse';
import * as mammoth from 'mammoth';

@Injectable()
export class FilesService {

  async processFile(file: Express.Multer.File): Promise<{ filename: string; totalChunks: number; chunks: string[] }> {
    let rawText = '';

    try {
      // 1. Text Extraction Phase (Routing based on file type or extension)
      const isPdf = file.mimetype.includes('pdf') || file.originalname.toLowerCase().endsWith('.pdf');
      const isDocx = file.mimetype.includes('wordprocessingml.document') || file.originalname.toLowerCase().endsWith('.docx');

      if (isPdf) {
        const parser = new PDFParse({ data: file.buffer });
        const data = await parser.getText();
        rawText = data.text;
      } else if (isDocx) {
        // Why: Mammoth extracts clean text from docx without heavy formatting HTML.
        const data = await mammoth.extractRawText({ buffer: file.buffer });
        rawText = data.value;
      } else {
        throw new BadRequestException('Unsupported file type. Please upload PDF or DOCX.');
      }

      // 2. Data Cleaning
      // Why: AI models get confused by excessive empty lines and spaces. 
      // This regex replaces multiple line breaks with a single one.
      const cleanedText = rawText.replace(/\n\s*\n/g, '\n').trim();

      if (!cleanedText) {
        throw new BadRequestException('The document appears to be empty or contains no readable text.');
      }

      // 3. Chunking Phase (Static 1000 chars for now)
      const chunks = this.chunkText(cleanedText, 1000);

      return {
        filename: file.originalname,
        totalChunks: chunks.length,
        chunks: chunks,
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new BadRequestException(`Failed to process document: ${errorMessage}`);
    }
  }

  /**
   * Helper method to split text into manageable arrays for the Vector Database.
   */
  private chunkText(text: string, chunkSize: number): string[] {
    const chunks: string[] = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.substring(i, i + chunkSize));
    }
    return chunks;
  }
}