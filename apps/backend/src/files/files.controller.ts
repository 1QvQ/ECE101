import { Controller, Post, UseInterceptors, UploadedFile, ParseFilePipe, FileTypeValidator } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FilesController {
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @UploadedFile(
            new ParseFilePipe({
                validators: [new FileTypeValidator({ fileType: '(pdf|text/plain)$' })],
            }),
        ) file: Express.Multer.File,
    ) {
        return { filename: file.originalname, size: file.size };
    }
}