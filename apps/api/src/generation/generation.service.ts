import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { spawn } from 'child_process';

@Injectable()
export class GenerationService {
  private readonly pythonPath: string;
  private readonly scriptPath: string;
  private readonly trainingDir: string;
  private readonly outputDir: string;

  constructor() {
    const rootDir = process.cwd(); // Expected to be apps/api
    this.trainingDir = path.resolve(rootDir, '../../training/F5-TTS');
    this.pythonPath = path.join(this.trainingDir, 'venv/Scripts/python.exe');
    this.scriptPath = path.join(this.trainingDir, 'inference_tounsi.py');
    this.outputDir = path.resolve(rootDir, 'uploads/generated');
    
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async generateAudio(text: string): Promise<string> {
    const filename = `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.wav`;
    const outputPath = path.join(this.outputDir, filename);

    console.log(`Generating audio for text: "${text}"`);
    console.log(`Output path: ${outputPath}`);

    return new Promise((resolve, reject) => {
      const process = spawn(this.pythonPath, [
        this.scriptPath,
        '--text', text,
        '--output', outputPath
      ], {
        cwd: this.trainingDir
      });

      let errorOutput = '';

      process.stdout.on('data', (data) => {
        console.log(`[Python] ${data}`);
      });

      process.stderr.on('data', (data) => {
        const msg = data.toString();
        // Filter out non-error logs if they appear in stderr (common in python libraries)
        errorOutput += msg;
        console.error(`[Python Stderr] ${msg}`);
      });

      process.on('error', (err) => {
        console.error('Failed to start python process:', err);
        reject(new InternalServerErrorException(`Failed to spawn python process: ${err.message}`));
      });

      process.on('close', (code) => {
        if (code !== 0) {
          reject(new InternalServerErrorException(`Generation failed with code ${code}`));
        } else {
            if (fs.existsSync(outputPath)) {
                resolve(outputPath);
            } else {
                reject(new InternalServerErrorException('Output file not created by script'));
            }
        }
      });
    });
  }
}
