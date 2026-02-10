import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { QAStatus } from '@prisma/client';
import * as archiver from 'archiver';
import { stringify } from 'csv-stringify/sync';
import { PassThrough } from 'stream';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import * as crypto from 'crypto';

@Injectable()
export class DatasetsService {
  private logger = new Logger(DatasetsService.name);

  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
  ) {}

  async findAll() {
    this.logger.log('Executing findAll with FIXED client path');
    try {
      return await this.prisma.datasetSnapshot.findMany({
        orderBy: { createdAt: 'desc' },
        include: { 
          _count: { select: { items: true } },
          speaker: true, 
        },
      });
    } catch (error) {
      this.logger.error('Failed to find snapshots', error);
      throw error;
    }
  }

  async getDownloadUrl(snapshotId: string) {
    const snapshot = await this.prisma.datasetSnapshot.findUnique({
      where: { id: snapshotId },
    });
    if (!snapshot) throw new NotFoundException('Snapshot not found');

    // Assumes the snapshot is stored at "snapshots/{name}.zip" or similar
    // For now, let's say we store it as "snapshots/{id}.zip"
    const key = `snapshots/${snapshot.id}.zip`;
    return this.storage.getPresignedUrl(key, 'GET');
  }

  async createSnapshot(name: string, speakerId?: string) {
    try {
        this.logger.log(`Starting snapshot generation: ${name}`);

        // 1. Fetch Approved Recordings
        const whereClause: any = { qaStatus: 'APPROVED' }; 
        if (speakerId) {
          whereClause.speakerId = speakerId;
        }

        this.logger.log(`Fetching recordings with criteria: ${JSON.stringify(whereClause)}`);

        const recordings = await this.prisma.recording.findMany({
            where: whereClause,
            include: { sentence: true, speaker: true },
        });
        this.logger.log(`Found ${recordings.length} approved recordings.`);
        
        /*
        try {
            const existing = await this.prisma.datasetSnapshot.findMany({ take: 1 });
            console.log(`Existing snapshots count: ${existing.length}`);
        } catch (e) {
            console.error('Failed to read snapshots:', e);
        }
        */
        // return { message: 'FindMany works', count: recordings.length }; // TESTING

        if (recordings.length === 0) {
          return { message: 'No recordings to export' };
        }

        // 2. Prepare Snapshot Record
        this.logger.log(`Creating snapshot record...`);
        const snapshotId = crypto.randomUUID();
        const now = new Date();
        
        try {
            await this.prisma.$executeRaw`
                INSERT INTO "DatasetSnapshot" ("id", "name", "status", "createdAt", "speakerId")
                VALUES (${snapshotId}, ${name}, 'PENDING', ${now}, ${speakerId || null})
            `;
            this.logger.log(`Snapshot record created with ID: ${snapshotId}`);
        } catch (rawError) {
             this.logger.error('Failed to create snapshot record:', rawError);
             throw rawError;
        }

        const snapshot = { id: snapshotId, name, status: 'PENDING' };

        // 2b. Insert Items
        if (recordings.length > 0) {
            this.logger.log(`Inserting ${recordings.length} items...`);
            
            const values = recordings.map(r => `('${snapshotId}', '${r.id}')`).join(',');
            
            try {
                await this.prisma.$executeRawUnsafe(`
                    INSERT INTO "DatasetItem" ("snapshotId", "recordingId") 
                    VALUES ${values}
                `);
                 this.logger.log(`Items inserted.`);
            } catch (err) {
                this.logger.error('Failed to insert items:', err);
                // Continue execution
            }
        }

        // 3. Start Archiver Stream
        const passThrough = new PassThrough();
        const archive = archiver.create('zip', { zlib: { level: 9 } });

        archive.on('error', (err) => {
            console.error('Archiver error:', err);
            // throw err; // Don't throw here to avoid crash, just log
        });

        archive.pipe(passThrough);

        // 4. Upload Logic (Stream to S3)
        const uploadKey = `snapshots/${snapshot.id}.zip`;
        const uploadPromise = this.storage.uploadStream(uploadKey, passThrough, 'application/zip');

        // 5. Add Files to Archive
        const csvData: any[] = []; 

        for (const rec of recordings) {
          try {
            const audioStream = await this.storage.getFileStream(rec.s3Url);
            const fileName = `wavs/${rec.id}.wav`;
            
            archive.append(audioStream, { name: fileName });

            csvData.push([
              fileName,
              rec.sentence.textArabizi,
              rec.speaker.displayName,
            ]);
          } catch (e) {
            console.error(`Failed to fetch recording ${rec.id}`, e);
          }
        }

        // 6. Add Metadata CSV
        const csvString = stringify(csvData, { delimiter: '|' });
        archive.append(csvString, { name: 'metadata.csv' });

        // 7. Finalize and Wait for Upload
        try {
            await archive.finalize();
            await uploadPromise;

            // 8. Update Status to COMPLETED
            await this.prisma.$executeRaw`
                UPDATE "DatasetSnapshot" SET "status" = 'COMPLETED' WHERE "id" = ${snapshot.id}
            `;
            
            this.logger.log(`Snapshot ${snapshot.id} COMPLETED and uploaded at ${uploadKey}`);
        } catch (error) {
            this.logger.error(`Snapshot ${snapshot.id} FAILED`, error);
            await this.prisma.$executeRaw`
                UPDATE "DatasetSnapshot" SET "status" = 'FAILED' WHERE "id" = ${snapshot.id}
            `;
        }

        return snapshot;
    } catch (error) {
        console.error('CRITICAL ERROR in createSnapshot:', error);
        // console.error('Error JSON:', JSON.stringify(error, null, 2));
        throw error;
    }
  }
}
