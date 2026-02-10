import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { SpeakersService } from './speakers.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('speakers')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class SpeakersController {
  constructor(private readonly speakersService: SpeakersService) {}

  @Get('stats')
  @Roles(Role.SPEAKER, Role.ADMIN)
  async getStats(@Req() req: any) {
    return this.speakersService.getStats(req.user.userId);
  }
}
