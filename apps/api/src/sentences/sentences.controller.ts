import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SentencesService } from './sentences.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('sentences')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class SentencesController {
  constructor(private readonly sentencesService: SentencesService) {}

  @Get()
  @Roles(Role.ADMIN)
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.sentencesService.findAll(page, limit);
  }

  @Post('import')
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async importCsv(@UploadedFile() file: Express.Multer.File) {
    console.log('Received file upload request');
    if (!file) {
      console.log('No file uploaded');
      throw new BadRequestException('File is required');
    }
    console.log(`File size: ${file.size}, Mimetype: ${file.mimetype}`);
    return this.sentencesService.importCsv(file.buffer);
  }
  @Get('next')
  @Roles(Role.SPEAKER, Role.ADMIN)
  async findNext(@Req() req: any) {
    // req.user is populated by JwtStrategy
    return this.sentencesService.findNext(req.user.userId);
  }
}
