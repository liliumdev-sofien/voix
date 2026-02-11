import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly service: AssignmentsService) {}

  @Get('stats')
  async getStats() {
    return this.service.getStats();
  }

  @Post()
  async create(@Body() dto: { speakerId: string, count: number, style?: any }) {
    return this.service.createAssignments(dto);
  }
}
