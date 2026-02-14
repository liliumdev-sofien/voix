#!/usr/bin/env python3
"""
Tounsi Dataset Preparation Script for F5-TTS
Converts snapshot ZIP format to F5-TTS training format
"""

import os
import json
import zipfile
import argparse
from pathlib import Path
import librosa
import soundfile as sf
from tqdm import tqdm

def extract_snapshot(zip_path, output_dir):
    """Extract snapshot ZIP file"""
    print(f"Extracting {zip_path}...")
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(output_dir)
    print(f"Extracted to {output_dir}")

def resample_audio(input_path, output_path, target_sr=24000):
    """Resample audio to target sample rate (24kHz for F5-TTS)"""
    audio, sr = librosa.load(input_path, sr=None)
    
    if sr != target_sr:
        audio = librosa.resample(audio, orig_sr=sr, target_sr=target_sr)
    
    sf.write(output_path, audio, target_sr)

def parse_metadata_csv(csv_path):
    """Parse the metadata.csv file (pipe-delimited)"""
    entries = []
    with open(csv_path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            
            # Format: wavs/{id}.wav|text_arabizi|speaker_name
            parts = line.split('|')
            if len(parts) >= 2:
                audio_file = parts[0]
                text = parts[1]
                speaker = parts[2] if len(parts) > 2 else "unknown"
                entries.append({
                    'audio_file': audio_file,
                    'text': text,
                    'speaker': speaker
                })
    
    return entries

def create_f5_dataset(snapshot_dir, output_dir, target_sr=24000, limit=None):
    """
    Convert Tounsi snapshot to F5-TTS format
    
    F5-TTS expects:
    - metadata.jsonl with format: {"audio_path": "path/to/audio.wav", "text": "transcription"}
    - All audio files resampled to 24kHz
    """
    snapshot_path = Path(snapshot_dir)
    output_path = Path(output_dir)
    
    # Create output directories
    audio_output = output_path / "audio"
    audio_output.mkdir(parents=True, exist_ok=True)
    
    # Parse metadata
    metadata_csv = snapshot_path / "metadata.csv"
    if not metadata_csv.exists():
        raise FileNotFoundError(f"metadata.csv not found in {snapshot_dir}")
    
    entries = parse_metadata_csv(metadata_csv)
    print(f"Found {len(entries)} entries in metadata.csv")
    
    # Limit dataset size for sanity check
    if limit:
        entries = entries[:limit]
        print(f"Limited to {limit} samples for sanity check")
    
    # Process audio files and create JSONL
    jsonl_data = []
    
    for entry in tqdm(entries, desc="Processing audio files"):
        # Source audio path
        src_audio = snapshot_path / entry['audio_file']
        
        if not src_audio.exists():
            print(f"Warning: Audio file not found: {src_audio}")
            continue
        
        # Output audio path (keep same filename)
        audio_filename = Path(entry['audio_file']).name
        dst_audio = audio_output / audio_filename
        
        # Resample audio to 24kHz
        try:
            resample_audio(src_audio, dst_audio, target_sr)
        except Exception as e:
            print(f"Error processing {src_audio}: {e}")
            continue
        
        # Create JSONL entry
        jsonl_entry = {
            "audio_path": str(dst_audio.relative_to(output_path)),
            "text": entry['text'],
            "speaker": entry['speaker']
        }
        jsonl_data.append(jsonl_entry)
    
    # Write metadata.jsonl
    jsonl_path = output_path / "metadata.jsonl"
    with open(jsonl_path, 'w', encoding='utf-8') as f:
        for entry in jsonl_data:
            f.write(json.dumps(entry, ensure_ascii=False) + '\n')
    
    print(f"\n=== Dataset Preparation Complete ===")
    print(f"Processed {len(jsonl_data)} audio files")
    print(f"Audio files: {audio_output}")
    print(f"Metadata: {jsonl_path}")
    print(f"\nSample entry:")
    print(json.dumps(jsonl_data[0], ensure_ascii=False, indent=2))

def main():
    parser = argparse.ArgumentParser(description='Prepare Tounsi dataset for F5-TTS training')
    parser.add_argument('--snapshot-zip', type=str, help='Path to snapshot ZIP file')
    parser.add_argument('--snapshot-dir', type=str, help='Path to extracted snapshot directory')
    parser.add_argument('--output-dir', type=str, default='./tounsi_dataset', 
                       help='Output directory for processed dataset')
    parser.add_argument('--sample-rate', type=int, default=24000, 
                       help='Target sample rate (default: 24000 Hz)')
    parser.add_argument('--limit', type=int, help='Limit number of samples (for testing)')
    
    args = parser.parse_args()
    
    # Extract if ZIP provided
    if args.snapshot_zip:
        extract_dir = Path(args.snapshot_dir) if args.snapshot_dir else Path('./snapshot_extracted')
        extract_snapshot(args.snapshot_zip, extract_dir)
        snapshot_dir = extract_dir
    elif args.snapshot_dir:
        snapshot_dir = Path(args.snapshot_dir)
    else:
        raise ValueError("Either --snapshot-zip or --snapshot-dir must be provided")
    
    # Prepare dataset
    create_f5_dataset(
        snapshot_dir=snapshot_dir,
        output_dir=args.output_dir,
        target_sr=args.sample_rate,
        limit=args.limit
    )

if __name__ == '__main__':
    main()
