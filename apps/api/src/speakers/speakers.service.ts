import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SpeakersService {
  constructor(private prisma: PrismaService) {}

  async getStats(userId: string) {
    const speaker = await this.prisma.speaker.findUnique({
      where: { userId },
    });

    if (!speaker) {
      throw new BadRequestException('User is not registered as a speaker');
    }

    // 1. Total Sentences Assigned (or available to record)
    // For now, let's assume all sentences are available to all speakers, 
    // OR we count sentences that don't have a recording by THIS speaker.
    // The user requirement says "Total sentences assigned to them".
    // Since we don't have explicit assignments yet (Assignment model exists but logic is "findNext"), 
    // we can treat "Total" as "Total Sentences in DB" or "Total Assignments".
    // Given the previous "findNext" logic which picks ANY sentence without a recording,
    // let's define "Total" as strict Assignments if used, otherwise Total Sentences.
    // Let's us count ALL sentences as the "Goal" for now, as that seems to be the current flow.
    
    // However, if we look at `findNext`, it looks for `recordings: { none: { speakerId } }`.
    // So distinct sentences recorded + unrecorded = Total. 
    // Actually, simple is best: Total Sentences in the system vs Recorded by me.
    
    const totalSentences = await this.prisma.sentence.count();
    
    const recordedCount = await this.prisma.recording.count({
      where: { speakerId: speaker.id },
    });

    // 2. Style Breakdown
    const recordings = await this.prisma.recording.findMany({
      where: { speakerId: speaker.id },
      select: { style: true },
    });

    const styleBreakdown = recordings.reduce((acc, curr) => {
      acc[curr.style] = (acc[curr.style] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalSentences,
      recordedCount,
      styleBreakdown,
    };
  }
}
