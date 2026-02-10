import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Style } from '@prisma/client';
import { Readable } from 'stream';
import csv from 'csv-parser';

@Injectable()
export class SentencesService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.sentence.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.sentence.count(),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit),
      },
    };
  }

  async importCsv(buffer: Buffer) {
    const results: Prisma.SentenceCreateManyInput[] = [];
    const stream = Readable.from(buffer);

    return new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on('data', (data: any) => {
          console.log('Row data:', data);
          // Validate required fields
          if (!data.textArabizi || !data.style) {
            console.warn('Skipping invalid row:', data);
            return; // Skip invalid rows
          }

          // Validate Style Enum
          const style = Object.values(Style).includes(data.style?.toUpperCase() as Style)
            ? (data.style?.toUpperCase() as Style)
            : Style.NEUTRAL;

          const tags = {
            style,
            domain: data.domain,
            length_class: data.length_class,
            ...JSON.parse(data.tags || '{}'),
          };

          results.push({
            textArabizi: data.textArabizi,
            textNormalized: data.textNormalized, // Optional field
            tags: tags as any, // Prisma Json handling
          });
        })
        .on('end', async () => {
          try {
            if (results.length > 0) {
              await this.prisma.sentence.createMany({
                data: results,
                skipDuplicates: true,
              });
            }
            resolve({ count: results.length });
          } catch (error) {
            reject(error);
          }
        })
        .on('error', (error: any) => reject(new BadRequestException('Invalid CSV format')));
    });
  }
  async findNext(userId: string) {
    // 1. Find the speaker profile for this user
    const speaker = await this.prisma.speaker.findUnique({
      where: { userId },
    });

    if (!speaker) {
      throw new BadRequestException('User is not registered as a speaker');
    }

    // 2. Find a sentence that doesn't have a recording by this speaker
    // Using raw query for performance or Prisma's findFirst with none filter
    const sentence = await this.prisma.sentence.findFirst({
      where: {
        recordings: {
          none: {
            speakerId: speaker.id,
            qaStatus: { not: 'REJECTED' }
          },
        },
      },
      // You might want to randomize this in production
      take: 1,
      orderBy: {
        createdAt: 'asc', 
      }
    });

    return sentence || null;
  }
}
