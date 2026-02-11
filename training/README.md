# F5-TTS CPU Sanity Check for Tounsi TTS

This directory contains scripts for running a CPU-only sanity check of F5-TTS training with your Tounsi (Arabizi) dataset.

## System Requirements

- **CPU**: Intel i5-11500H or similar
- **RAM**: 32GB
- **GPU**: Not required (CPU-only training)
- **OS**: Windows 10/11 (with Python 3.8+) or Linux/WSL

## Quick Start

### 1. Setup F5-TTS Environment

**On Windows (PowerShell):**
```powershell
cd training
.\setup_f5_cpu.ps1
```

**On Linux/WSL:**
```bash
cd training
chmod +x setup_f5_cpu.sh
./setup_f5_cpu.sh
```

This will:
- Clone the F5-TTS repository
- Create a virtual environment
- Install CPU-only PyTorch
- Install all dependencies

### 2. Prepare Your Dataset

First, download a snapshot from your admin panel or locate an existing snapshot ZIP file.

Then run the data preparation script:

```bash
# Activate the virtual environment first
# Windows: .\F5-TTS\venv\Scripts\Activate.ps1
# Linux: source F5-TTS/venv/bin/activate

# Prepare dataset (limit to 20 samples for quick test)
python prepare_tounsi.py \
  --snapshot-zip /path/to/your/snapshot.zip \
  --output-dir ./tounsi_dataset \
  --limit 20
```

This will:
- Extract the snapshot ZIP
- Resample all audio to 24kHz (F5-TTS requirement)
- Convert `metadata.csv` to `metadata.jsonl` format
- Preserve Arabizi text correctly with UTF-8 encoding

### 3. Run Sanity Check Training

**Important**: Set CPU thread limit to avoid overloading:

```bash
# Windows PowerShell
$env:OMP_NUM_THREADS=6
$env:MKL_NUM_THREADS=6

# Linux/WSL
export OMP_NUM_THREADS=6
export MKL_NUM_THREADS=6
```

**Run training:**

```bash
cd F5-TTS

# Using accelerate with CPU config
accelerate launch \
  --config_file ../accelerate_cpu_config.yaml \
  train.py \
  --dataset_name ../tounsi_dataset \
  --output_dir ../outputs/tounsi_sanity_check \
  --per_device_train_batch_size 1 \
  --gradient_accumulation_steps 4 \
  --max_steps 10 \
  --learning_rate 1e-4 \
  --warmup_steps 2 \
  --logging_steps 1 \
  --save_steps 5 \
  --gradient_checkpointing \
  --dataloader_num_workers 2
```

### 4. What to Look For

The sanity check is successful if you see:

✅ **Step 1 completes** (model processes first batch)
✅ **No errors with Arabizi text** (UTF-8 encoding works)
✅ **Audio loads correctly** (24kHz resampling worked)
✅ **Memory usage stays under 28GB**
✅ **Training loss appears** (model is learning signal)

Example successful output:
```
Step 1/10: loss=X.XXX, lr=1e-4
Step 2/10: loss=X.XXX, lr=1e-4
...
```

### 5. Expected Performance

On Intel i5-11500H (CPU-only):
- **Per step time**: 30-60 seconds (very slow, but expected for CPU)
- **Memory usage**: 20-28GB RAM
- **10 steps**: ~5-10 minutes total

**Note**: CPU training is ONLY for verification. For actual training, you'll need a GPU.

## Directory Structure

```
training/
├── README.md                      # This file
├── setup_f5_cpu.sh               # Linux/WSL setup script
├── setup_f5_cpu.ps1              # Windows PowerShell setup script
├── prepare_tounsi.py             # Dataset preparation script
├── accelerate_cpu_config.yaml    # Accelerate CPU configuration
├── train_config_cpu.yaml         # Training configuration reference
├── F5-TTS/                       # Cloned repository (created by setup)
├── tounsi_dataset/               # Prepared dataset (created by prepare_tounsi.py)
│   ├── audio/                    # Resampled audio files (24kHz)
│   └── metadata.jsonl            # Training metadata
└── outputs/                      # Training outputs
    └── tounsi_sanity_check/      # Checkpoints and logs
```

## Troubleshooting

### Out of Memory (OOM)

If you get OOM errors:
1. Reduce `--per_device_train_batch_size` to 1 (already minimal)
2. Increase `--gradient_accumulation_steps` to 8
3. Close other applications to free RAM
4. Reduce dataset size: `--limit 10` in prepare_tounsi.py

### Arabizi Text Issues

If text doesn't display correctly:
- Ensure your terminal supports UTF-8
- Windows: `[Console]::OutputEncoding = [System.Text.Encoding]::UTF8`
- The scripts use `ensure_ascii=False` to preserve Arabizi

### Slow Training

This is expected on CPU! Each step taking 30-60 seconds is normal.
- For actual training, use a GPU (RTX 3060 or better recommended)
- This sanity check is just to verify data pipeline works

### Audio Loading Errors

If audio files fail to load:
- Check that snapshot ZIP contains `wavs/` directory
- Verify `metadata.csv` format: `wavs/{id}.wav|text|speaker`
- Run prepare_tounsi.py with `--limit 5` to test with fewer files

## Next Steps After Sanity Check

Once the sanity check passes:

1. **Prepare full dataset**: Remove `--limit` flag
2. **Set up GPU training**: Use cloud GPU (Google Colab, Paperspace, etc.)
3. **Full training run**: 
   - Batch size: 8-16 (on GPU)
   - Steps: 10,000-50,000
   - Duration: Several hours to days
4. **Monitor training**: Use TensorBoard for loss curves
5. **Evaluation**: Test generated audio quality

## Additional Resources

- [F5-TTS Repository](https://github.com/SWivid/F5-TTS)
- [F5-TTS Paper](https://arxiv.org/abs/2410.06885)
- [Accelerate Documentation](https://huggingface.co/docs/accelerate)

## Support

For issues specific to this setup, check:
1. Python version: `python --version` (should be 3.8+)
2. PyTorch installation: `python -c "import torch; print(torch.__version__)"`
3. Virtual environment active: Look for `(venv)` in terminal prompt
