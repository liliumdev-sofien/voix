# Custom F5-TTS Training for Tounsi Dataset

## Problem

The standard F5-TTS `train.py` expects pre-built Emilia Arrow files, but you have your own dataset structure:

```
data/Tounsi_Arabizi_char/
├── audio/           # Audio files (24kHz WAV)
├── metadata.jsonl   # Training metadata
└── vocab.txt        # Character vocabulary
```

## Solution

This directory contains custom scripts that bypass the Arrow file loading and work directly with your data structure.

## Files

- **tounsi_dataset_loader.py** - Custom PyTorch Dataset for loading from metadata.jsonl
- **train_tounsi.py** - Modified training script that uses the custom dataset
- **generate_vocab.py** - Utility to create vocab.txt from your metadata

## Quick Start

### 1. Generate Vocabulary (if you don't have vocab.txt)

```bash
# Activate F5-TTS environment
source F5-TTS/venv/bin/activate  # Linux
# or: .\F5-TTS\venv\Scripts\Activate.ps1  # Windows

# Generate vocab.txt from your metadata
python generate_vocab.py \
  --metadata data/Tounsi_Arabizi_char/metadata.jsonl \
  --output data/Tounsi_Arabizi_char/vocab.txt \
  --min-freq 1
```

This will:
- Extract all unique characters from your Arabizi text
- Add special tokens (`<pad>`, `<unk>`, `<sos>`, `<eos>`)
- Save to vocab.txt

### 2. Run Custom Training

```bash
# Set CPU thread limits
export OMP_NUM_THREADS=6  # Linux
export MKL_NUM_THREADS=6
# or PowerShell: $env:OMP_NUM_THREADS=6; $env:MKL_NUM_THREADS=6

# Run training with custom script
python train_tounsi.py \
  --data_dir data/Tounsi_Arabizi_char \
  --vocab_path data/Tounsi_Arabizi_char/vocab.txt \
  --batch_size 1 \
  --gradient_accumulation_steps 4 \
  --max_steps 10 \
  --learning_rate 1e-4 \
  --output_dir outputs/tounsi_sanity_check \
  --logging_steps 1 \
  --save_steps 5 \
  --num_threads 6
```

### 3. Using Accelerate (Recommended)

For better CPU optimization:

```bash
# Copy accelerate config
cp accelerate_cpu_config.yaml F5-TTS/

# Run with accelerate
accelerate launch \
  --config_file accelerate_cpu_config.yaml \
  train_tounsi.py \
  --data_dir data/Tounsi_Arabizi_char \
  --vocab_path data/Tounsi_Arabizi_char/vocab.txt \
  --batch_size 1 \
  --max_steps 10 \
  --output_dir outputs/tounsi_sanity_check
```

## Key Differences from Standard F5-TTS Training

| Standard F5-TTS | Custom Tounsi Training |
|-----------------|------------------------|
| Uses `load_dataset()` with Arrow files | Uses custom `TounsiDataset` class |
| Expects Emilia format | Reads `metadata.jsonl` directly |
| Hardcoded vocabulary | Uses your `vocab.txt` |
| GPU-optimized | CPU-optimized |

## Dataset Format

Your `metadata.jsonl` should have this format (one JSON per line):

```json
{"audio_path": "audio/recording_001.wav", "text": "haw ya7ki Tounsi", "speaker": "speaker1"}
{"audio_path": "audio/recording_002.wav", "text": "chnouwa hal 9adhiya", "speaker": "speaker1"}
```

## Vocabulary Format

Your `vocab.txt` should list one character per line:

```
<pad>
<unk>
<sos>
<eos>
a
b
c
...
```

## Arguments

### Dataset Arguments
- `--data_dir`: Path to your dataset directory
- `--vocab_path`: Path to vocab.txt
- `--sample_rate`: Audio sample rate (default: 24000)
- `--max_duration`: Max audio duration in seconds (default: 30)
- `--min_duration`: Min audio duration in seconds (default: 0.5)

### Model Arguments
- `--dim`: Model dimension (default: 512, reduced for CPU)
- `--depth`: Model depth (default: 8, reduced for CPU)
- `--heads`: Number of attention heads (default: 8)
- `--ff_mult`: Feedforward multiplier (default: 2)

### Training Arguments
- `--batch_size`: Batch size (default: 1 for CPU)
- `--gradient_accumulation_steps`: Accumulation steps (default: 4)
- `--max_steps`: Maximum training steps (default: 10)
- `--learning_rate`: Learning rate (default: 1e-4)
- `--logging_steps`: Log every N steps (default: 1)
- `--save_steps`: Save checkpoint every N steps (default: 5)

### System Arguments
- `--num_workers`: DataLoader workers (default: 2)
- `--num_threads`: CPU threads (default: 6)
- `--debug`: Enable debug mode

## Expected Output

Successful sanity check output:

```
==================================================
F5-TTS Training Configuration
==================================================
data_dir: data/Tounsi_Arabizi_char
vocab_path: data/Tounsi_Arabizi_char/vocab.txt
batch_size: 1
max_steps: 10
...
==================================================

Loading dataset from: data/Tounsi_Arabizi_char
Loaded 100 samples from data/Tounsi_Arabizi_char
Filtered from 100 to 95 samples

Loading vocabulary from: data/Tounsi_Arabizi_char/vocab.txt
Vocabulary size: 89

Initializing F5-TTS model...

Starting training for 10 steps...
Batch size: 1
Gradient accumulation: 4
Effective batch size: 4

Training: 100%|████████| 10/10 [05:23<00:00, loss=0.5234, lr=1e-4]

Checkpoint saved to outputs/tounsi_sanity_check/checkpoint-5
Checkpoint saved to outputs/tounsi_sanity_check/checkpoint-10

Training complete!
```

## Troubleshooting

### Import Errors

If you get F5-TTS import errors, the custom script will use placeholder components. To fix:

```bash
cd F5-TTS
pip install -e .
```

### Audio Loading Issues

Ensure your audio files are:
- 24kHz sample rate (use `prepare_tounsi.py` to resample)
- WAV format
- Located in `data/Tounsi_Arabizi_char/audio/`

### Vocabulary Missing

Generate it first:

```bash
python generate_vocab.py --metadata data/Tounsi_Arabizi_char/metadata.jsonl
```

### Out of Memory

Reduce model size:
- `--dim 256`
- `--depth 4`
- `--batch_size 1` (already minimal)
- Close other applications

## Next Steps

After successful sanity check:

1. **Verify data loading**: Check that Arabizi text appears correctly in logs
2. **Test with more steps**: Increase `--max_steps` to 100
3. **Full training**: Move to GPU for production training
4. **Monitor losses**: Add TensorBoard logging
5. **Evaluate**: Test generated audio quality

## Comparison: Before vs After

**Before (Failing):**
```bash
python F5-TTS/train.py  # ❌ Looks for raw.arrow files
```

**After (Working):**
```bash
python train_tounsi.py \
  --data_dir data/Tounsi_Arabizi_char \
  --vocab_path data/Tounsi_Arabizi_char/vocab.txt  # ✅ Uses your data
```
