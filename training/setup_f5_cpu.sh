#!/bin/bash
# F5-TTS CPU Setup Script for Windows/WSL or Linux
# Optimized for Intel i5-11500H with 32GB RAM

set -e

echo "=== F5-TTS CPU Setup for Tounsi TTS ==="

# Clone F5-TTS repository
if [ ! -d "F5-TTS" ]; then
    echo "Cloning F5-TTS repository..."
    git clone https://github.com/SWivid/F5-TTS.git
    cd F5-TTS
else
    echo "F5-TTS directory already exists, skipping clone..."
    cd F5-TTS
fi

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "Upgrading pip..."
pip install --upgrade pip

# Install CPU-only PyTorch
echo "Installing PyTorch (CPU-only)..."
pip install torch torchaudio --index-url https://download.pytorch.org/whl/cpu

# Install F5-TTS dependencies
echo "Installing F5-TTS dependencies..."
pip install transformers accelerate datasets
pip install librosa soundfile
pip install pydub jieba pypinyin cn2an
pip install cached_path einops tqdm

# Install F5-TTS package
echo "Installing F5-TTS..."
pip install -e .

# Verify installation
echo ""
echo "=== Installation Complete ==="
echo "Verifying PyTorch CPU installation..."
python -c "import torch; print(f'PyTorch version: {torch.__version__}'); print(f'CUDA available: {torch.cuda.is_available()}'); print(f'CPU threads: {torch.get_num_threads()}')"

echo ""
echo "Setup complete! Virtual environment is at: $(pwd)/venv"
echo "To activate: source F5-TTS/venv/bin/activate"
