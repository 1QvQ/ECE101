import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { BadRequestException } from '@nestjs/common';
import { PDFParse } from 'pdf-parse';
import * as mammoth from 'mammoth';

const mockGetText = jest.fn();
jest.mock('pdf-parse', () => {
  return {
    PDFParse: jest.fn().mockImplementation(() => {
      return {
        getText: mockGetText,
      };
    }),
  };
});
jest.mock('mammoth');

describe('FilesService', () => {
  let service: FilesService;
  const mockMammoth = mammoth as jest.Mocked<typeof mammoth>;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockGetText.mockReset();
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilesService],
    }).compile();

    service = module.get<FilesService>(FilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processFile', () => {
    it('should successfully parse and chunk a PDF file', async () => {
      const file = {
        originalname: 'test.pdf',
        buffer: Buffer.from('pdf content'),
        mimetype: 'application/pdf',
      } as Express.Multer.File;

      mockGetText.mockResolvedValue({ text: 'Hello World PDF' });

      const result = await service.processFile(file);

      expect(PDFParse).toHaveBeenCalledWith({ data: file.buffer });
      expect(mockGetText).toHaveBeenCalled();
      expect(result).toEqual({
        filename: 'test.pdf',
        totalChunks: 1,
        chunks: ['Hello World PDF'],
      });
    });

    it('should successfully parse and chunk a DOCX file', async () => {
      const file = {
        originalname: 'test.docx',
        buffer: Buffer.from('docx content'),
        mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      } as Express.Multer.File;

      mockMammoth.extractRawText.mockResolvedValue({ value: 'Hello World DOCX', messages: [] });

      const result = await service.processFile(file);

      expect(mockMammoth.extractRawText).toHaveBeenCalledWith({ buffer: file.buffer });
      expect(result).toEqual({
        filename: 'test.docx',
        totalChunks: 1,
        chunks: ['Hello World DOCX'],
      });
    });

    it('should throw BadRequestException for unsupported file type', async () => {
      const file = {
        originalname: 'test.txt',
        buffer: Buffer.from('text content'),
        mimetype: 'text/plain',
      } as Express.Multer.File;

      await expect(service.processFile(file)).rejects.toThrow(
        new BadRequestException('Failed to process document: Unsupported file type. Please upload PDF or DOCX.')
      );
    });

    it('should clean duplicate empty lines from extracted text', async () => {
      const file = {
        originalname: 'test.pdf',
        buffer: Buffer.from('pdf content'),
        mimetype: 'application/pdf',
      } as Express.Multer.File;

      mockGetText.mockResolvedValue({ text: 'Line 1\n\n\nLine 2\n\n  \nLine 3' });

      const result = await service.processFile(file);

      expect(result.chunks[0]).toBe('Line 1\nLine 2\nLine 3');
    });

    it('should chunk the text into 1000 character pieces', async () => {
      const file = {
        originalname: 'test.pdf',
        buffer: Buffer.from('pdf content'),
        mimetype: 'application/pdf',
      } as Express.Multer.File;

      // 1500 'a's
      const longText = 'a'.repeat(1500);
      mockGetText.mockResolvedValue({ text: longText });

      const result = await service.processFile(file);

      expect(result.totalChunks).toBe(2);
      expect(result.chunks[0].length).toBe(1000);
      expect(result.chunks[1].length).toBe(500);
    });

    it('should throw BadRequestException if extracted text is empty', async () => {
      const file = {
        originalname: 'empty.pdf',
        buffer: Buffer.from('pdf content'),
        mimetype: 'application/pdf',
      } as Express.Multer.File;

      mockGetText.mockResolvedValue({ text: '   \n  \n  ' });

      await expect(service.processFile(file)).rejects.toThrow(
        new BadRequestException('Failed to process document: The document appears to be empty or contains no readable text.')
      );
    });

    it('should throw BadRequestException if pdf-parse fails', async () => {
      const file = {
        originalname: 'test.pdf',
        buffer: Buffer.from('pdf content'),
        mimetype: 'application/pdf',
      } as Express.Multer.File;

      mockGetText.mockRejectedValue(new Error('PDF extraction error'));

      await expect(service.processFile(file)).rejects.toThrow(
        new BadRequestException('Failed to process document: PDF extraction error')
      );
    });
  });
});
