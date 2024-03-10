import {
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { FileElementResponse } from './dto/file-response-element.response';
import { FilesService } from './files.service';
import { Mfile } from './mfile.class';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('files'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileElementResponse[]> {
    const saveArray: Mfile[] = [new Mfile(file)];
    if (
      file.mimetype.includes('image') &&
      !file.originalname.endsWith('.webp')
    ) {
      const buffer = await this.filesService.convertToWebp(file.buffer);
      saveArray.push(
        new Mfile({
          ...file,
          buffer,
          originalname: `${file.originalname.split('.')[0]}.webp`,
        }),
      );
    }

    return this.filesService.saveFiles(saveArray);
  }
}
