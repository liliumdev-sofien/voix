import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { StorageModule } from './storage/storage.module';
import { AuthModule } from './auth/auth.module';
import { SentencesModule } from './sentences/sentences.module';
import { RecordingsModule } from './recordings/recordings.module';
import { SpeakersModule } from './speakers/speakers.module';
import { DatasetsModule } from './datasets/datasets.module';
import { GenerationModule } from './generation/generation.module';
import { TrainingModule } from './training/training.module';
import { AssignmentsModule } from './assignments/assignments.module';

@Module({
  imports: [PrismaModule, StorageModule, AuthModule, SentencesModule, RecordingsModule, SpeakersModule, DatasetsModule, GenerationModule, TrainingModule, AssignmentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
