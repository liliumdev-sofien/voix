import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { QAStatus, Style } from '@prisma/client';
import { randomUUID } from 'crypto';

@Injectable()
export class RecordingsService {
  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
  ) {}

  async getPresignedUrl(userId: string, sentenceId: string) {
    const speaker = await this.prisma.speaker.findUnique({ where: { userId } });
    if (!speaker) throw new BadRequestException('Speaker not found');

    const recordingId = randomUUID();
    const key = `recordings/${speaker.id}/${sentenceId}/${recordingId}.wav`;
    
    // Generate PUT url
    const url = await this.storage.getPresignedUrl(key, 'PUT');

    return {
      url,
      key,
      recordingId,
      speakerId: speaker.id,
    };
  }

  async commitRecording(userId: string, data: {
    sentenceId: string;
    recordingId: string; // We trust the one we generated or we can generate new? 
    // Usually frontend sends back the key or we reconstruct it. 
    // Let's assume frontend sends metadata.
    s3Url: string; // The MinIO key or full URL
    style: Style;
    durationMs: number;
    sampleRate: number;
  }) {
    const speaker = await this.prisma.speaker.findUnique({ where: { userId } });
    if (!speaker) throw new BadRequestException('Speaker not found');

    // Verify file exists in S3 before committing
    const fileExists = await this.storage.checkFileExists(data.s3Url);
    
    if (!fileExists) {
      throw new BadRequestException(`File not found in S3: ${data.s3Url}`);
    }

    return this.prisma.recording.create({
      data: {
        id: data.recordingId, // Use the ID we reserved
        speakerId: speaker.id,
        sentenceId: data.sentenceId,
        style: data.style,
        s3Url: data.s3Url,
        durationMs: data.durationMs,
        sampleRate: data.sampleRate,
        qaStatus: QAStatus.PENDING,
      },
    });
  }

  async getMyLastFive(userId: string) {
    const speaker = await this.prisma.speaker.findUnique({ where: { userId } });
    if (!speaker) throw new BadRequestException('Speaker not found');

    const recordings = await this.prisma.recording.findMany({
      where: { speakerId: speaker.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { sentence: true },
    });

    // Generate Presigned GET URLs for each
    const results = await Promise.all(recordings.map(async (rec) => {
      const url = await this.storage.getPresignedUrl(rec.s3Url, 'GET');
      return {
        ...rec,
        url, // The presigned URL
      };
    }));

    return results;
  }

  async getPendingRecordings() {
    const recordings = await this.prisma.recording.findMany({
      where: { qaStatus: QAStatus.PENDING },
      include: { sentence: true, speaker: true },
      orderBy: { createdAt: 'asc' },
    });

    // Generate Presigned GET URLs for each
    const results = await Promise.all(recordings.map(async (rec) => {
      const url = await this.storage.getPresignedUrl(rec.s3Url, 'GET');
      return {
        ...rec,
        url,
      };
    }));

    return results;
  }

  async reviewRecording(recordingId: string, status: QAStatus, notes?: string) {
    return this.prisma.recording.update({
      where: { id: recordingId },
      data: {
        qaStatus: status,
        qaNotes: notes,
      },
    });
  }
}
