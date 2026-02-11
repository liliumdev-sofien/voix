# Quick Command Reference for Tounsi F5-TTS Training
# Copy and paste these commands to run the custom training

# ==========================================
# 1. GENERATE VOCABULARY (First Time Only)
# ==========================================

# Activate environment
# Linux/WSL:
source F5-TTS/venv/bin/activate
# Windows:
.\F5-TTS\venv\Scripts\Activate.ps1

# Generate vocab.txt from your metadata
python generate_vocab.py \
  --metadata data/Tounsi_Arabizi_char/metadata.jsonl \
  --output data/Tounsi_Arabizi_char/vocab.txt

# ==========================================
# 2. SET CPU LIMITS (Important!)
# ==========================================

# Linux/WSL:
export OMP_NUM_THREADS=6
export MKL_NUM_THREADS=6

# Windows PowerShell:
$env:OMP_NUM_THREADS=6
$env:MKL_NUM_THREADS=6

# ==========================================
# 3. RUN SANITY CHECK (10 steps)
# ==========================================

# Option A: Direct Python (Simple)
python train_tounsi.py \
  --data_dir data/Tounsi_Arabizi_char \
  --vocab_path data/Tounsi_Arabizi_char/vocab.txt \
  --batch_size 1 \
  --max_steps 10 \
  --logging_steps 1 \
  --num_threads 6

# Option B: With Accelerate (Recommended)
accelerate launch \
  --config_file accelerate_cpu_config.yaml \
  train_tounsi.py \
  --data_dir data/Tounsi_Arabizi_char \
  --vocab_path data/Tounsi_Arabizi_char/vocab.txt \
  --batch_size 1 \
  --max_steps 10 \
  --logging_steps 1

# ==========================================
# 4. LONGER TEST (100 steps)
# ==========================================

python train_tounsi.py \
  --data_dir data/Tounsi_Arabizi_char \
  --vocab_path data/Tounsi_Arabizi_char/vocab.txt \
  --batch_size 1 \
  --gradient_accumulation_steps 4 \
  --max_steps 100 \
  --learning_rate 1e-4 \
  --output_dir outputs/tounsi_100_steps \
  --logging_steps 10 \
  --save_steps 25

# ==========================================
# EXPECTED OUTPUT
# ==========================================

# You should see:
# - "Loaded X samples from data/Tounsi_Arabizi_char"
# - "Vocabulary size: X"
# - Progress bar: "Training: 10%|█ | 1/10 [00:30<...] loss=0.XXXX"
# - "Checkpoint saved to outputs/..."
# - "Training complete!"

# ==========================================
# TROUBLESHOOTING
# ==========================================

# If vocab.txt missing:
python generate_vocab.py --metadata data/Tounsi_Arabizi_char/metadata.jsonl --output data/Tounsi_Arabizi_char/vocab.txt

# If "module not found" errors:
cd F5-TTS && pip install -e . && cd ..

# If out of memory:
# Add: --dim 256 --depth 4

# If audio errors:
# Check: data/Tounsi_Arabizi_char/audio/ contains .wav files at 24kHz
