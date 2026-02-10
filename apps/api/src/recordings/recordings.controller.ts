import { Controller, Post, Get, Body, UseGuards, Req, Param } from '@nestjs/common';
import { RecordingsService } from './recordings.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role, Style, QAStatus } from '@prisma/client';

@Controller('recordings')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class RecordingsController {
  constructor(private readonly recordingsService: RecordingsService) {}

  @Post('presign')
  @Roles(Role.SPEAKER, Role.ADMIN)
  async getPresignedUrl(@Req() req: any, @Body() body: { sentenceId: string }) {
    return this.recordingsService.getPresignedUrl(req.user.userId, body.sentenceId);
  }

  @Post('commit')
  @Roles(Role.SPEAKER, Role.ADMIN)
  async commitRecording(
    @Req() req: any,
    @Body() body: {
      sentenceId: string;
      recordingId: string;
      s3Url: string;
      style: Style;
      durationMs: number;
      sampleRate: number;
    },
  ) {
    return this.recordingsService.commitRecording(req.user.userId, body);
  }
  @Get('my-last-five')
  @Roles(Role.SPEAKER, Role.ADMIN)
  async getMyLastFive(@Req() req: any) {
    return this.recordingsService.getMyLastFive(req.user.userId);
  }

  @Get('pending')
  @Roles(Role.ADMIN)
  async getPendingRecordings() {
    return this.recordingsService.getPendingRecordings();
  }

  @Post(':id/review')
  @Roles(Role.ADMIN)
  async reviewRecording(
    @Param('id') id: string,
    @Body() body: { status: QAStatus; comment?: string },
  ) {
    return this.recordingsService.reviewRecording(id, body.status, body.comment);
  }
}
