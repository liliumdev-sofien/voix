import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { DatasetsService } from './datasets.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin/dataset')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN)
export class DatasetsController {
  constructor(private readonly datasetsService: DatasetsService) {}

  @Get('snapshots')
  async findAll() {
    return this.datasetsService.findAll();
  }

  @Post('snapshot')
  async createSnapshot(@Body() body: { name: string; speakerId?: string }) {
    try {
      return await this.datasetsService.createSnapshot(body.name, body.speakerId);
    } catch (error) {
      console.error('DatasetsController: Error calling createSnapshot:', error);
      throw error;
    }
  }

  @Get('snapshots/:id/download')
  async getDownloadUrl(@Param('id') id: string) {
    return {
      url: await this.datasetsService.getDownloadUrl(id),
    };
  }
}
