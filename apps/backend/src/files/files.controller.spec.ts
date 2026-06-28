import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

describe('FilesController', () => {
  let controller: FilesController;
  let service: FilesService;

  const mockFilesService = {
    processFile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [
        {
          provide: FilesService,
          useValue: mockFilesService,
        },
      ],
    }).compile();

    controller = module.get<FilesController>(FilesController);
    service = module.get<FilesService>(FilesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call filesService.processFile with uploaded file', async () => {
    const file = {
      originalname: 'test.pdf',
      buffer: Buffer.from('dummy data'),
      mimetype: 'application/pdf',
      size: 123,
    } as Express.Multer.File;

    const expectedResult = {
      filename: 'test.pdf',
      totalChunks: 1,
      chunks: ['dummy data'],
    };

    mockFilesService.processFile.mockResolvedValue(expectedResult);

    const result = await controller.uploadFile(file);

    expect(service.processFile).toHaveBeenCalledWith(file);
    expect(result).toEqual(expectedResult);
  });
});
