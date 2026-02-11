import { Controller, Post, Body, Get, Delete } from '@nestjs/common';
import { TrainingService } from './training.service';

@Controller('training')
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  @Post('start')
  async start(@Body() config: any) {
    return this.trainingService.startTraining(config);
  }

  @Post('stop')
  async stop() {
    return this.trainingService.stopTraining();
  }

  @Get('status')
  async getStatus() {
    return this.trainingService.getStatus();
  }
}
