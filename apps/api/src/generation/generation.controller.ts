import { Controller, Post, Body, Res, HttpException, HttpStatus } from '@nestjs/common';
import { GenerationService } from './generation.service';
import type { Response } from 'express';
import * as fs from 'fs';

@Controller('generation')
export class GenerationController {
  constructor(private readonly generationService: GenerationService) {}

  @Post()
  async generate(@Body('text') text: string, @Res() res: Response) {
    if (!text) {
      throw new HttpException('Text is required', HttpStatus.BAD_REQUEST);
    }
    
    try {
      const filePath = await this.generationService.generateAudio(text);
      
      if (!fs.existsSync(filePath)) {
          throw new Error("File not found after generation");
      }

      const stat = fs.statSync(filePath);
      
      res.writeHead(200, {
        'Content-Type': 'audio/wav',
        'Content-Length': stat.size,
        'Content-Disposition': `attachment; filename="generated.wav"`
      });
      
      const readStream = fs.createReadStream(filePath);
      readStream.pipe(res);
      
      readStream.on('close', () => {
          fs.unlink(filePath, (err) => {
              if (err) console.error("Error deleting temp file:", err);
          });
      });

    } catch (error) {
      console.error("Generation error:", error);
      throw new HttpException(error.message || 'Generation failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
