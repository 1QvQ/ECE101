import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        // Why: Updated regex to accept PDF and modern Word documents (docx).
        // This strictly aligns with Feature 4 in your PRD.
        validators: [
          new FileTypeValidator({ fileType: /(pdf|wordprocessingml\.document)/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return await this.filesService.processFile(file);
  }
}