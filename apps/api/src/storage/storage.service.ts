import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand, CreateBucketCommand, HeadBucketCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Upload } from '@aws-sdk/lib-storage';

@Injectable()
export class StorageService implements OnModuleInit {
  private s3Client: S3Client;
  private bucket: string;
  private logger = new Logger(StorageService.name);

  constructor() {
    this.bucket = process.env.S3_BUCKET || 'voix-assets';
    const endpoint = process.env.S3_ENDPOINT || 'http://localhost:9000';
    
    this.logger.log(`Initializing S3 Client with endpoint: ${endpoint} and bucket: ${this.bucket}`);
    
    this.s3Client = new S3Client({
      region: process.env.S3_REGION || 'us-east-1',
      endpoint: endpoint,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || 'minioadmin',
        secretAccessKey: process.env.S3_SECRET_KEY || 'minioadmin',
      },
      forcePathStyle: true, // Required for MinIO
    });
  }

  async onModuleInit() {
    await this.ensureBucketExists();
  }

  async ensureBucketExists() {
    try {
      await this.s3Client.send(new HeadBucketCommand({ Bucket: this.bucket }));
      this.logger.log(`Bucket ${this.bucket} exists.`);
    } catch (error) {
      this.logger.warn(`Bucket ${this.bucket} not found. Creating...`);
      try {
        await this.s3Client.send(new CreateBucketCommand({ Bucket: this.bucket }));
        this.logger.log(`Bucket ${this.bucket} created successfully.`);
      } catch (createError) {
        this.logger.error(`Failed to create bucket ${this.bucket}:`, createError);
      }
    }
  }

  async getPresignedUrl(key: string, type: 'PUT' | 'GET'): Promise<string> {
    const command = type === 'PUT' 
      ? new PutObjectCommand({ Bucket: this.bucket, Key: key })
      : new GetObjectCommand({ Bucket: this.bucket, Key: key });

    const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    this.logger.debug(`Generated Presigned URL for ${key}: ${url}`);
    return getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }

  async checkFileExists(key: string): Promise<boolean> {
    try {
      await this.s3Client.send(new HeadObjectCommand({ Bucket: this.bucket, Key: key }));
      return true;
    } catch (error) {
      return false;
    }
  }

  async getFileStream(key: string): Promise<ReadableStream | any> {
    const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    const response = await this.s3Client.send(command);
    return response.Body;
  }

  async uploadStream(key: string, body: any, contentType: string) {
    this.logger.debug(`Starting uploadStream for key: ${key}`);
    const parallelUploads3 = new Upload({
      client: this.s3Client,
      params: { 
        Bucket: this.bucket, 
        Key: key, 
        Body: body,
        ContentType: contentType
      },
    });

    parallelUploads3.on('httpUploadProgress', (progress) => {
      this.logger.debug(`Upload progress for ${key}: ${progress.loaded}/${progress.total}`);
    });

    try {
        const result = await parallelUploads3.done();
        this.logger.debug(`Upload complete for ${key}`);
        return result;
    } catch (error) {
        this.logger.error(`Upload failed for ${key}`, error);
        throw error;
    }
  }
}
